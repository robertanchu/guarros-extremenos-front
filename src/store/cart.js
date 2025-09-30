// src/store/cart.js
// v9: añade `migrate` para Zustand persist y mejora los errores de checkout (superficie el 500 con detalle).

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import * as API from "@/lib/api"; // opcional: exporta createCheckout(items, opts)
import { PRODUCTS as CATALOG } from "@/data/products";

const createCheckout = API?.createCheckout;

const isSubscriptionItem = (it) => it?.kind === "subscription" || it?.isSubscription === true || it?.type === "recurring";

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

// ----- Resolver priceId desde el catálogo si falta -----
const findInCatalog = (it) => {
  if (!Array.isArray(CATALOG)) return null;
  const id = it?.id?.toString?.();
  const slug = it?.slug?.toString?.();
  return (
    CATALOG.find(p => (p.id?.toString?.() === id && id)) ||
    CATALOG.find(p => (p.slug?.toString?.() === slug && slug)) ||
    null
  );
};
const resolvePriceId = (it) => {
  const direct = it.priceId ?? it.stripePriceId ?? it.price_id ?? it.priceID ?? it.priceid;
  if (direct) return direct;
  const cat = findInCatalog(it);
  return cat?.priceId || null;
};

// Fallback legacy si no hay API.createCheckout
async function legacyCreateCheckout(items, opts = {}){
  const BASE = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/,'') || "";
  if(!BASE) throw new Error("VITE_BACKEND_URL no configurado");
  const success_url = opts.success_url || `${window.location.origin}/success`;
  const cancel_url  = opts.cancel_url  || `${window.location.origin}/cancel`;
  const payload = {
    items: items.map(i => ({ price: i.priceId, quantity: i.qty })),
    success_url, cancel_url
  };
  console.debug("[checkout] POST", `${BASE}/create-checkout-session`, payload);
  const res = await fetch(`${BASE}/create-checkout-session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if(!res.ok){
    let detail = "";
    try {
      const text = await res.text();
      detail = text?.slice(0, 300);
      // intenta parsear JSON si aplica
      try { detail = JSON.stringify(JSON.parse(text)); } catch {}
    } catch {}
    const msg = `Error al crear la sesión de pago (${res.status}). ${detail || ""}`;
    throw new Error(msg);
  }
  const data = await res.json();
  console.debug("[checkout] response:", data);
  if(data?.url){ window.location.assign(data.url); return; }
  throw new Error("Respuesta sin URL de checkout");
}

const callCreateCheckout = async (items, opts) => {
  if (typeof createCheckout === "function") {
    console.debug("[checkout] using API.createCheckout");
    return createCheckout(items, opts);
  }
  console.debug("[checkout] using fallback legacyCreateCheckout");
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

      checkout: async () => {
        const state = get();
        const items = state.items.map((it) => {
          const priceId = resolvePriceId(it);
          return { ...it, priceId, lineId: composeLineId(it) };
        });

        const missing = items.filter(i => !i.priceId);
        if (missing.length) {
          const names = missing.map(m => m.name || m.id || m.slug).join(", ");
          alert("Faltan priceId de Stripe para: " + names + ". Revisa src/data/products.js");
          console.error("[checkout] Faltan priceId:", missing);
          return null;
        }

        try {
          await callCreateCheckout(items, {
            success_url: `${window.location.origin}/success`,
            cancel_url: `${window.location.origin}/cancel`,
          });
        } catch (e) {
          console.error("[checkout] error:", e);
          alert(e?.message || "No se pudo iniciar el pago.");
        }
        return null;
      },
    }),
    {
      name: "guarros-cart",
      version: 9,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
      // ---- MIGRACIÓN: arregla estados viejos para evitar el warning/rotura ----
      migrate: (persistedState, fromVersion) => {
        try {
          const s = persistedState || {};
          // Estructura mínima
          if (!Array.isArray(s.items)) s.items = [];
          // Asegurar lineId en cada item y qty válida
          s.items = s.items.map((it) => {
            const qty = clampQty(it?.qty || 1);
            const lineId = composeLineId(it || {});
            return { ...it, qty, lineId };
          });
          return s;
        } catch {
          // Si algo falla, reseteamos limpio (mejor que romper)
          return { items: [] };
        }
      },
    }
  )
);
