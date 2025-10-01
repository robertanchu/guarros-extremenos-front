import React from "react";
import Meta from "@/lib/Meta";
import { Link } from "react-router-dom";

export default function Success(){
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
            <Link to="/" className="btn-secondary">Inicio</Link>
            <Link to="/jamones" className="btn-primary">Seguir comprando</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
