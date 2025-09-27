import React from "react";
import { PRODUCTS } from "@/data/products";
import { MEDIA } from "@/data/media";
import { Link } from "react-router-dom";
import { useCart } from "@/store/cart";

export default function FeaturedProducts(){
  const add = useCart(s=>s.addItem);
  const featured = ["entero","loncheado","sub_500"];
  return (
    <section className="py-14">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-stencil text-brand">Lo más pedido</h2>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {featured.map(id=>{
            const p = PRODUCTS.find(x=> x.id===id);
            const img = (MEDIA.products[id]) || (MEDIA[id]?.gallery?.[0]) || MEDIA.og.jamones;
            return (
              <div key={id} className="group rounded-2xl overflow-hidden border border-white/10 bg-black/40">
                <img src={img} alt={p.name} className="w-full h-56 object-cover group-hover:scale-[1.02] transition" loading="lazy" />
                <div className="p-5">
                  <h3 className="text-lg text-white">{p.name}</h3>
                  <p className="text-zinc-400 mt-1 line-clamp-2">{p.description}</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-amber-300">{p.type==='recurring' ? `${p.priceFrom} €/mes` : `${p.priceFrom} €`}</span>
                    <div className="flex gap-2">
                      <Link to={`/producto/${p.slug}`} className="px-3 py-2 rounded-xl border border-white/15 hover:bg-white/10">Ver</Link>
                      <button className="btn-primary px-4 py-2"
                        onClick={()=> add({ id:p.id, name:p.name, priceId:p.priceId, price:p.priceFrom, qty:1 })}>
                        Añadir
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
