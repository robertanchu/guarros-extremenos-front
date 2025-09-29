import { create } from "zustand";

function gather(){
  if (typeof window === "undefined") return [];
  const pools = [];
  if (Array.isArray(window.__JAMONES__)) pools.push(...window.__JAMONES__);
  if (Array.isArray(window.__PRODUCTS__)) pools.push(...window.__PRODUCTS__);
  try{
    const ls1 = JSON.parse(localStorage.getItem("jamones") || "null") || [];
    if (Array.isArray(ls1)) pools.push(...ls1);
  }catch{}
  try{
    const ls2 = JSON.parse(localStorage.getItem("products") || "null") || [];
    if (Array.isArray(ls2)) pools.push(...ls2);
  }catch{}
  return pools;
}

export const useCatalog = create((set,get) => ({
  items: [],
  hydrate: () => {
    const all = gather();
    if (all.length) set({ items: all });
  },
  getBySlug: (slug) => {
    const items = get().items;
    return items.find(p => p?.slug === slug || String(p?.id) === String(slug)) || null;
  }
}));
