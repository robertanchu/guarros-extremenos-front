import { Link, NavLink } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/store/cart";
import { useUI } from "@/store/ui";

export default function Header(){
  const { items } = useCart();
  const { openCart } = useUI();
  const itemsCount = items.reduce((a, x) => a + (x.qty ?? 1), 0);

  const linkBase = "text-white/80 hover:text-white transition-colors px-2 py-1 rounded-lg";
  const active = ({ isActive }) => isActive ? "text-white font-semibold" : "text-white/80";

  return (
    <header className="sticky top-0 z-50 w-full bg-black/70 backdrop-blur border-b border-white/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 h-14 md:h-16">
        {/* Logo */}
        <Link to="/" className="text-white font-semibold tracking-wide">
          Guarros Extremeños
        </Link>

        {/* NAV */}
        <nav className="hidden md:flex items-center gap-4">
          <NavLink to="/" className={({isActive}) => `${linkBase} ${isActive ? "text-white" : ""}`}>Inicio</NavLink>
          <NavLink to="/jamones" className={({isActive}) => `${linkBase} ${isActive ? "text-white" : ""}`}>Jamones</NavLink>
          <NavLink to="/suscripcion" className={({isActive}) => `${linkBase} ${isActive ? "text-white" : ""}`}>Suscripción</NavLink>
          <NavLink to="/dehesa" className={({isActive}) => `${linkBase} ${isActive ? "text-white" : ""}`}>Dehesa</NavLink>
          <NavLink to="/contacto" className={({isActive}) => `${linkBase} ${isActive ? "text-white" : ""}`}>Contacto</NavLink>
        </nav>

        {/* Carrito */}
        <button
          onClick={openCart}
          className="relative ml-3 inline-flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 transition-all h-11 w-11 md:h-12 md:w-12"
          aria-label="Abrir carrito"
        >
          <ShoppingCart className="h-6 w-6 text-white" />
          {itemsCount > 0 && (
            <span className="absolute -top-1 -right-1 text-[11px] font-bold leading-none bg-[#E53935] text-white rounded-full px-1.5 py-0.5 shadow">
              {itemsCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
