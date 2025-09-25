import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { checkoutViaServer } from "../lib/checkout_server";

export default function MiniCart() {
  const { items, remove, changeQty, totals, clear } = useCart();
  const [open, setOpen] = useState(false);
  const subs = items.filter(i=>i.pid==='sub');
  const oneTime = items.filter(i=>i.pid!=='sub');

  return (
    <>
      <button onClick={()=>setOpen(true)} className="relative">
        <span className="text-white">🛒</span>
        {items.length>0 && <span className="absolute -top-2 -right-2 text-xs bg-rojo rounded-full px-2">{items.length}</span>}
      </button>
      <div className={`fixed top-0 right-0 h-full w-96 max-w-[95vw] bg-[#111] border-l border-[#333] z-50 drawer ${open?"open":""}`}>
        <div className="p-4 flex justify-between items-center border-b border-[#222]">
          <h3 className="font-stencil text-xl">Tu carrito</h3>
          <button onClick={()=>setOpen(false)} className="text-gray-300 hover:text-white">✕</button>
        </div>
        <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-220px)]">
          {items.length===0 && <p className="text-gray-400">Tu carrito está vacío.</p>}
          {items.map(it=>(
            <div key={it.vid} className="flex justify-between items-center gap-2 border border-[#222] rounded p-3">
              <div>
                <div className="font-semibold text-sm">{it.name}</div>
                <div className="text-xs text-gray-400">{it.variant}</div>
                <div className="text-sm mt-1">{it.price.toFixed(2)} €</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={()=>changeQty(it.vid, it.qty-1)} className="px-2 border border-[#444]">-</button>
                <span>{it.qty}</span>
                <button onClick={()=>changeQty(it.vid, it.qty+1)} className="px-2 border border-[#444]">+</button>
                <button onClick={()=>remove(it.vid)} className="text-rojo ml-2">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-[#222] space-y-2">
          <div className="flex justify-between text-sm"><span>Subtotal</span><span>{totals.subtotal.toFixed(2)} €</span></div>
          <div className="flex justify-between text-sm"><span>Envío</span><span>{totals.shipping.toFixed(2)} €</span></div>
          <div className="flex justify-between font-bold text-lg"><span>Total</span><span>{totals.total.toFixed(2)} €</span></div>

          {oneTime.length>0 && (()=>{ const valid = oneTime.every(i=>!!i.priceId); return (
            <button
              disabled={!valid}
              onClick={()=> valid && checkoutViaServer({ items: oneTime.map(i=>({price: i.priceId, quantity: i.qty})), mode: 'payment' })}
              className={`w-full mt-2 font-bold py-2 rounded ${valid?'bg-dorado text-black hover:brightness-110':'bg-[#444] text-gray-400 cursor-not-allowed'}`}>
              Pagar productos
            </button>
          );})()}

          {subs.length>0 && (()=>{ const valid = subs.every(i=>!!i.priceId); return (
            <button
              disabled={!valid}
              onClick={()=> valid && checkoutViaServer({ items: subs.map(i=>({price: i.priceId, quantity: i.qty})), mode: 'subscription' })}
              className={`w-full mt-2 font-bold py-2 rounded ${valid?'bg-dorado text-black hover:brightness-110':'bg-[#444] text-gray-400 cursor-not-allowed'}`}>
              Activar suscripción
            </button>
          );})()}

          <p className="text-xs text-gray-500">* Si algún botón aparece deshabilitado, falta asignar el <code>priceId</code> en <span className='underline'>src/data/products.js</span>.</p>
          <button onClick={clear} className="w-full text-sm text-gray-400 hover:text-white">Vaciar carrito</button>
        </div>
      </div>
    </>
  );
}
