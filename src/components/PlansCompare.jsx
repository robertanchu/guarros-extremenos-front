// src/components/PlansCompare.jsx
import React from "react";
import { motion } from "framer-motion";

const BRAND = "Guarros Extremeños";

// Tabla oficial de tramos y precios (€/mes)
const PLAN_PRICES = [
  { g: 100,  price: 46 },
  { g: 200,  price: 58 },
  { g: 300,  price: 69 },
  { g: 400,  price: 80 },
  { g: 500,  price: 91,  badge: "Más popular" },
  { g: 600,  price: 103 },
  { g: 700,  price: 114 },
  { g: 800,  price: 125 },
  { g: 900,  price: 136 },
  { g: 1000, price: 148 },
  { g: 1500, price: 204 },
  { g: 2000, price: 260, badge: "Mejor valor" }
];

// Animaciones
const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: "easeOut" },
  viewport: { once: true, amount: 0.2 }
};

function onChoosePlan(grams) {
  // Si el selector expone una API global, úsala
  try {
    if (typeof window !== "undefined") {
      window.selectPlan?.(grams);
      const el = document.querySelector("#plans-root");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  } catch (_) {}
}

export default function PlansCompare() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-6 md:py-8">
      <motion.div
        {...fadeUp}
        className="text-center mb-6 md:mb-8"
      >
        <h2 className="text-2xl md:text-3xl font-stencil text-brand">
          Elige tu dosis canalla
        </h2>
        <p className="text-zinc-300 mt-2">
          Tramos cerrados de 100 g a 2000 g. Precios finales, envío incluido. Sin permanencia.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
        {PLAN_PRICES.map((p, i) => (
          <motion.article
            key={p.g}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.35, delay: Math.min(i, 8) * 0.03 }}
            className={[
              "group relative rounded-2xl border border-white/10 bg-zinc-900/60",
              "p-4 md:p-5 flex flex-col items-center text-center",
              "shadow-[0_10px_30px_rgba(0,0,0,.25)]",
              "hover:border-brand/60 hover:bg-black/70 hover:shadow-[0_14px_40px_rgba(214,40,40,.25)]",
              "transition-all"
            ].join(" ")}
          >
            {/* Badge */}
            {p.badge && (
              <div className="absolute -top-2 right-3">
                <span className="inline-flex items-center rounded-full bg-brand text-white text-[11px] font-bold px-2.5 py-1 shadow-[0_6px_18px_rgba(214,40,40,.45)]">
                  {p.badge}
                </span>
              </div>
            )}

            <div className="mt-1">
              <div className="text-sm uppercase tracking-wide text-zinc-400">Suscripción</div>
              <h3 className="mt-1 text-2xl md:text-3xl font-stencil text-white">
                {p.g} g/mes
              </h3>
            </div>

            <div className="mt-3 md:mt-4">
              <div className="text-[13px] text-zinc-400">Desde</div>
              <div className="text-2xl md:text-3xl font-extrabold text-brand">
                {p.price} €/mes
              </div>
            </div>

            <ul className="mt-4 md:mt-5 text-sm text-zinc-300 space-y-1.5">
              <li>✔ Corte a cuchillo al vacío</li>
              <li>✔ Envío mensual incluido</li>
              <li>✔ Sin permanencia</li>
            </ul>

            <button
              type="button"
              onClick={() => onChoosePlan(p.g)}
              className={[
                "mt-5 w-full",
                "relative inline-flex items-center justify-center",
                "rounded-xl px-4 py-2.5",
                "font-black tracking-wide uppercase",
                // estilo “canalla” (como tus CTAs rojos)
                "bg-brand text-white",
                "shadow-[0_8px_22px_rgba(214,40,40,.35)]",
                "ring-1 ring-brand/30",
                "transition-all",
                "hover:translate-y-[-1px] hover:shadow-[0_12px_28px_rgba(214,40,40,.45)]",
                "active:translate-y-[0px] active:shadow-[0_6px_16px_rgba(214,40,40,.35)]"
              ].join(" ")}
              aria-label={`Elegir plan de ${p.g} gramos`}
            >
              Elegir este plan
            </button>

            {/* Glow al pasar el ratón */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                 style={{
                   boxShadow: "inset 0 0 0 1px rgba(255,255,255,.04), 0 0 0 0 rgba(214,40,40,.0), 0 30px 80px rgba(214,40,40,.20)"
                 }}
            />
          </motion.article>
        ))}
      </div>

      <motion.p
        {...fadeUp}
        className="text-center text-zinc-400 text-sm mt-6"
      >
        Los importes mostrados son finales (IVA y envío incluidos). Gestiona tu suscripción cuando quieras desde tu email.
      </motion.p>
    </section>
  );
}
