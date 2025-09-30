import React, { useEffect } from "react";
import Meta from "../lib/Meta";
import FAQ from "@/components/FAQ";
import "@/styles/effects.css";
import { useCart } from "@/store/cart";
import { useUI } from "@/store/ui";
import { isSubscription } from "@/lib/subscription";

const PLANS = [
  {
    slug: "sub-500",
    name: "Suscripción 500 g / mes",
    desc: "Cada mes, 500 gramos de jamón ibérico 100% bellota D.O.P. cortado, en sobres listos para disfrutar.",
    priceText: "40 €/mes",
    price: 40,
    priceId: import.meta.env.VITE_SUB_500_PRICE_ID || "price_sub_500",
    isSubscription: true,
    kind: "subscription",
  },
  {
    slug: "sub-1000",
    name: "Suscripción 1 kg / mes",
    desc: "Para los muy guarros: 1 kilo al mes, sobres al vacío, corte fino y listo para volar de la tabla.",
    priceText: "70 €/mes",
    price: 70,
    priceId: import.meta.env.VITE_SUB_1000_PRICE_ID || "price_sub_1000",
    isSubscription: true,
    kind: "subscription",
  },
];

const BENEFITS = [
  "Pausa o cambia cuando quieras",
  "Corte fino, sobres al vacío",
  "100% Ibérico D.O.P Dehesa de Extremadura",
];

const FAQS = [
  { q: "¿Hay compromiso de permanencia?", a: "No. Puedes pausar o cancelar cuando quieras desde tu cuenta o escribiéndonos." },
  { q: "¿Los sobres son al vacío?", a: "Sí, para preservar sabor y textura. Abre y sirve." },
  { q: "¿Puedo cambiar de plan más adelante?", a: "Claro, cambia de 500 g a 1 kg o al revés en un clic." },
];

export default function Suscripcion(){
  const { items, addItem } = useCart();
  const openCart = () => useUI.getState().openCart();
  const hasSubscription = items.some(isSubscription);

  const handleSubscribe = (p) => {
    if (hasSubscription) return openCart();
    addItem({ ...p, qty: 1, kind: "subscription", isSubscription: true });
    openCart();
  };

  // reveal on mount
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const root = document.getElementById('plans-grid');
    if (!root) return;
    const els = Array.from(root.querySelectorAll('[data-reveal]'));
    els.forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = (Math.min(i, 6) * 60) + 'ms';
    });
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('revealed');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.2 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <main className="shell py-10 md:py-12">
      <Meta title="Suscripción Jamón Canalla | Guarros Extremeños" description="Tu jamón favorito en suscripción mensual, sin ataduras." />
      <header className="mb-6 md:mb-10 text-center">
        <p className="text-amber-300 tracking-wide text-sm">Guarros Extremeños Club</p>
        <h1 className="mt-2 text-3xl md:text-5xl font-stencil text-brand">Suscripción Jamón Canalla</h1>
        <p className="mt-4 text-zinc-300 max-w-3xl mx-auto">
          El sabor que manda, cada mes en tu casa. Sin postureo, sin esperas y con la pureza del 100% ibérico D.O.P Dehesa de Extremadura.
        </p>
      </header>

      {/* Plans */}
      <section id="plans-grid" className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {PLANS.map((p, idx) => (
          <article key={p.slug} data-reveal className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-7 flex flex-col">
            <div className="flex-1">
              <h3 className="text-2xl font-stencil text-white">{p.name}</h3>
              <p className="mt-2 text-zinc-300">{p.desc}</p>
              <div className="mt-4 text-2xl text-brand font-semibold">{p.priceText}</div>
              <ul className="mt-4 space-y-2 text-white/85 text-sm">
                {BENEFITS.map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <svg className="mt-[3px] h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.42l-8 8a1 1 0 01-1.408 0l-4-4a1 1 0 111.408-1.42L8 12.58l7.296-7.29a1 1 0 011.408 0z" clipRule="evenodd"/>
                    </svg>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6">
              {hasSubscription ? (
                <button type="button" className="w-full btn-secondary" onClick={openCart} aria-label="Ver carrito">
                  Ya tienes una suscripción — Ver carrito
                </button>
              ) : (
                <button type="button" className="w-full btn-primary btn-shiny" onClick={() => handleSubscribe(p)} aria-label="Añadir suscripción al carrito">
                  Suscribirme
                </button>
              )}
            </div>
          </article>
        ))}
      </section>

      {/* FAQ */}
      <section className="mt-12 md:mt-16">
        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">Preguntas frecuentes</h2>
        <FAQ items={FAQS} />
      </section>
    </main>
  );
}
