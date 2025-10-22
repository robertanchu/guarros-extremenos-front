// src/pages/Checkout.jsx
import React, { useMemo, useState } from "react";
import { useCart } from "@/store/cart";
import Meta from "@/lib/Meta";

// Provincias de España (canónicas para Stripe)
const ES_PROVINCES = [
  "Álava", "Albacete", "Alicante", "Almería", "Asturias", "Ávila",
  "Badajoz", "Baleares", "Barcelona", "Burgos", "Cáceres", "Cádiz",
  "Cantabria", "Castellón", "Ciudad Real", "Córdoba", "Cuenca",
  "Girona", "Granada", "Guadalajara", "Gipuzkoa", "Huelva", "Huesca",
  "Jaén", "La Rioja", "Las Palmas", "León", "Lleida", "Lugo", "Madrid",
  "Málaga", "Murcia", "Navarra", "Ourense", "Palencia", "Pontevedra",
  "Salamanca", "Santa Cruz de Tenerife", "Segovia", "Sevilla", "Soria",
  "Tarragona", "Teruel", "Toledo", "Valencia", "Valladolid", "Bizkaia",
  "Zamora", "Zaragoza", "Ceuta", "Melilla"
];

function resolveApiBase() {
  const env = import.meta.env?.VITE_API_BASE;
  if (env) return env.replace(/\/+$/, "");
  if (typeof window !== "undefined") {
    if (window.__API_BASE__) return String(window.__API_BASE__).replace(/\/+$/, "");
    const host = window.location.hostname;
    if (host.endsWith("guarrosextremenos.com") || host.endsWith("vercel.app")) {
      return "https://guarros-extremenos-api.onrender.com";
    }
    if (host === "localhost" || host === "127.0.0.1") return "http://localhost:10000";
  }
  return "https://guarros-extremenos-api.onrender.com";
}
const API_BASE = resolveApiBase();

export default function Checkout() {
  const { items } = useCart();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    province: "Madrid",
    postal_code: "",
    country: "ES",
  });

  const totalQty = useMemo(() => items.reduce((a, b) => a + (b.qty || 1), 0), [items]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!items.length) return alert("Tu carrito está vacío.");

    const required = ["name", "email", "address", "city", "province", "postal_code"];
    const missing = required.filter((k) => !String(form[k] || "").trim());
    if (missing.length) {
      alert("Completa todos los campos obligatorios.");
      return;
    }

    setLoading(true);
    try {
      // Pasamos title e image para pintar nombre exacto en Stripe
      const lineItems = items
        .map((it) => ({
          price: it.priceId,
          quantity: it.qty || 1,
          title: it.title || it.name,
          image: it.image || it.img || undefined,
        }))
        .filter((li) => !!li.price);

      const res = await fetch(`${API_BASE}/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: lineItems,
          customer: {
            email: form.email,
            name: form.name,
            phone: form.phone,
            address: form.address,
            city: form.city,
            postal: form.postal_code,
            country: form.country || "ES",
            province: form.province, // mapea a state en el server
          },
          shipping_address: {
            address: form.address,
            city: form.city,
            postal_code: form.postal_code,
            country: form.country || "ES",
            province: form.province,
          },
          metadata: {
            source: "guarros-front",
            flow: "oneoff-precheckout",
            name: form.name,
            email: form.email,
            phone: form.phone || "",
            address: form.address,
            city: form.city,
            province: form.province,
            postal: form.postal_code,
            country: form.country || "ES",
            items_count: String(totalQty),
          },
        }),
      });

      let data;
      try { data = await res.json(); } catch { data = { error: await res.text() }; }

      if (!res.ok) {
        console.error("[checkout] fail:", data);
        alert(data?.error || `No se pudo iniciar el pago (HTTP ${res.status}).`);
        return;
      }
      if (data?.url) {
        window.location.assign(data.url);
      } else {
        alert("No se pudo abrir el checkout de Stripe.");
      }
    } catch (err) {
      console.error("[checkout] error:", err);
      alert(err?.message || "No se pudo iniciar el pago.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="shell py-12 md:py-16">
      <Meta title="Finalizar compra | Guarros Extremeños" description="Introduce tus datos y paga de forma segura." />
      <header className="mb-8 md:mb-12 text-center">
        <h1 className="mt-2 text-3xl md:text-5xl font-stencil text-brand">Finalizar compra</h1>
        <p className="mt-3 text-zinc-300">Datos de contacto y envío antes de ir al pago seguro.</p>
      </header>

      <section className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
        {/* Formulario */}
        <form onSubmit={handleSubmit} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-7 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field id="name" label="Nombre completo" required value={form.name} onChange={handleChange} placeholder="Tu nombre y apellidos" />
            <Field id="email" label="Email" type="email" required value={form.email} onChange={handleChange} placeholder="tucorreo@ejemplo.com" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field id="phone" label="Teléfono" type="tel" value={form.phone} onChange={handleChange} placeholder="+34 600 000 000" />
            <Field id="postal_code" label="Código Postal" required value={form.postal_code} onChange={handleChange} placeholder="28001" />
          </div>

          <Field id="address" label="Dirección" required value={form.address} onChange={handleChange} placeholder="Calle y número" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Field id="city" label="Ciudad" required value={form.city} onChange={handleChange} placeholder="Madrid" />
            {/* Provincia como select */}
            <div className="space-y-1.5">
              <label htmlFor="province" className="block text-sm text-white/80">Provincia</label>
              <select
                id="province"
                name="province"
                value={form.province}
                onChange={handleChange}
                className="h-11 w-full rounded-xl bg-black/60 text-white border border-white/15 px-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
              >
                {ES_PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

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

          <div className="flex items-center gap-3 pt-2">
            <button type="button" onClick={() => history.back()} className="btn-secondary">Volver</button>
            <button
              type="submit"
              disabled={loading || !items.length}
              className="relative inline-flex items-center justify-center rounded-xl px-6 py-3 font-stencil bg-brand text-white ring-1 ring-brand/30 shadow-[0_8px_22px_rgba(214,40,40,.35)] hover:translate-y-[-1px] hover:shadow-[0_12px_28px_rgba(214,40,40,.45)]"
            >
              {loading ? "Redirigiendo a Stripe..." : "Ir a pago seguro"}
            </button>
          </div>
        </form>

        {/* Resumen */}
        <aside className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-7">
          <h2 className="text-xl font-semibold text-white mb-4">Resumen</h2>
          {!items.length ? (
            <p className="text-zinc-300">Tu carrito está vacío.</p>
          ) : (
            items.map((it) => (
              <div key={`${it.id}-${it.priceId}`} className="flex items-center justify-between py-2 border-b border-white/10">
                <div className="text-white">{it.title} {it.variant ? `– ${it.variant}` : ""}</div>
                <div className="text-white/90">x{it.qty || 1}</div>
              </div>
            ))
          )}
        </aside>
      </section>
    </main>
  );
}

function Field({ id, label, type = "text", value, onChange, required = false, placeholder }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm text-white/80">{label}</label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="h-11 w-full rounded-xl bg-black/60 text-white border border-white/15 px-3 placeholder:text-white/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
      />
    </div>
  );
}
