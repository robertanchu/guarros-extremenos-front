// src/lib/priceClient.js
const API = import.meta.env.VITE_API_BASE || 'https://guarros-extremenos-api.onrender.com';

const cache = new Map();

export function formatMoney(cents, currency = 'EUR') {
  if (typeof cents !== 'number') return '';
  try {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency }).format(cents / 100);
  } catch {
    return `${(cents / 100).toFixed(2)} ${currency}`;
  }
}

export async function getPrice(priceId) {
  if (!priceId) return null;
  if (cache.has(priceId)) return cache.get(priceId);
  const url = `${API}/price/${encodeURIComponent(priceId)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('No se pudo leer el precio');
  const data = await res.json();
  cache.set(priceId, data);
  return data;
}

// Para lotes: resolver varios de golpe
export async function resolvePrices(priceIds = []) {
  const ids = priceIds.filter(Boolean).filter(id => !cache.has(id));
  if (ids.length) {
    const res = await fetch(`${API}/prices/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids })
    });
    if (res.ok) {
      const { prices } = await res.json();
      Object.entries(prices || {}).forEach(([id, p]) => cache.set(id, p));
    }
  }
  // devolver siempre un mapa completo
  const out = {};
  priceIds.forEach(id => out[id] = cache.get(id) || null);
  return out;
}
