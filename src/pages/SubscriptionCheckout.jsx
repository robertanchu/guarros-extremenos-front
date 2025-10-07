// src/pages/SubscriptionCheckout.jsx
import React, { useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Meta from "@/lib/Meta";
import { createSubscriptionSession } from "@/lib/checkout";

const PRICE_500 = import.meta.env.VITE_SUB_500_PRICE_ID;
const PRICE_1000 = import.meta.env.VITE_SUB_1000_PRICE_ID;

const PLANS = [
  { id: PRICE_500,  label: "Suscripción 500 g / mes — 40 €/mes", priceText: "40 €/mes", name: "Suscripción 500 g / mes" },
  { id: PRICE_1000, label: "Suscripción 1 kg / mes — 70 €/mes",  priceText: "70 €/mes", name: "Suscripción 1 kg / mes" },
].filter(p => !!p.id);

export default function SubscriptionCheckout(){
  const [search] = useSearchParams();
  const navigate = useNavigate();

  const initialPlan = search.get("plan") || PRICE_500 || "";
  const [plan, setPlan] = useState(initialPlan);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postal_code: "",
    country: "ES",
  });
  const [loading, setLoading] = useState(false);

  const selectedPlan = useMemo(() => PLANS.find(p => p.id === plan) || null, [plan]);
  const planOk = !!selectedPlan;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(s => ({ ...s, [name]: value }));
  };

  async function handleSubmit(e){
    e.preventDefault();
    if (!planOk) return alert("Selecciona un plan de suscripción válido.");
    const required = ["name", "email", "address", "city", "postal_code"];
    const missing = required.filter(k => !String(form[k] || "").trim());
    if (missing.length) return alert("Completa todos los campos obligatorios.");

    try {
      setLoading(true);
      await createSubscriptionSession({
        price: plan,
        quantity: 1,
        customer: { email: form.email, name: form.name, phone: form.phone },
        shipping_address: {
          address: form.address,
          city: form.city,
          postal_code: form.postal_code,
          country: form.country || "ES",
        },
        metadata: {
          name: form.name,
          email: form.email,
          phone: form.phone || "",
          address: form.address,
          city: form.city,
          postal: form.postal_code,
          country: form.country || "ES",
          source: "guarros-front",
          flow: "subscription-precheckout",
        },
      });
      // El helper redirige a Stripe si todo va bien
    } catch (err) {
      console.error("[subscription pre-checkout] error:", err);
      alert(err?.message || "No se pudo iniciar la suscripción. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  const goBack = () => navigate(-1);

  return (
    <main className="shell py-12 md:py-16">
      <Meta
        title="Finalizar suscripción | Guarros Extremeños"
        description="Introduce tus datos para completar la suscripción."
      />

      {/* Cabecera igual que en Checkout */}
      <header className="mb-8 md:mb-12">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h1 className="mt-2 text-3xl md:text-5xl font-stencil text-brand">Finalizar suscripción</h1>
          <p className="mt-4 text-zinc-300">Tus datos para la entrega y contacto antes de ir al pago seguro.</p>
        </div>
      </header>

      {/* Grid idéntico al Checkout normal */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
          {/* Formulario (misma tarjeta y estilos que Checkout) */}
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-7 space-y-5"
          >
            {/* Plan */}
            <div className="space-y-1.5">
              <label className="block text-sm text-white/80">Plan</label>
              <select
                value={plan}
                onChange={(e)=>setPlan(e.target.value)}
                className="h-11 w-full rounded-xl bg-black/60 text-white border border-white/15 px-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
              >
                <option value="">Selecciona un plan</option>
                {PLANS.map(p => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
            </div>

            {/* Datos comprador/envío (mismo look) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field id="name" label="Nombre completo" autoComplete="name" required value={form.name} onChange={v => setForm(s => ({...s, name: v}))} placeholder="Tu nombre y apellidos" />
              <Field id="email" label="Email" type="email" autoComplete="email" required value={form.email} onChange={v => setForm(s => ({...s, email: v}))} placeholder="tucorreo@ejemplo.com" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field id="phone" label="Teléfono" type="tel" autoComplete="tel" value={form.phone} onChange={v => setForm(s => ({...s, phone: v}))} placeholder="+34 600 000 000" />
              <Field id="postal_code" label="Código Postal" autoComplete="postal-code" required value={form.postal_code} onChange={v => setForm(s => ({...s, postal_code: v}))} placeholder="28001" />
            </div>

            <Field id="address" label="Dirección" autoComplete="address-line1" required value={form.address} onChange={v => setForm(s => ({...s, address: v}))} placeholder="Calle y número" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field id="city" label="Ciudad" autoComplete="address-level2" required value={form.city} onChange={v => setForm(s => ({...s, city: v}))} placeholder="Madrid" />
              <div className="space-y-1.5">
                <label htmlFor="country" className="block text-sm text-white/80">País</label>
                <select
                  id="country"
                  name="country"
                  value={form.country}
                  onChange={(e)=>setForm(s => ({...s, country: e.target.value}))}
                  className="h-11 w-full rounded-xl bg-black/60 text-white border border-white/15 px-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
                >
                  <option value="ES">España</option>
                  <option value="PT">Portugal</option>
                  <option value="FR">Francia</option>
                </select>
              </div>
            </div>

            {/* Botones: Volver (outline) + Continuar (rojo canalla) */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={goBack}
                disabled={loading}
                className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-base font-stencil tracking-wide
                           text-white border border-white/20 transition-colors duration-200 hover:bg-white/15
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 active:scale-[0.98]
                           disabled:opacity-60"
              >
                Volver
              </button>

              <button
                type="submit"
                disabled={loading || !planOk}
                aria-label="Continuar al pago"
                className={[
                  "group relative inline-flex items-center justify-center rounded-xl px-6 py-3 text-base font-stencil tracking-wide",
                  "text-white transition-colors duration-200 shadow-lg",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
                  "active:scale-[0.98]",
                  (loading || !planOk)
                    ? "bg-white/10 cursor-not-allowed opacity-60"
                    : "bg-[#E53935] hover:bg-[#992623]"
                ].join(" ")}
              >
                <span className="relative z-10">
                  {loading ? "Redirigiendo a Stripe..." : "Continuar al pago"}
                </span>
                {(loading || !planOk) ? null : (
                  <span className="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-[#E53935]/50 group-hover:ring-[#992623]/50 transition-all" />
                )}
              </button>
            </div>

            {!planOk && (
              <p className="text-sm text-amber-300/90 pt-1">
                Selecciona un plan válido para continuar.
              </p>
            )}
          </form>

          {/* Resumen (igual estilo de tarjeta que en Checkout) */}
          <aside className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-7">
            <h2 className="text-xl font-semibold text-white mb-4">Resumen de la suscripción</h2>

            {selectedPlan ? (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-white">{selectedPlan.name}</div>
                    <div className="text-sm text-white/70">Frecuencia: mensual</div>
                  </div>
                  <div className="text-white font-semibold">{selectedPlan.priceText}</div>
                </div>

                <div className="mt-4 border-t border-white/10 pt-4">
                  <h3 className="text-sm text-white/70 mb-2">Incluye</h3>
                  <ul className="text-white/85 text-sm space-y-2">
                    <li>• Pausa/cambio cuando quieras</li>
                    <li>• Sobres al vacío, corte fino</li>
                    <li>• 100% Ibérico D.O.P. Dehesa de Extremadura</li>
                  </ul>
                </div>
                <p className="mt-3 text-xs text-white/50">Los datos de facturación/entrega se aplicarán al iniciar la suscripción en Stripe.</p>
              </>
            ) : (
              <p className="text-white/70">Selecciona un plan para ver el resumen.</p>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}

/* Campo reutilizable (mismo look que Checkout normal) */
function Field({ id, label, type="text", autoComplete, value, onChange, required=false, placeholder }){
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm text-white/80">{label}</label>
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(e)=>onChange(e.target.value)}
        className="h-11 w-full rounded-xl bg-black/60 text-white border border-white/15 px-3 placeholder:text-white/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
      />
    </div>
  );
}
