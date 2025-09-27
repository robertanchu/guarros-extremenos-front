import React from 'react';
import { Link } from 'react-router-dom';
import { HERO } from '@/data/media';

export default function HeroPlus(){
  return (
    <section className="relative h-[72vh] min-h-[520px] w-full overflow-hidden border-b border-white/10 full-bleed">
      <img src={HERO.poster} alt="Dehesa" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/35" />
      <div className="relative h-full shell flex items-center">
        <div className="max-w-3xl">
          <p className="text-amber-300 tracking-wide text-sm">D.O.P Dehesa de Extremadura</p>
          <h1 className="mt-3 text-4xl md:text-6xl font-stencil text-white leading-tight">TAN GUARROS QUE SÓLO COMEN BELLOTAS</h1>
          <p className="mt-4 text-zinc-200/90">Jamón ibérico 100% de bellota. Sin postureo, con descaro y con el sabor que manda.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/jamones" className="btn-primary">Ver Jamones</Link>
            <Link to="/suscripcion" className="btn-secondary">Suscripción</Link>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute -top-10 -left-10 w-60 h-60 rounded-full blur-3xl opacity-20" style={{background:'radial-gradient(circle, #d4af37 0%, rgba(0,0,0,0) 70%)'}}/>
    </section>
  );
}
