// src/components/SubscriptionPlans.jsx
import React, { useMemo, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "https://guarros-extremenos-api.onrender.com";

/** Opciones fijas (gramos → precio en céntimos) */
const PLANS = [
  { grams: 100,  cents: 4600 },
  { grams: 200,  cents: 5800 },
  { grams: 300,  cents: 6900 },
  { grams: 400,  cents: 8000 },
  { grams: 500,  cents: 9100 },
  { grams: 600,  cents: 10300 },
  { grams: 700,  cents: 11400 },
  { grams: 800,  cents: 12500 },
  { grams: 900,  cents: 13600 },
  { grams: 1000, cents: 14800 },
  { grams: 1500, cents: 20400 },
  { grams: 2000, cents: 26000 },
];

function formatMoney(cents, currency = "EUR") {
  try {
    return new Intl.NumberFormat("es-ES", { style: "currency", currency }).format((cents || 0) / 100);
  } catch {
    return `${(cents || 0) / 100} ${currency}`;
  }
}

function fetchJson(url, opts = {}, ms = 10000) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), ms);
  return fetch(url, { ...opts, signal: ctrl.signal })
    .then(async (r) => {
      const txt = await r.text();
      let data = null;
      try { data = txt ? JSON.parse(txt) : null; } catch { data = { raw: txt }; }
      if (!r.ok) throw Object.assign(new Error(data?.error || r.statusText || "Error"), { status: r.status, data });
      return data;
    })
    .finally(() => clearTimeout(id));
}

export default function SubscriptionPlans() {
  const [selected, setSelected] = useState(500);  // por defecto 500 g
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");         // recomendado
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const priceCents = useMemo(
    () => PLANS.find(p => p.grams === selected)?.cents ?? null,
    [selected]
  );
  const priceText = priceCents != null ? formatMoney(priceCents) : "—";

  async function handleSubscribe() {
    try {
      setLoading(true);
      const body = {
        grams: selected,              // ⬅️ sólo gramos; el backend fija el precio desde tabla segura
        currency: "eur",
        customer: email ? { email, name, phone } : undefined,
        metadata: {
          source: "guarros-front",
          subscription_grams: String(selected),
        },
        success_url: `${window.location.origin}/success`,
        cancel_url: `${window.location.origin}/cancel`,
      };

      const { url } = await fetchJson(`${API_BASE}/create-subscription-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      window.location.href = url;
    } catch (e) {
      console.error("[subscription] error:", e);
      alert(e.message || "No se ha podido iniciar la suscripción.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-8">
      {/* Grid de planes fijos */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-6">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h3 className="text-2xl font-stencil text-white">Elige tu suscripción mensual</h3>
            <p className="mt-1 text-white/70 text-sm">Selecciona una cantidad fija (100 g–2000 g).</p>
          </div>
          <div className="text-right">
            <div className="text-white/80 text-sm">Total / mes</div>
            <div className="text-3xl font-semibold text-brand">{priceText}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {PLANS.map((p) => {
            const active = p.grams === selected;
            return (
              <button
                key={p.grams}
                type="button"
                onClick={() => setSelected(p.grams)}
                className={
                  `rounded-xl border text-left p-4 transition
                   ${active
                      ? "border-brand bg-brand/10 text-brand"
                      : "border-white/15 text-white hover:bg-white/10"}`
                }
                aria-pressed={active}
              >
                <div className="text-base font-medium">{p.grams} g / mes</div>
                <div className="text-sm opacity-80 mt-1">{formatMoney(p.cents)}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Datos básicos para pre-rellenar Stripe */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 max-w-2xl">
        <div className="grid gap-3">
          <div>
            <label className="block text-sm text-white/70 mb-1">Nombre (opcional)</label>
            <input
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 h-11 outline-none focus:border-brand"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
              autoComplete="name"
            />
          </div>
          <div>
            <label className="block text-sm text-white/70 mb-1">Email (recomendado)</label>
            <input
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 h-11 outline-none focus:border-brand"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tucorreo@ejemplo.com"
              autoComplete="email"
              inputMode="email"
            />
          </div>
          <div>
            <label className="block text-sm text-white/70 mb-1">Teléfono (opcional)</label>
            <input
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 h-11 outline-none focus:border-brand"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+34 ..."
              autoComplete="tel"
              inputMode="tel"
            />
          </div>

          <div className="mt-2">
            <button
              type="button"
              onClick={handleSubscribe}
              disabled={loading || priceCents == null}
              className="relative inline-flex items-center justify-center rounded-xl h-11 px-5
                         font-stencil tracking-wide text-black bg-[#E53935] hover:bg-[#992623]
                         transition-colors duration-200 shadow-lg btn-shiny
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50
                         active:scale-[0.98]"
            >
              {loading ? "Redirigiendo…" : `Suscribirme (${selected} g / mes)`}
              <span className="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-[#E53935]/50 hover:ring-[#992623]/50 transition-all" />
            </button>
          </div>

          <p className="text-xs text-white/60 mt-2">
            Al continuar, se abrirá Stripe para completar la suscripción mensual. Podrás cancelar cuando quieras desde tu portal de cliente.
          </p>
        </div>
      </div>
    </div>
  );
}
