import React from "react";
import { Link } from "react-router-dom";
import { formatEUR } from "@/utils/format";

export default function JamonCard({ product }){
  const slug = product.slug || String(product.id || product.name || "").toLowerCase().replaceAll(" ", "-").replace(/[^a-z0-9-]/g, "");
  return (
    <Link
      to={`/producto/${slug}`}
      state={{ product }}
      className="group rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
    >
      <div className="aspect-square bg-gradient-to-br from-brand/15 via-black/10 to-transparent grid place-items-center">
        <span className="text-white/50 text-sm">Imagen</span>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-white font-medium leading-tight group-hover:underline">{product.name}</h3>
          {product.priceFrom != null && (
            <span className="inline-flex items-center rounded-full bg-brand/15 text-brand px-2 py-0.5 text-xs font-semibold">
              {formatEUR(product.priceFrom)}
            </span>
          )}
        </div>
        {product.description && (
          <p className="text-white/60 text-sm mt-2 line-clamp-2">{product.description}</p>
        )}
      </div>
    </Link>
  );
}
