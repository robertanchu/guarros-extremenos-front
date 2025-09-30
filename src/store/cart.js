// src/store/cart.js
// Estado del carrito con Zustand + persistencia.
// Fix: addItem ahora respeta qty cuando viene dentro del objeto (p.ej. desde JamonCard)
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// ---------- Utils
const isSubscriptionItem = (it) => it?.kind === "subscription" || it?.isSubscription === true;

const sameItem = (it, matcher) =>
  it?.id === matcher || it?.priceId === matcher || it?.lineId === matcher || it?.slug === matcher;

const clampQty = (n, min = 1, max = 99) => {
  const x = Number(n);
  if (!Number.isFinite(x)) return min;
  return Math.min(Math.max(Math.trunc(x), min), max);
};

const findIndexByMatcher = (items, matcher) =>
  items.findIndex((i) => sameItem(i, matcher));

const calcSubtotal = (items) =>
  items.reduce((sum, it) => sum + (Number(it.price) || 0) * (Number(it.qty) || 1), 0);

// ---------- Store
export const useCart = create(
  persist(
    (set, get) => ({
      items: [],

      // Selectores
      subtotal() {
        return calcSubtotal(get().items);
      },
      totalItems() {
        return get().items.reduce((n, it) => n + (Number(it.qty) || 1), 0);
      },
      hasSubscription() {
        return get().items.some((it) => isSubscriptionItem(it));
      },

      // Acciones
      // Nota: qty puede venir como 2º argumento o dentro de 'product.qty' (caso JamonCard).
      addItem: (product, qty) =>
        set((state) => {
          if (!product) return state;
          const isSub = isSubscriptionItem(product);

          // Soportar qty dentro del objeto producto si no se pasó como arg
          const desiredQty = isSub ? 1 : clampQty(qty ?? product.qty ?? 1);

          const next = [...state.items];
          const existingIdx =
            findIndexByMatcher(next, product.id) !== -1
              ? findIndexByMatcher(next, product.id)
              : findIndexByMatcher(next, product.priceId);

          // Suscripción: única y qty fija = 1
          if (isSub) {
            const alreadySubIdx = next.findIndex((it) => isSubscriptionItem(it));
            const merged = { ...product, qty: 1 };
            if (alreadySubIdx !== -1) {
              next[alreadySubIdx] = merged;
            } else {
              next.push(merged);
            }
            return { items: next };
          }

          // Producto normal
          if (existingIdx !== -1) {
            const curr = next[existingIdx];
            const newQty = clampQty((curr.qty || 1) + desiredQty);
            next[existingIdx] = { ...curr, qty: newQty };
            return { items: next };
          } else {
            next.push({ ...product, qty: desiredQty });
            return { items: next };
          }
        }),

      removeItem: (matcher) =>
        set((state) => {
          const idx = findIndexByMatcher(state.items, matcher);
          if (idx === -1) return state;
          const next = [...state.items];
          next.splice(idx, 1);
          return { items: next };
        }),

      increment: (matcher) =>
        set((state) => {
          const idx = findIndexByMatcher(state.items, matcher);
          if (idx === -1) return state;
          const item = state.items[idx];
          if (isSubscriptionItem(item)) return state;
          const next = [...state.items];
          const currQty = clampQty(item.qty || 1);
          next[idx] = { ...item, qty: clampQty(currQty + 1) };
          return { items: next };
        }),

      decrement: (matcher) =>
        set((state) => {
          const idx = findIndexByMatcher(state.items, matcher);
          if (idx === -1) return state;
          const item = state.items[idx];
          if (isSubscriptionItem(item)) return state;
          const currQty = clampQty(item.qty || 1);
          const newQty = clampQty(currQty - 1);
          const next = [...state.items];
          next[idx] = { ...item, qty: newQty };
          return { items: next };
        }),

      clear: () => set({ items: [] }),

      checkout: async () => {
        const state = get();
        const payload = {
          items: state.items.map((it) => ({
            id: it.id ?? it.priceId ?? it.slug,
            name: it.name,
            price: Number(it.price) || 0,
            qty: Number(it.qty) || 1,
            kind: it.kind,
          })),
          subtotal: calcSubtotal(state.items),
          hasSubscription: state.items.some(isSubscriptionItem),
          currency: "EUR",
        };
        console.debug("[checkout] payload:", payload);
        return payload;
      },
    }),
    {
      name: "guarros-cart",
      version: 2,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
