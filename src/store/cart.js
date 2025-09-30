// src/store/cart.js
// Estado del carrito con Zustand + persistencia.
// - Firmas públicas usadas por la app: addItem, removeItem, increment, decrement, clear, checkout
// - Match por id | priceId | lineId | slug
// - Suscripciones: no permiten cambiar cantidad ni acumular varias diferentes

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

      // --------- Selectores simples (como métodos)
      subtotal() {
        return calcSubtotal(get().items);
      },
      totalItems() {
        return get().items.reduce((n, it) => n + (Number(it.qty) || 1), 0);
      },
      hasSubscription() {
        return get().items.some((it) => isSubscriptionItem(it));
      },

      // --------- Acciones
      addItem: (product, qty = 1) =>
        set((state) => {
          if (!product) return state;
          const isSub = isSubscriptionItem(product);
          const next = [...state.items];
          const existingIdx =
            findIndexByMatcher(next, product.id) !== -1
              ? findIndexByMatcher(next, product.id)
              : findIndexByMatcher(next, product.priceId);

          // Si es suscripción: solo 1 en el carrito (y qty fija = 1)
          if (isSub) {
            const alreadySubIdx = next.findIndex((it) => isSubscriptionItem(it));
            if (alreadySubIdx !== -1) {
              // ya hay una suscripción, reemplazamos por la nueva
              const merged = {
                ...product,
                qty: 1,
              };
              next[alreadySubIdx] = merged;
              return { items: next };
            }
            // no había suscripción: añadimos con qty = 1
            next.push({ ...product, qty: 1 });
            return { items: next };
          }

          // Producto normal
          if (existingIdx !== -1) {
            const curr = next[existingIdx];
            const newQty = clampQty((curr.qty || 1) + (qty || 1));
            next[existingIdx] = { ...curr, qty: newQty };
            return { items: next };
          } else {
            next.push({ ...product, qty: clampQty(qty || 1) });
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
          if (isSubscriptionItem(item)) return state; // 🔒 bloquear suscripciones
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
          if (isSubscriptionItem(item)) return state; // 🔒 bloquear suscripciones
          const currQty = clampQty(item.qty || 1);
          const newQty = clampQty(currQty - 1);
          const next = [...state.items];
          next[idx] = { ...item, qty: newQty };
          return { items: next };
        }),

      clear: () => set({ items: [] }),

      // Stub de checkout: sustituye con tu lógica (Stripe/TPV) si procede
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
        // Aquí puedes:
        //  - Llamar a tu API: await fetch("/api/checkout", { method: "POST", body: JSON.stringify(payload) })
        //  - Redirigir a pasarela, etc.
        console.debug("[checkout] payload:", payload);
        return payload;
      },
    }),
    {
      name: "guarros-cart",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }), // solo persistimos los items
    }
  )
);
