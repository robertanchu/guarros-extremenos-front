// src/lib/checkout.js
const RAW_API = import.meta.env.VITE_API_URL;
const API = typeof RAW_API === 'string' ? RAW_API.replace(/\/+$/, '') : '';
const ORIGIN = window.location.origin;

function assertApi() {
  if (!API) {
    const msg = 'VITE_API_URL no está configurada en el frontend.';
    console.error('[checkout] ' + msg);
    throw new Error(msg);
  }
}

async function parseJsonSafe(res) {
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) {
    try { return await res.json(); } catch { /* ignore */ }
  }
  const text = await res.text(); // útil para depurar 405/HTML
  return { __raw: text };
}

export async function createCheckoutSession({ items, price, quantity, customer, shipping_address, metadata }) {
  assertApi();

  const payload = {
    mode: 'payment',
    success_url: `${ORIGIN}/success`,
    cancel_url:  `${ORIGIN}/cancel`,
    ...(items?.length ? { items } : { price, quantity }),
    ...(customer ? { customer } : {}),
    ...(shipping_address ? { shipping_address } : {}),
    metadata: { source: 'guarros-front', ...(metadata || {}) }
  };

  console.log('[checkout] payload →', payload);

  const res = await fetch(`${API}/create-checkout-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const data = await parseJsonSafe(res);
  if (!res.ok) {
    const msg = data?.error || `Error ${res.status} al crear la sesión`;
    console.error('[checkout] fail:', msg, data);
    throw new Error(msg);
  }
  if (!data?.url) throw new Error('No se recibió URL de Stripe');
  window.location.href = data.url;
}

export async function createSubscriptionSession({ price, quantity = 1, customer }) {
  assertApi();

  const payload = {
    price, quantity,
    success_url: `${ORIGIN}/success`,
    cancel_url:  `${ORIGIN}/cancel`,
    ...(customer ? { customer } : {})
  };

  console.log('[subscription] payload →', payload);

  const res = await fetch(`${API}/create-subscription-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const data = await parseJsonSafe(res);
  if (!res.ok) {
    const msg = data?.error || `Error ${res.status} al crear la sesión de suscripción`;
    console.error('[subscription] fail:', msg, data);
    throw new Error(msg);
  }
  if (!data?.url) throw new Error('No se recibió URL de Stripe');
  window.location.href = data.url;
}
