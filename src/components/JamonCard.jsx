// src/components/JamonCard.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useCart } from "@/store/cart";

const API = import.meta.env.VITE_API_BASE || "https://guarros-extremenos-api.onrender.com";

function formatMoney(cents, currency = "EUR") {
  if (typeof cents !== "number") return "—";
  try {
    return new Intl.NumberFormat("es-ES", { style: "currency", currency }).format(cents / 100);
  } catch {
    return `${(cents / 100).toFixed(2)} ${currency}`;
  }
}

function pickPriceIds(product) {
  const baseCandidates = [
    product?.stripe?.unsliced,
    product?.priceIdBase,
    product?.unslicedPriceId,
    product?.priceId,
    product?.priceID,
    product?.price_id,
  ];
  const slicedCandidates = [
    product?.stripe?.sliced,
    product?.priceIdSliced,
    product?.slicedPriceId,
  ];

  const base = baseCandidates.find((x) => typeof x === "string" && x.startsWith("price_")) || null;
  const sliced = slicedCandidates.find((x) => typeof x === "string" && x.startsWith("price_")) || null;

  // Fallback: busca cualquier "price_"
  let fallbackAny = null;
  if (!base && !sliced) {
    try {
      const stack = [product]; const seen = new Set();
      while (stack.length) {
        const obj = stack.pop();
        if (!obj || typeof obj !== "object" || seen.has(obj)) continue;
        seen.add(obj);
        for (const v of Object.values(obj)) {
          if (typeof v === "string" && v.startsWith("price_")) { fallbackAny = v; break; }
          else if (v && typeof v === "object") stack.push(v);
        }
        if (fallbackAny) break;
      }
    } catch {}
  }

  return { basePriceId: base || fallbackAny, slicedPriceId: sliced };
}

export default function JamonCard({ product, priceMap = {} }) {
  const addItem = useCart((s) => s.addItem || s.add || s.addToCart || s.addProduct);

  const [sliced, setSliced] = useState(false);
  const [qty, setQty] = useState(1);

  const { basePriceId, slicedPriceId } = useMemo(() => pickPriceIds(product), [product]);
  const activePriceId = sliced ? (slicedPriceId || basePriceId) : basePriceId;

  // 1) Intentar leer del map precargado
  let priceObj = activePriceId ? priceMap[activePriceId] : null;
  const [fallbackPrice, setFallbackPrice] = useState(null);
  const [loadingFallback, setLoadingFallback] = useState(false);

  // 2) Fallback: si no hay precio en el map, pedirlo individualmente
  useEffect(() => {
    let alive = true;
    async function load() {
      if (!activePriceId) { setFallbackPrice(null); return; }
      if (priceObj && priceObj.unit_amount != null) { setFallbackPrice(null); return; }
      setLoadingFallback(true);
      try {
        const r = await fetch(`${API}/price/${encodeURIComponent(activePriceId)}`);
        if (!r.ok) throw new Error("no price");
        const p = await r.json(); // {id, unit_amount, currency}
        if (alive) setFallbackPrice(p);
      } catch {
        if (alive) setFallbackPrice(null);
      } finally {
        if (alive) setLoadingFallback(false);
      }
    }
    load();
    return () => { alive = false; };
  }, [activePriceId, priceObj]);

  const unitCents = priceObj?.unit_amount ?? (fallbackPrice?.unit_amount ?? null);
  const currency = (priceObj?.currency || fallbackPrice?.currency || "EUR").toUpperCase();
  const displayPrice =
    unitCents != null ? formatMoney(unitCents, currency) : (loadingFallback ? "…" : "—");

  useEffect(() => {
    if (!activePriceId) {
      console.warn("[JamonCard] No se pudo determinar un priceId para:", { id: product?.id, name: product?.name, product });
    }
  }, [activePriceId, product]);

  const inc = () => setQty((q) => Math.min(99, q + 1));
  const dec = () => setQty((q) => Math.max(1, q - 1));

  const onAdd = () => {
    if (!activePriceId || !addItem) return;

    const priceFields = unitCents != null ? {
      unit_amount: unitCents,
      currency,
      priceCents: unitCents,
      price: unitCents / 100,
      unitPrice: unitCents / 100,
      unitAmountCents: unitCents,
    } : {};

    // Añadir al carrito (la store disparará el "pulso" del icono)
    try {
      addItem({
        id: `${product.id}_${sliced ? "sliced" : "unsliced"}`,
        name: `${product.name}${sliced ? " (loncheado)" : ""}`,
        image: product.image,
        kind: "product",
        qty,
        priceId: activePriceId,
        meta: { sliced, productId: product.id },
        ...priceFields,
      });
    } catch {
      try { addItem(product, qty, activePriceId); } catch {}
    }
  };

  const imgSrc = product?.image || "/images/placeholder.webp";

  return (
    <div className="group rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden flex flex-col">
      <div className="aspect-[4/3] bg-black/40">
        <img
          src={imgSrc}
          alt={product?.name || "Jamón"}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          loading="lazy"
        />
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-stencil text-white">
          {product?.name || "Jamón"}
        </h3>
        {product?.short ? <p className="mt-1 text-sm text-white/60">{product.short}</p> : null}
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
            className={`inline-flex h-7 w-12 items-center rounded-full transition ${sliced ? "bg-[#E53935]" : "bg-white/15"}`}
          >
            <span className={`h-6 w-6 bg-white rounded-full transform transition ${sliced ? "translate-x-6" : "translate-x-1"}`} />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-[1fr,auto] gap-3 items-center">
          <div>
            <div className="text-white text-lg font-medium">{displayPrice}</div>
            {sliced ? (
              <div className="text-xs text-white/50">Precio real de Stripe (loncheado)</div>
            ) : (
              <div className="text-xs text-white/50">Precio real de Stripe</div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button onClick={dec} className="h-9 w-9 rounded-lg border border-white/10 text-white hover:bg-white/10" aria-label="Restar cantidad">−</button>
            <div className="min-w-[2ch] text-center text-white">{qty}</div>
            <button onClick={inc} className="h-9 w-9 rounded-lg border border-white/10 text-white hover:bg-white/10" aria-label="Aumentar cantidad">+</button>
          </div>
        </div>

        <div className="mt-4">
          <button
            onClick={onAdd}
            disabled={!activePriceId}
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
