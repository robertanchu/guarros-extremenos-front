import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { PRODUCTS } from "../data/products";
import { useCart } from "../context/CartContext";
import Gallery from "../components/Gallery";

export default function Producto(){
  const { slug } = useParams();
  const product = useMemo(()=> PRODUCTS.find(p=>p.slug===slug), [slug]);
  const { add } = useCart();
  const [variant, setVariant] = useState(product?.variants[0]);

  if(!product) return <div className="p-10">Producto no encontrado.</div>;

  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10">
        <Gallery images={product.images || []} />
        <div>
          <h1 className="text-3xl font-stencil text-white">{product.name}</h1>
          <p className="text-gray-300 mt-3">{product.description}</p>
          <div className="mt-6">
            <label className="block text-sm text-gray-400 mb-1">Selecciona formato / peso</label>
            <select className="bg-[#111] border border-[#333] rounded px-4 py-3 text-white"
              value={variant.id} onChange={e=> setVariant(product.variants.find(v=>v.id===e.target.value))}>
              {product.variants.map(v=>(<option key={v.id} value={v.id}>{v.label} — {v.price} €</option>))}
            </select>
          </div>
          <div className="mt-6 flex items-center gap-4">
            <div className="text-2xl font-bold">{variant.price.toFixed(2)} €</div>
            <button onClick={()=>add(product, variant, 1)} className="px-6 py-3 rounded-full bg-rojo text-white font-bold uppercase hover:brightness-110">
              Añadir al carrito
            </button>
          </div>
          <ul className="mt-8 text-gray-300 list-disc list-inside space-y-1">
            <li>Origen: D.O.P. Dehesa de Extremadura</li>
            <li>Raza: Ibérico 100%</li>
            <li>Alimentación: Bellota</li>
            <li>Curación: Lenta y controlada</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
