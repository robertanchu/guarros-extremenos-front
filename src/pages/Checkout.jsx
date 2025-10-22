import React, { useMemo, useState } from "react";
import { useCart } from "@/store/cart";
import { Link } from "react-router-dom";

const API_BASE =
  import.meta.env.VITE_API_BASE ||
  "https://guarros-extremenos-api.onrender.com";
const FRONT_BASE =
  import.meta.env.VITE_FRONT_BASE || "https://guarrosextremenos.com";

export default function Checkout() {
  const { items, clear } = useCart();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const hasItems = items && items.length > 0;

  const totals = useMemo(() => {
    // Cada item debería traer unit_amount o priceUnit; si no, calculamos desde total/qty como fallback visual.
    let subtotal = 0;
    for (const it of items) {
      const lineTotal =
        typeof it.totalCents === "number"
          ? it.totalCents
          : (it.unitAmountCents || 0) * (it.qty || 1);
      subtotal += lineTotal;
    }
    return {
      subtotalCents: subtotal,
      subtotal: (subtotal / 100).toLocaleString("es-ES", {
        style: "currency",
        currency: "EUR",
      }),
    };
  }, [items]);

  async function handlePay() {
    try {
      setErr("");
      setLoading(true);

      // Construimos los items mínimos para el backend:
      const payloadItems = items.map((it) => ({
        price: it.priceId || it.price, // Stripe PriceID
        quantity: it.qty || 1,
        title: it.title || it.name,
        image: it.image, // si la tienes; el backend la hará absoluta
      }));

      const res = await fetch(`${API_BASE}/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: payloadItems,
          success_url: `${FRONT_BASE}/success`,
          cancel_url: `${FRONT_BASE}/cancel`,
          metadata: { source: "front-checkout" },
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.url) {
        throw new Error(data?.error || "Error al crear la sesión de pago");
      }

      // Redirigimos a Stripe
      window.location.href = data.url;
    } catch (e) {
      console.error("[checkout] error:", e);
      setErr(e.message || "Error al iniciar el pago");
      setLoading(false);
    }
  }

  if (!hasItems) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-2xl w-full text-center">
          <h1 className="mt-2 text-3xl md:text-5xl font-stencil text-brand">
            Checkout
          </h1>
          <p className="mt-3 text-white/80">
            Tu carrito está vacío. Añade algún producto antes de continuar.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-2xl px-5 py-3 font-black uppercase tracking-wide btn-primary btn-shiny"
            >
              Inicio
            </Link>
            <Link
              to="/jamones"
              className="inline-flex items-center justify-center rounded-2xl px-5 py-3 font-black uppercase tracking-wide btn-ghost"
            >
              Ver jamones
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] w-full px-4">
      <div className="mx-auto max-w-5xl py-10">
        <h1 className="mt-2 text-3xl md:text-5xl font-stencil text-brand">
          Checkout
        </h1>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Resumen de productos */}
          <section className="lg:col-span-7 bg-white/5 border border-white/10 rounded-2xl p-5">
            <h2 className="text-lg font-black text-white tracking-wide mb-3 uppercase">
              Resumen del pedido
            </h2>
            <ul className="divide-y divide-white/10">
              {items.map((it) => {
                const lineTotal =
                  typeof it.totalCents === "number"
                    ? it.totalCents
                    : (it.unitAmountCents || 0) * (it.qty || 1);
                const lineTotalFmt = (lineTotal / 100).toLocaleString("es-ES", {
                  style: "currency",
                  currency: "EUR",
                });

                return (
                  <li
                    key={`${it.id || it.priceId}-${it.variant || "std"}`}
                    className="py-4 flex items-center gap-4"
                  >
                    {it.image && (
                      <img
                        src={it.image}
                        alt={it.title || "Producto"}
                        className="w-16 h-16 object-cover rounded-lg border border-white/10"
                        loading="lazy"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold">
                        {it.title || it.name || "Producto"}
                      </p>
                      <p className="text-white/60 text-sm">
                        Cantidad: {it.qty || 1}
                        {it.variantLabel ? ` · ${it.variantLabel}` : ""}
                      </p>
                    </div>
                    <div className="text-right text-white font-black">
                      {lineTotalFmt}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Total + acción */}
          <aside className="lg:col-span-5 bg-white/5 border border-white/10 rounded-2xl p-5 h-fit">
            <h2 className="text-lg font-black text-white tracking-wide mb-3 uppercase">
              Total
            </h2>
            <div className="flex items-center justify-between py-3 border-b border-white/10">
              <span className="text-white/70">Subtotal</span>
              <span className="text-white font-bold">{totals.subtotal}</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-white/70">Envío e impuestos</span>
              <span className="text-white/60 text-sm">
                Se calculan en Stripe
              </span>
            </div>

            {err && (
              <div className="mt-3 text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                {err}
              </div>
            )}

            <button
              type="button"
              onClick={handlePay}
              disabled={loading}
              className="mt-5 w-full inline-flex items-center justify-center rounded-2xl px-5 py-3 font-black uppercase tracking-wide btn-primary btn-shiny disabled:opacity-60"
              aria-label="Ir a pago seguro"
            >
              {loading ? "Conectando con Stripe..." : "Ir a pago seguro"}
            </button>

            <div className="mt-4 flex justify-between gap-3 text-sm">
              <Link
                to="/jamones"
                className="inline-flex items-center justify-center rounded-2xl px-4 py-2 font-black uppercase tracking-wide btn-ghost"
              >
                Seguir comprando
              </Link>
              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-2xl px-4 py-2 font-black uppercase tracking-wide btn-primary btn-shiny"
              >
                Inicio
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
