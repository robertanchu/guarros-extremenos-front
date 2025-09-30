import React, { useMemo, useState } from "react";
import Meta from "../lib/Meta";
import JamonCard from "@/components/JamonCard";
import { PRODUCTS } from "@/data/products.js";

const getCatalog = () => {
  // Prefer server data
  if (Array.isArray(PRODUCTS) && PRODUCTS.length) return PRODUCTS;
  // Fallback: window hydration
  if (typeof window !== "undefined" && Array.isArray(window.__PRODUCTS__)) return window.__PRODUCTS__;
  return [];
};

export default function Jamones(){
  const base = useMemo(() => getCatalog().filter(p => p.type === "one_time"), []);

  const [q, setQ] = useState("");
  const [sort, setSort] = useState("price-asc");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let out = base;
    if (needle) out = out.filter(p => (p.name || "").toLowerCase().includes(needle));
    switch (sort){
      case "price-desc":
        return [...out].sort((a,b) => (b.priceFrom ?? 0) - (a.priceFrom ?? 0));
      case "name-asc":
        return [...out].sort((a,b) => (a.name || "").localeCompare(b.name || ""));
      case "name-desc":
        return [...out].sort((a,b) => (b.name || "").localeCompare(a.name || ""));
      default: // price-asc
        return [...out].sort((a,b) => (a.priceFrom ?? 0) - (b.priceFrom ?? 0));
    }
  }, [base, q, sort]);

  return (
    <>
      <Meta title="Jamones Ibéricos | Guarros Extremeños" description="Nuestra selección de jamón ibérico: piezas enteras y cortes listos para disfrutar." />
      <section className="py-10 md:py-12">
        <div className="container max-w-7xl px-4 mx-auto">
          {/* Header */}
          <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold text-white">Jamones</h1>
              <p className="text-white/60 mt-1">Elige tu corte favorito. Envío rápido y sabor serio.</p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <input
                value={q}
                onChange={(e)=>setQ(e.target.value)}
                placeholder="Buscar jamón..."
                className="h-11 rounded-xl bg-white/5 border border-white/10 px-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-brand/40"
              />
              <select
                value={sort}
                onChange={(e)=>setSort(e.target.value)}
                className="h-11 rounded-xl bg-white/5 border border-white/10 px-3 text-white focus:outline-none focus:ring-2 focus:ring-brand/40"
              >
                <option value="price-asc">Precio: menor a mayor</option>
                <option value="price-desc">Precio: mayor a menor</option>
                <option value="name-asc">Nombre A→Z</option>
                <option value="name-desc">Nombre Z→A</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <p className="text-white/70">No hay jamones con esos filtros.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filtered.map((p) => (
                <JamonCard key={p.id ?? p.slug ?? p.name} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
