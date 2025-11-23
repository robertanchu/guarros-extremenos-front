// src/components/PlansCompare.jsx
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useConfig } from "@/store/config"; // <--- IMPORTANTE

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css'; import 'swiper/css/navigation'; import 'swiper/css/pagination';

const BADGES = { 500: "Más popular", 2000: "Mejor valor" };

export default function PlansCompare() {
  const navigate = useNavigate();
  
  // 1. Conectamos con el store dinámico
  const { prices, getGramsList, fetchConfig } = useConfig();
  const gramsList = getGramsList();

  // 2. Pedimos precios frescos al cargar el componente
  useEffect(() => { fetchConfig(); }, []);

  function onChoosePlan(grams) {
    navigate(`/subscription-checkout?grams=${grams}`);
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-6 md:py-8">
      <motion.div className="text-center mb-6 md:mb-8" initial={{opacity:0, y:10}} whileInView={{opacity:1, y:0}} viewport={{once:true}}>
        <h2 className="text-2xl md:text-3xl font-stencil text-brand">Elige tu dosis canalla</h2>
        <p className="text-zinc-300 mt-2">Precios actualizados en tiempo real. Envío incluido.</p>
      </motion.div>

      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={20} slidesPerView={2} navigation pagination={{ clickable: true }}
        breakpoints={{ 640: { slidesPerView: 3 }, 1024: { slidesPerView: 4 } }}
        className="pb-12"
      >
        {gramsList.map((g, i) => {
          const price = prices[g] / 100; // Convertir céntimos a euros

          return (
            <SwiperSlide key={g} className="h-auto pb-2">
              <div className="group relative rounded-2xl border border-white/10 bg-zinc-900/60 p-5 flex flex-col items-center text-center h-full hover:border-brand/60 hover:shadow-lg transition-all">
                {BADGES[g] && (
                  <span className="absolute -top-2 right-3 bg-brand text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {BADGES[g]}
                  </span>
                )}
                <div className="mt-2">
                  <h3 className="text-2xl font-stencil text-white">{g} g</h3>
                  <p className="text-xs text-zinc-400 uppercase">AL MES</p>
                </div>
                <div className="mt-4 text-3xl font-black text-brand">{price} €</div>
                <div className="flex-1" />
                <button onClick={() => onChoosePlan(g)} className="mt-5 w-full rounded-xl bg-white text-black font-bold py-2.5 hover:bg-zinc-200 transition">
                  Elegir
                </button>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
}