import React, { useMemo, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { PRODUCTS } from "@/data/products";
import { MEDIA } from "@/data/media";
import { useCart } from "@/store/cart";
import { useUI } from "@/store/ui";

export default function Producto(){
  const { slug } = useParams();
  const add = useCart(s => s.addItem);
  const imgRef = useRef(null);

  const product = useMemo(() => PRODUCTS.find(p => p.slug === slug), [slug]);

  useEffect(() => {
    // Si usas GA4/GTM se lanza sin romper si no existe
    try {
      if (product && window.gtag) {
        window.gtag("event","view_item",{items:[{item_id:product.id,item_name:product.name,price:product.priceFrom}]});
      } else if (product && window.dataLayer) {
        window.dataLayer.push({event:"view_item",items:[{item_id:product.id,item_name:product.name,price:product.priceFrom}]});
      }
    } catch {}
  }, [product]);

  if (!product) {
    return (
      <div className="container py-14">
        <h1 className="text-white text-2xl">Producto no encontrado</h1>
        <Link to="/jamones" className="mt-4 inline-block btn-secondary">Volver al catálogo</Link>
      </div>
    );
  }

  const heroImg =
    (MEDIA?.products && MEDIA.products[product.id]) ||
    (MEDIA?.og && MEDIA.og.jamones);

  // --- Efectos locales (sin tocar otros archivos) ---
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
        transition:
          "transform .7s cubic-bezier(.22,.61,.36,1), opacity .7s",
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
    try {
      // sólo si tu store tiene pulseCart
      useUI.getState().pulseCart?.();
    } catch {}
  };

  const handleAdd = () => {
    // Animaciones
    flyToCart(imgRef.current);
    pulseCart();

    // Añadir al carrito (sin cambios en estructura)
    add({
      id: product.id,
      name: product.name,
      priceId: product.priceId,
      price: product.priceFrom,
      qty: 1,
    });

    // Analytics seguro (opcional)
    try {
      if (window.gtag) {
        window.gtag("event","add_to_cart",{
          items:[{item_id:product.id,item_name:product.name,price:product.priceFrom,quantity:1}]
        });
      } else if (window.dataLayer) {
        window.dataLayer.push({
          event:"add_to_cart",
          items:[{item_id:product.id,item_name:product.name,price:product.priceFrom,quantity:1}]
        });
      }
    } catch {}
  };

  return (
    <div className="container py-10">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <img
            ref={imgRef}
            src={heroImg}
            alt={product.name}
            className="w-full h-96 md:h-[520px] object-cover rounded-2xl border border-white/10"
          />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl text-white font-stencil">
            {product.name}
          </h1>
          <p className="mt-3 text-zinc-300">
            {product.longDescription || product.description}
          </p>

          <div className="mt-6 text-amber-300 text-xl">
            {product.type === "recurring"
              ? `${product.priceFrom} €/mes`
              : `${product.priceFrom} €`}
          </div>

          <button className="mt-6 btn-primary btn-shiny" onClick={handleAdd}>
            Añadir al carrito
          </button>

          <div className="mt-8 text-sm text-zinc-400 space-y-2">
            <p>• D.O.P. Dehesa de Extremadura</p>
            <p>• Curación lenta · Selección de bellota</p>
            <p>• Envío 24/48h · Pago 100% seguro</p>
          </div>
        </div>
      </div>
    </div>
  );
}
