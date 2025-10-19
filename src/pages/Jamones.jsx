// src/pages/Jamones.jsx
import React from "react";
import { products as ALL_PRODUCTS } from "@/data/products";
import JamonCard from "@/components/JamonCard";

const API = import.meta.env.VITE_API_BASE || "https://guarros-extremenos-api.onrender.com";

// Escanea cualquier posible campo donde pueda venir un priceId
function collectPriceIdsFromProduct(p) {
  const ids = new Set();

  // Claves más comunes
  const commonKeys = [
    "priceId", "priceID", "price_id",
    "priceIdBase", "basePriceId", "unslicedPriceId",
    "priceIdSliced", "slicedPriceId",
  ];

  // Campos anidados típicos
  if (p?.stripe?.unsliced) ids.add(p.stripe.unsliced);
  if (p?.stripe?.sliced) ids.add(p.stripe.sliced);

  // Lee claves comunes directas
  commonKeys.forEach(k => {
    const v = p?.[k];
    if (typeof v === "string" && v.startsWith("price_")) ids.add(v);
  });

  // Recorre todo el objeto por si hay otras claves que empiecen por "price_"
  try {
    const stack = [p];
    const visited = new Set();
    while (stack.length) {
      const obj = stack.pop();
      if (!obj || typeof obj !== "object" || visited.has(obj)) continue;
      visited.add(obj);
      for (const val of Object.values(obj)) {
        if (typeof val === "string" && val.startsWith("price_")) {
          ids.add(val);
        } else if (val && typeof val === "object") {
          stack.push(val);
        }
      }
    }
  } catch {
    // silencioso
  }

  return Array.from(ids);
}

// Resuelve en lote
async function resolvePrices(priceIds = []) {
  const uniq = Array.from(new Set(priceIds.filter(Boolean)));
  if (!uniq.length) return {};
  const res = await fetch(`${API}/prices/resolve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids: uniq }),
  });
  if (!res.ok) {
    console.warn("[prices.resolve] fallo:", res.status);
    return {};
  }
  const data = await res.json();
  return data?.prices || {};
}

export default function Jamones() {
  const jamones = Array.isArray(ALL_PRODUCTS)
    ? ALL_PRODUCTS.filter((p) => p?.kind === "jamon-weight")
    : [];

  // Colecta todos los priceId de todos los productos
  const allIds = React.useMemo(() => {
    const ids = [];
    jamones.forEach(p => ids.push(...collectPriceIdsFromProduct(p)));
    return Array.from(new Set(ids));
  }, [jamones]);

  // Mapa de precios resueltos (priceId -> objeto con unit_amount/currency/product_name)
  const [priceMap, setPriceMap] = React.useState({});

  React.useEffect(() => {
    let alive = true;
    resolvePrices(allIds).then((map) => {
      if (alive) setPriceMap(map);
    });
    return () => { alive = false; };
  }, [allIds]);

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
              <JamonCard
                key={p.id}
                product={p}
                priceMap={priceMap} // ← se lo pasamos a la card
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
