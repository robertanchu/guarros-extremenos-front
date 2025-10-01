// src/store/cart.js
// v14: checkout() navega a /checkout (formulario). Mantiene sumar/restar/eliminar y migración.

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const isSubscriptionItem = (it) => it?.kind === "subscription" || it?.isSubscription === true || it?.type === "recurring";

const variantOf = (it = {}) => {
  const cand =
    it.variant ?? it.format ?? it.presentation ?? it.cut ?? it.size ?? it.weight ??
    it.tipo ?? it.formato ?? it.opcion ?? it.option ?? (Array.isArray(it.options) ? it.options.join("|") : "") ?? "";
  return String(cand).trim().toLowerCase();
};

const baseIdOf = (it = {}) => it.id ?? it.priceId ?? it.slug ?? it.sku ?? it.code ?? it.key ?? it.name;

const composeLineId = (it = {}) => {
  if (it.lineId) return String(it.lineId);
  const base = String(baseIdOf(it) ?? "").trim();
  const variant = variantOf(it);
  return variant ? `${base}::${variant}` : `${base}`;
};

const clampQty = (n, min = 1, max = 99) => {
  const x = Number(n);
  if (!Number.isFinite(x)) return min;
  return Math.min(Math.max(Math.trunc(x), min), max);
};

const findIndexByMatcher = (items, matcher) => {
  if (matcher == null) return -1;
  const m = String(matcher);
  let idx = items.findIndex((it) => String(it.lineId) === m);
  if (idx !== -1) return idx;
  idx = items.findIndex((it) =>
    it.id === matcher || it.priceId === matcher || it.slug === matcher ||
    it.sku === matcher || it.key === matcher || it.name === matcher
  );
  return idx;
};

export const useCart = create(
  persist(
    (set, get) => ({
      items: [],

      subtotal() { return get().items.reduce((s, it) => s + (Number(it.price) || 0) * (Number(it.qty) || 1), 0); },
      totalItems() { return get().items.reduce((n, it) => n + (Number(it.qty) || 1), 0); },
      hasSubscription() { return get().items.some((it) => isSubscriptionItem(it)); },

      addItem: (product, qty) =>
        set((state) => {
          if (!product) return state;
          const isSub = isSubscriptionItem(product);
          const desiredQty = isSub ? 1 : (typeof qty === "number" ? clampQty(qty) : clampQty(product.qty || 1));
          const incoming = { ...product, lineId: composeLineId(product) };
          const next = [...state.items];
          const idx = next.findIndex((it) => String(it.lineId) === String(incoming.lineId));

          if (isSub) {
            const subIdx = next.findIndex((it) => isSubscriptionItem(it));
            const merged = { ...incoming, qty: 1 };
            if (subIdx !== -1) next[subIdx] = merged;
            else next.push(merged);
            return { items: next };
          }

          if (idx !== -1) next[idx] = { ...next[idx], qty: clampQty((next[idx].qty || 1) + desiredQty) };
          else next.push({ ...incoming, qty: desiredQty });
          return { items: next };
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
          next[idx] = { ...item, qty: clampQty((item.qty || 1) + 1) };
          return { items: next };
        }),

      decrement: (matcher) =>
        set((state) => {
          const idx = findIndexByMatcher(state.items, matcher);
          if (idx === -1) return state;
          const item = state.items[idx];
          if (isSubscriptionItem(item)) return state;
          const nextQty = clampQty((item.qty || 1) - 1);
          const next = [...state.items];
          next[idx] = { ...item, qty: nextQty };
          return { items: next };
        }),

      clear: () => set({ items: [] }),

      checkout: async () => {
        window.location.assign("/checkout");
        return null;
      },
    }),
    {
      name: "guarros-cart",
      version: 14,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
      migrate: (persistedState) => {
        try {
          const s = persistedState || {};
          if (!Array.isArray(s.items)) s.items = [];
          s.items = s.items.map((it) => ({
            ...it,
            qty: clampQty(it?.qty || 1),
            lineId: composeLineId(it || {}),
          }));
          return s;
        } catch {
          return { items: [] };
        }
      },
    }
  )
);
