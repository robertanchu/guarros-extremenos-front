import React, { useEffect, useMemo, useRef, useState } from "react";
import Meta from "../lib/Meta";
import SortSelect from "@/components/SortSelect";
import JamonCard from "@/components/JamonCard";
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
  { value: "price-desc", label: "Precio: mayor a menor" },
  { value: "name-asc",   label: "Nombre A→Z" },
  { value: "name-desc",  label: "Nombre Z→A" },
];

const FORMATS = [
  { value: "entero", label: "Entero" },
  { value: "loncheado", label: "Loncheado" },
];

const keyOf = (p) => p.id ?? p.slug ?? p.priceId ?? p.sku ?? p.name;

export default function Jamones(){
  const base = useMemo(() => getCatalog().filter(p => p.type === "one_time"), []);
  const { addItem } = useCart();
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("price-asc");
  const [activeFormats, setActiveFormats] = useState(new Set());
  const gridRef = useRef(null);

  // refs de tarjeta
  const cardRefs = useRef(new Map());
  const setCardRef = (key) => (el) => {
    if (el) cardRefs.current.set(key, el);
    else cardRefs.current.delete(key);
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

  // Efecto reveal
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

  // -------- Detección robusta de cantidad --------
  const coerceQty = (v) => {
    const n = Number(v);
    if (!Number.isFinite(n)) return 1;
    return Math.max(1, Math.min(99, Math.trunc(n)));
  };

  const readQtyFromDom = (rootEl) => {
    if (!rootEl) return 1;
    // 1) inputs number
    let el = rootEl.querySelector('input[type="number"]');
    if (el) return coerceQty(el.value);
    // 2) atributos data
    el = rootEl.querySelector('[data-qty],[data-quantity],[data-count],[data-amount],[data-units]');
    if (el) return coerceQty(el.getAttribute("data-qty") || el.getAttribute("data-quantity") || el.getAttribute("data-count") || el.getAttribute("data-amount") || el.getAttribute("data-units"));
    // 3) inputs por name
    el = rootEl.querySelector('input[name*="qty" i],input[name*="quant" i],input[name*="cant" i],input[name*="cantidad" i]');
    if (el) return coerceQty(el.value);
    // 4) spans comunes
    el = rootEl.querySelector('.qty,.quantity,[data-quantity-text]');
    if (el) return coerceQty(el.textContent);
    // fallback
    return 1;
  };

  // onAdd que acepta: number, string, objeto con qty/quantity, evento, o nada
  const onAddFactory = (product, key) => (...args) => {
    let qty = 1;
    // casos por argumentos
    for (const a of args) {
      if (typeof a === "number" || (typeof a === "string" && /^\d+$/.test(a))) {
        qty = Number(a);
        break;
      }
      if (a && typeof a === "object") {
        // { qty }, { quantity }, { amount }, event
        const cand = a.qty ?? a.quantity ?? a.amount ?? a.units ?? a.value;
        if (cand != null) { qty = cand; break; }
        // si parece evento, mirar target cercano
        const t = a.target ?? a.currentTarget;
        if (t && typeof t.closest === "function") {
          const card = t.closest("[data-card-root]") || cardRefs.current.get(key);
          qty = readQtyFromDom(card);
          break;
        }
      }
    }
    // si no se obtuvo por args, leer del DOM por ref
    if (!args.length) {
      qty = readQtyFromDom(cardRefs.current.get(key));
    }
    qty = coerceQty(qty);
    addItem(product, qty);
  };

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
                  onClick={() => {
                    const n = new Set(activeFormats);
                    if (active) n.delete(f.value); else n.add(f.value);
                    setActiveFormats(n);
                  }}
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
                const k = keyOf(p);
                return (
                  <div key={k} data-reveal data-card-root ref={setCardRef(k)}>
                    <JamonCard
                      product={p}
                      onAdd={onAddFactory(p, k)} // soporta qty por arg, por objeto, por evento, o leyendo el DOM
                    />
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
