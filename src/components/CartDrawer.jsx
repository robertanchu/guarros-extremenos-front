import React from "react";
import { useCart } from "@/store/cart";
import { useUI } from "@/store/ui";
import { gaBeginCheckout } from "@/lib/analytics";

const API = import.meta.env.VITE_BACKEND_URL; // ej: https://guarros-extremenos-api.onrender.com
const SHIPPING_RATE = import.meta.env.VITE_SHIPPING_RATE_ID || "shr_1SBOWZRPLp0YiQTHa4ClyIOc"; // tu rate

export default function CartDrawer(){
  const { items, removeItem, clear } = useCart();
  const cartOpen = useUI(s=>s.cartOpen);
  const close = ()=> useUI.getState().closeCart();
  const subtotal = items.reduce((a,b)=> a + b.price*b.qty, 0);

  const handleCheckout = async ()=>{
    try {
      if (!API) {
        alert("Falta VITE_BACKEND_URL en el entorno del frontend.");
        return;
      }
      gaBeginCheckout(items);

      const res = await fetch(`${API}/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify({
          items: items.map(it=>({
            price: it.priceId, // tus price_xxx
            quantity: it.qty
          })),
          shipping_rate: SHIPPING_RATE,
          success_url: `${window.location.origin}/exito`,
          cancel_url: `${window.location.origin}/jamones`,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(()=> ({}));
        console.error("Checkout error:", err);
        alert(`Error iniciando pago: ${err.error || res.statusText}`);
        return;
      }

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // Redirección a Stripe Checkout
      } else {
        alert("No se recibió URL de Stripe. Revisa el backend.");
      }
    } catch (e) {
      console.error(e);
      alert("No se pudo iniciar el pago. Revisa CORS/Stripe en el backend.");
    }
  };

  return (
    <aside
      className={
        "fixed top-0 right-0 h-full w-[92%] sm:w-[420px] bg-zinc-950 border-l border-white/10 shadow-xl " +
        "transition-transform duration-300 z-50 grid grid-rows-[auto,1fr,auto] " +
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

      {/* Lista */}
      <div className="p-4 overflow-y-auto">
        {items.length===0 ? (
          <p className="text-zinc-400">Tu carrito está vacío.</p>
        ) : (
          <ul className="space-y-3">
            {items.map((it)=> (
              <li key={it.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-3">
                <div>
                  <div className="text-white">{it.name}</div>
                  <div className="text-sm text-zinc-400">x{it.qty}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-white">{(it.price*it.qty).toFixed(2)} €</div>
                  <button onClick={()=> removeItem(it.id)} className="px-3 py-2 rounded-xl text-white bg-brand/90 hover:bg-brand">Eliminar</button>
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
