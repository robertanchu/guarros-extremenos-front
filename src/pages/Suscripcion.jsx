// src/pages/Suscripcion.jsx
import React from "react"; // 'useEffect' ya no es necesario aquí
import Meta from "../lib/Meta";
import FAQ from "@/components/FAQ";
// import SubscriptionPlans from "@/components/SubscriptionPlans"; // ELIMINADO
import PlansCompare from "@/components/PlansCompare";
import "@/styles/effects.css";

import { useCart } from "@/store/cart";
import { useUI } from "@/store/ui";
import { isSubscription } from "@/lib/subscription";

const FAQS = [
  { q: "¿Hay compromiso de permanencia?", a: "No. Puedes pausar o cancelar cuando quieras desde tu cuenta o escribiéndonos." },
  { q: "¿Los sobres son al vacío?", a: "Sí, para preservar sabor y textura. Abre y sirve." },
  { q: "¿Puedo cambiar de plan más adelante?", a: "Claro, puedes subir o bajar de gramos cuando quieras." },
];

export default function Suscripcion() {
  const { items } = useCart();
  const openCart = () => useUI.getState().openCart();
  const hasSubscription = items.some(isSubscription);

  // 'useEffect' para las animaciones de 'plans-root' ha sido ELIMINADO
  // porque el componente 'SubscriptionPlans' ya no existe.
  // Las animaciones de 'PlansCompare' (motion) son independientes.

  return (
    <main className="shell py-12 md:py-16">
      <Meta
        title="Suscripción Jamón Canalla | Guarros Extremeños"
        description="Tu jamón favorito en suscripción mensual, sin ataduras."
      />

      {/* Cabecera */}
      <header className="mb-8 md:mb-12">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h1 className="text-3xl md:text-5xl font-stencil text-brand">Suscripción Jamón Canalla</h1>
          <p className="mt-4 text-zinc-300">
            El sabor que manda, cada mes en tu casa. Sin postureo, sin esperas y con la pureza del 100% ibérico D.O.P Dehesa de Extremadura.
          </p>
        </div>
      </header>

      {/* Aviso si ya hay suscripción en el carrito */}
      {hasSubscription && (
        <div className="max-w-4xl mx-auto px-4 mb-8">
          <div className="alert">
            <div className="flex items-start gap-3">
              <div className="shrink-0 mt-0.5">
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.75-11.5a.75.75 0 011.5 0V9a.75.75 0 01-1.5 0V6.5zm.75 6a1 1 0 100 2 1 1 0 000-2z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <div className="alert-title">Ya tienes una suscripción en el carrito</div>
                <div className="alert-desc">Solo puede haber una por carrito. Puedes cambiar de plan eliminando la actual.</div>
              </div>
              <div>
                <button type="button" onClick={openCart} className="btn-secondary" aria-label="Ver carrito">
                  Ver carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comparativa de planes (ahora es la acción principal) */}
      <PlansCompare />

      {/* ELIMINADO el <section id="plans-root"> ... </section> */}

      {/* FAQ */}
      <section className="mt-16 md:mt-24"> {/* 'data-reveal' quitado, ya que el 'useEffect' se ha ido */}
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 text-center md:text-left">
            Preguntas frecuentes
          </h2>
          <FAQ items={FAQS} />
        </div>
      </section>
    </main>
  );
}