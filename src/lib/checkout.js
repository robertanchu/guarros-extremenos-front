// src/lib/checkout.js
const API = import.meta.env.VITE_API_URL; // e.g. https://guarros-extremenos-api.onrender.com
const ORIGIN = window.location.origin;

export async function createCheckoutSession({ items, price, quantity, customer, shipping_address, metadata }) {
  const payload = {
    mode: 'payment',
    success_url: `${ORIGIN}/success`,
    cancel_url:  `${ORIGIN}/cancel`,
    // O BIEN items [{ price, quantity }...] O BIEN price+quantity sueltos:
    ...(items?.length ? { items } : { price, quantity }),
    ...(customer ? { customer } : {}),
    ...(shipping_address ? { shipping_address } : {}),
    metadata: { source: 'guarros-front', ...(metadata || {}) }
  };

  const res = await fetch(`${API}/create-checkout-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || 'Error al crear sesión');
  if (!data?.url) throw new Error('No se recibió URL de Stripe');
  window.location.href = data.url;
}

export async function createSubscriptionSession({ price, quantity = 1, customer }) {
  const payload = {
    price, quantity,
    success_url: `${ORIGIN}/success`,
    cancel_url:  `${ORIGIN}/cancel`,
    ...(customer ? { customer } : {})
  };

  const res = await fetch(`${API}/create-subscription-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || 'Error al crear sesión de suscripción');
  if (!data?.url) throw new Error('No se recibió URL de Stripe');
  window.location.href = data.url;
}
