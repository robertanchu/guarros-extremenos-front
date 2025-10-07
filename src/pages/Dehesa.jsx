// src/pages/Dehesa.jsx
import React from "react";
import Meta from "../lib/Meta";
// import { MEDIA } from "../data/media"; // ← ya no lo necesitamos para la imagen principal

export default function Dehesa(){
  // Rutas de tus imágenes responsive (colócalas en /public/images/dehesa/)
  const imgBase = "/images/dehesa/dehesa_hero_1920.webp";
  const imgSrcSet = `
    /images/dehesa/dehesa_hero_960.webp 960w,
    /images/dehesa/dehesa_hero_1280.webp 1280w,
    /images/dehesa/dehesa_hero_1920.webp 1920w
  `;
  // tamaños estimados que usará el navegador según el layout de dos columnas
  const imgSizes = "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 768px";

  return (
    <>
      <Meta
        title="La Dehesa · Origen y Filosofía"
        description="D.O.P Extremadura, bellota a saco y jamón sin postureo. Así se cría el descaro."
      />

      <section className="py-16">
        <div className="container grid md:grid-cols-2 gap-10 items-start">
          {/* Imagen principal de Dehesa (responsive) */}
          <img
            src={imgBase}
            srcSet={imgSrcSet}
            sizes={imgSizes}
            alt="Dehesa de encinas en Extremadura al atardecer"
            loading="lazy"
            className="w-full rounded-2xl border border-white/10 object-cover"
          />

          {/* Texto */}
          <div>
            <h1 className="text-3xl md:text-5xl font-stencil text-brand">La Dehesa</h1>
            <p className="text-zinc-300 mt-4">
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
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="container grid md:grid-cols-3 gap-6">
          {["Selección de bellota","Curación lenta","Corte fino"].map((t,i)=>(
            <div key={i} className="rounded-2xl border border-white/10 p-6 bg-white/5">
              <h3 className="font-stencil text-brand text-xl">{t}</h3>
              <p className="text-zinc-300 mt-2">
                Cada pieza se mima. Elegimos bellota madura, dejamos que el tiempo haga su magia y
                te lo servimos para ganarle por goleada a cualquier tabla.
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
