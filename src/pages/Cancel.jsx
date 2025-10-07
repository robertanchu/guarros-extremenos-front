// src/pages/Cancel.jsx
import React from "react";
import Meta from "@/lib/Meta";
import { Link } from "react-router-dom";

export default function Cancel(){
  return (
    <main className="shell py-12 md:py-16">
      <Meta title="Pago cancelado | Guarros Extremeños" description="El pago se canceló o no pudo completarse." />
      <section className="max-w-3xl mx-auto px-4 text-center">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 md:p-10">
          <svg className="mx-auto h-12 w-12 text-amber-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 5a1 1 0 10-2 0v6a1 1 0 102 0V7zm-1 10a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5z" clipRule="evenodd"/>
          </svg>
          <h1 className="mt-4 text-3xl md:text-5xl font-stencil text-brand">Pago cancelado</h1>
          <p className="mt-3 text-zinc-300">No se ha realizado el cargo. Puedes revisar el carrito y volver a intentarlo.</p>

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
