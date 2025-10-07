// src/pages/Success.jsx
import React, { useEffect } from "react";
import Meta from "@/lib/Meta";
import { Link } from "react-router-dom";
import { useCart } from "@/store/cart";

export default function Success(){
  const clear = useCart((s) => s.clear);

  useEffect(() => {
    // Vacía el carrito al llegar desde Stripe
    clear();
  }, [clear]);

  return (
    <main className="shell py-12 md:py-16">
      <Meta title="Pago correcto | Guarros Extremeños" description="Tu pedido se ha procesado correctamente." />
      <section className="max-w-3xl mx-auto px-4 text-center">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 md:p-10">
          <svg className="mx-auto h-12 w-12 text-brand" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.42l-8 8a1 1 0 01-1.408 0l-4-4a1 1 0 111.408-1.42L8 12.58l7.296-7.29a1 1 0 011.408 0z" clipRule="evenodd"/>
          </svg>
          <h1 className="mt-4 text-3xl md:text-5xl font-stencil text-brand">Pago completado</h1>
          <p className="mt-3 text-zinc-300">¡Gracias por tu compra! Te hemos enviado un email con los detalles del pedido.</p>

          <div className="mt-6 flex items-center justify-center gap-3">
            {/* Inicio: estilo Suscripción del Hero (outline) */}
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-base font-stencil tracking-wide
                         text-white border border-white/20 transition-colors duration-200 hover:bg-white/15
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 active:scale-[0.98]"
            >
              Inicio
            </Link>

            {/* Seguir comprando: estilo Ver Jamones (rojo) */}
            <Link
              to="/jamones"
              className="group relative inline-flex items-center justify-center rounded-xl px-6 py-3 text-base font-stencil tracking-wide
                         text-black bg-[#E53935] transition-colors duration-200 shadow-lg hover:bg-[#992623]
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 active:scale-[0.98]"
            >
              <span className="relative z-10">Seguir comprando</span>
              <span className="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-[#E53935]/50 group-hover:ring-[#992623]/50 transition-all" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
