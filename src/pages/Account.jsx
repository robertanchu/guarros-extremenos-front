// src/pages/Account.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Account() {
  return (
    <main className="min-h-[70vh] bg-black text-white">
      <section className="max-w-5xl mx-auto px-4 py-16">
        {/* Título consistente con secciones (stencil + rojo marca) */}
	<h1 className="text-3xl md:text-5xl font-stencil text-brand">MI CUENTA</h1>

        <p className="mt-6 text-base md:text-lg text-zinc-300 leading-relaxed max-w-3xl">
          Has regresado del portal de facturación. Desde allí puedes actualizar tu método de pago,
          descargar facturas o cancelar tu suscripción. Si necesitas ayuda, escríbenos a{" "}
          <a href="mailto:soporte@guarrosextremenos.com" className="underline decoration-brand-red">
            soporte@guarrosextremenos.com
          </a>.
        </p>

        {/* Caja de información */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold text-white">¿Qué puedo hacer aquí?</h2>
          <ul className="mt-3 space-y-2 text-sm md:text-base text-zinc-300 list-disc pl-5">
            <li>Revisa tu correo: encontrarás el botón <em>“Gestionar suscripción”</em>.</li>
            <li>Descarga tus facturas desde los emails de confirmación.</li>
            <li>Contacta con nosotros para cualquier cambio en tu pedido.</li>
          </ul>
        </div>

        {/* CTA */}
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-xl border border-brand-red/50 bg-brand-red/90 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-red transition"
          >
            Volver al inicio
          </Link>
          <Link
            to="/suscripcion"
            className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
          >
            Ver planes de suscripción
          </Link>
          <Link
            to="/contacto"
            className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
          >
            Contacto
          </Link>
        </div>

        {/* Nota legal ligera */}
        <p className="mt-12 text-xs text-zinc-500">
          Si has llegado aquí directamente, puede que no haya cambios que mostrar. La gestión de la
          suscripción se realiza desde el enlace seguro del correo.
        </p>
      </section>
    </main>
  );
}
