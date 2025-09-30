import React, { useMemo, useState } from "react";
import Meta from "../lib/Meta";
import JamonCard from "@/components/JamonCard";
import SortSelect from "@/components/SortSelect";
import { PRODUCTS } from "@/data/products.js";
import { getFormat } from "@/utils/format";

const getCatalog = () => {
  if (Array.isArray(PRODUCTS) && PRODUCTS.length) return PRODUCTS;
  if (typeof window !== "undefined" && Array.isArray(window.__PRODUCTS__)) return window.__PRODUCTS__;
  return [];
};

const SORT_OPTIONS = [
  { value: "price-asc",  label: "Precio: menor a mayor" },
  { value: "price-desc", label: "Precio: mayor a menor" },
  { value: "name-asc",   label: "Nombre A→Z" },
  { value: "name-desc",  label: "Nombre Z→A" },
];

const FORMATS = [
  { value: "entero", label: "Entero" },
  { value: "loncheado", label: "Loncheado" },
];

export default function Jamones(){
  const base = useMemo(() => getCatalog().filter(p => p.type === "one_time"), []);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("price-asc");
  const [activeFormats, setActiveFormats] = useState(new Set());

  const toggleFormat = (val) => {
    setActiveFormats(prev => {
      const n = new Set(prev);
      if (n.has(val)) n.delete(val); else n.add(val);
      return n;
    });
  };

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let out = base;
    if (needle) out = out.filter(p => (p.name || "").toLowerCase().includes(needle));
    if (activeFormats.size > 0){
      out = out.filter(p => activeFormats.has(getFormat(p)));
    }
    switch (sort){
      case "price-desc": return [...out].sort((a,b) => (b.priceFrom ?? 0) - (a.priceFrom ?? 0));
      case "name-asc":   return [...out].sort((a,b) => (a.name || "").localeCompare(b.name || ""));
      case "name-desc":  return [...out].sort((a,b) => (b.name || "").localeCompare(a.name || ""));
      default:           return [...out].sort((a,b) => (a.priceFrom ?? 0) - (b.priceFrom ?? 0));
    }
  }, [base, q, sort, activeFormats]);

  return (
    <>
      <Meta title="Jamones Ibéricos | Guarros Extremeños" description="Nuestra selección de jamón ibérico: piezas enteras y loncheado listo para disfrutar." />
      <section className="py-10 md:py-12">
        <div className="container max-w-7xl px-4 mx-auto">
          <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              {/* Título ahora en rojo de marca */}
              <h1 className="mt-2 text-3xl md:text-5xl font-stencil text-brand">
                Jamones
              </h1>
              <p className="text-white/70 mt-1">Elige y añádelo al carrito directamente.</p>
            </div>
            <div className="flex items-center gap-3">
              <input
                value={q}
                onChange={(e)=>setQ(e.target.value)}
                placeholder="Buscar jamón..."
                className="h-11 rounded-xl bg-black/60 text-white border border-white/15 px-3 placeholder:text-white/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
              />
              <SortSelect value={sort} onChange={setSort} options={SORT_OPTIONS} />
            </div>
          </div>

          <div className="mb-6 flex flex-wrap items-center gap-2">
            {FORMATS.map(f => {
              const active = activeFormats.has(f.value);
              return (
                <button
                  key={f.value}
                  onClick={() => toggleFormat(f.value)}
                  className={
                    (active
                      ? "bg-brand text-white border-transparent "
                      : "bg-black/40 text-white/80 border-white/15 hover:bg-white/10 ")
                    + "h-9 px-3 rounded-full border text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
                  }
                >
                  {f.label}
                </button>
              );
            })}
            {activeFormats.size > 0 && (
              <button
                onClick={() => setActiveFormats(new Set())}
                className="h-9 px-3 rounded-full border border-white/15 text-white/70 hover:text-white hover:bg-white/10 text-sm"
              >
                Limpiar filtros
              </button>
            )}
          </div>

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
