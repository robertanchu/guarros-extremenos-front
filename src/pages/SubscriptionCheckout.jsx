// src/pages/SubscriptionCheckout.jsx
import React, { useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Meta from "@/lib/Meta";
import { createSubscriptionSession } from "@/lib/checkout";

const PRICE_500 = import.meta.env.VITE_SUB_500_PRICE_ID;
const PRICE_1000 = import.meta.env.VITE_SUB_1000_PRICE_ID;

const PLANS = [
  { id: PRICE_500,  label: "Suscripción 500 g / mes — 40 €/mes" },
  { id: PRICE_1000, label: "Suscripción 1 kg / mes — 70 €/mes" },
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

  const planOk = useMemo(() => PLANS.some(p => p.id === plan), [plan]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(s => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!planOk) return alert("Selecciona un plan de suscripción válido.");
    if (!form.email || !form.name || !form.address || !form.city || !form.postal_code) {
      return alert("Completa todos los campos obligatorios.");
    }
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
          address: form.address,
          city: form.city,
          postal: form.postal_code,
          country: form.country || "ES",
          phone: form.phone || "",
          name: form.name,
          flow: "subscription-precheckout",
        },
      });
      // La redirección a Stripe la ejecuta el helper si todo fue OK
    } catch (err) {
      console.error("[subscription pre-checkout] error:", err);
      alert(err?.message || "No se pudo iniciar la suscripción. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => navigate(-1);

  return (
    <main className="shell py-12 md:py-16">
      <Meta title="Checkout de Suscripción | Guarros Extremeños" description="Introduce tus datos para completar la suscripción." />

      <div className="max-w-3xl mx-auto px-4">
        <header className="mb-8 md:mb-10 text-center">
          <h1 className="mt-2 text-3xl md:text-5xl font-stencil text-brand">Checkout de Suscripción</h1>
          <p className="mt-4 text-zinc-300">Introduce tus datos y continúa para completar el pago seguro.</p>
        </header>

        <section className="mb-8">
          <label className="block text-sm text-white/80 mb-2">Plan</label>
          <select
            value={plan}
            onChange={(e)=>setPlan(e.target.value)}
            className="w-full h-11 rounded-lg bg-black/40 border border-white/10 px-3 text-white focus:outline-none focus:ring-2 focus:ring-brand"
          >
            <option value="">Selecciona un plan</option>
            {PLANS.map(p => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
        </section>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm text-white/80 mb-1">Nombre completo*</label>
              <input
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                className="w-full h-11 rounded-lg bg-black/40 border border-white/10 px-3 text-white focus:outline-none focus:ring-2 focus:ring-brand"
                placeholder="Tu nombre"
              />
            </div>
            <div>
              <label className="block text-sm text-white/80 mb-1">Email*</label>
              <input
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full h-11 rounded-lg bg-black/40 border border-white/10 px-3 text-white focus:outline-none focus:ring-2 focus:ring-brand"
                placeholder="tu@email.com"
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-white/80 mb-1">Teléfono</label>
            <input
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              className="w-full h-11 rounded-lg bg-black/40 border border-white/10 px-3 text-white focus:outline-none focus:ring-2 focus:ring-brand"
              placeholder="+34 600 000 000"
              autoComplete="tel"
            />
          </div>

          <div>
            <label className="block text-sm text-white/80 mb-1">Dirección*</label>
            <input
              name="address"
              type="text"
              required
              value={form.address}
              onChange={handleChange}
              className="w-full h-11 rounded-lg bg-black/40 border border-white/10 px-3 text-white focus:outline-none focus:ring-2 focus:ring-brand"
              placeholder="Calle y número"
              autoComplete="address-line1"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm text-white/80 mb-1">Ciudad*</label>
              <input
                name="city"
                type="text"
                required
                value={form.city}
                onChange={handleChange}
                className="w-full h-11 rounded-lg bg-black/40 border border-white/10 px-3 text-white focus:outline-none focus:ring-2 focus:ring-brand"
                placeholder="Ciudad"
                autoComplete="address-level2"
              />
            </div>
            <div>
              <label className="block text-sm text-white/80 mb-1">Código Postal*</label>
              <input
                name="postal_code"
                type="text"
                required
                value={form.postal_code}
                onChange={handleChange}
                className="w-full h-11 rounded-lg bg-black/40 border border-white/10 px-3 text-white focus:outline-none focus:ring-2 focus:ring-brand"
                placeholder="CP"
                autoComplete="postal-code"
              />
            </div>
            <div>
              <label className="block text-sm text-white/80 mb-1">País*</label>
              <select
                name="country"
                value={form.country}
                onChange={handleChange}
                className="w-full h-11 rounded-lg bg-black/40 border border-white/10 px-3 text-white focus:outline-none focus:ring-2 focus:ring-brand"
              >
                <option value="ES">España</option>
                <option value="PT">Portugal</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            {/* Volver → estilo "Suscripción" del Hero (outline) */}
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

            {/* Continuar → estilo "Ver Jamones" (rojo canalla) */}
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

          <p className="text-xs text-white/60 pt-2">
            Al continuar, aceptas nuestros Términos y Condiciones y la Política de Privacidad.
          </p>
        </form>
      </div>
    </main>
  );
}
