import React, { useState } from "react";
import { useCart } from "@/store/cart";
import { useUI } from "@/store/ui";
import { Link, useNavigate } from "react-router-dom";

function CartSummary(){
  const items = useCart(s=>s.items);
  const totalQty = items.reduce((a,b)=> a+b.qty, 0);
  const subtotal = items.reduce((a,b)=> a + (b.price*b.qty), 0);
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-zinc-300">Carrito <span className="ml-1 inline-flex items-center justify-center text-xs bg-dorado text-black px-2 py-0.5 rounded-full">{totalQty}</span></span>
      <span className="text-white font-medium">{subtotal.toFixed(2)} €</span>
    </div>
  );
}

export default function MobileMenuDrawer({open, onClose}){
  const [openJamones, setOpenJamones] = useState(false);
  const navigate = useNavigate();

  const goClub = () => {
    onClose();
    // Si estamos en otra ruta, navega a Home y luego scroll
    requestAnimationFrame(()=>{
      if (location.pathname !== "/") navigate("/");
      setTimeout(()=> {
        const el = document.getElementById("club-guarro");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    });
  };

  return (
    <div aria-hidden={!open}>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={
          "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity " +
          (open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none")
        }
      />
      {/* Drawer */}
      <aside
        className={
          "fixed z-50 top-0 left-0 h-full w-[85%] max-w-sm bg-zinc-950 border-r border-white/10 shadow-xl " +
          "transition-transform duration-300 will-change-transform flex flex-col " +
          (open ? "translate-x-0" : "-translate-x-full")
        }
        role="dialog" aria-modal="true"
      >
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <span className="text-white font-stencil text-xl">Menú</span>
          <button onClick={onClose} aria-label="Cerrar menú" className="p-2 rounded-lg hover:bg-white/10">
            <svg width="22" height="22" viewBox="0 0 24 24"><path fill="currentColor" d="M6.4 5l12.2 12.2-1.4 1.4L5 6.4 6.4 5Zm12.2 1.4L6.4 18.6 5 17.2 17.2 5l1.4 1.4Z"/></svg>
          </button>
        </div>

        <nav className="p-4 flex-1 overflow-y-auto">
          <Link to="/" onClick={onClose} className="block px-3 py-2 rounded-lg hover:bg-white/10 text-white">Home</Link>

          {/* Jamones con submenú */}
          <button
            onClick={()=> setOpenJamones(v=>!v)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/10 text-white"
            aria-expanded={openJamones}
          >
            <span>Jamones</span>
            <svg width="18" height="18" viewBox="0 0 24 24" className={"transition-transform " + (openJamones ? "rotate-180" : "")}>
              <path fill="currentColor" d="M12 15.6 5.7 9.3l1.4-1.4L12 12.8l4.9-4.9 1.4 1.4z"/>
            </svg>
          </button>
          <div className={"pl-3 overflow-hidden transition-[max-height] duration-300 " + (openJamones ? "max-h-40" : "max-h-0")}>
            <Link to="/jamones" onClick={onClose} className="block px-3 py-2 rounded-lg hover:bg-white/10 text-zinc-200">Todos</Link>
            <Link to="/producto/jamon-entero" onClick={onClose} className="block px-3 py-2 rounded-lg hover:bg-white/10 text-zinc-200">JAMÓN entero</Link>
            <Link to="/producto/jamon-loncheado" onClick={onClose} className="block px-3 py-2 rounded-lg hover:bg-white/10 text-zinc-200">Loncheado</Link>
            <Link to="/suscripcion" onClick={onClose} className="block px-3 py-2 rounded-lg hover:bg-white/10 text-zinc-200">Suscripción</Link>
          </div>

          <Link to="/dehesa" onClick={onClose} className="block px-3 py-2 rounded-lg hover:bg-white/10 text-white mt-1">La Dehesa</Link>
          <Link to="/contacto" onClick={onClose} className="block px-3 py-2 rounded-lg hover:bg-white/10 text-white">Contacto</Link>
        </nav>

        <div className="p-4 border-t border-white/10">
  <CartSummary />
  <button onClick={()=>{ useUI.getState().openCart(); onClose(); }} className="w-full mt-3 btn-primary btn-shiny">Ir a pagar</button>
  <button onClick={goClub} className="w-full mt-2 btn-secondary">Hazte del Club Guarro</button>
  <p className="mt-2 text-center text-[11px] text-zinc-500">Lotes exclusivos, avisos tempranos y cero spam.</p>
</div>
      </aside>
    </div>
  );
}
