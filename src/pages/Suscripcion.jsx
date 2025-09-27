import React, { useRef } from "react";
import { useCart } from "@/store/cart";
import { useUI } from "@/store/ui";
import { MEDIA } from "@/data/media";
import { PRODUCTS } from "@/data/products";

export default function Suscripcion(){
  const add = useCart(s => s.addItem);

  // Local helpers (no cambian otros archivos)
  const flyToCart = (fromEl) => {
    try {
      const toEl =
        document.querySelector('[data-cart-target="true"]') ||
        document.querySelector("#cart-button");
      if (!fromEl || !toEl) return;
      const a = fromEl.getBoundingClientRect();
      const b = toEl.getBoundingClientRect();
      const clone = fromEl.cloneNode(true);
      Object.assign(clone.style, {
        position: "fixed",
        left: a.left + "px",
        top: a.top + "px",
        width: a.width + "px",
        height: a.height + "px",
        borderRadius: "16px",
        transition: "transform .7s cubic-bezier(.22,.61,.36,1), opacity .7s",
        zIndex: 9999,
        pointerEvents: "none",
      });
      document.body.appendChild(clone);
      const dx = b.left - a.left;
      const dy = b.top - a.top;
      const scale = Math.max(0.15, Math.min(0.25, b.width / a.width));
      requestAnimationFrame(() => {
        clone.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
        clone.style.opacity = "0.4";
      });
      setTimeout(() => clone.remove(), 800);
    } catch {}
  };

  const pulseCart = () => {
    try { useUI.getState().pulseCart?.(); } catch {}
  };

  // Productos de suscripción (ya están en PRODUCTS y MEDIA)
  const sub500 = PRODUCTS.find(p => p.id === "sub_500");
  const sub1000 = PRODUCTS.find(p => p.id === "sub_1000");
  const img500 = (MEDIA.products && MEDIA.products.sub_500) || MEDIA.og?.jamones;
  const img1000 = (MEDIA.products && MEDIA.products.sub_1000) || MEDIA.og?.jamones;

  // Refs para animación
  const ref500 = useRef(null);
  const ref1000 = useRef(null);

  const handleAdd = (product, imgRef) => {
    flyToCart(imgRef?.current);
    pulseCart();
    add({
      id: product.id,
      name: product.name,
      priceId: product.priceId,
      price: product.priceFrom,
      qty: 1,
    });

    // Analytics (no rompe si no hay gtag/dataLayer)
    try {
      if (window.gtag) {
        window.gtag("event", "add_to_cart", {
          items: [{ item_id: product.id, item_name: product.name, price: product.priceFrom, quantity: 1 }],
        });
      } else if (window.dataLayer) {
        window.dataLayer.push({
          event: "add_to_cart",
          items: [{ item_id: product.id, item_name: product.name, price: product.priceFrom, quantity: 1 }],
        });
      }
    } catch {}
  };

  return (
    <div className="container py-10">
      <h1 className="text-3xl md:text-4xl text-white font-stencil">Suscripción</h1>
      <p className="mt-3 text-zinc-300">
        Elige tu dosis mensual de jamón 100% bellota. Sin permanencia, pausa cuando quieras.
      </p>

      <div className="mt-8 grid md:grid-cols-2 gap-6">
        {/* 500 g / mes */}
        {sub500 && (
          <div className="group rounded-2xl overflow-hidden border border-white/10 bg-black/40 transition hover:border-white/20">
            <img
              ref={ref500}
              src={img500}
              alt={sub500.name}
              className="w-full h-56 object-cover"
              loading="lazy"
            />
            <div className="p-5">
              <h3 className="text-lg text-white">{sub500.name}</h3>
              <p className="text-zinc-400 mt-1">{sub500.description}</p>
              <div className="flex items-center justify-between mt-4">
                <span className="text-amber-300">{sub500.priceFrom} €/mes</span>
                <button
                  className="btn-primary px-4 py-2 btn-shiny"
                  onClick={() => handleAdd(sub500, ref500)}
                >
                  Añadir
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 1 kg / mes */}
        {sub1000 && (
          <div className="group rounded-2xl overflow-hidden border border-white/10 bg-black/40 transition hover:border-white/20">
            <img
              ref={ref1000}
              src={img1000}
              alt={sub1000.name}
              className="w-full h-56 object-cover"
              loading="lazy"
            />
            <div className="p-5">
              <h3 className="text-lg text-white">{sub1000.name}</h3>
              <p className="text-zinc-400 mt-1">{sub1000.description}</p>
              <div className="flex items-center justify-between mt-4">
                <span className="text-amber-300">{sub1000.priceFrom} €/mes</span>
                <button
                  className="btn-primary px-4 py-2 btn-shiny"
                  onClick={() => handleAdd(sub1000, ref1000)}
                >
                  Añadir
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
