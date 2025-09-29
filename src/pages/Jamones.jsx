import React from "react";
import Meta from "../lib/Meta";
import { Link } from "react-router-dom";
import { PRODUCTS } from "../data/products.js";

export default function Jamones(){
  return (
    <>
      <Meta title="Nuestros Jamones" />
      <section className="py-16">
        <div className="container grid md:grid-cols-2 gap-6">
          {PRODUCTS
            .filter(p => p.type === "one_time")
            .map((p) => (
              <Link
                key={p.id}
                to={`/producto/${p.slug}`}
                state={{ product: p }}  // <-- pasa el producto al detalle
                className="rounded-2xl border border-white/10 p-6 hover:bg-white/5 transition"
              >
                <h3 className="text-xl">{p.name}</h3>
                <p className="text-amber-300 mt-2">{p.priceFrom} €</p>
              </Link>
            ))}
        </div>
      </section>
    </>
  );
}
