import React from "react";
import JamonCard from "@/components/JamonCard";
import { useCart } from "@/store/cart";

// API base del backend (para resolver precios de Stripe)
const API = import.meta.env.VITE_API_BASE || "https://guarros-extremenos-api.onrender.com";

// Utilidad para formatear dinero
function formatMoney(cents, currency = "EUR") {
  if (typeof cents !== "number") return "";
  try {
    return new Intl.NumberFormat("es-ES", { style: "currency", currency }).format(cents / 100);
  } catch {
    return `${(cents / 100).toFixed(2)} ${currency}`;
  }
}

// ----- Configura aquí tus productos y price IDs (Stripe) -----
const PRODUCTS = [
  {
    id: "ham-6-7",
    title: "Jamón 6–7 kg",
    subtitle: "Curación lenta y sabor equilibrado",
    image: "/images/jamon_6-7.jpg", // cambia a tu ruta real
    priceIdBase: import.meta.env.VITE_PRICE_6_7_BASE,     // p.ej. "price_123..."
    priceIdSliced: import.meta.env.VITE_PRICE_6_7_SLICED, // p.ej. "price_456..."
  },
  {
    id: "ham-7-8",
    title: "Jamón 7–8 kg",
    subtitle: "Grasa infiltrada y aroma intenso",
    image: "/images/jamon_7-8.jpg",
    priceIdBase: import.meta.env.VITE_PRICE_7_8_BASE,
    priceIdSliced: import.meta.env.VITE_PRICE_7_8_SLICED,
  },
  {
    id: "ham-8-9",
    title: "Jamón 8–9 kg",
    subtitle: "La joya, potencia y persistencia",
    image: "/images/jamon_8-9.jpg",
    priceIdBase: import.meta.env.VITE_PRICE_8_9_BASE,
    priceIdSliced: import.meta.env.VITE_PRICE_8_9_SLICED,
  },
];

// Resuelve varios precios en lote para evitar parpadeos
async function resolvePrices(ids = []) {
  const uniq = Array.from(new Set(ids.filter(Boolean)));
  if (!uniq.length) return {};
  const res = await fetch(`${API}/prices/resolve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids: uniq }),
  });
  if (!res.ok) return {};
  const data = await res.json();
  return data?.prices || {};
}

export default function Jamones() {
  // Extrae una acción de añadir al carrito cualquiera que exista (add / addItem / addToCart)
  const cartState = useCart();
  const addFn = cartState.add || cartState.addItem || cartState.addToCart;

  // Pre-carga precios para las 6 combinaciones
  const allPriceIds = React.useMemo(() => {
    const ids = [];
    PRODUCTS.forEach((p) => {
      if (p.priceIdBase) ids.push(p.priceIdBase);
      if (p.priceIdSliced) ids.push(p.priceIdSliced);
    });
    return ids;
  }, []);

  const [priceMap, setPriceMap] = React.useState({});
  React.useEffect(() => {
    let alive = true;
    resolvePrices(allPriceIds).then((result) => {
      if (alive) setPriceMap(result || {});
    });
    return () => { alive = false; };
  }, [allPriceIds]);

  // Handler para añadir al carrito desde una card
  const handleAdd = (product, qty, activePriceId, variantLabel) => {
    if (!addFn || !activePriceId) return;
    const keyId = `${product.id}:${activePriceId}`; // ID compuesto para distinguir variaciones
    const priceInfo = priceMap[activePriceId];

    const item = {
      id: keyId,
      name: product.title + (variantLabel ? ` — ${variantLabel}` : ""),
      image: product.image || null,
      priceId: activePriceId,
      qty: qty || 1,
      kind: "product",
      // extra opcional para mostrar precio preformateado en el carrito
      _unit_amount: priceInfo?.unit_amount ?? null,
      _currency: priceInfo?.currency ?? "EUR",
    };

    // Llamamos intentando distintos nombres de acción para no romper tu store
    try {
      const maybeReturn = addFn(item);
      if (maybeReturn === false) {
        // fallback de firma alternativa: (product, qty, priceId)
        addFn(product, qty, activePriceId);
      }
    } catch {
      try {
        addFn(product, qty, activePriceId);
      } catch {
        // último recurso: nada
      }
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Título al estilo de Suscripción (mayúsculas, stencil, rojo marca) */}
      <section className="relative pt-16 pb-8">
        <div className="mx-auto max-w-6xl px-4">
          <h1 className="mt-2 text-3xl md:text-5xl font-stencil text-[#D62828] tracking-wide">
            JAMONES
          </h1>
          {/* Se quitó la barrita degradada bajo el título como pediste en su día */}
        </div>
      </section>

      {/* Grilla de cards */}
      <section className="pb-20">
        <div className="mx-auto max-w-6xl px-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((p) => {
            const base = priceMap[p.priceIdBase];
            const sliced = priceMap[p.priceIdSliced];

            return (
              <JamonCard
                key={p.id}
                product={p}
                priceBase={base ? { ...base, text: formatMoney(base.unit_amount, base.currency) } : null}
                priceSliced={sliced ? { ...sliced, text: formatMoney(sliced.unit_amount, sliced.currency) } : null}
                onAdd={handleAdd}
              />
            );
          })}
        </div>
      </section>
    </main>
  );
}
