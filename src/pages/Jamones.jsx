import React, { useMemo, useState } from "react";
import { useCart } from "@/store/cart";
import { products as ALL_PRODUCTS } from "@/data/products"; // ajusta esta ruta si tu archivo difiere

export default function Jamones(){
  const { addItem } = useCart();
  const [qtyByKey, setQtyByKey] = useState({});

  // Intento filtrar solo jamones si el catálogo lo permite; si no, muestro todo.
  const list = useMemo(() => {
    const src = Array.isArray(ALL_PRODUCTS) ? ALL_PRODUCTS : [];
    const jamones = src.filter((p) => {
      const cat = (p.category || p.categoria || p.type || "").toString().toLowerCase();
      return cat.includes("jamon") || cat.includes("jamón");
    });
    return jamones.length > 0 ? jamones : src;
  }, []);

  const clamp = (n) => {
    const x = parseInt(n, 10);
    if (isNaN(x)) return 1;
    return Math.max(1, Math.min(99, x));
  };

  const keyOf = (p) => p.id ?? p.priceId ?? p.slug ?? p.sku ?? p.name;
  const getQty = (p) => qtyByKey[keyOf(p)] ?? 1;
  const setQty = (p, n) => setQtyByKey((prev) => ({ ...prev, [keyOf(p)]: clamp(n) }));
  const inc = (p) => setQty(p, getQty(p) + 1);
  const dec = (p) => setQty(p, getQty(p) - 1);

  const addWithQty = (p) => {
    addItem(p, getQty(p));
  };

  return (
    <main className="shell py-8 md:py-10">
      <header className="mb-6 md:mb-10 text-center">
        <h1 className="mt-2 text-3xl md:text-5xl font-stencil text-brand">JAMONES</h1>
      </header>

      {(!list || list.length === 0) ? (
        <div className="text-white/70">No hay productos de jamón disponibles.</div>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((p) => (
            <article
              key={keyOf(p)}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 flex flex-col"
            >
              {/* Imagen */}
              <div className="aspect-[4/3] overflow-hidden rounded-xl border border-white/10">
                <img src={p.image} alt={p.name} className="h-full w-full object-cover" loading="lazy" />
              </div>

              {/* Info */}
              <h3 className="mt-3 text-white text-lg font-medium line-clamp-2">{p.name}</h3>
              {p.description && (
                <p className="mt-1 text-white/70 text-sm line-clamp-2">{p.description}</p>
              )}

              {/* Precio */}
              <div className="mt-2 text-2xl font-semibold text-white">{Number(p.price) ? new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(p.price) : ""}</div>

              {/* Spacer para pegar el CTA abajo */}
              <div className="flex-1" />

              {/* Controles cantidad + CTA */}
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
                  onClick={() => addWithQty(p)}
                  className="ml-auto h-10 px-4 rounded-xl bg-brand text-white hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
                >
                  Añadir al carrito
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
