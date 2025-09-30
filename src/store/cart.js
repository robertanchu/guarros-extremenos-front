// src/store/cart.js
// v13 — Recupera increment/decrement/remove con identidad compuesta (lineId).
// Mantiene checkout determinista a `${VITE_BACKEND_URL}/create-checkout-session`
// y resolución de priceId desde el catálogo.

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { PRODUCTS as CATALOG } from "@/data/products";

const isSubscriptionItem = (it) => it?.kind === "subscription" || it?.isSubscription === true || it?.type === "recurring";

const variantOf = (it = {}) => {
  const cand =
    it.variant ?? it.format ?? it.presentation ?? it.cut ?? it.size ?? it.weight ??
    it.tipo ?? it.formato ?? it.opcion ?? it.option ?? (Array.isArray(it.options) ? it.options.join("|") : "") ?? "";
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
const clampQty = (n, min = 1, max = 99) => {
  const x = Number(n);
  if (!Number.isFinite(x)) return min;
  return Math.min(Math.max(Math.trunc(x), min), max);
};
const calcSubtotal = (items) =>
  items.reduce((sum, it) => sum + (Number(it.price) || 0) * (Number(it.qty) || 1), 0);

const findIndexByMatcher = (items, matcher) => {
  if (matcher == null) return -1;
  const m = String(matcher);
  let idx = items.findIndex((it) => String(it.lineId) === m);
  if (idx !== -1) return idx;
  idx = items.findIndex((it) =>
    it.id === matcher || it.priceId === matcher || it.slug === matcher ||
    it.sku === matcher || it.key === matcher || it.name === matcher
  );
  return idx;
};

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

function extractUrlFromBody(text) {
  try {
    const j = JSON.parse(text);
    const url = j?.url || j?.redirectUrl || j?.checkoutUrl || j?.data?.url || null;
    if (url && typeof url === "string" && url.startsWith("http")) return url;
  } catch {}
  if (typeof text === "string") {
    const m = text.match(/https?:\/\/[^\s"']+/i);
    if (m && m[0]) return m[0];
  }
  return null;
}

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
          const incoming = { ...product, lineId: composeLineId(product) };

          const next = [...state.items];
          const existingIdx = next.findIndex((it) => String(it.lineId) === String(incoming.lineId));

          if (isSub) {
            const alreadySubIdx = next.findIndex((it) => isSubscriptionItem(it));
            const merged = { ...incoming, qty: 1 };
            if (alreadySubIdx !== -1) next[alreadySubIdx] = merged;
            else next.push(merged);
            return { items: next };
          }

          if (existingIdx !== -1) {
            const curr = next[existingIdx];
            next[existingIdx] = { ...curr, qty: clampQty((curr.qty || 1) + desiredQty) };
          } else {
            next.push({ ...incoming, qty: desiredQty });
          }
          return { items: next };
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
          next[idx] = { ...item, qty: clampQty((item.qty || 1) + 1) };
          return { items: next };
        }),

      decrement: (matcher) =>
        set((state) => {
          const idx = findIndexByMatcher(state.items, matcher);
          if (idx === -1) return state;
          const item = state.items[idx];
          if (isSubscriptionItem(item)) return state;
          const nextQty = clampQty((item.qty || 1) - 1);
          const next = [...state.items];
          next[idx] = { ...item, qty: nextQty };
          return { items: next };
        }),

      clear: () => set({ items: [] }),

      checkout: async () => {
        const state = get();
        const items = state.items.map((it) => ({ ...it, priceId: resolvePriceId(it) }));
        const missing = items.filter(i => !i.priceId);
        if (missing.length) {
          const names = missing.map(m => m.name || m.id || m.slug).join(", ");
          alert("Faltan priceId de Stripe para: " + names + ". Revisa src/data/products.js");
          console.error("[checkout] Faltan priceId:", missing);
          return null;
        }

        const BASE = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, "") || "";
        if (!BASE) {
          alert("VITE_BACKEND_URL no está configurado");
          return null;
        }

        const success_url = `${window.location.origin}/success`;
        const cancel_url  = `${window.location.origin}/cancel`;
        const payload = {
          items: items.map(i => ({ price: i.priceId, quantity: i.qty })),
          success_url,
          cancel_url
        };

        try {
          const res = await fetch(`${BASE}/create-checkout-session`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          const text = await res.text();
          const url = extractUrlFromBody(text);
          if (res.ok && url) {
            window.location.assign(url);
            return null;
          }
          console.error("[checkout] respuesta", res.status, text.slice(0, 500));
          alert("No se pudo iniciar el pago. Revisa Network → Response y pásame el contenido.");
        } catch (e) {
          console.error("[checkout] error:", e);
          alert(e?.message || "No se pudo iniciar el pago.");
        }
        return null;
      },
    }),
    {
      name: "guarros-cart",
      version: 13,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
      migrate: (persistedState) => {
        try {
          const s = persistedState || {};
          if (!Array.isArray(s.items)) s.items = [];
          s.items = s.items.map((it) => ({
            ...it,
            qty: clampQty(it?.qty || 1),
            lineId: composeLineId(it || {}),
          }));
          return s;
        } catch {
          return { items: [] };
        }
      },
    }
  )
);
