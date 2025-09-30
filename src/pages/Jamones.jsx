import React, { useState, useMemo } from "react";
import { useCart } from "@/store/cart";

// IMPORTANTE: mantén tu import original de productos si difiere
// Ejemplo común:
// import { products as JAMONES } from "@/data/products";
// Aquí dejo un fallback por si ya recibes los productos por props.
const FALLBACK = [];

export default function Jamones({ products = FALLBACK }){
  const { addItem } = useCart();

  // Estado local para cantidades por producto
  const [qtyById, setQtyById] = useState({});

  const clamp = (n) => {
    const x = parseInt(n, 10);
    if (isNaN(x)) return 1;
    return Math.max(1, Math.min(99, x));
  };

  const getQty = (p) => {
    const k = p.id ?? p.priceId ?? p.slug ?? p.name;
    return qtyById[k] ?? 1;
  };

  const setQty = (p, n) => {
    const k = p.id ?? p.priceId ?? p.slug ?? p.name;
    setQtyById((prev) => ({ ...prev, [k]: clamp(n) }));
  };

  const dec = (p) => setQty(p, getQty(p) - 1);
  const inc = (p) => setQty(p, getQty(p) + 1);

  const handleAdd = (p) => {
    const qty = getQty(p);
    // Llamada a la store con la cantidad seleccionada
    addItem(p, qty);
  };

  // Si en tu proyecto haces filtros/ordenaciones, mantén tu lógica original.
  const list = useMemo(() => products, [products]);

  return (
    <main className="shell py-8 md:py-10">
      <header className="mb-6 md:mb-10 text-center">
        <h1 className="mt-2 text-3xl md:text-5xl font-stencil text-brand">JAMONES</h1>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {list && list.length > 0 ? list.map((p) => (
          <article key={(p.id ?? p.priceId ?? p.slug ?? p.name) + String(p.format ?? "")} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 flex flex-col">
            <div className="aspect-[4/3] overflow-hidden rounded-xl border border-white/10">
              <img src={p.image} alt={p.name} className="h-full w-full object-cover" loading="lazy" />
            </div>
            <h3 className="mt-3 text-white text-lg font-medium">{p.name}</h3>
            <p className="mt-1 text-white/70 text-sm">{p.description}</p>
            <div className="mt-2 text-white font-semibold">{Number(p.price) ? new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(p.price) : ""}</div>

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
          </article>
        )) : (
          <div className="col-span-full text-white/70">No hay productos disponibles.</div>
        )}
      </section>
    </main>
  );
}
