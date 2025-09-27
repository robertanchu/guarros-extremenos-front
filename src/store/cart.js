
// src/store/cart.js
import { create } from "zustand";

const makeId = (seed) => {
  try {
    if (seed?.priceId && seed?.slug) return `line-${seed.priceId}-${seed.slug}`;
    if (seed?.priceId && seed?.name) return `line-${seed.priceId}-${seed.name}`;
    if (seed?.priceId) return `line-${seed.priceId}`;
  } catch {}
  return `line-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
};

export const useCart = create((set, get) => ({
  items: [],

  addItem: (payload) => {
    const it = { qty: 1, ...payload };
    if (!it.id) it.id = makeId(it);

    const key = (x) => `${x.priceId || ""}::${x.slug || x.name || ""}`;
    set((s) => {
      const idx = s.items.findIndex((x) => key(x) === key(it));
      if (idx >= 0) {
        const items = s.items.slice();
        items[idx] = { ...items[idx], qty: items[idx].qty + (it.qty || 1) };
        return { items };
      }
      return { items: [...s.items, it] };
    });
  },

  removeItem: (matcher) => {
    set((s) => ({
      items: s.items.filter((x) => x.id !== matcher && x.priceId !== matcher),
    }));
  },

  decrement: (matcher) => {
    set((s) => {
      const items = s.items.map((x) => ({ ...x }));
      const idx = items.findIndex(
        (x) => x.id === matcher || x.priceId === matcher
      );
      if (idx === -1) return { items };
      if (items[idx].qty > 1) {
        items[idx].qty -= 1;
        return { items };
      }
      items.splice(idx, 1);
      return { items };
    });
  },

  clear: () => set({ items: [] }),
}));
