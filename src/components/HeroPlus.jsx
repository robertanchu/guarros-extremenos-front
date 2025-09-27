import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const VIDEO_SRC  = "/media/hero.mp4";
const POSTER_SRC = "/media/hero-poster.jpg";

export default function HeroPlus(){
  const videoRef = useRef(null);
  const [usePosterOnly, setUsePosterOnly] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const tryPlay = async () => {
      try { v.muted = true; v.playsInline = true; await v.play(); }
      catch { setUsePosterOnly(true); }
    };
    fetch(VIDEO_SRC, { method: "HEAD" })
      .then(r => { if (!r.ok) throw new Error(); return tryPlay(); })
      .catch(() => setUsePosterOnly(true));
  }, []);

  return (
    <section className="relative h-[72vh] min-h-[520px] w-full overflow-hidden border-b border-white/10 full-bleed">
      {!usePosterOnly ? (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover block"
          muted loop playsInline autoPlay preload="auto" poster={POSTER_SRC}
        >
          <source src={VIDEO_SRC} type="video/mp4" />
        </video>
      ) : (
        <img src={POSTER_SRC} alt="Dehesa" className="absolute inset-0 w-full h-full object-cover block" />
      )}

      <div className="absolute inset-0 bg-black/35" />

      {/* ⬇️ contenido centrado horizontal y verticalmente */}
      <div className="relative h-full shell flex items-center justify-center">
        <div className="max-w-3xl w-full mx-auto text-center">
          <p className="text-amber-300 tracking-wide text-sm">D.O.P Dehesa de Extremadura</p>
          <h1 className="mt-3 text-4xl md:text-6xl font-stencil text-white leading-tight">
            TAN GUARROS QUE SÓLO COMEN BELLOTAS
          </h1>
          <p className="mt-4 text-zinc-200/90">
            Jamón ibérico 100% de bellota. Sin postureo, con descaro y con el sabor que manda.
          </p>
          <div className="mt-7 flex flex-wrap gap-3 justify-center">
            <Link to="/jamones" className="btn-primary">Ver Jamones</Link>
            <Link to="/suscripcion" className="btn-secondary">Suscripción</Link>
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute -top-10 -left-10 w-60 h-60 rounded-full blur-3xl opacity-20"
        style={{ background: "radial-gradient(circle, #d4af37 0%, rgba(0,0,0,0) 70%)" }}
      />
    </section>
  );
}
