import React from "react";
import { PRODUCTS } from "../data/products";
import { useCart } from "../context/CartContext";

export default function Suscripcion(){
  const p = PRODUCTS.find(x=>x.id==='sub');
  const { add } = useCart();
  return (
    <section className="py-16">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h1 className="text-4xl font-stencil text-dorado">{p.name}</h1>
        <p className="text-gray-300 mt-4">{p.description}</p>
        <div className="mt-8 grid sm:grid-cols-3 gap-6">
          {p.variants.map(v=>(
            <div key={v.id} className="p-6 rounded-2xl bg-[#111] border border-dorado shadow-suave">
              <div className="text-xl font-stencil">{v.label}</div>
              <div className="text-3xl font-bold mt-2">{v.price} €</div>
              <button onClick={()=>add(p,v,1)} className="mt-4 px-5 py-2 rounded-full bg-dorado text-black font-bold uppercase hover:brightness-110">Añadir</button>
            </div>
          ))}
        </div>
        <p className="text-gray-400 mt-4">Cancela cuando quieras · Envío 24/48h</p>
      </div>
    </section>
  );
}
