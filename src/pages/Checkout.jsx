import React, { useMemo, useState } from "react";
import { useCart } from "@/store/cart";
import { Link } from "react-router-dom";

const API_BASE =
  import.meta.env.VITE_API_BASE ||
  "https://guarros-extremenos-api.onrender.com";
const FRONT_BASE =
  import.meta.env.VITE_FRONT_BASE || "https://guarrosextremenos.com";

export default function Checkout() {
  const { items } = useCart();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const hasItems = items && items.length > 0;

  const totals = useMemo(() => {
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

      const payloadItems = items.map((it) => ({
        price: it.priceId || it.price, // Stripe PriceID
        quantity: it.qty || 1,
        title: it.title || it.name,
        image: it.image,
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
            {/* Inicio → estilo “Ver Jamones” */}
            <Link
              to="/"
              className="group relative inline-flex items-center justify-center rounded-xl px-6 py-3 text-base font-stencil tracking-wide text-black bg-[#E53935] transition-colors duration-200 shadow-lg hover:bg-[#992623] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 active:scale-[0.98]"
            >
              <span className="relative z-10">Inicio</span>
              <span className="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-[#E53935]/50 group-hover:ring-[#992623]/50 transition-all" />
            </Link>

            {/* Ver jamones (equivalente a “Seguir comprando”) → estilo “Suscripción” */}
            <Link
              to="/jamones"
              className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-base font-stencil tracking-wide text-white border border-white/20 transition-colors duration-200 hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 active:scale-[0.98]"
            >
              Ver Jamones
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
          {/* Resumen */}
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
                Incluidos
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
              {/* Seguir comprando → estilo “Suscripción” */}
              <Link
                to="/jamones"
                className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-base font-stencil tracking-wide text-white border border-white/20 transition-colors duration-200 hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 active:scale-[0.98]"
              >
                Seguir comprando
              </Link>

              {/* Inicio → estilo “Ver Jamones” */}
              <Link
                to="/"
                className="group relative inline-flex items-center justify-center rounded-xl px-6 py-3 text-base font-stencil tracking-wide text-black bg-[#E53935] transition-colors duration-200 shadow-lg hover:bg-[#992623] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 active:scale-[0.98]"
              >
                <span className="relative z-10">Inicio</span>
                <span className="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-[#E53935]/50 group-hover:ring-[#992623]/50 transition-all" />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
