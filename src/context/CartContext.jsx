import React, { createContext, useContext, useMemo, useState, useEffect } from "react";

const CartCtx = createContext();
export const useCart = () => useContext(CartCtx);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem("cart") || "[]"); } catch { return []; }
  });
  useEffect(() => localStorage.setItem("cart", JSON.stringify(items)), [items]);

  const add = (product, variant, qty=1) => {
    setItems(prev => {
      const i = prev.findIndex(p => p.vid === variant.id);
      if (i !== -1) {
        const copy = [...prev]; copy[i].qty += qty; return copy;
      }
      return [...prev, { pid: product.id, vid: variant.id, name: product.name, variant: variant.label, price: variant.price, qty, priceId: variant.priceId }];
    });
  };
  const remove = (vid) => setItems(prev => prev.filter(p => p.vid !== vid));
  const changeQty = (vid, qty) => setItems(prev => prev.map(p => p.vid === vid ? { ...p, qty: Math.max(1, qty) } : p));
  const clear = () => setItems([]);

  const totals = useMemo(() => {
    const subtotal = items.reduce((s,i)=> s + i.price*i.qty, 0);
    return { subtotal, shipping: subtotal>80?0:4.9, total: subtotal>80?subtotal:subtotal+4.9 };
  }, [items]);

  const value = { items, add, remove, changeQty, clear, totals };
  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}
