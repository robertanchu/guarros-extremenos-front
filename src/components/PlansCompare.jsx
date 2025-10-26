// src/components/PlansCompare.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  SUBSCRIPTION_PRICE_TABLE,
} from "@/data/subscriptionPricing";

const BADGES = {
  500: "Más popular",
  2000: "Mejor valor",
};

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: "easeOut" },
  viewport: { once: true, amount: 0.2 }
};

function onChoosePlan(grams) {
  try {
    if (typeof window !== "undefined") {
      window.selectPlan?.(grams);
      document.querySelector("#plans-root")?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  } catch (_) {}
}

export default function PlansCompare() {
  return (
    // He quitado el <section> que sobraba para que se ajuste al div de la página
    <div className="max-w-6xl mx-auto px-4">
      {/* El título se ha movido a Suscripcion.jsx
      <motion.div {...fadeUp} className="text-center mb-6 md:mb-8">
        ...
      </motion.div>
      */}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
        {SUBSCRIPTION_PRICE_TABLE.map((p, i) => (
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
            {/* ----- INSIGNIA MODIFICADA ----- */}
            {BADGES[p.g] && (
              <div className="absolute -top-2 right-3">
                <span className="inline-flex items-center rounded-full bg-zinc-700 text-zinc-200 text-[11px] font-bold px-2.5 py-1">
                  {BADGES[p.g]}
                </span>
              </div>
            )}
            {/* ------------------------------- */}

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

            {/* ----- BOTÓN MODIFICADO ----- */}
            <button
              type="button"
              onClick={() => onChoosePlan(p.g)}
              className={[
                "mt-5 w-full",
                "relative inline-flex items-center justify-center",
                "rounded-xl px-4 py-2.5",
                "text-sm font-black tracking-wide uppercase", // Texto más pequeño
                "border border-zinc-600 text-zinc-300", // Estilo "outline"
                "transition-all",
                "hover:bg-brand hover:text-white hover:border-brand hover:shadow-[0_12px_28px_rgba(214,40,40,.45)]", // Efecto en hover
                "active:translate-y-[0px] active:scale-[0.98]"
              ].join(" ")}
              aria-label={`Elegir plan de ${p.g} gramos`}
            >
              Elegir
            </button>
            {/* -------------------------- */}

            <div
              className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
              style={{
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,.04), 0 30px 80px rgba(214,40,40,.20)"
              }}
            />
          </motion.article>
        ))}
      </div>

      <motion.p {...fadeUp} className="text-center text-zinc-400 text-sm mt-6">
        Los importes mostrados son finales (IVA y envío incluidos). Gestiona tu suscripción cuando quieras desde el email de confirmación.
      </motion.p>
    </div>
  );
}