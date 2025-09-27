import React from "react"; import { Link } from "react-router-dom"; import Brand from "./Brand"; import { useCart } from "@/store/cart"; import { useUI } from "@/store/ui";
function CartIcon({className=""}){
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" className={className} aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="20" r="1.8"></circle>
        <circle cx="18" cy="20" r="1.8"></circle>
        <path d="M3 4h2l2.2 11.2A2 2 0 0 0 9.16 17H18a2 2 0 0 0 2-1.6l1.5-7.9H7.1"></path>
      </g>
    </svg>
  );
}
export default function Header(){ const items = useCart(s=>s.items); const total = items.reduce((a,b)=>a+b.qty,0);
  return (<header className="sticky top-0 z-50 bg-black/70 backdrop-blur border-b border-white/10"><div className="container py-2 md:py-3 flex items-center justify-between">
    <Brand/>
    <nav className="hidden md:flex gap-6 text-sm text-gray-200"><Link to="/jamones" className="hover:text-white">Jamones</Link><Link to="/suscripcion" className="hover:text-white">Suscripción</Link><Link to="/dehesa" className="hover:text-white">La Dehesa</Link><Link to="/contacto" className="hover:text-white">Contacto</Link></nav>
    <button onClick={()=> useUI.getState().toggleCart()} className="relative px-3 py-2 rounded-xl text-zinc-100 hover:bg-white/10 transition" aria-label="Carrito"><CartIcon/><span className="absolute -top-2 -right-2 text-[11px] bg-dorado text-black rounded-full px-2 py-0.5">{total}</span></button>
  </div></header>);
}
