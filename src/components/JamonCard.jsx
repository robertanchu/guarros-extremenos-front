// src/components/JamonCard.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useCart } from "@/store/cart";
import { usePrices } from "@/store/prices";

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

  // Fallback profundo a cualquier "price_"
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

// Utilidad para decidir imagen según estado
function pickImages(product) {
  const unsliced =
    product?.imageUnsliced ||
    product?.image ||
    product?.images?.unsliced ||
    product?.images?.default ||
    "/images/placeholder.webp";

  const sliced =
    product?.imageSliced ||
    product?.images?.sliced ||
    product?.image || // fallback si no hay específica
    unsliced;

  // Retina opcionales (si existen)
  const unsliced2x = product?.imageUnsliced2x || product?.images?.unsliced2x || null;
  const sliced2x = product?.imageSliced2x || product?.images?.sliced2x || null;

  return { unsliced, sliced, unsliced2x, sliced2x };
}

export default function JamonCard({ product, priceMap = {}, loadingPrices = false }) {
  const addItem = useCart((s) => s.addItem || s.add || s.addToCart || s.addProduct);

  const [sliced, setSliced] = useState(false);
  const [qty, setQty] = useState(1);

  const { basePriceId, slicedPriceId } = useMemo(() => pickPriceIds(product), [product]);
  const activePriceId = sliced ? (slicedPriceId || basePriceId) : basePriceId;

  const ensure = usePrices((s) => s.ensure);
  const pickMany = usePrices((s) => s.pickMany);
  const selection = pickMany(activePriceId ? [activePriceId] : []);
  const priceObj = activePriceId ? selection[activePriceId] : null;

  useEffect(() => {
    if (activePriceId) ensure(activePriceId);
    else console.warn("[JamonCard] Sin priceId:", product?.id, product?.name);
  }, [activePriceId, ensure, product?.id, product?.name]);

  // Fallback local si lo tienes
  let fallbackCents = product?.fallbackCents || null;
  if (!fallbackCents && product?.baseCents) {
    const delta = sliced ? (product?.slicedDeltaCents || 0) : 0;
    fallbackCents = product.baseCents + delta;
  }

  const unitCents = priceObj?.unit_amount ?? fallbackCents ?? null;
  const currency = (priceObj?.currency || "EUR").toUpperCase();
  const displayPrice =
    unitCents != null ? formatMoney(unitCents, currency) : (loadingPrices ? "…" : "—");

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

    try {
      addItem({
        id: `${product.id}_${sliced ? "sliced" : "unsliced"}`,
        name: `${product.name}${sliced ? " (loncheado)" : ""}`,
        image: sliced
          ? (product?.imageSliced || product?.images?.sliced || product?.image)
          : (product?.imageUnsliced || product?.image || product?.images?.unsliced),
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

  // IMÁGENES (crossfade suave)
  const { unsliced, sliced: slicedImg, unsliced2x, sliced2x } = useMemo(() => pickImages(product), [product]);

  return (
    <div className="group rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden flex flex-col 
                   transition-all duration-300 ease-in-out 
                   md:hover:scale-[1.02] md:hover:shadow-xl md:hover:shadow-black/40 
                   md:hover:ring-2 md:hover:ring-[#E53935]/80">
      
      {/* Contenedor de imagen con dos capas para crossfade */}
      <div className="relative aspect-[4/3] bg-black/40 overflow-hidden">
        {/* UNSLICED */}
        <img
          src={unsliced}
          // --- 1. LÍNEA ELIMINADA ---
          // srcSet={unsliced2x ? `${unsliced} 1x, ${unsliced2x} 2x` : undefined} 
          alt={(product?.name || "Jamón") + " entero"}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-in-out md:group-hover:scale-[1.05] ${sliced ? "opacity-0" : "opacity-100"}`}
          loading="lazy"
          draggable={false}
        />
        {/* SLICED */}
        <img
          src={slicedImg}
          // --- 2. LÍNEA ELIMINADA ---
          // srcSet={sliced2x ? `${slicedImg} 1x, ${sliced2x} 2x` : undefined}
          alt={(product?.name || "Jamón") + " loncheado"}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-in-out md:group-hover:scale-[1.05] ${sliced ? "opacity-100" : "opacity-0"}`}
          loading="lazy"
          draggable={false}
        />
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-stencil text-white">
          {product?.name || "Jamón"}
        </h3>
        {product?.short ? <p className="mt-1 text-sm text-white/60">{product.short}</p> : null}

        {/* Toggle Loncheado */}
        <div className="mt-4 flex items-center justify-between">
          
          <span className="text-lg font-stencil text-[#E53935]">Loncheado</span>

          <button
            type="button"
            aria-pressed={sliced}
            onClick={() => setSliced((x) => !x)}
            className={`inline-flex h-7 w-12 items-center rounded-full transition ${sliced ? "bg-[#E53935]" : "bg-white/15"}`}
          >
            <span className={`h-6 w-6 bg-white rounded-full transform transition ${sliced ? "translate-x-6" : "translate-x-1"}`} />
          </button>
        </div>

        {/* Precio + Cantidad */}
        <div className="mt-4 grid grid-cols-[1fr,auto] gap-3 items-center">
          <div>
            <div className="text-white text-lg font-medium">{displayPrice}</div>
            <div className="text-xs text-white/50">
              {sliced ? "Precio (loncheado)" : "Precio"}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={dec} className="h-9 w-9 rounded-lg border border-white/10 text-white md:hover:bg-white/10" aria-label="Restar cantidad">−</button>
            <div className="min-w-[2ch] text-center text-white">{qty}</div>
            <button onClick={inc} className="h-9 w-9 rounded-lg border border-white/10 text-white md:hover:bg-white/10" aria-label="Aumentar cantidad">+</button>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-4">
          <button
            onClick={onAdd}
            disabled={!activePriceId}
            className="relative inline-flex items-center justify-center rounded-xl h-11 px-5
                       font-stencil tracking-wide text-black bg-[#E53935] md:hover:bg-[#992623]
                       transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50
                       disabled:opacity-60 disabled:cursor-not-allowed w-full"
          >
            Añadir al carrito
            <span className="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-[#E53935]/50 md:hover:ring-[#992323]/50 transition-all" />
          </button>
        </div>
      </div>
    </div>
  );
}