// src/components/SubscriptionPlans.jsx
import React, { useState } from "react";
import {
  startSubscriptionCheckout,
  openBillingPortal,
  openBillingPortalByEmail,
  SUB_500_PRICE,
  SUB_1000_PRICE,
  ensurePrices,
} from "@/lib/billing";

export default function SubscriptionPlans({ customerId }) {
  ensurePrices();

  const [selected, setSelected] = useState("500"); // "500" | "1000"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");   // al menos email recomendado
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);

  const priceFor = (key) => (key === "500" ? SUB_500_PRICE : SUB_1000_PRICE);

  async function onSubscribe() {
    try {
      setLoading(true);
      await startSubscriptionCheckout({
        price: priceFor(selected),
        customer: email ? { email, name, phone } : undefined,
      });
    } catch (e) {
      alert(e.message || "No se ha podido iniciar la suscripción");
    } finally {
      setLoading(false);
    }
  }

  async function onPortal() {
    try {
      setPortalLoading(true);
      if (customerId) {
        await openBillingPortal({ customerId });
      } else {
        const mail = email || prompt("Introduce el email con el que te suscribiste:");
        if (!mail) return;
        await openBillingPortalByEmail({ email: mail.trim() });
      }
    } catch (e) {
      alert(e.message || "No se ha podido abrir el portal");
    } finally {
      setPortalLoading(false);
    }
  }

  return (
    <section className="grid gap-8">
      {/* Planes */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* 500 g */}
        <button
          type="button"
          onClick={() => setSelected("500")}
          className={`text-left rounded-2xl border p-6 transition ${
            selected === "500"
              ? "border-brand bg-brand/10"
              : "border-white/10 hover:border-white/20 bg-white/5"
          }`}
        >
          <div className="flex items-baseline justify-between">
            <h3 className="text-xl font-stencil text-white">Suscripción 500 g</h3>
            <span className="text-brand text-lg font-semibold">/mes</span>
          </div>
          <p className="mt-2 text-white/80">Corte fino, ración canalla para 1–2 personas</p>
          <p className="mt-4 text-3xl font-semibold text-white">Plan 500</p>
          <p className="mt-1 text-white/60 text-sm">Id: {SUB_500_PRICE}</p>
          {selected === "500" && <div className="mt-3 text-brand text-sm">Seleccionado</div>}
        </button>

        {/* 1000 g */}
        <button
          type="button"
          onClick={() => setSelected("1000")}
          className={`text-left rounded-2xl border p-6 transition ${
            selected === "1000"
              ? "border-brand bg-brand/10"
              : "border-white/10 hover:border-white/20 bg-white/5"
          }`}
        >
          <div className="flex items-baseline justify-between">
            <h3 className="text-xl font-stencil text-white">Suscripción 1000 g</h3>
            <span className="text-brand text-lg font-semibold">/mes</span>
          </div>
          <p className="mt-2 text-white/80">Para 3–4 personas o puro vicio individual</p>
          <p className="mt-4 text-3xl font-semibold text-white">Plan 1000</p>
          <p className="mt-1 text-white/60 text-sm">Id: {SUB_1000_PRICE}</p>
          {selected === "1000" && <div className="mt-3 text-brand text-sm">Seleccionado</div>}
        </button>
      </div>

      {/* Prefill (opcional) */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 max-w-xl">
        <div className="grid gap-3">
          <div>
            <label className="block text-sm text-white/70 mb-1">Nombre (opcional)</label>
            <input
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 h-11 outline-none focus:border-brand"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
            />
          </div>
          <div>
            <label className="block text-sm text-white/70 mb-1">Email (recomendado)</label>
            <input
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 h-11 outline-none focus:border-brand"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tucorreo@ejemplo.com"
            />
          </div>
          <div>
            <label className="block text-sm text-white/70 mb-1">Teléfono (opcional)</label>
            <input
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 h-11 outline-none focus:border-brand"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+34 ..."
            />
          </div>

          <div className="mt-2 flex flex-wrap gap-3">
            <button
              onClick={onSubscribe}
              disabled={loading}
              className="inline-flex h-11 items-center rounded-full bg-brand px-5 font-medium text-white hover:bg-brand/90 disabled:opacity-60"
            >
              {loading ? "Redirigiendo…" : `Suscribirme (${selected === "500" ? "500 g" : "1000 g"})`}
            </button>

            <button
              onClick={onPortal}
              disabled={portalLoading}
              className="inline-flex h-11 items-center rounded-full border border-white/15 px-5 font-medium text-white/90 hover:bg-white/10 disabled:opacity-60"
            >
              {portalLoading ? "Abriendo…" : "Gestionar suscripción"}
            </button>
          </div>

          <p className="text-xs text-white/60 mt-2">
            Al continuar, se abrirá Stripe para completar la suscripción mensual.
            Podrás cancelar cuando quieras desde “Gestionar suscripción”.
          </p>
        </div>
      </div>
    </section>
  );
}
