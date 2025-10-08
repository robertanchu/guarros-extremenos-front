// src/pages/Dehesa.jsx
import React from "react";
import Meta from "../lib/Meta";
import { motion, useReducedMotion } from "framer-motion";

export default function Dehesa(){
  // Rutas de tus imágenes responsive (colócalas en /public/images/dehesa/)
  const imgBase = "/images/dehesa/dehesa_hero_1920.webp";
  const imgSrcSet = `
    /images/dehesa/dehesa_hero_960.webp 960w,
    /images/dehesa/dehesa_hero_1280.webp 1280w,
    /images/dehesa/dehesa_hero_1920.webp 1920w
  `;
  const imgSizes = "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 768px";

  // ===== Animaciones =====
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
        title="La Dehesa · Origen y Filosofía"
        description="D.O.P Extremadura, bellota a saco y jamón sin postureo. Así se cría el descaro."
      />

      {/* Sección principal: header + grid con stagger */}
      <section className="py-16">
        <div className="container">
          {/* Header animado */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
          >
            <h1 className="text-3xl md:text-5xl font-stencil text-brand">La Dehesa</h1>
          </motion.div>

          {/* Grid 2 columnas animadas en secuencia */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            className="grid md:grid-cols-2 gap-10 items-start mt-6"
          >
            {/* Imagen principal de Dehesa (responsive) */}
            <motion.img
              variants={fadeUp}
              src={imgBase}
              srcSet={imgSrcSet}
              sizes={imgSizes}
              alt="Dehesa de encinas en Extremadura al atardecer"
              loading="lazy"
              className="w-full rounded-2xl border border-white/10 object-cover"
            />

            {/* Texto */}
            <motion.div variants={fadeUp}>
              <p className="text-zinc-300">
                Encinas, alcornoques y silencio. Aquí engordan nuestros ibéricos: a base de bellota y
                libertad. Sin prisas. Sin disfraces. Con la D.O.P. Extremadura marcando el listón.
              </p>
              <p className="text-zinc-300 mt-3">
                Creemos en el oficio bien hecho y en una filosofía simple: <em>menos ceremonia y más sabor</em>.
                Por eso nos llamamos Guarros. Porque somos honestos: los nuestros están tan guarros
                que sólo comen bellotas.
              </p>
              <ul className="mt-6 space-y-2 text-zinc-200">
                <li>• D.O.P. Dehesa de Extremadura</li>
                <li>• Curación lenta y controlada</li>
                <li>• Trazabilidad total y respeto animal</li>
                <li>• Sabor largo, textura sedosa, aroma de encina</li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Segunda sección: cards con stagger */}
      <section className="py-10">
        <div className="container">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid md:grid-cols-3 gap-6"
          >
            {["Selección de bellota","Curación lenta","Corte fino"].map((t,i)=>(
              <motion.div
                key={i}
                variants={fadeUp}
                className="rounded-2xl border border-white/10 p-6 bg-white/5"
              >
                <h3 className="font-stencil text-brand text-xl">{t}</h3>
                <p className="text-zinc-300 mt-2">
                  Cada pieza se mima. Elegimos bellota madura, dejamos que el tiempo haga su magia y
                  te lo servimos para ganarle por goleada a cualquier tabla.
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}
