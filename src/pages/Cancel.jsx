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
          <h1 className="mt-4 text-3xl md:text-5xl font-stencil text-white">Pago cancelado</h1>
          <p className="mt-3 text-zinc-300">No se ha realizado el cargo. Puedes revisar el carrito y volver a intentarlo.</p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link to="/carrito" className="btn-secondary">Ver carrito</Link>
            <Link to="/jamones" className="btn-primary">Seguir comprando</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
