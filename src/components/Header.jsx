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
        <span className="text-white font-semibold tracking-wide text-xl md:text-2xl">Guarros Extremeños</span>
      )}
    </Link>
  );
}

export default function Header(){
  const { items, pulseTick } = useCart();
  const { openCart } = useUI?.() || { openCart: () => {} };
  const itemsCount = items.reduce((a, x) => a + (x.qty ?? 1), 0);

  // Animación del icono carrito al añadir
  const controls = useAnimation();
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      // secuencia: bump + pequeño glow
      await controls.start({
        scale: [1, 1.14, 0.98, 1],
        rotate: [0, 6, 0, 0],
        transition: { duration: 0.45, ease: "easeOut" }
      });
      if (!mounted) return;
      await controls.start({
        boxShadow: [
          "0 0 0px rgba(214,40,40,0)",
          "0 0 16px rgba(214,40,40,0.55)",
          "0 0 0px rgba(214,40,40,0)"
        ],
        transition: { duration: 0.4 }
      });
    })();
    return () => { mounted = false; };
  }, [pulseTick, controls]);

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

        {/* Carrito (con animación) */}
        <motion.button
          animate={controls}
          className="relative ml-3 inline-flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 transition-all h-12 w-12 md:h-14 md:w-14"
          aria-label="Abrir carrito"
          onClick={openCart}
        >
          <ShoppingCart className="h-6 w-6 md:h-7 md:w-7 text-white" />
          {itemsCount > 0 && (
            <span className="absolute -top-1 -right-1 text-[11px] font-bold leading-none bg-brand text-white rounded-full px-1.5 py-0.5 shadow">
              {itemsCount}
            </span>
          )}
        </motion.button>
      </div>
    </header>
  );
}
