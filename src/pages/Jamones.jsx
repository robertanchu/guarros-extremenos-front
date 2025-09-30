import React, { useEffect, useMemo, useRef, useState } from "react";
import Meta from "../lib/Meta";
import SortSelect from "@/components/SortSelect";
import { PRODUCTS } from "@/data/products.js";
import { getFormat } from "@/utils/format";
import { useCart } from "@/store/cart";
import "@/styles/effects.css";

const getCatalog = () => {
  if (Array.isArray(PRODUCTS) && PRODUCTS.length) return PRODUCTS;
  if (typeof window !== "undefined" && Array.isArray(window.__PRODUCTS__)) return window.__PRODUCTS__;
  return [];
};

const SORT_OPTIONS = [
  { value: "price-asc",  label: "Precio: menor a mayor" },
  { value: "price-desc", label: "Precio: mayor a mayor" },
  { value: "name-asc",   label: "Nombre A→Z" },
  { value: "name-desc",  label: "Nombre Z→A" },
];

const FORMATS = [
  { value: "entero", label: "Entero" },
  { value: "loncheado", label: "Loncheado" },
];

const keyOf = (p) => p.id ?? p.slug ?? p.priceId ?? p.sku ?? p.name;

const fmtEUR = (n) => {
  const num = Number(n);
  if (!Number.isFinite(num)) return "";
  try { return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(num); }
  catch { return (num.toFixed?.(2) ?? String(num)) + " €"; }
};

export default function Jamones(){
  const base = useMemo(() => getCatalog().filter(p => p.type === "one_time"), []);
  const { addItem } = useCart();
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("price-asc");
  const [activeFormats, setActiveFormats] = useState(new Set());
  const [qtyByKey, setQtyByKey] = useState({});
  const gridRef = useRef(null);

  const clamp = (n) => {
    const x = parseInt(n, 10);
    if (isNaN(x)) return 1;
    return Math.max(1, Math.min(99, x));
  };
  const getQty = (p) => qtyByKey[keyOf(p)] ?? 1;
  const setQty = (p, n) => setQtyByKey(prev => ({ ...prev, [keyOf(p)]: clamp(n) }));
  const inc = (p) => setQty(p, getQty(p) + 1);
  const dec = (p) => setQty(p, getQty(p) - 1);

  const handleAdd = (p) => {
    addItem(p, getQty(p));
  };

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
      case "price-desc": return [...out].sort((a,b) => (b.priceFrom ?? b.price ?? 0) - (a.priceFrom ?? a.price ?? 0));
      case "name-asc":   return [...out].sort((a,b) => (a.name || "").localeCompare(b.name || ""));
      case "name-desc":  return [...out].sort((a,b) => (b.name || "").localeCompare(a.name || ""));
      default:           return [...out].sort((a,b) => (a.priceFrom ?? a.price ?? 0) - (b.priceFrom ?? b.price ?? 0));
    }
  }, [base, q, sort, activeFormats]);

  // Reveal effects
  useEffect(() => {
    const root = gridRef.current;
    if (!root) return;
    const els = Array.from(root.querySelectorAll("[data-reveal]"));
    els.forEach((el, i) => {
      el.classList.add("reveal");
      el.classList.remove("revealed");
      el.style.transitionDelay = (Math.min(i, 8) * 60) + "ms";
    });
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches){
      els.forEach(el => el.classList.add("revealed"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("revealed");
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.12 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [filtered.length]);

  return (
    <>
      <Meta title="Jamones Ibéricos | Guarros Extremeños" description="Nuestra selección de jamón ibérico: piezas enteras y loncheado listo para disfrutar." />
      <section className="py-10 md:py-12">
        <div className="container max-w-7xl px-4 mx-auto">
          <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="mt-2 text-3xl md:text-5xl font-stencil text-brand">Jamones</h1>
              <p className="text-white/70 mt-1">Elige cantidad y añádelo al carrito directamente.</p>
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
                  className={(active
                      ? "bg-brand text-white border-transparent "
                      : "bg-black/40 text-white/80 border-white/15 hover:bg-white/10 ")
                    + "h-9 px-3 rounded-full border text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"}
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
            <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filtered.map((p) => {
                const displayPrice = fmtEUR(p.priceFrom ?? p.price);
                return (
                  <div key={keyOf(p)} data-reveal className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 flex flex-col">
                    {/* Imagen */}
                    <div className="aspect-[4/3] overflow-hidden rounded-xl border border-white/10">
                      <img src={p.image || p.img} alt={p.name} className="h-full w-full object-cover" loading="lazy" />
                    </div>

                    {/* Info */}
                    <h3 className="mt-3 text-white text-lg font-medium line-clamp-2">{p.name}</h3>
                    <div className="mt-1 text-white/70 text-sm capitalize">{getFormat(p)}</div>
                    <div className="mt-2 text-2xl font-semibold text-white">{displayPrice}</div>

                    {/* Spacer to pin CTA at bottom */}
                    <div className="flex-1" />

                    {/* Qty + CTA */}
                    <div className="mt-4 flex items-center gap-3">
                      <div className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.03] overflow-hidden">
                        <button type="button" onClick={() => dec(p)} className="h-9 w-9 text-white/80 hover:bg-white/10" aria-label="Disminuir">−</button>
                        <input
                          type="number"
                          min="1"
                          max="99"
                          value={getQty(p)}
                          onChange={(e) => setQty(p, e.target.value)}
                          className="h-9 w-12 bg-transparent text-center text-white outline-none"
                        />
                        <button type="button" onClick={() => inc(p)} className="h-9 w-9 text-white/80 hover:bg-white/10" aria-label="Aumentar">+</button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAdd(p)}
                        className="ml-auto h-10 px-4 rounded-xl bg-brand text-white hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
                      >
                        Añadir al carrito
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
