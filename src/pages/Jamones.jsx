// src/pages/Jamones.jsx
import React from "react";
import { motion } from "framer-motion";
import { products as ALL_PRODUCTS } from "@/data/products";
import JamonCard from "@/components/JamonCard";

const API = import.meta.env.VITE_API_BASE || "https://guarros-extremenos-api.onrender.com";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 110, damping: 18 } },
};

// Escanea posibles campos que contengan priceId
function collectPriceIdsFromProduct(p) {
  const ids = new Set();
  const keys = [
    "priceId","priceID","price_id",
    "priceIdBase","unslicedPriceId",
    "priceIdSliced","slicedPriceId",
  ];
  if (p?.stripe?.unsliced) ids.add(p.stripe.unsliced);
  if (p?.stripe?.sliced) ids.add(p.stripe.sliced);
  keys.forEach(k => { const v = p?.[k]; if (typeof v === "string" && v.startsWith("price_")) ids.add(v); });

  // búsqueda profunda de strings "price_..."
  try {
    const stack = [p]; const seen = new Set();
    while (stack.length) {
      const obj = stack.pop();
      if (!obj || typeof obj !== "object" || seen.has(obj)) continue;
      seen.add(obj);
      for (const v of Object.values(obj)) {
        if (typeof v === "string" && v.startsWith("price_")) ids.add(v);
        else if (v && typeof v === "object") stack.push(v);
      }
    }
  } catch {}
  return Array.from(ids);
}

async function resolvePrices(ids = []) {
  const uniq = Array.from(new Set(ids.filter(Boolean)));
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

  const allIds = React.useMemo(() => {
    const ids = [];
    jamones.forEach(p => ids.push(...collectPriceIdsFromProduct(p)));
    return Array.from(new Set(ids));
  }, [jamones]);

  const [priceMap, setPriceMap] = React.useState({});

  React.useEffect(() => {
    let alive = true;
    resolvePrices(allIds).then((map) => { if (alive) setPriceMap(map); });
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
          <motion.div
            className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {jamones.map((p) => (
              <motion.div key={p.id} variants={itemVariants}>
                <JamonCard product={p} priceMap={priceMap} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
