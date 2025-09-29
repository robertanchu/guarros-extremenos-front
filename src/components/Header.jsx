import { Link, NavLink } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/store/cart"; // Ajusta si tu store tiene otro path

export default function Header(){
  const { openCart, itemsCount } = useCart?.() ?? { openCart: () => {}, itemsCount: 0 };

  return (
    <header className="sticky top-0 z-50 w-full bg-black/70 backdrop-blur border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          {/* Marca */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/logo/Logo_final_sinletras.png"
              alt="Guarros Extremeños"
              className="h-10 w-auto md:h-12 group-hover:scale-[1.02] transition-transform"
              loading="eager"
              fetchpriority="high"
            />
            <span className="text-white tracking-wide font-black text-lg md:text-xl lg:text-2xl">
              Guarros Extremeños
            </span>
          </Link>

          {/* Navegación */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLink to="/" className="text-sm md:text-base lg:text-lg text-white/90 hover:text-white transition-colors">Home</NavLink>
            <NavLink to="/jamones" className="text-sm md:text-base lg:text-lg text-white/90 hover:text-white transition-colors">Jamones</NavLink>
            <NavLink to="/suscripcion" className="text-sm md:text-base lg:text-lg text-white/90 hover:text-white transition-colors">Suscripción</NavLink>
            <NavLink to="/dehesa" className="text-sm md:text-base lg:text-lg text-white/90 hover:text-white transition-colors">La Dehesa</NavLink>
            <NavLink to="/contacto" className="text-sm md:text-base lg:text-lg text-white/90 hover:text-white transition-colors">Contacto</NavLink>
          </nav>

          {/* Carrito */}
          <button
            onClick={openCart}
            className="relative ml-3 inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 hover:bg-white/10 transition-all h-11 w-11 md:h-12 md:w-12"
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
      </div>
    </header>
  );
}
