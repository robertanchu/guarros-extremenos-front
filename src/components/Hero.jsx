import React from "react";
import heroPoster from "@/assets/hero/hero_poster.jpg";
import heroVideo from "@/assets/hero/hero-cinematic.mp4";

export default function Hero(){
  // Permite override por .env si es una URL absoluta (CDN); si no, usa el import
  const envSrc = import.meta.env.VITE_HERO_VIDEO;
  const isAbsolute = typeof envSrc === "string" && /^https?:\/\//.test(envSrc);
  const src = isAbsolute ? envSrc : heroVideo;

  return (
    <section className="relative h-[60vh] min-h-[420px] w-full overflow-hidden border-b border-white/10">
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src={src}
        poster={heroPoster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      >
        <source src={src} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative h-full max-w-7xl mx-auto px-6 flex items-center">
        <div>
          <p className="text-amber-300 tracking-wide text-sm">D.O.P Extremadura</p>
          <h1 className="mt-2 text-4xl md:text-6xl font-stencil text-white">
            TAN GUARROS QUE SÓLO COMEN BELLOTAS
          </h1>
        </div>
      </div>
    </section>
  );
}
