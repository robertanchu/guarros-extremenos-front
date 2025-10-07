// src/pages/Contacto.jsx
import React, { useState } from "react";
import Meta from "../lib/Meta";
import { MEDIA } from "../data/media";

const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://guarros-extremenos-api.onrender.com";

export default function Contacto() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
    company: "", // honeypot
  });
  const [status, setStatus] = useState({ sending: false, sent: false, error: "" });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus({ sending: true, sent: false, error: "" });

    try {
      const res = await fetch(`${API_BASE}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name?.trim(),
          email: form.email?.trim(),
          message: form.message?.trim(),
          company: form.company, // honeypot
          source: "front-contact",
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "No se pudo enviar el mensaje.");
      }

      setStatus({ sending: false, sent: true, error: "" });
      setForm({ name: "", email: "", message: "", company: "" });
    } catch (err) {
      setStatus({ sending: false, sent: false, error: err.message || "Error desconocido" });
    }
  };

  return (
    <>
      <Meta
        title="Contacto"
        description="¿Dudas, pedidos grandes o partnerships? Escríbenos sin filtro."
      />
      <section className="py-16">
        <div className="container grid md:grid-cols-2 gap-10">
          {/* Columna izquierda */}
          <div>
            <h1 className="text-3xl md:text-5xl font-stencil text-brand">Contacto</h1>
            <p className="text-zinc-300 mt-4">
              Si buscas un jamón serio con alma canalla, has llegado. Escríbenos
              para pedidos, suscripciones de empresa o tiendas que quieran vender
              Guarros.
            </p>
            <div className="mt-6 space-y-2 text-zinc-200">
              <p>
                <strong>Email:</strong> hola@guarrosextremenos.com
              </p>
              <p>
                <strong>Teléfono:</strong> +34 600 123 456
              </p>
              <p>
                <strong>Horario:</strong> L–V 9:00–18:00
              </p>
            </div>
            <img
              src={MEDIA.og.contacto}
              alt="Atención Guarra"
              className="w-full mt-8 rounded-2xl border border-white/10 object-cover"
            />
          </div>

          {/* Formulario (con focus-within del contenedor y focus canalla en campos) */}
          <form
            onSubmit={onSubmit}
            className="rounded-2xl border border-white/10 p-6 bg-white/5
                       focus-within:border-white/20 focus-within:ring-1 focus-within:ring-[#E53935]/30"
          >
            {/* Honeypot (oculto) */}
            <input
              type="text"
              name="company"
              value={form.company}
              onChange={onChange}
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden="true"
            />

            <div className="grid gap-4">
              <div>
                <label htmlFor="name" className="block text-sm text-zinc-300 mb-1">
                  Nombre
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  value={form.name}
                  onChange={onChange}
                  autoComplete="name"
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 outline-none
                             transition-colors focus:bg-white/10 focus:border-[#E53935]
                             focus:ring-2 focus:ring-[#E53935]/40"
                  placeholder="Tu nombre"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm text-zinc-300 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={onChange}
                  autoComplete="email"
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 outline-none
                             transition-colors focus:bg-white/10 focus:border-[#E53935]
                             focus:ring-2 focus:ring-[#E53935]/40"
                  placeholder="tucorreo@ejemplo.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm text-zinc-300 mb-1">
                  Mensaje
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 outline-none
                             transition-colors focus:bg-white/10 focus:border-[#E53935]
                             focus:ring-2 focus:ring-[#E53935]/40
                             min-h-48 md:min-h-64 lg:min-h-80 resize-y"
                  placeholder="Dispara tu duda, sin rodeos."
                  value={form.message}
                  onChange={onChange}
                />
              </div>

              {!status.sent ? (
                <button
                  type="submit"
                  disabled={status.sending}
                  className={`group relative inline-flex items-center justify-center 
                              w-full sm:w-auto rounded-xl px-6 py-3 text-base font-stencil tracking-wide
                              text-black bg-[#E53935] transition-colors duration-200 shadow-lg
                              hover:bg-[#992623] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 
                              active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed`}
                  aria-label={status.sending ? "Enviando" : "Enviar"}
                >
                  {status.sending && (
                    <svg
                      className="mr-2 h-5 w-5 animate-spin"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" className="opacity-25" />
                      <path d="M4 12a8 8 0 0 1 8-8" fill="none" stroke="currentColor" strokeWidth="4" className="opacity-75" />
                    </svg>
                  )}
                  {status.sending ? "Enviando…" : "Enviar"}
                  <span className="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-[#E53935]/50 group-hover:ring-[#992623]/50 transition-all" />
                </button>
              ) : (
                <div className="text-amber-300">
                  ¡Mensaje enviado! Te contestamos a la dehesa de ya.
                </div>
              )}

              {status.error && (
                <div className="text-red-400 text-sm">{status.error}</div>
              )}
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
