// src/lib/billing.js
const API = import.meta.env.VITE_API_URL || "https://guarros-extremenos-api.onrender.com";

export const SUB_500_PRICE = import.meta.env.VITE_SUB_500_PRICE_ID; // obligatorio
export const SUB_1000_PRICE = import.meta.env.VITE_SUB_1000_PRICE_ID; // obligatorio

export function ensurePrices() {
  if (!SUB_500_PRICE || !SUB_1000_PRICE) {
    throw new Error("Faltan VITE_SUB_500_PRICE_ID y/o VITE_SUB_1000_PRICE_ID en el .env del front.");
  }
}

export async function startSubscriptionCheckout({
  price, // <- pasamos explícitamente VITE_SUB_500_PRICE_ID o VITE_SUB_1000_PRICE_ID
  customer, // { email, name, phone } opcional (recomendado)
  successUrl = `${window.location.origin}/success`,
  cancelUrl  = `${window.location.origin}/cancel`,
}) {
  ensurePrices();
  if (!price) throw new Error("Debes indicar el priceId del plan (500 o 1000).");

  const res = await fetch(`${API}/create-subscription-session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ price, quantity: 1, success_url: successUrl, cancel_url: cancelUrl, customer })
  });
  const data = await res.json();
  if (!res.ok || !data?.url) throw new Error(data?.error || "Error creando la sesión de suscripción");
  window.location.assign(data.url);
}

export async function openBillingPortal({ customerId, returnUrl = `${window.location.origin}/account` }) {
  const res = await fetch(`${API}/billing-portal`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ customer_id: customerId, return_url: returnUrl })
  });
  const data = await res.json();
  if (!res.ok || !data?.url) throw new Error(data?.error || "Error creando sesión del portal");
  window.location.assign(data.url);
}

export async function openBillingPortalByEmail({ email, returnUrl = `${window.location.origin}/account` }) {
  const res = await fetch(`${API}/billing-portal-by-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, return_url: returnUrl })
  });
  const data = await res.json();
  if (!res.ok || !data?.url) throw new Error(data?.error || "No se encontró una suscripción activa para ese email");
  window.location.assign(data.url);
}
