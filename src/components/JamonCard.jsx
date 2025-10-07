// src/components/JamonCard.jsx
import React from "react";
import { formatEUR } from "@/utils/format";
import { useCart } from "@/store/cart";
import { useUI } from "@/store/ui";

export default function JamonCard({ product }){
  const { addItem } = useCart();
  const { openCart } = useUI();
  const [qty, setQty] = React.useState(1);
  const ref = React.useRef(null);
  const raf = React.useRef(0);

  const price = Number(product.priceFrom ?? product.price ?? 0);
  const img = product.image ?? product.cover ?? null;

  const dec = () => setQty(q => Math.max(1, q - 1));
  const inc = () => setQty(q => Math.min(99, q + 1));

  const handleAdd = () => {
    addItem({
      id: product.id ?? product.slug ?? product.name,
      name: product.name,
      price,
      qty,
      image: img,
      type: "product",
    });
    openCart();
  };

  // Tilt effect on mouse move (skips when reduced motion)
  const onMove = (e) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;  // 0..1
    const y = (e.clientY - rect.top) / rect.height;  // 0..1
    const rotY = (x - 0.5) * 6; // deg
    const rotX = (0.5 - y) * 6; // deg
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      el.style.setProperty('--rx', rotX.toFixed(2) + 'deg');
      el.style.setProperty('--ry', rotY.toFixed(2) + 'deg');
      el.style.transform = 'perspective(900px) rotateX(var(--rx)) rotateY(var(--ry))';
    });
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
  };

  return (
    <article
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="group h-full rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-colors flex flex-col will-change-transform"
      style={{ transform: 'perspective(900px) rotateX(0deg) rotateY(0deg)' }}
    >
      {/* Media */}
      <div className="aspect-square overflow-hidden">
        {img ? (
          <img
            src={img}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-brand/15 via-black/10 to-transparent grid place-items-center">
            <span className="text-white/50 text-sm">Imagen</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-white font-medium leading-tight line-clamp-2">{product.name}</h3>
            {product.description && (
              <p className="text-white/60 text-sm mt-1 line-clamp-2">{product.description}</p>
            )}
          </div>
          {Number.isFinite(price) && price > 0 && (
            <div className="shrink-0 text-right">
              <div className="text-brand font-semibold text-base md:text-lg leading-none">
                {formatEUR(price)}
              </div>
              <div className="text-[11px] text-white/50 mt-1">IVA incl.</div>
            </div>
          )}
        </div>

        {/* Actions pinned to bottom */}
        <div className="mt-4 pt-2 border-t border-white/10 flex items-center gap-3 md:gap-4 mt-auto">
          <div className="inline-flex items-center rounded-xl border border-white/15 overflow-hidden">
            <button onClick={dec} className="h-10 w-9 text-white/80 hover:bg-white/10">−</button>
            <span className="w-10 text-center text-white/90">{qty}</span>
            <button onClick={inc} className="h-10 w-9 text-white/80 hover:bg-white/10">+</button>
          </div>

          {/* Botón canalla */}
          <button
            onClick={handleAdd}
            className="relative btn-shiny flex-1 inline-flex items-center justify-center gap-2
                       rounded-xl px-4 h-10 md:h-11
                       font-stencil tracking-wide
                       text-black bg-[#E53935] hover:bg-[#992623]
                       transition-transform transition-colors duration-200
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50
                       active:scale-[0.98]"
            aria-label={`Añadir ${product.name} al carrito`}
          >
            Añadir al carrito
            {/* anillo decorativo al estilo Hero/Contacto */}
            <span className="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-[#E53935]/50 group-hover:ring-[#992623]/50 transition-all" />
          </button>
        </div>
      </div>
    </article>
  );
}
