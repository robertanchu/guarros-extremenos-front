import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import MiniCart from "./MiniCart";
import Logo from "../assets/Logo_final.png";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const nav = "uppercase font-semibold tracking-wide";
  const active = ({isActive}) => (isActive ? "text-rojo" : "text-white hover:text-rojo");
  return (
    <header className={`fixed top-0 w-full z-50 transition-all ${scrolled ? "header-blur border-b border-rojo" : "bg-transparent"}`}>
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-4">
          <img src={Logo} alt="Guarros Extremeños" className="h-16 md:h-20 w-auto" />
          <span className="hidden sm:block text-white text-2xl md:text-3xl font-stencil">Guarros Extremeños</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <NavLink to="/jamones" className={({isActive}) => `${nav} ${active({isActive})}`}>Jamones</NavLink>
          <NavLink to="/dehesa" className={({isActive}) => `${nav} ${active({isActive})}`}>La Dehesa</NavLink>
          <NavLink to="/suscripcion" className={({isActive}) => `${nav} ${active({isActive})}`}>Suscripción</NavLink>
          <NavLink to="/contacto" className={({isActive}) => `${nav} ${active({isActive})}`}>Contacto</NavLink>
          <MiniCart />
        </nav>
      </div>
    </header>
  );
}
