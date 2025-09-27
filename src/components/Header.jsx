import React from "react";
import { Link } from "react-router-dom";
export default function Header(){
  return (
    <header className="sticky top-0 z-50 bg-black/70 backdrop-blur border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="inline-block font-stencil text-2xl text-brand">Guarros Extremeños</Link>
        <nav className="hidden md:flex gap-6 text-sm text-gray-200">
          <Link to="/jamones" className="hover:text-white">Jamones</Link>
          <Link to="/suscripcion" className="hover:text-white">Suscripción</Link>
          <Link to="/dehesa" className="hover:text-white">La Dehesa</Link>
          <Link to="/contacto" className="hover:text-white">Contacto</Link>
        </nav>
        <Link to="/jamones" className="text-sm text-amber-300 border border-amber-400/60 px-3 py-1 rounded-xl">Carrito (0)</Link>
      </div>
    </header>
  );
}
