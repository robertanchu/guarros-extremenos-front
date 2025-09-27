import { create } from "zustand";
export const useCart = create((set, get) => ({
  items: [],
  addItem: (item) => set(state => {
    const exists = state.items.find(i => i.id === item.id);
    if (exists) return { items: state.items.map(i => i.id === item.id ? { ...i, qty: i.qty + (item.qty||1)} : i) }
    return { items: [...state.items, { ...item, qty: item.qty || 1 }] }
  }),
  clear: () => set({ items: [] }),
}));
