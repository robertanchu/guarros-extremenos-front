import React from "react"; import { Link } from "react-router-dom"; import Brand from "./Brand"; import { useCart } from "@/store/cart"; import { useUI } from "@/store/ui";
function CartIcon({className=""}){ return (<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" className={className}><path fill="currentColor" d="M7 4h.01L7 4a1 1 0 0 1 .97.757L8.28 6H20a1 1 0 0 1 .96 1.274l-2 7A1 1 0 0 1 18 15H9a1 1 0 0 1-.97-.757L6.28 6H5a1 1 0 1 1 0-2h2Zm3.02 11h7.23l1.43-5H8.6l1.42 5ZM9 18a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm9 0a2 2 0 1 1 0 3.999A2 2 0 0 1 18 18Z"></path></svg>); }
export default function Header(){ const items = useCart(s=>s.items); const total = items.reduce((a,b)=>a+b.qty,0);
  return (<header className="sticky top-0 z-50 bg-black/70 backdrop-blur border-b border-white/10"><div className="container py-3 flex items-center justify-between">
    <Brand/>
    <nav className="hidden md:flex gap-6 text-sm text-gray-200"><Link to="/jamones" className="hover:text-white">Jamones</Link><Link to="/suscripcion" className="hover:text-white">Suscripción</Link><Link to="/dehesa" className="hover:text-white">La Dehesa</Link><Link to="/contacto" className="hover:text-white">Contacto</Link></nav>
    <button onClick={()=> useUI.getState().toggleCart()} className="relative px-2 py-1 rounded-xl text-zinc-200 hover:bg-white/10 transition" aria-label="Carrito"><CartIcon/><span className="absolute -top-2 -right-2 text-[11px] bg-brand text-white rounded-full px-2 py-0.5">{total}</span></button>
  </div></header>);
}
