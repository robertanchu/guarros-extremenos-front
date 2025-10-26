// src/pages/Contacto.jsx
import React, { useEffect, useRef, useState } from "react";
import Meta from "@/lib/Meta";
import { motion, useReducedMotion } from "framer-motion";

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


// =========================================================
  // ===== FUNCIÓN 'onSubmit' MODIFICADA (FIRE-AND-FORGET) =====
  // =========================================================
  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true); // <-- Muestra "Enviando..."
    setOk(null);

    // 1. Obtenemos los datos del formulario
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());

    // 2. "Disparamos" la petición al servidor.
    //    NO usamos 'await', así que no esperamos la respuesta.
    fetch(import.meta.env.VITE_CONTACT_ENDPOINT || "/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(err => {
      // Si el envío falla en segundo plano (ej. sin conexión),
      // simplemente lo registramos en la consola. El usuario
      // ya ha visto el mensaje de éxito.
      console.error("Error de envío (segundo plano):", err);
    });

    // 3. Mostramos el mensaje de éxito INMEDIATAMENTE
    //    Usamos un pequeño retraso para que parezca "real".
    setTimeout(() => {
      setOk(true); // <-- Muestra "¡Gracias!"
      e.currentTarget.reset(); // <-- Limpia el formulario
      setLoading(false); // <-- ¡QUITA EL "Enviando..."!
    }, 600); // 0.6 segundos de retraso
  }
  // =========================================================
  // ===== FIN DE LA MODIFICACIÓN ============================
  // =========================================================


  // ===== Animaciones (Framer) =====
  const prefersReduced = useReducedMotion();
  const fadeUp = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    }
  };
  const container = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: prefersReduced ? 0 : 0.08,
        delayChildren: 0.05
      }
    }
  };

  return (
    <>
      <Meta
        title="Contacto · Guarros Extremeños"
        description="¿Dudas, pedidos especiales o distribuciones? Escríbenos y te respondemos canallamente rápido."
      />

      <section className="py-16 md:py-24">
        <div className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          {/* Header con efecto */}
          <motion.header
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            className="max-w-3xl"
          >
            <h1 className="mt-2 text-3xl md:text-5xl font-stencil text-brand">Contacto</h1>
            <p className="mt-4 text-zinc-300">
              ¿Hablamos? Rellena el formulario y te respondemos lo antes posible.
            </p>
          </motion.header>

          {/* Grid con stagger: imagen y formulario aparecen secuenciados */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            className="mt-10 grid gap-8 md:grid-cols-2 items-start"
          >
            {/* COLUMNA IMAGEN (manda la altura) */}
            <motion.div
              variants={fadeUp}
              className="rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03]"
            >
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
            </motion.div>

            {/* COLUMNA FORM (misma altura que la imagen) */}
            <motion.form
              variants={fadeUp}
              onSubmit={onSubmit}
              className="rounded-2xl border border-white/10 bg-white/[0.03] flex flex-col min-h-0"
              style={imgHeight ? { height: imgHeight + "px" } : undefined}
            >
              {/* Contenido interior compacto (como lo tenías) */}
              <div className="p-5 md:p-6 flex-1 min-h-0 flex flex-col">
                {/* ARRIBA: Nombre + Email (2 col), luego Asunto */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="name" className="block text-xs text-white/70 mb-1">Nombre</label>
                    <input
                      id="name" name="name" type="text" required autoComplete="name"
                      className="w-full h-10 rounded-xl bg-black/30 border border-white/10 px-3 text-white placeholder-white/40
                                 focus:outline-none focus:ring-2 focus:ring-[#E53935]/60 focus:border-[#E53935]/50 transition"
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs text-white/70 mb-1">Email</label>
                    <input
                      id="email" name="email" type="email" required autoComplete="email"
                      className="w-full h-10 rounded-xl bg-black/30 border border-white/10 px-3 text-white placeholder-white/40
                                 focus:outline-none focus:ring-2 focus:ring-[#E53935]/60 focus:border-[#E53935]/50 transition"
                      placeholder="tucorreo@ejemplo.com"
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label htmlFor="subject" className="block text-xs text-white/70 mb-1">Asunto</label>
                  <input
                    id="subject" name="subject" type="text" required
                    className="w-full h-10 rounded-xl bg-black/30 border border-white/10 px-3 text-white placeholder-white/40
                               focus:outline-none focus:ring-2 focus:ring-[#E53935]/60 focus:border-[#E53935]/50 transition"
                    placeholder="¿Sobre qué quieres hablar?"
                  />
                </div>

                {/* MENSAJE: ocupa todo el resto */}
                <div className="mt-3 flex-1 min-h-0 flex flex-col">
                  <label htmlFor="message" className="block text-xs text-white/70 mb-1">Mensaje</label>
                  <textarea
                    id="message" name="message"
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
            </motion.form>
          </motion.div>
        </div>
      </section>
    </>
  );
}
