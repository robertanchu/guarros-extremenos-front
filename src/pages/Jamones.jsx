import React from "react";
import Meta from "../lib/Meta";
import { MEDIA } from "../data/media.js";
export default function Jamones(){
  const CARDS=[
    { href:"/producto/jamon-entero", img: MEDIA.entero.gallery[0], title:"Jamón entero", price:"500 €" },
    { href:"/producto/jamon-loncheado", img: MEDIA.loncheado.gallery[0], title:"Jamón loncheado", price:"530 €" }
  ];
  return (
    <>
      <Meta title="Catálogo de Jamones Ibéricos 100% Bellota · D.O.P Extremadura" description="Entero, loncheado o suscripción. Elige tu pecado ibérico: piezas mimadas en dehesa y curadas como Dios manda." image={MEDIA.og.jamones} url="/jamones" />
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-3xl md:text-5xl font-stencil text-brand mb-8">Nuestros Jamones</h1>
          <div className="grid md:grid-cols-2 gap-6">
            {CARDS.map((c,i)=>(
              <a key={i} href={c.href} className="group relative overflow-hidden rounded-2xl border border-white/10">
                <img src={c.img} alt={c.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition"/>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white text-lg">{c.title}</h3><span className="text-amber-300">{c.price}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
