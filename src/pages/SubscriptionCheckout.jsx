// src/pages/SubscriptionCheckout.jsx
import React, { useMemo, useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Meta from "@/lib/Meta";
import {
  SUBSCRIPTION_GRAMS,
  getPriceFor,
  clampToValidGrams
} from "@/data/subscriptionPricing";

// Resolución robusta del API base
function resolveApiBase() {
  const env = import.meta.env?.VITE_API_BASE;
  if (env) return env.replace(/\/+$/, "");
  if (typeof window !== "undefined") {
    if (window.__API_BASE__) return String(window.__API_BASE__).replace(/\/+$/, "");
    const host = window.location.hostname;
    if (host.endsWith("guarrosextremenos.com") || host.endsWith("vercel.app")) {
      return "https://guarros-extremenos-api.onrender.com";
    }
    if (host === "localhost" || host === "127.0.0.1") {
      return "http://localhost:10000";
    }
  }
  return "https://guarros-extremenos-api.onrender.com";
}
const API_BASE = resolveApiBase();

export default function SubscriptionCheckout() {
  const [search] = useSearchParams();
  const navigate = useNavigate();

  // Leer gramos de la query o usar 500 por defecto
  const initialGrams = clampToValidGrams(search.get("grams") || 500);
  const [grams, setGrams] = useState(initialGrams);

  const price = useMemo(() => getPriceFor(grams), [grams]);
  const planOk = price != null;

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

  // Si el usuario cambia los gramos aquí, mantenemos el precio sincronizado
  useEffect(() => {
    const qg = search.get("grams");
    if (qg) setGrams(clampToValidGrams(qg));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // solo al montar

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!planOk) return alert("Selecciona una cantidad válida.");

    const required = ["name", "email", "address", "city", "postal_code"];
    const missing = required.filter((k) => !String(form[k] || "").trim());
    if (missing.length) return alert("Completa todos los campos obligatorios.");

    try {
      setLoading(true);

      // Llamada al backend: creamos la sesión de suscripción con grams y metadata
      const res = await fetch(`${API_BASE}/create-subscription-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grams,
          // Información útil para metadata (webhooks, factura propia, etc.)
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
            grams: String(grams),
            displayed_price: String(price)
          }
        })
      });

      let data;
      try {
        data = await res.json();
      } catch {
        const raw = await res.text();
        console.error("[subscription pre-checkout] respuesta no-JSON:", raw);
        data = { error: raw || "Respuesta no válida del servidor." };
      }

      if (!res.ok) {
        console.error("[subscription pre-checkout] fail:", data);
        alert(data?.error || `No se pudo iniciar la suscripción (HTTP ${res.status}).`);
        return;
      }

      if (data?.url) {
        window.location.assign(data.url);
      } else {
        alert("No se pudo abrir el checkout de Stripe.");
      }
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

      {/* Grid similar al Checkout normal */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
          {/* Formulario */}
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-7 space-y-5"
          >
            {/* Cantidad (gramos) */}
            <div className="space-y-1.5">
              <label className="block text-sm text-white/80">Cantidad mensual (gramos)</label>
              <select
                value={grams}
                onChange={(e)=>setGrams(clampToValidGrams(e.target.value))}
                className="h-11 w-full rounded-xl bg-black/60 text-white border border-white/15 px-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
              >
                {SUBSCRIPTION_GRAMS.map(g => (
                  <option key={g} value={g}>{g} g / mes</option>
                ))}
              </select>
            </div>

            {/* Datos comprador/envío */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field id="name" label="Nombre completo" autoComplete="name" required value={form.name} onChange={handleChange} placeholder="Tu nombre y apellidos" />
              <Field id="email" label="Email" type="email" autoComplete="email" required value={form.email} onChange={handleChange} placeholder="tucorreo@ejemplo.com" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field id="phone" label="Teléfono" type="tel" autoComplete="tel" value={form.phone} onChange={handleChange} placeholder="+34 600 000 000" />
              <Field id="postal_code" label="Código Postal" autoComplete="postal-code" required value={form.postal_code} onChange={handleChange} placeholder="28001" />
            </div>

            <Field id="address" label="Dirección" autoComplete="address-line1" required value={form.address} onChange={handleChange} placeholder="Calle y número" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field id="city" label="Ciudad" autoComplete="address-level2" required value={form.city} onChange={handleChange} placeholder="Madrid" />
              <div className="space-y-1.5">
                <label htmlFor="country" className="block text-sm text-white/80">País</label>
                <select
                  id="country"
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  className="h-11 w-full rounded-xl bg-black/60 text-white border border-white/15 px-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
                >
                  <option value="ES">España</option>
                  <option value="PT">Portugal</option>
                  <option value="FR">Francia</option>
                </select>
              </div>
            </div>

            {/* Botones: Volver + Continuar */}
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
                  "text-black transition-colors duration-200 shadow-lg",
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
                Selecciona una cantidad válida para continuar.
              </p>
            )}
          </form>

          {/* Resumen (mismo look que Checkout) */}
          <aside className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-7">
            <h2 className="text-xl font-semibold text-white mb-4">Resumen de la suscripción</h2>

            {planOk ? (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-white">Suscripción {grams} g / mes</div>
                  </div>
                  <div className="text-white font-semibold">{price} €/mes</div>
                </div>

                <div className="mt-4 border-t border-white/10 pt-4">
                  <h3 className="text-sm text-white/70 mb-2">Incluye</h3>
                  <ul className="text-white/85 text-sm space-y-2">
                    <li>• 100% Ibérico D.O.P. Dehesa de Extremadura</li>
                    <li>• Sobres al vacío, corte fino</li>
                    <li>• Cancela cuando quieras</li>
                  </ul>
                </div>
                <p className="mt-3 text-xs text-white/50">Los datos de facturación/entrega se aplicarán al iniciar el proceso de suscripción.</p>
              </>
            ) : (
              <p className="text-white/70">Selecciona una cantidad para ver el resumen.</p>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}

/* Campo reutilizable */
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
        onChange={onChange}
        className="h-11 w-full rounded-xl bg-black/60 text-white border border-white/15 px-3 placeholder:text-white/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
      />
    </div>
  );
}
