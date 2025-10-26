// src/components/PlansCompare.jsx
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  SUBSCRIPTION_PRICE_TABLE,
} from "@/data/subscriptionPricing";

// --- 1. IMPORTAR SWIPER ---
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

// --- 2. IMPORTAR ESTILOS DE SWIPER ---
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const BADGES = {
  500: "Más popular",
  2000: "Mejor valor",
};

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: "easeOut" },
  viewport: { once: true, amount: 0.2 }
};

export default function PlansCompare() {
  const navigate = useNavigate();

  function onChoosePlan(grams) {
    try {
      navigate(`/subscription-checkout?grams=${grams}`);
    } catch (e) {
      console.error("Error al navegar al checkout:", e);
    }
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-6 md:py-8">
      <motion.div {...fadeUp} className="text-center mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-stencil text-brand">
          Elige tu dosis canalla
        </h2>
        <p className="text-zinc-300 mt-2">
          Tramos cerrados de 100 g a 2000 g. Precios finales, envío incluido. Sin permanencia.
        </p>
      </motion.div>

      {/* --- 3. REEMPLAZAR EL GRID POR EL CARRUSEL SWIPER --- */}
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={20} // Espacio entre tarjetas
        slidesPerView={2} // Tarjetas por defecto (móvil)
        navigation // Activa flechas de navegación
        pagination={{ clickable: true }} // Activa puntos de paginación
        breakpoints={{
          // Responsive: 3 tarjetas en tablets
          640: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          // Responsive: 4 tarjetas en PC
          1024: {
            slidesPerView: 4,
            spaceBetween: 24,
          },
        }}
        className="pb-12" // Espacio extra abajo para los puntos de paginación
      >
        {SUBSCRIPTION_PRICE_TABLE.map((p, i) => (
          // --- 4. CADA ITEM VA EN UN <SwiperSlide> ---
          <SwiperSlide key={p.g} className="h-auto pb-2"> {/* h-auto para que el flex funcione bien */}
            <motion.article
              key={p.g}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.35, delay: Math.min(i, 8) * 0.03 }}
              className={[
                "group relative rounded-2xl border border-white/10 bg-zinc-900/60",
                "p-4 md:p-5 flex flex-col items-center text-center",
                "shadow-[0_10px_30px_rgba(0,0,0,.25)]",
                "hover:border-brand/60 hover:bg-black/70 hover:shadow-[0_14px_40px_rgba(214,40,40,.25)]",
                "transition-all",
                "h-full" // <-- 5. AÑADIDO: asegura que todas las tarjetas tengan la misma altura
              ].join(" ")}
            >
              {/* Badge opcional */}
              {BADGES[p.g] && (
                <div className="absolute -top-2 right-3">
                  <span className="inline-flex items-center rounded-full bg-brand text-white text-[11px] font-bold px-2.5 py-1 shadow-[0_6px_18px_rgba(214,40,40,.45)]">
                    {BADGES[p.g]}
                  </span>
                </div>
              )}

              <div className="mt-1">
                <div className="text-sm uppercase tracking-wide text-zinc-400">Suscripción</div>
                <h3 className="mt-1 text-2xl md:text-3xl font-stencil text-white">
                  {p.g} g/mes
                </h3>
              </div>

              <div className="mt-3 md:mt-4">
                <div className="text-[13px] text-zinc-400">Desde</div>
                <div className="text-2xl md:text-3xl font-extrabold text-brand">
                  {p.price} €/mes
                </div>
              </div>

              {/* Spacer para empujar el botón al fondo */}
              <div className="flex-1" />

              <button
                type="button"
                onClick={() => onChoosePlan(p.g)}
                className={[
                  "mt-5 w-full",
                  "relative inline-flex items-center justify-center",
                  "rounded-xl px-4 py-2.5",
                  "font-black tracking-wide uppercase",
                  "bg-brand text-white",
                  "shadow-[0_8px_22px_rgba(214,40,40,.35)]",
                  "ring-1 ring-brand/30",
                  "transition-all",
                  "hover:translate-y-[-1px] hover:shadow-[0_12px_28px_rgba(214,40,40,.45)]",
                  "active:translate-y-[0px] active:shadow-[0_6px_16px_rgba(214,40,40,.35)]"
                ].join(" ")}
                aria-label={`Elegir plan de ${p.g} gramos`}
              >
                Elegir este plan
              </button>

              <div
                className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  boxShadow: "inset 0 0 0 1px rgba(255,255,255,.04), 0 30px 80px rgba(214,40,40,.20)"
                }}
              />
            </motion.article>
          </SwiperSlide>
        ))}
      </Swiper>
      {/* --- FIN DEL CARRUSEL --- */}


      <motion.p {...fadeUp} className="text-center text-zinc-400 text-sm mt-6">
        Los importes mostrados son finales (IVA y envío incluidos). Gestiona tu suscripción cuando quieras desde el email de confirmación.
      </motion.p>
    </section>
  );
}