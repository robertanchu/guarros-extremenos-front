import React from "react";
import Meta from "../lib/Meta";
import { MEDIA } from "../data/media.js";
import { PRODUCTS } from "../data/products.js";
import { useCart } from "../store/cart";

function Card({ img, title, desc, price, onClick }){
  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/40">
      {img && <img src={img} alt={title} className="w-full h-64 object-cover" loading="lazy" />}
      <div className="p-6">
        <h2 className="text-2xl font-stencil text-brand">{title}</h2>
        {desc && <p className="text-zinc-300 mt-2">{desc}</p>}
        {price != null && <div className="mt-4 text-amber-300 text-xl">{price} €/mes</div>}
        <button className="mt-4 btn-secondary" onClick={onClick}>Activar suscripción</button>
      </div>
    </div>
  );
}

export default function Suscripcion(){
  const add = useCart(s => s.addItem);
  const sub500  = PRODUCTS.find(p => p.slug === "suscripcion-500");
  const sub1000 = PRODUCTS.find(p => p.slug === "suscripcion-1000");
  const img500  = MEDIA?.sub_500?.gallery?.[0]  || MEDIA?.og?.suscripcion;
  const img1000 = MEDIA?.sub_1000?.gallery?.[0] || MEDIA?.og?.suscripcion;
  return (
    <>
      <Meta title="Suscripción de Jamón · 500 g o 1 kg/mes" description="Cada mes jamón ibérico 100% bellota en tu puerta. Sin permanencia y con mucho descaro." />
      <section className="py-16">
        <div className="container">
          <h1 className="text-3xl md:text-5xl font-stencil text-brand mb-8">Suscripción</h1>
          <div className="grid md:grid-cols-2 gap-8">
            {sub500 && (<Card img={img500} title={sub500.name} desc={sub500.description} price={sub500.priceFrom} onClick={()=> add({ id: sub500.id, name: sub500.name, priceId: sub500.priceId, price: sub500.priceFrom, qty: 1 })} />)}
            {sub1000 && (<Card img={img1000} title={sub1000.name} desc={sub1000.description} price={sub1000.priceFrom} onClick={()=> add({ id: sub1000.id, name: sub1000.name, priceId: sub1000.priceId, price: sub1000.priceFrom, qty: 1 })} />)}
          </div>
        </div>
      </section>
    </>
  );
}
