import React from "react";
import { Link } from "react-router-dom";
import DehesaImg from "../assets/dehesa.jpg";
export default function Home(){
  return (
    <div>
      <section className="relative h-[90vh] min-h-[560px] flex items-center justify-center bg-cover bg-center" style={{backgroundImage:`url(${DehesaImg})`}}>
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative z-10 text-center px-6">
          <h1 className="text-4xl md:text-6xl font-stencil text-rojo mb-4">TAN GUARROS QUE SÓLO COMEN BELLOTAS</h1>
          <p className="text-gray-200 max-w-2xl mx-auto">Jamón Ibérico 100% de Bellota · D.O.P Extremadura.</p>
          <div className="mt-8 flex gap-4 justify-center">
            <Link to="/jamones" className="px-6 py-3 rounded-full bg-rojo hover:brightness-110 text-white font-bold uppercase transition">Ver Jamones</Link>
            <Link to="/suscripcion" className="px-6 py-3 rounded-full border-2 border-dorado text-dorado hover:bg-dorado hover:text-black font-bold uppercase transition">Suscripción</Link>
          </div>
        </div>
      </section>
      <section className="py-16 bg-negro">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          {[
            {title:"Jamón Ibérico 100% de Bellota D.O.P Extremadura (entero)", to:"/producto/jamon-iberico-100-bellota-dop-extremadura-entero"},
            {title:"Jamón Ibérico 100% de Bellota D.O.P Extremadura (loncheado)", to:"/producto/jamon-iberico-100-bellota-dop-extremadura-loncheado"},
            {title:"Suscripción Mensual de Jamón", to:"/producto/suscripcion-mensual-de-jamon"},
          ].map(c=>(
            <article key={c.title} className="p-8 rounded-2xl shadow-suave bg-[#111] border border-[#222] hover:-translate-y-1 hover:shadow-xl transition">
              <h3 className="text-xl font-stencil text-white">{c.title}</h3>
              <Link to={c.to} className="inline-block mt-4 text-dorado hover:underline">Descubrir →</Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
