// src/lib/subscription.js
// Detección unificada de suscripciones
const SUB_IDS = new Set([
  import.meta.env.VITE_SUB_500_PRICE_ID || "price_1SBNszRPLp0YiQTHO3EGpjcv",
  import.meta.env.VITE_SUB_1000_PRICE_ID || "price_1SBNtdRPLp0YiQTHrhnTXCr7",
]);

export const isSubscription = (x = {}) => {
  const n = (x.name || "").toLowerCase();
  const s = (x.slug || "").toLowerCase();
  if (x.isSubscription === true) return true;
  if (x.kind === "subscription") return true;
  if (/suscrip/.test(n) || /suscrip/.test(s)) return true;
  if (x.priceId && SUB_IDS.has(x.priceId)) return true;
  return false;
};
