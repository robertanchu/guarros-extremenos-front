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
      <motion.div {...fadeUp} className="text-center mb-10">
        <h2 className="text-3xl md:text-5xl font-stencil text-brand">
          Elige tu dosis canalla
        </h2>
        <p className="text-zinc-300 mt-3 text-lg">
          Precios actualizados. Envío incluido. Sin permanencia.
        </p>
      </motion.div>

      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={24}
        slidesPerView={1.2}
        centeredSlides={false}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          500: { slidesPerView: 2, spaceBetween: 20 },
          768: { slidesPerView: 3, spaceBetween: 24 },
          1024: { slidesPerView: 4, spaceBetween: 24 },
        }}
        className="!pb-14" // Fuerza padding para la paginación
      >
        {gramsList.map((g, i) => {
          const price = prices[g] / 100;
          return (
            <SwiperSlide key={g} className="h-auto pb-2">
              <div className="group h-full relative rounded-2xl border border-white/10 bg-zinc-900/60 p-6 flex flex-col items-center text-center transition-all hover:border-brand/50 hover:bg-zinc-900 hover:shadow-2xl hover:shadow-brand/10 hover:-translate-y-1">
                
                {BADGES[g] && (
                  <div className="absolute -top-3 right-1/2 translate-x-1/2 md:translate-x-0 md:right-4">
                    <span className="inline-flex items-center rounded-full bg-brand text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 shadow-lg shadow-brand/20">
                      {BADGES[g]}
                    </span>
                  </div>
                )}

                <div className="mt-2 mb-4">
                  <div className="text-sm uppercase tracking-widest text-zinc-500 font-bold mb-1">Suscripción</div>
                  <h3 className="text-3xl font-stencil text-white">
                    {g} <span className="text-xl align-top text-white/60">g</span>
                  </h3>
                </div>

                <div className="mt-auto w-full">
                  <div className="mb-1 text-xs text-zinc-500">Precio final</div>
                  <div className="text-4xl font-black text-brand tracking-tight">
                    {price}<span className="text-2xl font-bold text-brand/80">€</span>
                    <span className="text-sm font-medium text-zinc-500 ml-1">/mes</span>
                  </div>

                  <button
                    onClick={() => onChoosePlan(g)}
                    className="mt-6 w-full py-3 rounded-xl bg-brand text-black font-black uppercase tracking-wide hover:bg-zinc-200 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg"
                  >
                    Elegir
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