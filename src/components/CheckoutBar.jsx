import React from "react";
import { useCart } from "@/store/cart";
import { createCheckout } from "@/lib/api";

export default function CheckoutBar(){
  const items = useCart(s => s.items);
  const clear = useCart(s => s.clear);
  const count = items.reduce((a,b)=> a + b.qty, 0);
  const total = items.reduce((a,b)=> a + (b.price * b.qty), 0);

  if(count === 0) return null;

  const onPay = async () => {
    try{
      await createCheckout(items);
    }catch(e){
      alert(e.message || "Error al iniciar pago");
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-4 bg-black/70 backdrop-blur border border-white/10 rounded-2xl px-4 py-3">
        <span className="text-sm text-zinc-200">Artículos: <b>{count}</b> · <span className="text-amber-300">{total.toFixed(2)} €</span></span>
        <button className="btn-primary" onClick={onPay}>Pagar</button>
        <button className="btn-secondary" onClick={clear}>Vaciar</button>
      </div>
    </div>
  );
}
