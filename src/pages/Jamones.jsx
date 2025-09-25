import React from "react";
import { Link } from "react-router-dom";
import { PRODUCTS } from "../data/products";

export default function Jamones(){
  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-4xl font-stencil text-dorado mb-8">Jamones</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PRODUCTS.map(p=>(
            <article key={p.id} className={`p-8 rounded-2xl shadow-suave bg-[#111] border ${p.id==='sub'?"border-dorado":"border-[#222]"} hover:-translate-y-1 hover:shadow-xl transition`}>
              <h3 className="text-2xl font-stencil text-white">{p.name}</h3>
              <p className="text-gray-300 mt-2">{p.description}</p>
              <p className="text-gray-200 mt-2">Desde <span className="font-bold">{p.priceFrom} €</span></p>
              <Link to={`/producto/${p.slug}`} className="inline-block mt-5 px-5 py-2 rounded-full bg-rojo text-white hover:brightness-110">Ver detalles</Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
