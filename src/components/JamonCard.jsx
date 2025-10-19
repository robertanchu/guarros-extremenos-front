// src/components/JamonCard.jsx
import React, { useMemo, useState } from "react";
import { useCart } from "@/store/cart";

export default function JamonCard({ product }) {
  const addItem = useCart((s) => s.addItem);

  const [sliced, setSliced] = useState(false);
  const [qty, setQty] = useState(1);

  const priceId = useMemo(() => {
    if (!product?.stripe) return null;
    return sliced ? product.stripe.sliced : product.stripe.unsliced;
  }, [product, sliced]);

  const displayPrice = useMemo(() => {
    if (!product?.basePrice) return null;
    const base = product.basePrice;
    const up = sliced ? (product.slicedUpchargeHint || 0) : 0;
    return (base + up) / 100;
  }, [product, sliced]);

  const inc = () => setQty((q) => Math.min(99, q + 1));
  const dec = () => setQty((q) => Math.max(1, q - 1));

  const onAdd = () => {
    if (!priceId) return;
    addItem({
      id: `${product.id}_${sliced ? "sliced" : "unsliced"}`, // agrupa por peso + loncheado
      name: `${product.name}${sliced ? " (loncheado)" : ""}`,
      image: product.image,
      kind: "product",
      qty,
      priceId,
      meta: { sliced, productId: product.id },
    });
  };

  return (
    <div className="group rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden flex flex-col">
      <div className="aspect-[4/3] bg-black/40">
        {product.imageSet ? (
          <img
            src={product.imageSet.src}
            srcSet={product.imageSet.srcSet}
            sizes={product.imageSet.sizes}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-stencil text-white">{product.name}</h3>
        <p className="mt-1 text-sm text-white/60">{product.short}</p>

        {/* Badges (opcional) */}
        {product.badges?.length ? (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {product.badges.map((b) => (
              <span key={b} className="text-[11px] px-2 py-0.5 rounded-full bg-white/10 text-white/80">
                {b}
              </span>
            ))}
          </div>
        ) : null}

        {/* Toggle loncheado */}
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

        {/* Precio + cantidad + CTA */}
        <div className="mt-4 grid grid-cols-[1fr,auto] gap-3 items-center">
          <div>
            <div className="text-white text-lg font-medium">
              {displayPrice ? `${displayPrice.toFixed(2)}€` : "—"}
            </div>
            {sliced && product.slicedUpchargeHint ? (
              <div className="text-xs text-white/50">Incluye loncheado</div>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={dec}
              className="h-9 w-9 rounded-lg border border-white/10 text-white hover:bg-white/10"
            >−</button>
            <div className="min-w-[2ch] text-center text-white">{qty}</div>
            <button
              onClick={inc}
              className="h-9 w-9 rounded-lg border border-white/10 text-white hover:bg-white/10"
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
