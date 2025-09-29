import React from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "@/store/cart";
import { useUI } from "@/store/ui";

// NOTA: adapta esta función a tu fuente real de productos
// Aquí simplemente busca en window.__PRODUCTS__ o en una lista pasada por props/context.
function useProductBySlug(slug){
  const list = (window.__PRODUCTS__ ?? []).concat(window.__JAMONES__ ?? []);
  return list.find(p => p.slug === slug) || null;
}

export default function Producto(){
  const { slug } = useParams();
  const producto = useProductBySlug(slug);
  const { addItem } = useCart();
  const { openCart } = useUI();

  if(!producto){
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-white">
        <p className="text-white/80 mb-6">Producto no encontrado.</p>
        <Link to="/jamones" className="inline-block rounded-xl border border-white/20 px-4 py-2 hover:bg-white/10">
          ← Volver a jamones
        </Link>
      </div>
    );
  }

  const handleAdd = () => {
    addItem({
      id: producto.id ?? producto.slug,
      name: producto.name ?? producto.title ?? slug,
      price: Number(producto.price ?? 0),
      qty: 1,
      image: producto.image ?? producto.cover ?? null,
      type: "product",
    });
    openCart();
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-12 text-white">
      <nav className="text-sm text-white/60 mb-6">
        <Link to="/" className="hover:text-white/90">Inicio</Link>
        <span className="mx-2">/</span>
        <Link to="/jamones" className="hover:text-white/90">Jamones</Link>
        <span className="mx-2">/</span>
        <span className="text-white/90">{producto.name ?? producto.title ?? slug}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="rounded-2xl overflow-hidden border border-white/10 aspect-square bg-white/5" />
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold mb-3">
            {producto.name ?? producto.title ?? slug}
          </h1>
          {producto.subtitle && (
            <p className="text-white/70 mb-3">{producto.subtitle}</p>
          )}
          <p className="text-2xl font-bold mb-6">
            {Number(producto.price ?? 0).toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={handleAdd}
              className="rounded-xl bg-white text-black hover:bg-white/90 font-medium px-5 py-3"
            >
              Añadir al carrito
            </button>
            <Link to="/jamones" className="rounded-xl border border-white/20 hover:bg-white/10 px-5 py-3">
              Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
