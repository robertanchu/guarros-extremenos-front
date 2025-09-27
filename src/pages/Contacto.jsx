import React, { useState } from "react";
import Meta from "../lib/Meta";
import { MEDIA } from "../data/media";

export default function Contacto(){
  const [sent, setSent] = useState(false);
  const onSubmit = (e)=>{ e.preventDefault(); setSent(true); };
  return (
    <>
      <Meta title="Contacto" description="¿Dudas, pedidos grandes o partnerships? Escríbenos sin filtro." />
      <section className="py-16">
        <div className="container grid md:grid-cols-2 gap-10">
          <div>
            <h1 className="text-3xl md:text-5xl font-stencil text-brand">Contacto</h1>
            <p className="text-zinc-300 mt-4">Si buscas un jamón serio con alma canalla, has llegado. Escríbenos para pedidos, suscripciones de empresa o tiendas que quieran vender Guarros.</p>
            <div className="mt-6 space-y-2 text-zinc-200">
              <p><strong>Email:</strong> hola@guarrosextremenos.com</p>
              <p><strong>Teléfono:</strong> +34 600 123 456</p>
              <p><strong>Horario:</strong> L–V 9:00–18:00</p>
            </div>
            <img src={MEDIA.og.contacto} alt="Atención Guarra" className="w-full mt-8 rounded-2xl border border-white/10 object-cover" />
          </div>
          <form onSubmit={onSubmit} className="rounded-2xl border border-white/10 p-6 bg-white/5">
            <div className="grid gap-4">
              <div>
                <label className="block text-sm text-zinc-300 mb-1">Nombre</label>
                <input required className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand" placeholder="Tu nombre" />
              </div>
              <div>
                <label className="block text-sm text-zinc-300 mb-1">Email</label>
                <input type="email" required className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand" placeholder="tucorreo@ejemplo.com" />
              </div>
              <div>
                <label className="block text-sm text-zinc-300 mb-1">Mensaje</label>
                <textarea required rows="6" className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand" placeholder="Dispara tu duda, sin rodeos." />
              </div>
              {!sent ? (
                <button className="btn-primary">Enviar</button>
              ) : (
                <div className="text-amber-300">¡Mensaje enviado! Te contestamos a la dehesa de ya.</div>
              )}
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
