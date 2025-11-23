import React from "react";
import { Link } from "react-router-dom"; // <-- 1. IMPORTA LINK

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 border-t border-white/10 bg-black/60 backdrop-blur">
      <div className="container max-w-7xl px-4 mx-auto py-10 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-flex items-center gap-3"> {/* <-- 2. CAMBIADO */}
              <img
                src="/logo/logo_horizontal.svg"
                alt="Guarros Extremeños"
                className="h-8 md:h-10 w-auto"
                loading="lazy"
              />
            </Link>
            <p className="mt-3 text-white/70 text-sm max-w-xs">
              Jamón ibérico 100% bellota D.O.P. Dehesa de Extremadura. Directo de la dehesa a tu mesa.
            </p>
            <div className="mt-4 flex items-center gap-3">
              {/* Estos se quedan como <a> porque son externos */}
              <a href="https://instagram.com/guarrosextremenos" aria-label="Instagram" className="text-white/70 hover:text-white transition-colors">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11zm0 2a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM18 6.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                </svg>
              </a>
              <a href="mailto:hola@guarrosextremenos.com" aria-label="Email" className="text-white/70 hover:text-white transition-colors">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M2 6a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V6zm3-1a1 1 0 0 0-1 1v.2l8 5.3 8-5.3V6a1 1 0 0 0-1-1H5zm15 4.3-7.4 4.9a1 1 0 0 1-1.2 0L4 9.3V18a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9.3z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Shop */}
          <nav aria-labelledby="footer-shop">
            <h3 id="footer-shop" className="text-white font-semibold">Tienda</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link to="/" className="text-white/70 hover:text-white transition-colors">Inicio</Link></li> {/* <-- CAMBIADO */}
              <li><Link to="/jamones" className="text-white/70 hover:text-white transition-colors">Jamones</Link></li> {/* <-- CAMBIADO */}
              <li><Link to="/suscripcion" className="text-white/70 hover:text-white transition-colors">Suscripción</Link></li> {/* <-- CAMBIADO */}
              <li><Link to="/dehesa" className="text-white/70 hover:text-white transition-colors">Dehesa</Link></li> {/* <-- CAMBIADO */}
              <li><Link to="/contacto" className="text-white/70 hover:text-white transition-colors">Contacto</Link></li> {/* <-- CAMBIADO */}
            </ul>
          </nav>

          {/* Legal */}
          <nav aria-labelledby="footer-legal">
            <h3 id="footer-legal" className="text-white font-semibold">Legal</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link to="/legal/terminos" className="text-white/70 hover:text-white transition-colors">Términos y condiciones</Link></li> {/* <-- CAMBIADO */}
              <li><Link to="/legal/privacidad" className="text-white/70 hover:text-white transition-colors">Política de privacidad</Link></li> {/* <-- CAMBIADO */}
              <li><Link to="/legal/cookies" className="text-white/70 hover:text-white transition-colors">Política de cookies</Link></li> {/* <-- CAMBIADO */}
              <li><Link to="/legal/aviso-legal" className="text-white/70 hover:text-white transition-colors">Aviso legal</Link></li> {/* <-- CAMBIADO */}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold">Contacto</h3>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              <li><a href="mailto:hola@guarrosextremenos.com" className="hover:text-white transition-colors">hola@guarrosextremenos.com</a></li>
              <li><span className="hover:text-white/90">+34 600 000 000</span></li>
              <li><span className="hover:text-white/90">Extremadura, España</span></li>
            </ul>
            <form onSubmit={(e)=>e.preventDefault()} className="mt-4">
              <label htmlFor="news" className="block text-sm text-white/80">Newsletter</label>
              <div className="mt-2 flex items-center gap-2">
                <input id="news" type="email" placeholder="Tu email" className="flex-1 h-10 rounded-lg bg-black/50 text-white placeholder:text-white/40 border border-white/15 px-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40" />
                <button type="submit" className="group relative inline-flex items-center h-10 justify-center rounded-xl px-6 py-3 text-base font-stencil tracking-wide text-black bg-[#E53935] transition-colors duration-200 shadow-lg hover:bg-[#992623] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 active:scale-[0.98]"
            >
              <span className="relative z-10">Enviar</span>
              <span className="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-[#E53935]/50 group-hover:ring-[#992623]/50 transition-all" /></button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container max-w-7xl px-4 mx-auto py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-white/60">
          <div>© {year} Guarros Extremeños — Todos los derechos reservados.</div>
          <div className="flex items-center gap-3">
            <Link to="/legal/privacidad" className="hover:text-white">Privacidad</Link> {/* <-- CAMBIADO */}
            <span aria-hidden="true">•</span>
            <Link to="/legal/cookies" className="hover:text-white">Cookies</Link> {/* <-- CAMBIADO */}
            <span aria-hidden="true">•</span>
            <Link to="/legal/terminos" className="hover:text-white">Términos</Link> {/* <-- CAMBIADO */}
          </div>
        </div>
      </div>
    </footer>
  );
}