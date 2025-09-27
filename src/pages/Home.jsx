import React from "react";
import Meta from "../lib/Meta";
import Hero from "@/components/Hero";
import { Link } from "react-router-dom";
export default function Home(){
  return (
    <>
      <Meta title="Jamón Ibérico 100% Bellota" />
      <Hero />
      <section className="py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-stencil text-brand">TAN GUARROS QUE SÓLO COMEN BELLOTAS</h1>
        <p className="text-zinc-300 mt-4">Jamón 100% bellota · D.O.P Extremadura</p>
        <div className="mt-8 flex gap-4 justify-center">
          <Link to="/jamones" className="btn-primary">Ver Jamones</Link>
          <Link to="/suscripcion" className="btn-secondary">Suscripción</Link>
        </div>
      </section>
    </>
  );
}
