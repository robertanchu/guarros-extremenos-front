import React, { useEffect } from "react";
import Meta from "../lib/Meta";
import FAQ from "@/components/FAQ";
import "@/styles/effects.css";
import { useCart } from "@/store/cart";
import { useUI } from "@/store/ui";
import { isSubscription } from "@/lib/subscription";
import { useNavigate } from "react-router-dom";

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

export default function Suscripcion() {
  const { items } = useCart();
  const openCart = () => useUI.getState().openCart();
  const hasSubscription = items.some(isSubscription);
  const navigate = useNavigate();

  // SOLO navegamos al formulario con el plan elegido
  const handleSubscribe = (plan) => {
    if (hasSubscription) return openCart();
    navigate(`/suscripcion/checkout?plan=${encodeURIComponent(plan.priceId)}`);
  };

  // Efecto reveal igual que antes
  useEffect(() => {
    const root = document.getElementById("plans-grid");
    if (!root) return;
    const els = Array.from(root.querySelectorAll("[data-reveal]"));
    els.forEach((el, i) => {
      el.classList.add("reveal");
      el.classList.remove("revealed");
      el.style.transitionDelay = (Math.min(i, 8) * 60) + "ms";
    });
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach((el) => el.classList.add("revealed"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("revealed");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Efecto hover glow de las tarjetas
  const handleCardMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--lx", x + "px");
    card.style.setProperty("--ly", y + "px");
  };
  const handleCardLeave = (e) => {
    const card = e.currentTarget;
    card.style.removeProperty("--lx");
    card.style.removeProperty("--ly");
  };

  return (
    <main className="shell py-12 md:py-16">
      <Meta title="Suscripción Jamón Canalla | Guarros Extremeños" description="Tu jamón favorito en suscripción mensual, sin ataduras." />

      {/* Cabecera */}
      <header className="mb-8 md:mb-12">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h1 className="text-3xl md:text-5xl font-stencil text-brand">Suscripción Jamón Canalla</h1>
          <p className="mt-4 text-zinc-300">
            El sabor que manda, cada mes en tu casa. Sin postureo, sin esperas y con la pureza del 100% ibérico D.O.P Dehesa de Extremadura.
          </p>
        </div>
      </header>

      {/* Aviso si ya hay suscripción */}
      {hasSubscription && (
        <div className="max-w-4xl mx-auto px-4 mb-8">
          <div className="alert">
            <div className="flex items-start gap-3">
              <div className="shrink-0 mt-0.5">
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.75-11.5a.75.75 0 011.5 0V9a.75.75 0 01-1.5 0V6.5zm.75 6a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="alert-title">Ya tienes una suscripción en el carrito</div>
                <div className="alert-desc">Solo puede haber una por carrito. Puedes cambiar de plan eliminando la actual.</div>
              </div>
              <div>
                <button type="button" onClick={openCart} className="btn-secondary" aria-label="Ver carrito">Ver carrito</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Planes */}
      <section className="max-w-6xl mx-auto px-4">
        <div id="plans-grid" className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          {PLANS.map((p) => (
            <article
              key={p.slug}
              data-reveal
              className="relative rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-7 flex flex-col card-hover"
              onMouseMove={handleCardMove}
              onMouseLeave={handleCardLeave}
            >
              <div className="card-glow" aria-hidden="true"></div>
              <div className="flex-1">
                <h3 className="text-2xl font-stencil text-white">{p.name}</h3>
                <p className="mt-2 text-zinc-300">{p.desc}</p>
                <div className="mt-4 text-2xl text-brand font-semibold">{p.priceText}</div>
                <ul className="mt-4 space-y-2 text-white/85 text-sm">
                  {BENEFITS.map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <svg className="mt-[3px] h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.42l-8 8a1 1 0 01-1.408 0l-4-4a1 1 0 111.408-1.42L8 12.58l7.296-7.29a1 1 0 011.408 0z" clipRule="evenodd" />
                      </svg>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6">
                {hasSubscription ? (
                  <div className="rounded-xl border border-brand/30 bg-brand/10 text-brand-200 px-4 py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.42l-8 8a1 1 0 01-1.408 0l-4-4a1 1 0 111.408-1.42L8 12.58l7.296-7.29a1 1 0 011.408 0z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">Suscripción en el carrito</span>
                    </div>
                    <button
                      type="button"
                      onClick={openCart}
                      className="inline-flex items-center justify-center h-9 px-3 rounded-lg border border-brand/40 text-brand-100 hover:bg-brand/20 transition-colors"
                    >
                      Ver carrito
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="w-full btn-primary btn-shiny"
                    onClick={() => handleSubscribe(p)}
                    aria-label="Suscribirme"
                  >
                    Suscribirme
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-16 md:mt-24">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 text-center md:text-left">Preguntas frecuentes</h2>
          <FAQ items={FAQS} />
        </div>
      </section>
    </main>
  );
}
