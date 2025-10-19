// src/pages/Jamones.jsx
import React from "react";
import { products as ALL_PRODUCTS } from "@/data/products";
import JamonCard from "@/components/JamonCard";

export default function Jamones(){
  // Evita crashear si no hay catálogo o import roto
  const jamones = Array.isArray(ALL_PRODUCTS)
    ? ALL_PRODUCTS.filter((p) => p?.kind === "jamon-weight")
    : [];

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <h1 className="mt-2 text-3xl md:text-5xl font-stencil text-brand">JAMONES</h1>

        {jamones.length === 0 ? (
          <p className="mt-6 text-white/70">
            No hay jamones configurados. Revisa el export de <code>src/data/products.js</code> y que las rutas de imagen existan.
          </p>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {jamones.map((p) => (
              <JamonCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
