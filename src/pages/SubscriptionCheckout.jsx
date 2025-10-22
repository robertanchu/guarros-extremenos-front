import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE || "https://guarros-extremenos-api.onrender.com";

// Mismo mapa que en el backend (solo para mostrar "Desde X €/mes" en el formulario)
const SUB_PRICE_TABLE = {
  100: 4600, 200: 5800, 300: 6900, 400: 8000, 500: 9100,
  600: 10300, 700: 11400, 800: 12500, 900: 13600, 1000: 14800,
  1500: 20400, 2000: 26000,
};

export default function SubscriptionCheckout() {
  const [params] = useSearchParams();
  // Permitimos que venga en query (?grams=500), o que elijas aquí
  const initialGrams = Number(params.get("grams")) || 500;

  const [grams, setGrams] = useState(initialGrams);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // Datos cliente
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState(""); // ← NUEVO
  const [postal, setPostal] = useState("");
  const [country, setCountry] = useState("ES");

  const priceLabel = useMemo(() => {
    const cents = SUB_PRICE_TABLE[grams] || 0;
    return (cents / 100).toLocaleString("es-ES", { style: "currency", currency: "EUR" });
  }, [grams]);

  const canSubmit = useMemo(() => {
    return grams && email && name && address && city && postal && country;
  }, [grams, email, name, address, city, postal, country]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setErr("");

    try {
      const r = await fetch(`${API_BASE}/create-subscription-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grams,
          customer: { name, email, phone, address, city, postal, country, province }, // ← Provincia incluida
          success_url: `${window.location.origin}/success`,
          cancel_url: `${window.location.origin}/cancel`,
        }),
      });
      const data = await r.json();
      if (!r.ok || !data?.url) throw new Error(data?.error || "No se pudo iniciar la suscripción. Inténtalo de nuevo.");
      window.location.href = data.url;
    } catch (e) {
      setErr(e.message || "Error");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-12">
      <div className="mx-auto max-w-5xl px-4">
        <h1 className="text-3xl md:text-5xl font-stencil text-brand-red mb-6">Suscripción</h1>

        {err && <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm">{err}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Resumen */}
          <div className="rounded-2xl border border-white/10 p-4 md:p-6 bg-white/5">
            <h2 className="text-xl font-bold mb-4">Tu plan</h2>

            <label className="block text-sm text-white/70 mb-2">Cantidad mensual (g)</label>
            <select
              className="w-full bg-black/40 rounded-xl border border-white/15 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-red/60"
              value={grams}
              onChange={(e) => setGrams(Number(e.target.value))}
            >
              {Object.keys(SUB_PRICE_TABLE).map((g) => (
                <option key={g} value={Number(g)}>{g} g</option>
              ))}
            </select>

            <div className="mt-4 border-t border-white/10 pt-4 flex justify-between">
              <span className="font-bold">Precio</span>
              <span className="font-bold">Desde {priceLabel}/mes</span>
            </div>
          </div>

          {/* Formulario */}
          <form onSubmit={onSubmit} className="rounded-2xl border border-white/10 p-4 md:p-6 bg-white/5">
            <h2 className="text-xl font-bold mb-3">Datos del suscriptor</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex flex-col gap-1">
                <span className="text-sm text-white/70">Nombre</span>
                <input className="bg-black/40 rounded-xl border border-white/15 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-red/60"
                  value={name} onChange={e=>setName(e.target.value)} required />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm text-white/70">Email</span>
                <input type="email" className="bg-black/40 rounded-xl border border-white/15 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-red/60"
                  value={email} onChange={e=>setEmail(e.target.value)} required />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm text-white/70">Teléfono</span>
                <input className="bg-black/40 rounded-xl border border-white/15 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-red/60"
                  value={phone} onChange={e=>setPhone(e.target.value)} />
              </label>

              <label className="flex flex-col gap-1 md:col-span-2">
                <span className="text-sm text-white/70">Dirección</span>
                <input className="bg-black/40 rounded-xl border border-white/15 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-red/60"
                  value={address} onChange={e=>setAddress(e.target.value)} required />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-sm text-white/70">Ciudad</span>
                <input className="bg-black/40 rounded-xl border border-white/15 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-red/60"
                  value={city} onChange={e=>setCity(e.target.value)} required />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-sm text-white/70">Provincia</span>
                <input className="bg-black/40 rounded-xl border border-white/15 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-red/60"
                  value={province} onChange={e=>setProvince(e.target.value)} />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-sm text-white/70">Código postal</span>
                <input className="bg-black/40 rounded-xl border border-white/15 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-red/60"
                  value={postal} onChange={e=>setPostal(e.target.value)} required />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-sm text-white/70">País</span>
                <input className="bg-black/40 rounded-xl border border-white/15 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-red/60"
                  value={country} onChange={e=>setCountry(e.target.value)} />
              </label>
            </div>

            <button
              type="submit"
              disabled={!canSubmit || loading}
              className="mt-6 w-full rounded-2xl px-4 py-3 font-stencil text-lg tracking-wide bg-brand-red text-white hover:brightness-110 active:scale-[.98] transition"
            >
              {loading ? "Cargando…" : "Suscribirme"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
