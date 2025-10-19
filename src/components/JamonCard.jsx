// src/components/JamonCard.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useCart } from "@/store/cart";

// Formateador €
function formatMoney(cents, currency = "EUR") {
  if (typeof cents !== "number") return "—";
  try {
    return new Intl.NumberFormat("es-ES", { style: "currency", currency }).format(cents / 100);
  } catch {
    return `${(cents / 100).toFixed(2)} ${currency}`;
  }
}

// Selecciona priceId "base" y "loncheado" entre varias posibles claves del producto
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

  // Fallback: si no hay nada, intenta encontrar cualquier "price_" en el objeto
  let fallbackAny = null;
  if (!base && !sliced) {
    try {
      const stack = [product];
      const visited = new Set();
      while (stack.length) {
        const obj = stack.pop();
        if (!obj || typeof obj !== "object" || visited.has(obj)) continue;
        visited.add(obj);
        for (const val of Object.values(obj)) {
          if (typeof val === "string" && val.startsWith("price_")) {
            fallbackAny = val;
            break;
          } else if (val && typeof val === "object") {
            stack.push(val);
          }
        }
        if (fallbackAny) break;
      }
    } catch {}
  }

  return {
    basePriceId: base || fallbackAny,
    slicedPriceId: sliced,
  };
}

export default function JamonCard({ product, priceMap = {} }) {
  const addItem = useCart((s) => s.addItem);
  const [sliced, setSliced] = useState(false);
  const [qty, setQty] = useState(1);

  const { basePriceId, slicedPriceId } = useMemo(() => pickPriceIds(product), [product]);
  const activePriceId = sliced ? (slicedPriceId || basePriceId) : basePriceId;

  // Lee precio del map precargado
  const priceObj = activePriceId ? priceMap[activePriceId] : null;
  const unitCents = Number.isFinite(priceObj?.unit_amount) ? priceObj.unit_amount : null;
  const currency = (priceObj?.currency || "EUR").toUpperCase();
  const displayPrice = unitCents != null ? formatMoney(unitCents, currency) : "—";

  useEffect(() => {
    if (!activePriceId) {
      console.warn("[JamonCard] No se pudo determinar un priceId para el producto:", {
        id: product?.id, name: product?.name, product
      });
    }
  }, [activePriceId, product]);

  const inc = () => setQty((q) => Math.min(99, q + 1));
  const dec = () => setQty((q) => Math.max(1, q - 1));

  const onAdd = () => {
    if (!activePriceId) return;

    // ⚠️ AQUI EL CAMBIO: incluimos precio y moneda (y alias compatibles) en el item
    const priceFields = unitCents != null ? {
      unit_amount: unitCents,          // estándar Stripe (en céntimos)
      currency,                        // "EUR"
      priceCents: unitCents,           // alias de compatibilidad
      price: unitCents / 100,          // en euros (número)
      unitPrice: unitCents / 100,      // alias
      unitAmountCents: unitCents,      // alias
    } : {};

    addItem({
      id: `${product.id}_${sliced ? "sliced" : "unsliced"}`,
      name: `${product.name}${sliced ? " (loncheado)" : ""}`,
      image: product.image,
      kind: "product",
      qty,
      priceId: activePriceId,
      meta: { sliced, productId: product.id },
      ...priceFields,                  // ← Los metadatos de precio para el carrito
    });
  };

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
        <h3 className="text-lg font-stencil text-white">
          {product?.name || "Jamón"}
        </h3>
        {product?.short ? (
          <p className="mt-1 text-sm text-white/60">{product.short}</p>
        ) : null}

        {product?.badges?.length ? (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {product.badges.map((b) => (
              <span
                key={b}
                className="text-[11px] px-2 py-0.5 rounded-full bg-white/10 text-white/80"
              >
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
              {displayPrice}
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
            >
              −
            </button>
            <div className="min-w-[2ch] text-center text-white">{qty}</div>
            <button
              onClick={inc}
              className="h-9 w-9 rounded-lg border border-white/10 text-white hover:bg-white/10"
              aria-label="Sumar cantidad"
            >
              +
            </button>
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
