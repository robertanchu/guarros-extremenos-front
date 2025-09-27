import { create } from "zustand";
export const useCart = create((set, get) => ({
  items: [],
  addItem: (item) => set(state => {
    const exists = state.items.find(i => i.id === item.id);
    if (exists) return { items: state.items.map(i => i.id === item.id ? { ...i, qty: i.qty + (item.qty||1)} : i) }
    return { items: [...state.items, { ...item, qty: item.qty || 1 }] }
  }),
  removeItem: (id) => set(state => ({ items: state.items.filter(i => i.id !== id) })),
  clear: () => set({ items: [] }),
  checkout: async (mode="payment") => {
    const BACKEND = import.meta.env.VITE_BACKEND_URL;
    const items = get().items.map(i => ({ price: i.priceId, quantity: i.qty }));
    if (!BACKEND || items.length===0) return;
    const resp = await fetch(`${BACKEND}/create-checkout-session`, {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({
        mode,
        items,
        success_url: window.location.origin + '/success',
        cancel_url: window.location.origin + '/cancel'
      })
    });
    const data = await resp.json();
    if (data?.url) window.location.href = data.url;
    else console.error(data);
  }
}));
