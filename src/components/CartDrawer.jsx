import React from "react";
import { useCart } from "@/store/cart";
import { useUI } from "@/store/ui";
import { gaBeginCheckout } from "@/lib/analytics";

export default function CartDrawer(){
  const { items, removeItem, clear } = useCart();
  const cartOpen = useUI(s=>s.cartOpen);
  const close = ()=> useUI.getState().closeCart();
  const subtotal = items.reduce((a,b)=> a + b.price*b.qty, 0);

  const handleCheckout = ()=>{
    gaBeginCheckout(items);
    alert("Checkout simulado (conecta tu backend Stripe).");
  };

  return (
    <aside
      className={
        "fixed top-0 right-0 h-full w-[92%] sm:w-[420px] bg-zinc-950 border-l border-white/10 shadow-xl " +
        "transition-transform duration-300 z-50 " +
        "grid grid-rows-[auto,1fr,auto] " + // layout: header / contenido / footer
        (cartOpen ? "translate-x-0" : "translate-x-full")
      }
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-zinc-950/90 backdrop-blur">
        <h3 className="text-white font-stencil text-xl">Tu carrito</h3>
        <button onClick={close} className="p-2 rounded-lg hover:bg-white/10" aria-label="Cerrar">
          <svg width="22" height="22" viewBox="0 0 24 24"><path fill="currentColor" d="M6.4 5l12.2 12.2-1.4 1.4L5 6.4 6.4 5Zm12.2 1.4L6.4 18.6 5 17.2 17.2 5l1.4 1.4Z"/></svg>
        </button>
      </div>

      {/* Contenido scrollable */}
      <div className="p-4 overflow-y-auto">
        {items.length===0 ? (
          <p className="text-zinc-400">Tu carrito está vacío.</p>
        ) : (
          <ul className="space-y-3">
            {items.map((it)=> (
              <li key={it.id} className="flex items-center justify-between panel p-3">
                <div>
                  <div className="text-white">{it.name}</div>
                  <div className="text-sm text-zinc-400">x{it.qty}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-white">{(it.price*it.qty).toFixed(2)} €</div>
                  <button onClick={()=> removeItem(it.id)} className="btn-danger">Eliminar</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer fijo */}
      <div className="p-4 border-t border-white/10 bg-zinc-950/90 backdrop-blur">
        <div className="flex items-center justify-between text-sm mb-3">
          <span className="text-zinc-300">Subtotal</span>
          <span className="text-white">{subtotal.toFixed(2)} €</span>
        </div>
        <button onClick={handleCheckout} className="w-full btn-primary btn-shiny">Pagar</button>
        <button onClick={()=>{ clear(); close(); }} className="w-full mt-2 btn-secondary">Vaciar</button>
      </div>
    </aside>
  );
}
