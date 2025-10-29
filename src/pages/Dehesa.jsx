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

  // ===========================================
  // ===== TEXTO DE LAS TARJETAS ACTUALIZADO =====
  // ===========================================
  const cardData = [
    { title: "Bellota Pura y Dura", text: "Aquí no hay trampas. Bellotas de encina y alcornoque a discreción. La base de un sabor que no pide permiso." },
    { title: "Curación sin Prisas", text: "Meses de paciencia en secadero. El tiempo es el único secreto para esa textura que se deshace, no que se rompe." },
    { title: "Corte Preciso (¡A Máquina!)", text: "Sí, usamos máquina. ¿Por qué? Porque clava la loncha perfecta siempre. Consistencia canalla para tu disfrute." }
  ];
  // ===========================================

  return (
    <>
      <Meta
        title="La Dehesa · Origen y Filosofía Canalla" // Título Meta actualizado
        description="Extremadura pura. Bellota hasta las trancas y jamón sin gilipolleces. Así criamos el descaro." // Descripción Meta actualizada
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
            <h1 className="text-3xl md:text-5xl font-stencil text-brand">La Dehesa: Territorio Canalla</h1> {/* Título actualizado */}
          </motion.div>

          {/* Grid 2 columnas animadas en secuencia */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            className="grid md:grid-cols-2 gap-10 items-start mt-6"
          >
            {/* ---- COLUMNA IZQUIERDA: IMAGEN ---- */}
	     <motion.img
              variants={fadeUp}
              src={imgBase}
              srcSet={imgSrcSet}
              sizes={imgSizes}
              alt="Dehesa extremeña, donde campan a sus anchas nuestros guarros" // Alt actualizado
              loading="lazy"
              className="w-full rounded-2xl border border-white/10 object-cover md:sticky top-24" // <-- CLASE MODIFICADA
            />

            {/* ---- COLUMNA DERECHA: TEXTO + TARJETAS ---- */}
            <motion.div variants={fadeUp}>

              {/* ===== TEXTO PRINCIPAL ACTUALIZADO ===== */}
              <p className="text-zinc-200 text-lg font-semibold leading-relaxed"> {/* Texto más destacado */}
                Esto no es una granja bonita, es la Dehesa de Extremadura. Kilómetros de encinas y aire libre donde nuestros bichos se ponen finos a bellota. Sin estrés, sin tonterías.
              </p>
              <p className="text-zinc-300 mt-4">
                El sello D.O.P. Dehesa de Extremadura no es postureo, es la garantía de que aquí se hacen las cosas bien. Y nosotros lo llevamos a rajatabla. Por eso nos llamamos Guarros Extremeños: somos transparentes. Nuestros cerdos viven como lo que son, guarros felices revolcándose y buscando las mejores bellotas. ¿El resultado? Un jamón con carácter.
              </p>
              {/* ===== FIN TEXTO PRINCIPAL ===== */}

              {/* ===== LISTA ACTUALIZADA ===== */}
              <ul className="mt-8 space-y-3 text-zinc-200 font-medium"> {/* Más espacio y fuente */}
                <li><span className="text-brand mr-2">✓</span> D.O.P. Dehesa de Extremadura. Calidad sellada, no inventada.</li>
                <li><span className="text-brand mr-2">✓</span> Curación natural. Dejamos que el tiempo haga su trabajo sucio.</li>
                <li><span className="text-brand mr-2">✓</span> Trazabilidad sin cuentos. Sabes lo que comes, de principio a fin.</li>
                <li><span className="text-brand mr-2">✓</span> Sabor que engancha. Largo, intenso, con el toque justo de Dehesa.</li>
              </ul>
              {/* ===== FIN LISTA ===== */}

              {/* ----- SECCIÓN DE TARJETAS (MOVIMIENTO Y TEXTO ACTUALIZADO) ----- */}
              <motion.div
                className="grid grid-cols-1 gap-6 mt-10" // Más margen superior
              >
                {cardData.map((card, i) => (
                  <motion.div
                    key={i}
                    variants={fadeUp}
                    className="rounded-2xl border border-white/10 p-6 bg-white/[0.03] 
                               transition-colors duration-300 ease-in-out hover:border-brand" // Mantenemos bg-white/[0.03]
                  >
                    <h3 className="font-stencil text-brand text-xl">{card.title}</h3> {/* Título actualizado */}
                    <p className="text-zinc-300 mt-2 text-sm">{card.text}</p> {/* Texto actualizado */}
                  </motion.div>
                ))}
              </motion.div>
              {/* ----- FIN DE LA SECCIÓN DE TARJETAS ----- */}

            </motion.div>
            {/* ---- FIN COLUMNA DERECHA ---- */}

          </motion.div>
        </div>
      </section>
    </>
  );
}