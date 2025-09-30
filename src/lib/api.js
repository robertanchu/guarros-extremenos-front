// src/lib/api.js
// Helper opcional. Si existe, el store lo usará primero.
export async function createCheckout(items, opts = {}){
  const BASE = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, "");
  if (!BASE) throw new Error("VITE_BACKEND_URL no configurado en .env");
  const payload = {
    items: items.map(i => ({ price: i.priceId, quantity: i.qty || 1 })),
    success_url: opts.success_url || `${window.location.origin}/success`,
    cancel_url:  opts.cancel_url  || `${window.location.origin}/cancel`,
    ...(opts.shipping_rate ? { shipping_rate: opts.shipping_rate } : {}),
  };
  const res = await fetch(`${BASE}/create-checkout-session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("Error al crear la sesión de pago");
  const data = await res.json();
  return data; // { url }
}
