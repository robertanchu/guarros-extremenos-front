import React from "react";
import Meta from "../lib/Meta";
import Hero from "../components/Hero";
import { MEDIA } from "../data/media.js";
export default function Home(){
  return (
    <>
      <Meta title="Jamón Ibérico 100% Bellota D.O.P Extremadura" description="TAN GUARROS QUE SÓLO COMEN BELLOTAS. Jamón ibérico 100% bellota D.O.P. Extremadura, sin postureo y con toda la verdad del sabor." image={MEDIA.og.home} url="/" />
      <Hero />
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-6">
          <a href="/jamones" className="group relative overflow-hidden rounded-2xl border border-white/10"><img src={MEDIA.banners.entero} alt="Jamón entero" className="w-full h-full object-cover group-hover:scale-[1.02] transition" /></a>
          <a href="/jamones" className="group relative overflow-hidden rounded-2xl border border-white/10"><img src={MEDIA.banners.loncheado} alt="Jamón loncheado" className="w-full h-full object-cover group-hover:scale-[1.02] transition" /></a>
          <a href="/suscripcion" className="group relative overflow-hidden rounded-2xl border border-white/10"><img src={MEDIA.banners.suscripcion} alt="Suscripción" className="w-full h-full object-cover group-hover:scale-[1.02] transition" /></a>
        </div>
      </section>
    </>
  );
}
