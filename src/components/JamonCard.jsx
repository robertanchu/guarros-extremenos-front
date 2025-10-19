// src/components/JamonCard.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "@/store/cart";

// Cache en memoria para no pedir lo mismo varias veces
const priceCache = new Map(); // key: priceId, value: { unit_amount, currency, ... }
let inFlight = null;

async function fetchPricesOnce(baseUrl, ids) {
  // Devuelve solo los que no están cacheados
  const missing = ids.filter(id => id && !priceCache.has(id));
  if (!missing.length) return;

  const url = `${baseUrl.replace(/\/$/, "")}/catalog/prices?ids=${missing.join(",")}`;
  // Evita peticiones paralelas duplicadas
  inFlight = inFlight || fetch(url, { method: "GET" }).then(r => r.json()).finally(() => { inFlight = null; });
  const data = await inFlight;

  if (data && data.prices) {
    for (const [id, val] of Object.entries(data.prices)) {
      priceCache.set(id, val);
    }
  }
}

export default function JamonCard({ product }) {
  const addItem = useCart((s) => s.addItem);
  const [sliced, setSliced] = useState(false);
  const [qty, setQty] = useState(1);

  // URL del backend (mismo que usas para /create-checkout-session)
  const API_BASE = import.meta.env.VITE_API_BASE || "https://guarros-extremenos-api.onrender.com";

  const priceIdUnsliced = product?.stripe?.unsliced || null;
  const priceIdSliced   = product?.stripe?.sliced   || null;

  const priceId = useMemo(
    () => (sliced ? priceIdSliced : priceIdUnsliced),
    [sliced, priceIdUnsliced, priceIdSliced]
  );

  // Carga unit_amount reales desde Stripe (vía backend)
  const [, force] = useState(0);
  const forceRerender = () => force(x => x + 1);

  const didFetchRef = useRef(false);
  useEffect(() => {
    if (didFetchRef.current) return;
    didFetchRef.current = true;
    const ids = [priceIdUnsliced, priceIdSliced].filter(Boolean);
    fetchPricesOnce(API_BASE, ids).then(() => {
      // una vez llegan, re-render para mostrar los importes
      forceRerender();
    });
  }, [API_BASE, priceIdUnsliced, priceIdSliced]);

  // Precio para mostrar: el de Stripe
  const stripePrice = priceCache.get(priceId || "");
  const displayPrice =
    stripePrice && Number.isFinite(stripePrice.unit_amount)
      ? (stripePrice.unit_amount / 100).toFixed(2)
      : null;

  const inc = () => setQty((q) => Math.min(99, q + 1));
  const dec = () => setQty((q) => Math.max(1, q - 1));

  const onAdd = () => {
    if (!priceId) return;
    addItem({
      id: `${product.id}_${sliced ? "sliced" : "unsliced"}`,
      name: `${product.name}${sliced ? " (loncheado)" : ""}`,
      image: product.image,
      kind: "product",
      qty,
      priceId,
      meta: { sliced, productId: product.id },
    });
  };

  // Si falta la imagen, no rompas la UI:
  const imgSrc = product?.image || "/images/placeholder.webp";

  return (
    <div className="group rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden flex flex-col">
      <div className="aspect-[4/3] bg-black/40">
        <img
          src={imgSrc}
          alt={product?.name || "Jamón"}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-stencil text-white">{product?.name || "Jamón"}</h3>
        {product?.short ? (
          <p className="mt-1 text-sm text-white/60">{product.short}</p>
        ) : null}

        {product?.badges?.length ? (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {product.badges.map((b) => (
              <span key={b} className="text-[11px] px-2 py-0.5 rounded-full bg-white/10 text-white/80">
                {b}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-white/80">Loncheado</span>
          <button
            type="button"
            aria-pressed={sliced}
            onClick={() => setSliced((x) => !x)}
            className={`inline-flex h-7 w-12 items-center rounded-full transition
              ${sliced ? "bg-[#E53935]" : "bg-white/15"}`}
          >
            <span
              className={`h-6 w-6 bg-white rounded-full transform transition
                ${sliced ? "translate-x-6" : "translate-x-1"}`}
            />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-[1fr,auto] gap-3 items-center">
          <div>
            <div className="text-white text-lg font-medium">
              {displayPrice ? `${displayPrice}€` : "—"}
            </div>
            {sliced ? (
              <div className="text-xs text-white/50">Precio real de Stripe (loncheado)</div>
            ) : (
              <div className="text-xs text-white/50">Precio real de Stripe</div>
            )}
          </div>

        {/* Cantidad */}
          <div className="flex items-center gap-2">
            <button
              onClick={dec}
              className="h-9 w-9 rounded-lg border border-white/10 text-white hover:bg-white/10"
              aria-label="Restar cantidad"
            >−</button>
            <div className="min-w-[2ch] text-center text-white">{qty}</div>
            <button
              onClick={inc}
              className="h-9 w-9 rounded-lg border border-white/10 text-white hover:bg-white/10"
              aria-label="Sumar cantidad"
            >+</button>
          </div>
        </div>

        <div className="mt-4">
          <button
            onClick={onAdd}
            disabled={!priceId}
            className="relative inline-flex items-center justify-center rounded-xl h-11 px-5
                       font-stencil tracking-wide text-black bg-[#E53935] hover:bg-[#992623]
                       transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50
                       disabled:opacity-60 disabled:cursor-not-allowed w-full"
          >
            Añadir al carrito
            <span className="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-[#E53935]/50 hover:ring-[#992623]/50 transition-all" />
          </button>
        </div>
      </div>
    </div>
  );
}
