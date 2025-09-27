import React from "react";
import Meta from "../lib/Meta";
import { useParams } from "react-router-dom";
import { PRODUCTS } from "../data/products.js";
import { MEDIA } from "../data/media.js";
import { useCart } from "../store/cart";

export default function Producto(){
  const { slug } = useParams();
  const product = PRODUCTS.find(p => p.slug === slug);
  const add = useCart(s => s.addItem);
  if (!product) return <section className="py-20 text-center">Producto no encontrado.</section>;
  const img = MEDIA.products[product.id] || MEDIA.og.jamones;
  return (
    <>
      <Meta title={product.name} />
      <section className="py-16 container">
        <div className="grid md:grid-cols-2 gap-8">
          <img src={img} alt={product.name} className="w-full rounded-2xl border border-white/10" />
          <div>
            <h1 className="text-3xl md:text-5xl font-stencil text-brand">{product.name}</h1>
            <p className="text-zinc-300 mt-4">{product.description}</p>
            <div className="mt-6 text-amber-300 text-2xl">{product.priceFrom} €</div>
            <button className="mt-6 btn-primary" onClick={()=> add({ id: product.id, name: product.name, priceId: product.priceId, price: product.priceFrom, qty: 1 })}>Añadir al carrito</button>
          </div>
        </div>
      </section>
    </>
  );
}
