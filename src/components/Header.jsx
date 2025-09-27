import React from "react";
import Brand from "./Brand";
import { useCart } from "@/store/cart";
export default function Header(){
  const items = useCart(s => s.items);
  const total = items.reduce((a,b)=>a+b.qty,0);
  return (
    <header className="sticky top-0 z-50 bg-black/70 backdrop-blur border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Brand />
        <nav className="hidden md:flex gap-6 text-sm text-gray-200">
          <a href="/jamones" className="hover:text-white">Jamones</a>
          <a href="/suscripcion" className="hover:text-white">Suscripción</a>
          <a href="/dehesa" className="hover:text-white">La Dehesa</a>
          <a href="/contacto" className="hover:text-white">Contacto</a>
        </nav>
        <a href="/jamones" className="text-sm text-amber-300 border border-amber-400/60 px-3 py-1 rounded-xl">Carrito ({total})</a>
      </div>
    </header>
  );
}
