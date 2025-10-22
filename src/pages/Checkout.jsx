import React, { useMemo, useState, useEffect } from "react";
import { useCart } from "@/store/cart";

const API_BASE = import.meta.env.VITE_API_BASE || "https://guarros-extremenos-api.onrender.com";

export default function Checkout() {
  const { items, total, clear } = useCart();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // Datos del cliente
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState(""); // ← NUEVO
  const [postal, setPostal] = useState("");
  const [country, setCountry] = useState("ES");

  useEffect(() => {
    // precargar del localStorage si quisieras…
  }, []);

  const cartForAPI = useMemo(() => {
    // Asegúrate de tener title/imágenes en tus cards
    return items.map((it) => ({
      priceId: it.priceId,
      quantity: it.qty || 1,
      title: it.title || it.name || it.productName, // ← esto es lo que verá el usuario en Stripe
      image: it.image || it.img || undefined,
    }));
  }, [items]);

  const canSubmit = useMemo(() => {
    return cartForAPI.length > 0 && email && name && address && city && postal && country;
  }, [cartForAPI, email, name, address, city, postal, country]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setErr("");

    try {
      const r = await fetch(`${API_BASE}/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartForAPI,
          customer: { name, email, phone, address, city, postal, country, province },
          success_url: `${window.location.origin}/success`,
          cancel_url: `${window.location.origin}/cancel`,
        }),
      });
      const data = await r.json();
      if (!r.ok || !data?.url) throw new Error(data?.error || "Error iniciando checkout");
      window.location.href = data.url;
    } catch (e) {
      setErr(e.message || "Error");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-12">
      <div className="mx-auto max-w-5xl px-4">
        <h1 className="text-3xl md:text-5xl font-stencil text-brand-red mb-6">Finalizar compra</h1>

        {err && <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm">{err}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Resumen */}
          <div className="rounded-2xl border border-white/10 p-4 md:p-6 bg-white/5">
            <h2 className="text-xl font-bold mb-3">Tu pedido</h2>
            <ul className="space-y-3">
              {items.map((it) => (
                <li key={(it.id || it.priceId) + '-' + (it.variant || '')} className="flex items-center gap-3">
                  {it.image && <img src={it.image} alt="" className="w-14 h-14 object-cover rounded-lg" />}
                  <div className="flex-1">
                    <div className="font-semibold">{it.title || it.name}</div>
                    <div className="text-sm text-white/70">
                      {it.qty || 1} × {(it.priceAmountFormatted || it.priceLabel || "")}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4 border-t border-white/10 pt-4 flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">{total.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}</span>
            </div>
          </div>

          {/* Formulario */}
          <form onSubmit={onSubmit} className="rounded-2xl border border-white/10 p-4 md:p-6 bg-white/5">
            <h2 className="text-xl font-bold mb-3">Datos del comprador</h2>

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
              {loading ? "Cargando…" : "Ir a pago seguro"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
