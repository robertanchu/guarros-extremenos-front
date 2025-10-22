// src/components/SubscriptionPlans.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  SUBSCRIPTION_GRAMS,
  getPriceFor,
  clampToValidGrams
} from "@/data/subscriptionPricing";

export default function SubscriptionPlans() {
  // Valor por defecto sugerido
  const [selectedGrams, setSelectedGrams] = useState(500);
  const navigate = useNavigate();

  // Precio calculado desde la tabla centralizada
  const price = useMemo(() => getPriceFor(selectedGrams), [selectedGrams]);
  const planOk = price != null;

  // Exponer función global para seleccionar plan desde la comparativa
  useEffect(() => {
    const handler = (grams) => setSelectedGrams(clampToValidGrmsSafe(grams));
    if (typeof window !== "undefined") {
      window.selectPlan = handler;
    }
    return () => {
      if (typeof window !== "undefined" && window.selectPlan === handler) {
        delete window.selectPlan;
      }
    };
  }, []);

  // Wrapper seguro por si llega algo raro
  function clampToValidGrmsSafe(g) {
    try {
      return clampToValidGrams(g);
    } catch {
      return 500;
    }
  }

  // Navegación al checkout de suscripción (conservar funcionalidad)
  function goToSubscriptionCheckout() {
    if (!planOk) return;
    // ✅ Corregido: usar selectedGrams (antes había un typo)
    navigate(`/subscription-checkout?grams=${selectedGrams}`);
  }

  // Formateo de precio (por si getPriceFor devuelve número en euros)
  const priceLabel = useMemo(() => {
    if (price == null) return "—";
    try {
      return Number(price).toLocaleString("es-ES", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      });
    } catch {
      return `${price} €`;
    }
  }, [price]);

  return (
    <div className="mx-auto max-w-4xl">
      {/* Selector de gramos */}
      <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-4 md:p-6">
        <div className="flex justify-center flex-col md:flex-row md:items-end gap-4 md:gap-6">
          <div className="flex-1">
            <label htmlFor="grams" className="block text-sm text-zinc-400 mb-2">
              Cantidad mensual (gramos)
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {SUBSCRIPTION_GRAMS.map((g) => {
                const active = selectedGrams === g;
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setSelectedGrams(g)}
                    className={[
                      "h-10 rounded-xl border text-sm font-semibold transition-all",
                      active
                        ? "border-brand/70 bg-brand text-white shadow-[0_8px_22px_rgba(214,40,40,.35)]"
                        : "border-white/10 bg-zinc-900 text-zinc-200 hover:border-brand/40 hover:bg-zinc-950"
                    ].join(" ")}
                    aria-pressed={active}
                    aria-label={`Seleccionar ${g} gramos`}
                  >
                    {g} g
                  </button>
                );
              })}
            </div>
          </div>

          <div className="w-full md:w-64">
            <div className="text-sm text-zinc-400 mb-1">Precio</div>
            <div className="text-3xl font-extrabold text-brand">
              {planOk ? `${priceLabel}/mes` : "—"}
            </div>
            <div className="text-xs text-zinc-500">
              IVA y envío incluidos
            </div>
          </div>
        </div>

        <div className="mt-5 md:mt-6 flex justify-center">
          {/* Botón rojo canalla (igual que “Ver Jamones” del Hero) + funcionalidades conservadas */}
          <button
            type="button"
            onClick={goToSubscriptionCheckout}
            disabled={!planOk}
            className="group relative inline-flex items-center justify-center rounded-xl px-6 py-3 text-base font-stencil tracking-wide text-black bg-[#E53935] transition-colors duration-200 shadow-lg hover:bg-[#992623] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed w-full md:w-auto"
            aria-label="Continuar al formulario"
          >
            <span className="relative z-10">Suscribirme</span>
            <span className="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-[#E53935]/50 group-hover:ring-[#992623]/50 transition-all" />
          </button>
        </div>
      </div>
    </div>
  );
}
