// src/store/cart.js
// Fix: no agrupar piezas con mismo id pero distinto formato (entero vs loncheado)
// - Genera un lineId compuesto (id + variante) y lo usa para identificar líneas.
// - Respeta qty dentro de product (como v63).

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// ---------- Utils
const isSubscriptionItem = (it) => it?.kind === "subscription" || it?.isSubscription === true;

// clave de variante (intentamos cubrir los campos más usados en tu catálogo)
const variantOf = (it = {}) => {
  const cand =
    it.variant ?? it.format ?? it.presentation ?? it.cut ?? it.size ?? it.weight ??
    it.tipo ?? it.formato ?? it.opcion ?? it.option ?? it.options?.join?.("|") ?? "";
  return String(cand).trim().toLowerCase();
};

const baseIdOf = (it = {}) => it.id ?? it.priceId ?? it.slug ?? it.sku ?? it.code ?? it.key ?? it.name;
const safeBaseId = (it) => String(baseIdOf(it) ?? "").trim();

const composeLineId = (it = {}) => {
  // Si ya viene lineId, respetarlo
  if (it.lineId) return String(it.lineId);
  const base = safeBaseId(it);
  const variant = variantOf(it);
  return variant ? `${base}::${variant}` : `${base}`;
};

const sameItem = (a, b) => {
  if (!a || !b) return false;
  // Si tienen lineId, comparar por lineId
  const la = composeLineId(a);
  const lb = composeLineId(b);
  if (la && lb) return la === lb;
  // Fallback
  return baseIdOf(a) === baseIdOf(b);
};

const clampQty = (n, min = 1, max = 99) => {
  const x = Number(n);
  if (!Number.isFinite(x)) return min;
  return Math.min(Math.max(Math.trunc(x), min), max);
};

const findIndexByMatcher = (items, matcher) => {
  // Soportar buscar por lineId explícito, luego por otras claves
  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    if (String(it.lineId) === String(matcher)) return i;
  }
  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    if (
      it.id === matcher ||
      it.priceId === matcher ||
      it.lineId === matcher ||
      it.slug === matcher ||
      it.sku === matcher ||
      it.key === matcher ||
      it.name === matcher
    ) return i;
  }
  return -1;
};

const calcSubtotal = (items) =>
  items.reduce((sum, it) => sum + (Number(it.price) || 0) * (Number(it.qty) || 1), 0);

// ---------- Store
export const useCart = create(
  persist(
    (set, get) => ({
      items: [],

      subtotal() {
        return calcSubtotal(get().items);
      },
      totalItems() {
        return get().items.reduce((n, it) => n + (Number(it.qty) || 1), 0);
      },
      hasSubscription() {
        return get().items.some((it) => isSubscriptionItem(it));
      },

      addItem: (product, qty) =>
        set((state) => {
          if (!product) return state;
          const isSub = isSubscriptionItem(product);

          // qty puede venir como 2º arg o dentro de product
          const desiredQty = isSub ? 1 : clampQty(qty ?? product.qty ?? 1);

          // La identidad de línea incluye variante (entero/loncheado...)
          const incoming = { ...product };
          incoming.lineId = composeLineId(incoming);

          const next = [...state.items];

          // Buscar misma línea (mismo base id + misma variante)
          const existingIdx = next.findIndex((it) => sameItem(it, incoming));

          // Suscripción: única y qty fija = 1
          if (isSub) {
            const alreadySubIdx = next.findIndex((it) => isSubscriptionItem(it));
            const merged = { ...incoming, qty: 1 };
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
            next.push({ ...incoming, qty: desiredQty });
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
            id: baseIdOf(it),
            lineId: composeLineId(it),
            name: it.name,
            price: Number(it.price) || 0,
            qty: Number(it.qty) || 1,
            kind: it.kind,
            variant: variantOf(it),
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
      version: 3,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
