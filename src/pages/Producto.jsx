import React, { useMemo } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { useCart } from "@/store/cart";
import { useUI } from "@/store/ui";

function tryParseJSON(value){
  try { return JSON.parse(value); } catch { return null; }
}

function useProduct(slug, location){
  const fromState = location?.state?.product || location?.state?.item || null;
  if (fromState && (fromState.slug === slug || String(fromState.id) === String(slug))) return fromState;

  const pools = [
    (typeof window !== "undefined" && (window.__PRODUCTS__ || [])) || [],
    (typeof window !== "undefined" && (window.__JAMONES__ || [])) || [],
  ];
  for (const arr of pools){
    const found = Array.isArray(arr) ? arr.find(p => p?.slug === slug || String(p?.id) === String(slug)) : null;
    if (found) return found;
  }

  if (typeof window !== "undefined"){
    const lsKeys = ["products", "jamones", "catalog"];
    for (const k of lsKeys){
      const data = tryParseJSON(localStorage.getItem(k));
      if (Array.isArray(data)){
        const found = data.find(p => p?.slug === slug || String(p?.id) === String(slug));
        if (found) return found;
      }
    }
  }

  return { slug, name: slug.replace(/-/g, " "), price: 0, __stub: true };
}

export default function Producto(){
  const { slug } = useParams();
  const location = useLocation();
  const producto = useMemo(() => useProduct(slug, location), [slug, location]);
  const { addItem } = useCart();
  const { openCart } = useUI();

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
    <section className="max-w-6xl mx-auto px-4 py-12 text-white" style={{ maxWidth: "72rem", margin: "0 auto", padding: "3rem 1rem", color: "#fff" }}>
      <nav className="text-sm text-white/60 mb-6" style={{ color: "rgba(255,255,255,0.6)", marginBottom: "1.5rem" }}>
        <Link to="/" className="hover:text-white/90" style={{ color: "inherit" }}>Inicio</Link>
        <span className="mx-2"> / </span>
        <Link to="/jamones" className="hover:text-white/90" style={{ color: "inherit" }}>Jamones</Link>
        <span className="mx-2"> / </span>
        <span className="text-white/90" style={{ color: "rgba(255,255,255,0.9)" }}>{producto.name ?? producto.title ?? slug}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }}>
        <div className="rounded-2xl overflow-hidden border border-white/10 aspect-square bg-white/5"
             style={{ borderRadius: "1rem", overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)", aspectRatio: "1 / 1", background: "rgba(255,255,255,0.05)" }} />
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold mb-3" style={{ fontSize: "2rem", fontWeight: 600, marginBottom: "0.75rem" }}>
            {producto.name ?? producto.title ?? slug}
          </h1>
          {producto.subtitle && (
            <p className="text-white/70 mb-3" style={{ color: "rgba(255,255,255,0.7)", marginBottom: "0.75rem" }}>{producto.subtitle}</p>
          )}
          <p className="text-2xl font-bold mb-6" style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem" }}>
            {Number(producto.price ?? 0).toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
          </p>
          <div className="flex items-center gap-3" style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <button
              onClick={handleAdd}
              className="rounded-xl bg-white text-black hover:bg-white/90 font-medium px-5 py-3"
              style={{ borderRadius: "0.75rem", background: "#fff", color: "#000", fontWeight: 500, padding: "0.75rem 1.25rem" }}
            >
              Añadir al carrito
            </button>
            <Link to="/jamones" className="rounded-xl border border-white/20 hover:bg-white/10 px-5 py-3"
                  style={{ borderRadius: "0.75rem", border: "1px solid rgba(255,255,255,0.2)", padding: "0.75rem 1.25rem", color: "#fff" }}>
              Seguir comprando
            </Link>
          </div>
          {producto.__stub && (
            <p className="mt-4 text-white/60" style={{ marginTop: "1rem", color: "rgba(255,255,255,0.6)" }}>
              Nota: no encontramos datos del producto en memoria. Lo ideal es navegar desde la lista de Jamones o pasar el producto en el estado del enlace.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
