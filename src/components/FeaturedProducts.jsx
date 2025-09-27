import React from "react";
import { PRODUCTS } from "@/data/products";
import { MEDIA } from "@/data/media";
import { Link } from "react-router-dom";
import { useCart } from "@/store/cart";
import { useUI } from "@/store/ui";
import { flyToCart, findCartTarget } from "@/lib/flyToCart";
import { gaAddToCart } from "@/lib/analytics";

export default function FeaturedProducts(){
  const add = useCart(s=>s.addItem);
  const featured = ["entero","loncheado","sub_500"];
  return (
    <section className="py-14">
      <div className="shell">
        <h2 className="text-3xl md:text-4xl font-stencil text-brand">Lo más pedido</h2>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {featured.map(id=>{
            const p = PRODUCTS.find(x=> x.id===id);
            if(!p) return null;
            const img = (MEDIA.products[id]) || MEDIA.og.jamones;
            return (
              <div key={id} className="group panel card-hover">
                <img src={img} alt={p.name} className="w-full h-56 object-cover" loading="lazy" />
                <div className="p-5">
                  <h3 className="text-lg text-white">{p.name}</h3>
                  <p className="text-zinc-400 mt-1 line-clamp-2">{p.description}</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-amber-300">{p.type==='recurring' ? `${p.priceFrom} €/mes` : `${p.priceFrom} €`}</span>
                    <div className="flex gap-2">
                      <Link to={`/producto/${p.slug}`} className="px-3 py-2 rounded-xl border border-white/15 hover:bg-white/10">Ver</Link>
                      <button className="btn-primary px-4 py-2"
                        onClick={(e)=> { const card = e.currentTarget.closest(".group"); const imgEl = card?.querySelector("img"); flyToCart(imgEl, findCartTarget()); add({ id:p.id, name:p.name, priceId:p.priceId, price:p.priceFrom, qty:1 }); useUI.getState().pulseCart(); gaAddToCart(p,1); }}>
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
