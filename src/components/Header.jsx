import React, { useState } from "react";
import { Link } from "react-router-dom";
import Brand from "./Brand";
import { useCart } from "@/store/cart";
import { useUI } from "@/store/ui";
import MobileMenuDrawer from "./MobileMenuDrawer";

export default function Header(){
  const items = useCart(s=>s.items);
  const total = items.reduce((a,b)=>a+b.qty,0);
  const cartPulse = useUI(s=>s.cartPulse);
  const openCart = ()=> useUI.getState().openCart();
  const [open,setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur border-b border-white/10">
      <div className="shell py-2 md:py-3 flex items-center justify-between">
        <Brand />
        <button className="md:hidden p-2 rounded-xl hover:bg-white/10" onClick={()=> setOpen(true)} aria-label="Abrir menú">
          <svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M4 6h16v2H4V6Zm0 5h16v2H4v-2Zm0 5h16v2H4v-2Z"/></svg>
        </button>
        <nav className="hidden md:flex gap-6 text-sm text-gray-200">
          <Link to="/" className="hover:text-white">Home</Link>
          <Link to="/jamones" className="hover:text-white">Jamones</Link>
          <Link to="/suscripcion" className="hover:text-white">Suscripción</Link>
          <Link to="/dehesa" className="hover:text-white">La Dehesa</Link>
          <Link to="/contacto" className="hover:text-white">Contacto</Link>
        </nav>
        <button onClick={openCart}
          className={"relative px-3 py-2 rounded-xl text-zinc-100 hover:bg-white/10 transition " + (cartPulse ? "cart-pulse" : "")}
          data-cart-target="true" aria-label="Abrir carrito">
          <svg width="22" height="22" viewBox="0 0 24 24"><path fill="currentColor" d="M7 6h13l-1.5 9h-11zM6 6l-1-2H2v2h3zM7 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/></svg>
          {total>0 && <span className="absolute -top-1 -right-1 text-[11px] bg-brand text-white rounded-full px-1.5">{total}</span>}
        </button>
      </div>
      <MobileMenuDrawer open={open} onClose={()=> setOpen(false)} />
    </header>
  );
}
