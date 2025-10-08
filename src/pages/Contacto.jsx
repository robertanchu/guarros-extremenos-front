// src/pages/Contacto.jsx
import React, { useEffect, useRef, useState } from "react";
import Meta from "@/lib/Meta";

export default function Contacto() {
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(null);

  // Igualar altura del formulario a la altura real de la imagen
  const imgRef = useRef(null);
  const [imgHeight, setImgHeight] = useState(null);

  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;

    const apply = () => setImgHeight(el.clientHeight || null);
    const ro = new ResizeObserver(apply);
    ro.observe(el);

    if (el.complete) apply();
    else el.addEventListener("load", apply, { once: true });

    window.addEventListener("resize", apply);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", apply);
    };
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setOk(null);
    try {
      const form = new FormData(e.currentTarget);
      const payload = Object.fromEntries(form.entries());
      const res = await fetch(import.meta.env.VITE_CONTACT_ENDPOINT || "/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Error al enviar");
      setOk(true);
      e.currentTarget.reset();
    } catch (err) {
      console.error(err);
      setOk(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Meta
        title="Contacto · Guarros Extremeños"
        description="¿Dudas, pedidos especiales o distribuciones? Escríbenos y te respondemos canallamente rápido."
      />

      <section className="py-16 md:py-24">
        <div className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <header className="max-w-3xl">
            <h1 className="mt-2 text-3xl md:text-5xl font-stencil text-brand">Contacto</h1>
            <p className="mt-4 text-zinc-300">
              ¿Hablamos? Rellena el formulario y te respondemos lo antes posible.
            </p>
          </header>

          {/* Importante: items-start para NO estirar automáticamente */}
          <div className="mt-10 grid gap-8 md:grid-cols-2 items-start">
            {/* COLUMNA IMAGEN (manda la altura) */}
            <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03]">
              <img
                ref={imgRef}
                src="/images/contacto/contacto_banner_1500x1000.webp"
                srcSet="
                  /images/contacto/contacto_banner_1000x667.webp 1000w,
                  /images/contacto/contacto_banner_1500x1000.webp 1500w
                "
                sizes="(max-width: 768px) 100vw, 50vw"
                alt="Material de oficina y contacto de Guarros Extremeños"
                loading="lazy"
                className="w-full h-auto block"
              />
            </div>

            {/* COLUMNA FORM (misma altura que la imagen) */}
            <form
              onSubmit={onSubmit}
              className="rounded-2xl border border-white/10 bg-white/[0.03] flex flex-col min-h-0"
              style={imgHeight ? { height: imgHeight + "px" } : undefined}
            >
              {/* Contenido interior más compacto */}
              <div className="p-5 md:p-6 flex-1 min-h-0 flex flex-col">
                {/* ARRIBA: Nombre + Email (2 col), luego Asunto (1 col) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="name" className="block text-xs text-white/70 mb-1">
                      Nombre
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      className="w-full h-10 rounded-xl bg-black/30 border border-white/10 px-3 text-white placeholder-white/40
                                 focus:outline-none focus:ring-2 focus:ring-[#E53935]/60 focus:border-[#E53935]/50 transition"
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs text-white/70 mb-1">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      className="w-full h-10 rounded-xl bg-black/30 border border-white/10 px-3 text-white placeholder-white/40
                                 focus:outline-none focus:ring-2 focus:ring-[#E53935]/60 focus:border-[#E53935]/50 transition"
                      placeholder="tucorreo@ejemplo.com"
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label htmlFor="subject" className="block text-xs text-white/70 mb-1">
                    Asunto
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    className="w-full h-10 rounded-xl bg-black/30 border border-white/10 px-3 text-white placeholder-white/40
                               focus:outline-none focus:ring-2 focus:ring-[#E53935]/60 focus:border-[#E53935]/50 transition"
                    placeholder="¿Sobre qué quieres hablar?"
                  />
                </div>

                {/* MENSAJE: ocupa TODO el resto de altura */}
                <div className="mt-3 flex-1 min-h-0 flex flex-col">
                  <label htmlFor="message" className="block text-xs text-white/70 mb-1">
                    Mensaje
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    className="flex-1 min-h-0 w-full rounded-xl bg-black/30 border border-white/10 px-3 py-3 text-white
                               placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#E53935]/60 focus:border-[#E53935]/50
                               transition resize-none overflow-auto"
                    placeholder="Cuéntanos con detalle cómo podemos ayudarte"
                  />
                </div>

                {/* Estado compacto */}
                {ok === true && (
                  <p className="mt-2 text-xs text-green-400">
                    ¡Gracias! Hemos recibido tu mensaje y te contestaremos pronto.
                  </p>
                )}
                {ok === false && (
                  <p className="mt-2 text-xs text-red-400">
                    Ha habido un problema al enviar el mensaje. Inténtalo de nuevo.
                  </p>
                )}
              </div>

              {/* Botón pegado abajo */}
              <div className="px-5 md:px-6 pb-5">
                <button
                  type="submit"
                  disabled={loading}
                  className="relative inline-flex items-center justify-center rounded-xl h-11 px-5
                             font-stencil tracking-wide text-black bg-[#E53935] hover:bg-[#992623]
                             transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50
                             disabled:opacity-60 disabled:cursor-not-allowed w-full"
                >
                  {loading ? "Enviando…" : "Enviar"}
                  <span className="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-[#E53935]/50 hover:ring-[#992623]/50 transition-all" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
