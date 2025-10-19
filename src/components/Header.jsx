// src/components/Header.jsx
import { Link, NavLink } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/store/cart";
import { useUI } from "@/store/ui";
import React from "react";
import { motion, useAnimation } from "framer-motion";

function BrandLogo(){
  const [imgOk, setImgOk] = React.useState(true);
  return (
    <Link to="/" className="flex items-center gap-3" aria-label="Ir al inicio">
      {imgOk ? (
        <img
          src="/logo/logo_horizontal2.png"
          alt="Guarros Extremeños"
          className="w-auto h-14 md:h-16"
          onError={() => setImgOk(false)}
          loading="eager"
          decoding="async"
        />
      ) : (
        <span className="text-white font-semibold tracking-wide text-xl md:text-2xl">
          Guarros Extremeños
        </span>
      )}
    </Link>
  );
}

export default function Header(){
  const { items, pulseTick } = useCart();
  const { openCart } = useUI?.() || { openCart: () => {} };
  const itemsCount = items.reduce((a, x) => a + (x.qty ?? 1), 0);

  // 👉 Animación SOLO del icono (no del botón ni del badge)
  const iconControls = useAnimation();

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      // secuencia visible: shake/bounce/tilt (icono)
      await iconControls.start({
        // pequeño “golpe” inicial
        scale: [1, 1.15, 0.9, 1.05, 1],
        rotate: [0, -10, 6, -3, 0],
        x: [0, -3, 3, -2, 0],
        y: [0, -2, 0, -1, 0],
        transition: { duration: 0.55, ease: "easeOut" }
      });
      if (!mounted) return;
      // micro pulso final
      await iconControls.start({
        scale: [1, 1.08, 1],
        transition: { duration: 0.25, ease: "easeOut" }
      });
    })();
    return () => { mounted = false; };
  }, [pulseTick, iconControls]);

  const linkBase = "text-white/80 hover:text-white transition-colors px-2 py-1 rounded-lg";

  return (
    <header className="sticky top-0 z-50 w-full bg-black/70 backdrop-blur border-b border-white/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 h-20 md:h-24">
        {/* Logo */}
        <BrandLogo />

        {/* NAV */}
        <nav className="hidden md:flex items-center gap-4">
          <NavLink to="/" className={({isActive}) => `${linkBase} ${isActive ? "text-white" : ""}`}>Inicio</NavLink>
          <NavLink to="/jamones" className={({isActive}) => `${linkBase} ${isActive ? "text-white" : ""}`}>Jamones</NavLink>
          <NavLink to="/suscripcion" className={({isActive}) => `${linkBase} ${isActive ? "text-white" : ""}`}>Suscripción</NavLink>
          <NavLink to="/dehesa" className={({isActive}) => `${linkBase} ${isActive ? "text-white" : ""}`}>Dehesa</NavLink>
          <NavLink to="/contacto" className={({isActive}) => `${linkBase} ${isActive ? "text-white" : ""}`}>Contacto</NavLink>
        </nav>

        {/* Carrito: botón estático; SOLO el icono se anima */}
        <button
          className="relative ml-3 inline-flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 transition-all h-12 w-12 md:h-14 md:w-14"
          aria-label="Abrir carrito"
          onClick={openCart}
        >
          {/* Icono animado */}
          <motion.span
            aria-hidden
            animate={iconControls}
            className="inline-flex"
            style={{ display: "inline-flex" }}
          >
            <ShoppingCart className="h-6 w-6 md:h-7 md:w-7 text-white" />
          </motion.span>

          {/* Badge (no se mueve) */}
          {itemsCount > 0 && (
            <span className="absolute -top-1 -right-1 text-[11px] font-bold leading-none bg-brand text-white rounded-full px-1.5 py-0.5 shadow">
              {itemsCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
