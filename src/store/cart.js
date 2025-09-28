// src/store/cart.js
import { create } from "zustand";
import { toast } from "@/store/toast";

const isSubscription = (x={}) => {
  const n = (x.name || "").toLowerCase();
  const s = (x.slug || "").toLowerCase();
  return x.isSubscription === true || x.kind === "subscription" || /suscrip/.test(n) || /suscrip/.test(s);
};

const makeId = (seed) => {
  try {
    if (seed?.priceId && seed?.slug) return `line-${seed.priceId}-${seed.slug}`;
    if (seed?.priceId && seed?.name) return `line-${seed.priceId}-${seed.name}`;
    if (seed?.priceId) return `line-${seed.priceId}`;
  } catch {}
  return `line-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
};

export const useCart = create((set, get) => ({
  items: [],

  addItem: (payload) => {
    const it = { qty: 1, ...payload };
    if (!it.id) it.id = makeId(it);

    const sub = isSubscription(it);
    const state = get();

    // 🔒 Global guard: si ya hay una suscripción en el carrito, impedir añadir otra
    if (sub && state.items.some(isSubscription)) {
      toast({
        title: "Suscripción ya añadida",
        message: "Gestiona la suscripción actual desde el carrito.",
        variant: "warning",
      });
      return; // no modifica el estado
    }

    // clave para mergear líneas iguales (evita duplicados)
    const key = (x) => `${x.priceId || ""}::${x.slug || x.name || ""}`;

    set((s) => {
      const idx = s.items.findIndex((x) => key(x) === key(it));
      if (idx >= 0) {
        const items = s.items.slice();
        if (sub) {
          // suscripción: siempre 1 unidad
          items[idx] = { ...items[idx], qty: 1, isSubscription: true };
        } else {
          items[idx] = { ...items[idx], qty: items[idx].qty + (it.qty || 1) };
        }
        return { items };
      }
      // nueva línea
      return { items: [...s.items, { ...it, qty: sub ? 1 : (it.qty || 1), isSubscription: sub }] };
    });
  },

  removeItem: (matcher) => {
    set((s) => ({
      items: s.items.filter((x) => x.id !== matcher && x.priceId !== matcher),
    }));
  },

  decrement: (matcher) => {
    set((s) => {
      const items = s.items.map((x) => ({ ...x }));
      const idx = items.findIndex(
        (x) => x.id === matcher || x.priceId === matcher
      );
      if (idx === -1) return { items };
      if (isSubscription(items[idx])) {
        // no-op para suscripciones
        return { items };
      }
      if (items[idx].qty > 1) {
        items[idx].qty -= 1;
        return { items };
      }
      items.splice(idx, 1);
      return { items };
    });
  },

  increment: (matcher) => {
    set((s) => {
      const items = s.items.map((x) => ({ ...x }));
      const idx = items.findIndex(
        (x) => x.id === matcher || x.priceId === matcher
      );
      if (idx === -1) return { items };
      if (isSubscription(items[idx])) {
        // no-op para suscripciones
        return { items };
      }
      items[idx].qty += 1;
      return { items };
    });
  },

  clear: () => set({ items: [] }),
}));
