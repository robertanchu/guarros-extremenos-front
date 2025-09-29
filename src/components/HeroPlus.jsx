// src/components/HeroPlus.jsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function HeroPlus(){
  return (
    <section className="relative isolate overflow-hidden">
      {/* Video fondo */}
      <div className="absolute inset-0 -z-10">
        <video
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          src="/video/hero.mp4"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70" />
      </div>

      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-20 md:py-28 lg:py-36">
        <div className="max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-white"
          >
            TAN GUARROS QUE{" "}
            <span className="text-[#E53935]">SÓLO COMEN BELLOTAS</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            viewport={{ once: true }}
            className="mt-5 text-base md:text-lg text-white/80 leading-relaxed"
          >
            Jamón ibérico 100% de bellota D.O.P. de Extremadura. Premium sin postureo:
            humor canalla, materia prima seria.
          </motion.p>

          <div className="mt-8 flex gap-4">
            <Link
              to="/jamones"
              className="relative inline-flex items-center justify-center rounded-xl px-6 py-3 text-base font-extrabold text-black bg-[#E53935] hover:bg-[#d23431] transition shadow-lg"
            >
              <span className="relative z-10">Ver Jamones</span>
              <span className="absolute inset-0 rounded-xl animate-[pulse_2.2s_ease-out_infinite] ring-2 ring-[#E53935]/50"></span>
            </Link>
            <Link
              to="/suscripcion"
              className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-base font-bold text-white border border-white/20 hover:bg-white/10 transition"
            >
              Suscripción
            </Link>
          </div>
        </div>
      </div>

      {/* Ticker derecha -> izquierda */}
      <Ticker />
    </section>
  );
}

function Ticker(){
  const items = [
    "Jamón 100% Bellota",
    "D.O.P. Extremadura",
    "Envío 24/48h",
    "Satisfacción o devolución",
    "Club Guarro",
  ];
  return (
    <div className="relative bg-[#E53935] py-2 overflow-hidden border-t border-[#ff6a66]">
      <motion.div
        className="whitespace-nowrap font-black tracking-wide text-black/90"
        initial={{ x: "100%" }}
        animate={{ x: "-100%" }}
        transition={{ duration: 18, ease: "linear", repeat: Infinity }}
      >
        {items.map((txt, i) => (
          <span key={i} className="mx-6 inline-block text-sm md:text-base lg:text-lg">
            {txt}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
