// src/pages/Suscripcion.jsx
import React from "react";
import { useCart } from "@/store/cart";
import { useUI } from "@/store/ui";
import { isSubscription } from "@/lib/subscription";

// Planes (usa tus Price IDs reales o variables de entorno)
const PLANS = [
  {
    slug: "sub-500",
    name: "Suscripción 500 g / mes",
    desc: "Cada mes, 500 gramos de jamón ibérico 100% bellota D.O.P. cortado, en sobres listos para disfrutar.",
    priceText: "40 €/mes",
    price: 40,
    priceId: import.meta.env.VITE_SUB_500_PRICE_ID || "price_1SBNszRPLp0YiQTHO3EGpjcv",
    isSubscription: true,
    kind: "subscription",
  },
  {
    slug: "sub-1000",
    name: "Suscripción 1 kg / mes",
    desc: "Para los muy guarros: 1 kilo al mes, sobres al vacío, corte fino y listo para volar de la tabla.",
    priceText: "70 €/mes",
    price: 70,
    priceId: import.meta.env.VITE_SUB_1000_PRICE_ID || "price_1SBNtdRPLp0YiQTHrhnTXCr7",
    isSubscription: true,
    kind: "subscription",
  },
];

export default function Suscripcion(){
  const { items, addItem } = useCart();
  const openCart = () => useUI.getState().openCart();

  const hasSubscription = items.some(isSubscription);

  const handleSubscribe = (p) => {
    if (hasSubscription) {
      openCart();
      return;
    }
    addItem({
      ...p,
      qty: 1,
      kind: "subscription",
      isSubscription: true,
    });
    openCart();
  };

  return (
    <main className="shell py-10 md:py-12">
      <header className="mb-6 md:mb-8 text-center">
        <p className="text-amber-300 tracking-wide text-sm">Guarros Extremeños Club</p>
        <h1 className="mt-2 text-3xl md:text-5xl font-stencil text-white">Suscripción Jamón Canalla</h1>
        <p className="mt-4 text-zinc-300 max-w-3xl mx-auto">
          El sabor que manda, cada mes en tu casa. Sin postureo, sin esperas y con la pureza del 100% ibérico D.O.P Dehesa de Extremadura.
        </p>
      </header>

      {/* Banner si ya hay suscripción en carrito */}
      {hasSubscription && (
        <div className="mb-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-300 p-4">
          <div className="font-semibold">Ya tienes una suscripción en el carrito.</div>
          <div className="text-sm opacity-90">Solo puede haber una por carrito. Puedes cambiar de plan eliminando la actual.</div>
          <div className="mt-3">
            <button
              type="button"
              onClick={openCart}
              className="btn-secondary"
              aria-label="Ver carrito"
            >
              Ver carrito
            </button>
          </div>
        </div>
      )}

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {PLANS.map((p) => (
          <article key={p.slug} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-7 flex flex-col">
            <div className="flex-1">
              <h3 className="text-2xl font-stencil text-white">{p.name}</h3>
              <p className="mt-2 text-zinc-300">{p.desc}</p>
              <div className="mt-4 text-2xl text-brand font-semibold">{p.priceText}</div>
            </div>

            <div className="mt-6">
              {hasSubscription ? (
                <button
                  type="button"
                  className="w-full btn-secondary"
                  onClick={openCart}
                  aria-label="Ver carrito"
                  title="Ya tienes una suscripción en el carrito"
                >
                  Ya tienes una suscripción — Ver carrito
                </button>
              ) : (
                <button
                  type="button"
                  className="w-full btn-primary btn-shiny"
                  onClick={() => handleSubscribe(p)}
                  aria-label="Añadir suscripción al carrito"
                >
                  Suscribirme
                </button>
              )}
            </div>
          </article>
        ))}
      </section>

      <section className="mt-12 md:mt-16 grid md:grid-cols-3 gap-6 text-zinc-300">
        <div className="rounded-2xl border border-white/10 p-5 bg-white/[0.03]">
          <h4 className="text-white font-semibold">Pausa o cambia cuando quieras</h4>
          <p className="mt-2 text-sm">Sin ataduras. Gestiona tu suscripción con un solo click.</p>
        </div>
        <div className="rounded-2xl border border-white/10 p-5 bg-white/[0.03]">
          <h4 className="text-white font-semibold">Corte perfecto</h4>
          <p className="mt-2 text-sm">Loncheado fino, sobres al vacío y el punto de curación que nos hace canallas.</p>
        </div>
        <div className="rounded-2xl border border-white/10 p-5 bg-white/[0.03]">
          <h4 className="text-white font-semibold">D.O.P Dehesa de Extremadura</h4>
          <p className="mt-2 text-sm">Garantía de origen y de bellota. Tan guarros que sólo comen bellotas.</p>
        </div>
      </section>
    </main>
  );
}
