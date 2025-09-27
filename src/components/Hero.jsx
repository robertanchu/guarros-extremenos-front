import React from "react";
import stackedLogo from "@/assets/logo/logo_stacked_1600.webp";
import poster from "@/assets/hero/hero-poster.jpg";
import heroVideoDefault from "@/assets/hero/hero-spot.mp4";
export default function Hero(){
  const HERO_VIDEO = import.meta.env.VITE_HERO_VIDEO || heroVideoDefault;
  return (
    <section className="relative overflow-hidden bg-black">
      {HERO_VIDEO ? (
        <div className="absolute inset-0 -z-10 opacity-35">
          <video className="w-full h-full object-cover" src={HERO_VIDEO} autoPlay muted loop playsInline poster={poster} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black" />
        </div>
      ) : (
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black via-zinc-950 to-black" />
      )}
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-block relative shine-wrap">
          <img src={stackedLogo} alt="Guarros Extremeños" className="mx-auto w-[70%] max-w-[520px] drop-shadow-[0_0_18px_rgba(162,46,36,0.35)]" fetchpriority="high" />
        </div>
        <h1 className="mt-8 text-3xl md:text-5xl font-stencil tracking-wide text-brand">TAN GUARROS QUE SÓLO COMEN BELLOTAS</h1>
        <p className="mt-4 text-zinc-300 max-w-2xl mx-auto">Jamón Ibérico 100% de Bellota · D.O.P Extremadura. Humor canalla, sabor premium.</p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/jamones" className="btn-primary">Ver Jamones</a>
          <a href="/suscripcion" className="btn-secondary">Suscripción Mensual</a>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
      <style>{`
        .shine-wrap::after{content:"";position:absolute;inset:0;background:linear-gradient(120deg,transparent 0%,rgba(255,255,255,0.18) 35%,transparent 65%);transform:translateX(-130%);pointer-events:none;}
        .shine-wrap:hover::after{animation:shine 1.2s ease;}
        @keyframes shine{to{transform:translateX(130%);}}
      `}</style>
    </section>
  );
}
