// src/data/subscriptionPricing.js

// Tabla oficial de tramos y precios (€/mes)
export const SUBSCRIPTION_PRICE_TABLE = [
  { g: 100,  price: 46 },
  { g: 200,  price: 58 },
  { g: 300,  price: 69 },
  { g: 400,  price: 80 },
  { g: 500,  price: 91 },   // Más popular (sugerencia visual)
  { g: 600,  price: 103 },
  { g: 700,  price: 114 },
  { g: 800,  price: 125 },
  { g: 900,  price: 136 },
  { g: 1000, price: 148 },  // Mejor valor (sugerencia visual)
  { g: 1500, price: 204 },
  { g: 2000, price: 260 }
];

// Lista de gramos disponibles
export const SUBSCRIPTION_GRAMS = SUBSCRIPTION_PRICE_TABLE.map(p => p.g);

// Devuelve el precio para unos gramos exactos (o null si no existe)
export function getPriceFor(grams) {
  const row = SUBSCRIPTION_PRICE_TABLE.find(p => p.g === Number(grams));
  return row ? row.price : null;
}

// Devuelve el tramo más cercano permitido (si no existe el grams exacto)
export function clampToValidGrams(grams) {
  const n = Number(grams);
  if (!Number.isFinite(n)) return SUBSCRIPTION_GRAMS[0];
  // Si coincide, retorna n
  if (SUBSCRIPTION_GRAMS.includes(n)) return n;
  // Si no coincide, devuelve el tramo más cercano
  let closest = SUBSCRIPTION_GRAMS[0];
  let best = Math.abs(SUBSCRIPTION_GRAMS[0] - n);
  for (const g of SUBSCRIPTION_GRAMS) {
    const d = Math.abs(g - n);
    if (d < best) { best = d; closest = g; }
  }
  return closest;
}
