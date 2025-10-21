// src/components/SubscriptionPlans.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  SUBSCRIPTION_GRAMS,
  getPriceFor,
  clampToValidGrams
} from "@/data/subscriptionPricing";

// ==== RESOLUCIÓN ROBUSTA DE API_BASE ====
// 1) .env de Vite
// 2) variable global inyectable window.__API_BASE__ (por si la quieres setear en index.html)
// 3) Deducción por dominio (si estás en guarrosextremenos.com, usa onrender)
function resolveApiBase() {
  const env = import.meta.env?.VITE_API_BASE;
  if (env) return env.replace(/\/+$/, "");

  if (typeof window !== "undefined") {
    if (window.__API_BASE__) return String(window.__API_BASE__).replace(/\/+$/, "");

    const host = window.location.hostname;
    // Producción principal
    if (host.endsWith("guarrosextremenos.com")) {
      return "https://guarros-extremenos-api.onrender.com";
    }
    // Vercel preview fallback (si usas front vercel y backend onrender)
    if (host.endsWith("vercel.app")) {
      return "https://guarros-extremenos-api.onrender.com";
    }
    // Desarrollo local
    if (host === "localhost" || host === "127.0.0.1") {
      return "http://localhost:10000";
    }
  }
  // Último recurso (evita "undefined/create-…")
  return "https://guarros-extremenos-api.onrender.com";
}

const API_BASE = resolveApiBase();

export default function SubscriptionPlans() {
  const [selectedGrams, setSelectedGrams] = useState(500); // default sugerido
  const price = useMemo(() => getPriceFor(selectedGrams), [selectedGrams]);
  const planOk = price != null;

  const [loading, setLoading] = useState(false);

  // Exponer API global para preseleccionar plan desde la comparativa
  useEffect(() => {
    const handler = (grams) => setSelectedGrams(clampToValidGrams(grams));
    if (typeof window !== "undefined") {
      window.selectPlan = handler;
    }
    return () => {
      if (typeof window !== "undefined" && window.selectPlan === handler) {
        delete window.selectPlan;
      }
    };
  }, []);

  async function startSubscriptionCheckout(e) {
    e?.preventDefault?.();
    if (!planOk || loading) return;

    setLoading(true);
    try {
      const url = `${API_BASE}/create-subscription-session`;
      const payload = { grams: selectedGrams };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "omit", // el backend ya maneja CORS
        body: JSON.stringify(payload)
      });

      // Intenta leer JSON; si falla, lee texto crudo para debug
      let data;
      try {
        data = await res.json();
      } catch {
        const raw = await res.text();
        console.error("[subscription] Respuesta no-JSON:", raw);
        data = { error: raw || "Respuesta no válida del servidor." };
      }

      if (!res.ok) {
        console.error("[subscription] fail:", data);
        alert(data?.error || `No se pudo iniciar la suscripción (HTTP ${res.status}).`);
        return;
      }

      if (data?.url) {
        window.location.assign(data.url);
      } else {
        console.error("[subscription] falta url en respuesta:", data);
        alert("No se pudo abrir el checkout de Stripe.");
      }
    } catch (err) {
      console.error("[subscription] error:", err);
      // Errores típicos: CORS, DNS, API_BASE mal, etc.
      alert(`No se pudo iniciar la suscripción.\nDetalle: ${err?.message || err}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      {/* Selector de gramos */}
      <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6">
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
              {planOk ? `${price} €/mes` : "—"}
            </div>
            <div className="text-xs text-zinc-500">IVA y envío incluidos</div>
          </div>
        </div>

        <div className="mt-5 md:mt-6">
          <button
            type="button"
            onClick={startSubscriptionCheckout}
            className={[
              "relative inline-flex items-center justify-center",
              "rounded-xl px-5 py-3",
              "font-black tracking-wide uppercase",
              "bg-brand text-white",
              "shadow-[0_8px_22px_rgba(214,40,40,.35)]",
              "ring-1 ring-brand/30",
              "transition-all",
              "hover:translate-y-[-1px] hover:shadow-[0_12px_28px_rgba(214,40,40,.45)]",
              "active:translate-y-[0px] active:shadow-[0_6px_16px_rgba(214,40,40,.35)]",
              "w-full md:w-auto",
              loading ? "opacity-80 cursor-not-allowed" : ""
            ].join(" ")}
            disabled={!planOk || loading}
            aria-label="Continuar al pago"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                </svg>
                Procesando…
              </span>
            ) : (
              "Suscribirme"
            )}
          </button>
        </div>

        {/* DEBUG opcional visible (comentado). Útil si vuelve a fallar: */}
        {false && (
          <pre className="mt-4 text-xs text-zinc-400/80">
            API_BASE = {API_BASE}
            {"\n"}selectedGrams = {selectedGrams}
            {"\n"}price = {String(price)}
          </pre>
        )}
      </div>
    </div>
  );
}
