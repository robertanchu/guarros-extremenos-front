// src/pages/Checkout.jsx
import React, { useMemo, useState } from "react";
import { useCart } from "@/store/cart";
import Meta from "@/lib/Meta";

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

export default function Checkout(){
  const { items, subtotal } = useCart();
  const [submitting, setSubmitting] = useState(false);

  // Datos del comprador
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postal, setPostal] = useState("");
  const [country, setCountry] = useState("ES");

  const lineItems = useMemo(()=> items.map(i => ({
    price: i.priceId ?? i.stripePriceId ?? i.price_id ?? i.priceID ?? i.priceid,
    quantity: i.qty || 1,
  })), [items]);

  const canPay = lineItems.every(li => !!li.price) && lineItems.length > 0;

  const totals = useMemo(()=>{
    const sub = subtotal ? subtotal() : 0;
    return { sub };
  }, [items, subtotal]);

  async function handlePay(e){
    e.preventDefault();
    if (!canPay) return alert("Faltan identificadores de precio para algunos productos.");
    setSubmitting(true);
    try {
      const BASE = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/$/, "");
      if (!BASE) throw new Error("VITE_BACKEND_URL no configurado");
      const payload = {
        items: lineItems,
        success_url: `${window.location.origin}/success`,
        cancel_url: `${window.location.origin}/cancel`,
        // Información adicional para el backend (si la soporta)
        customer: { name, email, phone },
        shipping_address: { address, city, postal_code: postal, country },
        metadata: {
          name, email, phone, address, city, postal, country,
          source: "guarros-front",
        }
      };
      const res = await fetch(`${BASE}/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const text = await res.text();
      let url = null;
      try {
        const j = JSON.parse(text);
        url = j?.url || j?.redirectUrl || j?.checkoutUrl || j?.data?.url || null;
      } catch { /* ignore */ }
      if (!url){
        const m = text.match(/https?:\/\/[^\s"']+/i);
        if (m && m[0]) url = m[0];
      }
      if (res.ok && url){
        window.location.assign(url);
        return;
      }
      console.error("Checkout error:", res.status, text.slice(0, 500));
      alert("No se pudo iniciar el pago. Revisa la consola (Network) para ver detalles.");
    } catch (err){
      console.error(err);
      alert(err.message || "Error al iniciar el pago.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="shell py-12 md:py-16">
      <Meta title="Finalizar compra | Guarros Extremeños" description="Introduce tus datos para completar la compra." />

      <header className="mb-8 md:mb-12">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h1 className="mt-2 text-3xl md:text-5xl font-stencil text-brand">Finalizar compra</h1>
          <p className="mt-4 text-zinc-300">Tus datos para el envío y contacto antes de ir al pago seguro.</p>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
          {/* Formulario */}
          <form className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-7 space-y-5" onSubmit={handlePay}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field id="name" label="Nombre completo" autoComplete="name" value={name} onChange={setName} required placeholder="Tu nombre y apellidos" />
              <Field id="email" label="Email" type="email" autoComplete="email" value={email} onChange={setEmail} required placeholder="tucorreo@ejemplo.com" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field id="phone" label="Teléfono" type="tel" autoComplete="tel" value={phone} onChange={setPhone} placeholder="+34 600 000 000" />
              <Field id="postal" label="Código Postal" autoComplete="postal-code" value={postal} onChange={setPostal} required placeholder="28001" />
            </div>
            <Field id="address" label="Dirección" autoComplete="address-line1" value={address} onChange={setAddress} required placeholder="Calle y número" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field id="city" label="Ciudad" autoComplete="address-level2" value={city} onChange={setCity} required placeholder="Madrid" />
              <div className="space-y-1.5">
                <label htmlFor="country" className="block text-sm text-white/80">País</label>
                <select
                  id="country"
                  name="country"
                  value={country}
                  onChange={(e)=>setCountry(e.target.value)}
                  className="h-11 w-full rounded-xl bg-black/60 text-white border border-white/15 px-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
                >
                  <option value="ES">España</option>
                  <option value="PT">Portugal</option>
                  <option value="FR">Francia</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              {/* Botón canalla */}
              <button
                type="submit"
                disabled={!canPay || submitting}
                className={[
                  "group relative w-full inline-flex items-center justify-center",
                  "rounded-xl h-11 px-5 font-stencil tracking-wide",
                  "text-black transition-colors duration-200 shadow-lg",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
                  "active:scale-[0.98]",
                  (!canPay || submitting)
                    ? "bg-white/10 cursor-not-allowed opacity-60"
                    : "bg-[#E53935] hover:bg-[#992623]"
                ].join(" ")}
                aria-label="Ir al pago"
              >
                <span className="relative z-10">
                  {submitting ? "Conectando con el pago..." : "Ir al pago seguro"}
                </span>
                {(!canPay || submitting) ? null : (
                  <span className="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-[#E53935]/50 group-hover:ring-[#992623]/50 transition-all" />
                )}
              </button>

              {!canPay && (
                <p className="mt-2 text-sm text-amber-300/90">
                  Revisa los productos del carrito: falta el identificador de precio.
                </p>
              )}
            </div>
          </form>

          {/* Resumen */}
          <aside className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-7">
            <h2 className="text-xl font-semibold text-white mb-4">Resumen del pedido</h2>
            <ul className="divide-y divide-white/10">
              {items.map((it) => (
                <li key={it.lineId || it.id} className="py-3 flex items-start justify-between gap-4">
                  <div>
                    <div className="text-white">{it.name || it.title}</div>
                    <div className="text-sm text-white/70">Cantidad: {it.qty || 1}</div>
                  </div>
                  <div className="text-white/90">{(Number(it.price) || 0).toFixed(2)} €</div>
                </li>
              ))}
            </ul>
            <div className="mt-4 border-t border-white/10 pt-4 flex items-center justify-between">
              <div className="text-white/70">Subtotal</div>
              <div className="text-white font-semibold">{totals.sub.toFixed(2)} €</div>
            </div>
            <p className="mt-2 text-xs text-white/50">Los gastos de envío y tasas se calculan en el pago.</p>
          </aside>
        </div>
      </section>
    </main>
  );
}
