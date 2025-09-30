import React from "react";
import { formatEUR } from "@/utils/format";
import { useCart } from "@/store/cart";
import { useUI } from "@/store/ui";

export default function JamonCard({ product }){
  const { addItem } = useCart();
  const { openCart } = useUI();

  const handleAdd = () => {
    addItem({
      id: product.id ?? product.slug ?? product.name,
      name: product.name,
      price: Number(product.priceFrom ?? product.price ?? 0),
      qty: 1,
      image: product.image ?? product.cover ?? null,
      type: "product",
    });
    openCart();
  };

  return (
    <article
      className="group rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-colors focus-within:outline-none focus-within:ring-2 focus-within:ring-brand/40"
    >
      <div className="aspect-square bg-gradient-to-br from-brand/15 via-black/10 to-transparent grid place-items-center">
        <span className="text-white/50 text-sm">Imagen</span>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-white font-medium leading-tight">{product.name}</h3>
            {product.description && (
              <p className="text-white/60 text-sm mt-1 line-clamp-2">{product.description}</p>
            )}
          </div>
          {(product.priceFrom ?? product.price) != null && (
            <span className="shrink-0 inline-flex items-center rounded-full bg-brand/15 text-brand px-2 py-0.5 text-xs font-semibold">
              {formatEUR(product.priceFrom ?? product.price)}
            </span>
          )}
        </div>

        <div className="mt-4">
          <button
            onClick={handleAdd}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-brand hover:bg-brand-700 text-white font-medium px-4 py-2.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
            aria-label={`Añadir ${product.name} al carrito`}
          >
            Añadir al carrito
          </button>
        </div>
      </div>
    </article>
  );
}
