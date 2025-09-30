// src/store/cart.js
// Checkout redirige usando el backend LEGACY con VITE_BACKEND_URL (/create-checkout-session).
// Usa priceId+qty como esperaba tu API antigua (ver lib/api.js:createCheckout).

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
// Intentamos usar tu helper si existe en el proyecto.
// Asegúrate de que el archivo esté en src/lib/api.js y exporte createCheckout.
let createCheckout = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  createCheckout = (await import("@/lib/api")).createCheckout;
} catch (_) {
  // fallback local si no existe el helper importado
}

const isSubscriptionItem = (it) => it?.kind === "subscription" || it?.isSubscription === true;

const variantOf = (it = {}) => {
  const cand =
    it.variant ?? it.format ?? it.presentation ?? it.cut ?? it.size ?? it.weight ??
    it.tipo ?? it.formato ?? it.opcion ?? it.option ?? it.options?.join?.("|") ?? "";
  return String(cand).trim().toLowerCase();
};
const baseIdOf = (it = {}) => it.id ?? it.priceId ?? it.slug ?? it.sku ?? it.code ?? it.key ?? it.name;
const safeBaseId = (it) => String(baseIdOf(it) ?? "").trim();
const composeLineId = (it = {}) => {
  if (it.lineId) return String(it.lineId);
  const base = safeBaseId(it);
  const variant = variantOf(it);
  return variant ? `${base}::${variant}` : `${base}`;
};
const sameItem = (a, b) => {
  if (!a || !b) return false;
  const la = composeLineId(a);
  const lb = composeLineId(b);
  if (la && lb) return la === lb;
  return baseIdOf(a) === baseIdOf(b);
};
const clampQty = (n, min = 1, max = 99) => {
  const x = Number(n);
  if (!Number.isFinite(x)) return min;
  return Math.min(Math.max(Math.trunc(x), min), max);
};
const findIndexByMatcher = (items, matcher) => {
  for (let i = 0; i < items.length; i++) if (String(items[i].lineId) === String(matcher)) return i;
  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    if (
      it.id === matcher || it.priceId === matcher || it.slug === matcher ||
      it.sku === matcher || it.key === matcher || it.name === matcher
    ) return i;
  }
  return -1;
};
const calcSubtotal = (items) =>
  items.reduce((sum, it) => sum + (Number(it.price) || 0) * (Number(it.qty) || 1), 0);

// Fallback local de createCheckout si no existe en @/lib/api
async function legacyCreateCheckout(items, opts = {}){
  const BASE = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/,'') || "";
  if(!BASE) throw new Error("VITE_BACKEND_URL no configurado");
  const success_url = opts.success_url || `${window.location.origin}/success`;
  const cancel_url  = opts.cancel_url  || `${window.location.origin}/cancel`;
  const shipping_rate = opts.shipping_rate || "shr_1SBOWZRPLp0YiQTHa4ClyIOc";
  // Tu backend esperaba priceId+quantity
  const payload = {
    items: items.map(i => ({ price: i.priceId, quantity: i.qty })),
    success_url, cancel_url, shipping_rate
  };
  const res = await fetch(`${BASE}/create-checkout-session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if(!res.ok){
    let msg = "Error al crear la sesión de pago";
    try { const j = await res.json(); msg = j.error || msg; } catch {}
    throw new Error(msg);
  }
  const data = await res.json();
  if(data?.url){ window.location.assign(data.url); return; }
  throw new Error("Respuesta sin URL de checkout");
}

const callCreateCheckout = async (items, opts) => {
  if (createCheckout) return createCheckout(items, opts);
  return legacyCreateCheckout(items, opts);
};

export const useCart = create(
  persist(
    (set, get) => ({
      items: [],

      subtotal() { return calcSubtotal(get().items); },
      totalItems() { return get().items.reduce((n, it) => n + (Number(it.qty) || 1), 0); },
      hasSubscription() { return get().items.some((it) => isSubscriptionItem(it)); },

      addItem: (product, qty) =>
        set((state) => {
          if (!product) return state;
          const isSub = isSubscriptionItem(product);
          const desiredQty = isSub ? 1 : clampQty(qty ?? product.qty ?? 1);
          const incoming = { ...product };
          incoming.lineId = composeLineId(incoming);

          const next = [...state.items];
          const existingIdx = next.findIndex((it) => sameItem(it, incoming));

          if (isSub) {
            const alreadySubIdx = next.findIndex((it) => isSubscriptionItem(it));
            const merged = { ...incoming, qty: 1 };
            if (alreadySubIdx !== -1) next[alreadySubIdx] = merged;
            else next.push(merged);
            return { items: next };
          }

          if (existingIdx !== -1) {
            const curr = next[existingIdx];
            const newQty = clampQty((curr.qty || 1) + desiredQty);
            next[existingIdx] = { ...curr, qty: newQty };
            return { items: next };
          } else {
            next.push({ ...incoming, qty: desiredQty });
            return { items: next };
          }
        }),

      removeItem: (matcher) =>
        set((state) => {
          const idx = findIndexByMatcher(state.items, matcher);
          if (idx === -1) return state;
          const next = [...state.items];
          next.splice(idx, 1);
          return { items: next };
        }),

      increment: (matcher) =>
        set((state) => {
          const idx = findIndexByMatcher(state.items, matcher);
          if (idx === -1) return state;
          const item = state.items[idx];
          if (isSubscriptionItem(item)) return state;
          const next = [...state.items];
          const currQty = clampQty(item.qty || 1);
          next[idx] = { ...item, qty: clampQty(currQty + 1) };
          return { items: next };
        }),

      decrement: (matcher) =>
        set((state) => {
          const idx = findIndexByMatcher(state.items, matcher);
          if (idx === -1) return state;
          const item = state.items[idx];
          if (isSubscriptionItem(item)) return state;
          const currQty = clampQty(item.qty || 1);
          const newQty = clampQty(currQty - 1);
          const next = [...state.items];
          next[idx] = { ...item, qty: newQty };
          return { items: next };
        }),

      clear: () => set({ items: [] }),

      // --- Checkout: llama al backend legacy ---
      checkout: async () => {
        const state = get();
        // Verificación rápida: todos los items deben tener priceId para la API legacy
        const items = state.items.map((it) => ({
          ...it,
          // si tu catálogo trae el campo stripe price como 'priceId' ya estamos ok.
          // Si fuese otro nombre (p.ej. stripePriceId), añádelo aquí:
          priceId: it.priceId ?? it.stripePriceId ?? it.price_id ?? it.priceID
        }));

        const missing = items.filter(i => !i.priceId);
        if (missing.length) {
          console.error("[checkout] Faltan priceId en:", missing);
          throw new Error("Hay productos sin priceId de Stripe. No se puede crear la sesión de pago.");
        }

        // Éxito -> redirige (dentro de createCheckout)
        await callCreateCheckout(items, {
          // Puedes personalizar estas rutas:
          success_url: `${window.location.origin}/success`,
          cancel_url: `${window.location.origin}/cancel`,
          // shipping_rate: "shr_XXXX" // opcional si quieres cambiarlo
        });

        return null;
      },
    }),
    {
      name: "guarros-cart",
      version: 5,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
