import React from "react";
import { Link } from "react-router-dom";
export default function Footer(){
  return (
    <footer className="mt-16 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-4 gap-6 text-sm text-zinc-300">
        <div><h4 className="text-white font-semibold mb-2">Guarros Extremeños</h4><p className="text-zinc-400">Jamón Ibérico 100% Bellota · D.O.P.</p></div>
        <div><h4 className="text-white font-semibold mb-2">Tienda</h4><ul className="space-y-2"><li><Link to="/jamones" className="hover:text-white">Jamones</Link></li><li><Link to="/suscripcion" className="hover:text-white">Suscripción</Link></li></ul></div>
        <div><h4 className="text-white font-semibold mb-2">La marca</h4><ul className="space-y-2"><li><Link to="/dehesa" className="hover:text-white">La Dehesa</Link></li><li><Link to="/contacto" className="hover:text-white">Contacto</Link></li></ul></div>
        <div><h4 className="text-white font-semibold mb-2">Legal</h4><ul className="space-y-2"><li><Link to="/terminos" className="hover:text-white">Términos</Link></li><li><Link to="/privacidad" className="hover:text-white">Privacidad</Link></li></ul></div>
      </div>
      <div className="py-4 text-center text-xs text-zinc-500">© {new Date().getFullYear()} Guarros Extremeños</div>
    </footer>
  );
}
