import React from "react";

export default function Hero(){
  const videoSrc = import.meta.env.VITE_HERO_VIDEO;
  return (
    <section className="relative h-[60vh] min-h-[420px] w-full overflow-hidden border-b border-white/10">
      {videoSrc ? (
        <video className="absolute inset-0 w-full h-full object-cover" src={videoSrc} autoPlay muted loop playsInline />
      ) : (
        <img className="absolute inset-0 w-full h-full object-cover" src="/src/assets/hero/hero_poster.jpg" alt="Guarros Extremeños" />
      )}
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative h-full max-w-7xl mx-auto px-6 flex items-center">
        <div>
          <p className="text-amber-300 tracking-wide text-sm">D.O.P Extremadura</p>
          <h1 className="mt-2 text-4xl md:text-6xl font-stencil text-white">TAN GUARROS QUE SÓLO COMEN BELLOTAS</h1>
        </div>
      </div>
    </section>
  );
}
