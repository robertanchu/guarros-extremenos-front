import React, { useMemo, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { PRODUCTS } from "@/data/products";
import { MEDIA } from "@/data/media";
import { useCart } from "@/store/cart";

export default function Producto(){
  const { slug } = useParams();
  const add = useCart(s => s.addItem);

  // Buscar el producto por slug (seguro)
  const product = useMemo(() => PRODUCTS.find(p => p.slug === slug), [slug]);

  // (Opcional) Si tienes analytics, podrías dejar aquí tu useEffect de view_item
  // useEffect(() => { if (product) gaViewItem(product); }, [product]);

  // Si no hay producto, no rompemos la página
  if (!product) {
    return (
      <div className="container py-14">
        <h1 className="text-white text-2xl">Producto no encontrado</h1>
        <Link to="/jamones" className="mt-4 inline-block btn-secondary">Volver al catálogo</Link>
      </div>
    );
  }

  // Fallback de imagen: intenta products[id] y luego og.jamones
  const heroImg =
    (MEDIA?.products && MEDIA.products[product.id]) ||
    (MEDIA?.og && MEDIA.og.jamones);

  const handleAdd = () => {
    add({
      id: product.id,
      name: product.name,
      priceId: product.priceId,
      price: product.priceFrom,
      qty: 1,
    });
  };

  return (
    <div className="container py-10">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <img
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
