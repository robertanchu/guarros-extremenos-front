// src/components/PlansCompare.jsx
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useConfig } from "@/store/config"; 

// Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const BADGES = {
  500: "Más popular",
  2000: "Mejor valor"
};

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
  viewport: { once: true }
};

export default function PlansCompare() {
  const navigate = useNavigate();
  const { prices, getGramsList, fetchConfig } = useConfig();
  const gramsList = getGramsList();

  useEffect(() => { fetchConfig(); }, []);

  function onChoosePlan(grams) {
    navigate(`/subscription-checkout?grams=${grams}`);
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <motion.div {...fadeUp} className="text-center mb-6 md:mb-8">
        <h2 className="text-3xl md:text-5xl font-stencil text-brand">
          Elige tu dosis canalla
        </h2>
        <p className="text-zinc-300 mt-3 text-lg">
          Precios actualizados. Envío incluido. Sin permanencia.
        </p>
      </motion.div>

      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={20}
        slidesPerView={1.2}
        centeredSlides={false}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          500: { slidesPerView: 2, spaceBetween: 20 },
          768: { slidesPerView: 3, spaceBetween: 24 },
          1024: { slidesPerView: 4, spaceBetween: 24 },
        }}
        // CAMBIO 1 (Flechas): Añadido '!px-12 md:!px-16' para dejar sitio a las flechas a los lados
        className="!pt-4 !pb-14 !px-12 md:!px-16"
      >
        {gramsList.map((g) => {
          const price = prices[g] / 100;
          const isBadge = !!BADGES[g];

          // CAMBIO 2 (Formato Kg): Lógica para mostrar kg o g
          let displayVal = g;
          let displayUnit = "g";
          
          if (g >= 1000) {
            // Convierte 1500 -> 1,5 (con coma española si el navegador está en es-ES)
            displayVal = (g / 1000).toLocaleString("es-ES");
            displayUnit = "kg";
          }

          return (
            <SwiperSlide key={g} className="h-auto pb-2">
              <div className="group h-full relative rounded-2xl border border-white/10 bg-white/[0.03] p-4 flex flex-col items-center text-center 
                              transition-all duration-300 ease-in-out 
                              hover:scale-[1.02] hover:shadow-xl hover:shadow-black/40 
                              hover:ring-2 hover:ring-[#E53935]/80">
                
                {isBadge && (
                  <div className="absolute -top-3 right-1/2 translate-x-1/2 md:translate-x-0 md:right-4">
                    <span className="inline-flex items-center rounded-full bg-brand text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 shadow-lg shadow-brand/20">
                      {BADGES[g]}
                    </span>
                  </div>
                )}

                <div className="mt-2 mb-3">
                  <div className="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-1">Suscripción</div>
                  {/* Renderizado dinámico de gramos o kg */}
                  <h3 className="text-2xl md:text-3xl font-stencil text-white">
                    {displayVal} <span className="text-lg align-top text-white/60">{displayUnit}</span>
                  </h3>
                </div>

                <div className="mt-auto w-full">
                  <div className="mb-1 text-[11px] text-zinc-500">Precio final</div>
                  <div className="text-3xl md:text-4xl font-black text-brand tracking-tight">
                    {price}<span className="text-xl font-bold text-brand/80">€</span>
                    <span className="text-xs font-medium text-zinc-500 ml-1">/mes</span>
                  </div>

                  <button
                    onClick={() => onChoosePlan(g)}
                    className="mt-5 relative inline-flex items-center justify-center rounded-xl h-11 px-5
                               font-stencil tracking-wide text-black bg-[#E53935] hover:bg-[#992623]
                               transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50
                               w-full shadow-lg active:scale-[0.98] text-sm md:text-base"
                  >
                    <span className="relative z-10">ELEGIR</span>
                    <span className="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-[#E53935]/50 group-hover:ring-[#992323]/50 transition-all" />
                  </button>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
}