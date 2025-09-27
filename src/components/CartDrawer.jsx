import React from "react";
import { useCart } from "@/store/cart";
import { useUI } from "@/store/ui";
import { createCheckout } from "@/lib/api";

function CloseIcon({className=""}){
  return (<svg viewBox="0 0 24 24" width="22" height="22" className={className} aria-hidden="true"><path fill="currentColor" d="M18.3 5.71a1 1 0 0 1 0 1.41L13.41 12l4.89 4.88a1 1 0 1 1-1.42 1.42L12 13.41l-4.88 4.89a1 1 0 0 1-1.42-1.42L10.59 12 5.7 7.12A1 1 0 0 1 7.12 5.7L12 10.59l4.88-4.89a1 1 0 0 1 1.42 0z"></path></svg>);
}

export default function CartDrawer(){
  const { cartOpen, closeCart } = useUI();
  const items = useCart(s => s.items);
  const setItems = useCart.setState;
  const clear = useCart(s => s.clear);
  const subtotal = items.reduce((a,b)=> a + b.price * b.qty, 0);
  const inc = (id)=> setItems((s)=>({ items: s.items.map(i => i.id===id ? ({...i, qty: i.qty+1}) : i) }));
  const dec = (id)=> setItems((s)=>({ items: s.items.map(i => i.id===id ? ({...i, qty: Math.max(1, i.qty-1)}) : i) }));
  const remove = (id)=> setItems((s)=>({ items: s.items.filter(i => i.id!==id) }));
  const onPay = async ()=>{ try{ await createCheckout(items) }catch(e){ alert(e.message||"Error al iniciar pago") } };
  return (<>
    <div className={"fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 "+(cartOpen?"opacity-100 pointer-events-auto":"opacity-0 pointer-events-none")} onClick={closeCart} />
    <aside className={"fixed top-0 right-0 h-full w-full max-w-md bg-zinc-950 border-l border-white/10 shadow-2xl transition-transform duration-300 "+(cartOpen?"translate-x-0":"translate-x-full")} aria-hidden={!cartOpen} aria-label="Carrito">
      <div className="flex items-center justify-between px-5 h-14 border-b border-white/10">
        <h3 className="font-stencil text-lg tracking-wider">Tu carrito</h3>
        <button className="p-2 hover:bg-white/10 rounded-xl" onClick={closeCart} aria-label="Cerrar carrito"><CloseIcon/></button>
      </div>
      <div className="p-5 space-y-4 overflow-y-auto h-[calc(100%-7.5rem)]">
        {items.length===0 ? (<p className="text-zinc-400">Tu carrito está vacío.</p>) : items.map((it)=>(
          <div key={it.id} className="flex items-center gap-4 py-3 border-b border-white/10">
            <div className="flex-1"><div className="text-white font-medium">{it.name}</div><div className="text-amber-300 text-sm">{it.price.toFixed(2)} €</div></div>
            <div className="flex items-center gap-2">
              <button className="px-2 py-1 rounded bg-white/10 hover:bg-white/20" onClick={()=> dec(it.id)}>-</button>
              <span className="min-w-[2ch] text-center">{it.qty}</span>
              <button className="px-2 py-1 rounded bg-white/10 hover:bg-white/20" onClick={()=> inc(it.id)}>+</button>
            </div>
            <button className="text-zinc-400 hover:text-white" onClick={()=> remove(it.id)} aria-label="Eliminar">Eliminar</button>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 p-5">
        <div className="flex items-center justify-between text-sm text-zinc-300"><span>Subtotal</span><span className="text-amber-300">{subtotal.toFixed(2)} €</span></div>
        <div className="mt-4 flex gap-3"><button className="btn-secondary flex-1" onClick={clear}>Vaciar</button><button className="btn-primary flex-1" onClick={onPay}>Pagar</button></div>
      </div>
    </aside>
  </>);
}
