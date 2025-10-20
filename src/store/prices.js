// src/store/prices.js
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const API = import.meta.env.VITE_API_BASE || "https://guarros-extremenos-api.onrender.com";

// TTL en ms (por defecto 5 min). Puedes subirlo si quieres aún más rapidez.
const DEFAULT_TTL = Number(import.meta.env.VITE_PRICE_TTL_MS || 5 * 60 * 1000);

function now() {
  return Date.now();
}

export const usePrices = create(
  persist(
    (set, get) => ({
      // map: { priceId: { id, unit_amount, currency, product_name, ts } }
      map: {},
      ttl: DEFAULT_TTL,
      loading: false,

      setTTL: (ms) => set({ ttl: Number(ms) || DEFAULT_TTL }),

      // Devuelve del caché si está fresco
      getFresh(id) {
        const { map, ttl } = get();
        const hit = map[id];
        if (!hit) return null;
        if (now() - (hit.ts || 0) > ttl) return null;
        return hit;
      },

      // Inserta/actualiza varios precios en el mapa con sello de tiempo
      upsertMany(obj = {}) {
        const { map } = get();
        const next = { ...map };
        const stamp = now();
        for (const [id, p] of Object.entries(obj)) {
          if (p && p.unit_amount != null) next[id] = { ...p, ts: stamp };
        }
        set({ map: next });
      },

      // Prefetch por lote: pide sólo los que falten o estén caducados
      async prefetch(ids = []) {
        const uniq = Array.from(new Set(ids.filter(Boolean)));
        if (!uniq.length) return;

        const { getFresh } = get();
        const missing = uniq.filter((id) => !getFresh(id));
        if (!missing.length) return;

        set({ loading: true });
        try {
          const res = await fetch(`${API}/prices/resolve`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids: missing }),
          });
          if (res.ok) {
            const json = await res.json();
            get().upsertMany(json?.prices || {});
          }
        } catch {
          // silencioso: fallback local en tarjetas
        } finally {
          set({ loading: false });
        }
      },

      // Asegura que un id está disponible (prefetch si no fresco)
      async ensure(id) {
        if (!id) return null;
        const hit = get().getFresh(id);
        if (hit) return hit;
        await get().prefetch([id]);
        return get().getFresh(id);
      },

      // Selecciona muchos (devuelve objeto compacto)
      pickMany(ids = []) {
        const out = {};
        ids.forEach((id) => {
          const h = get().getFresh(id);
          if (h) out[id] = h;
        });
        return out;
      },
    }),
    {
      name: "prices-cache",
      storage: createJSONStorage(() => localStorage),
      version: 1,
      // small migrate to guard unknown shapes
      migrate: (state, _v) => state || { map: {}, ttl: DEFAULT_TTL, loading: false },
      partialize: (s) => ({ map: s.map, ttl: s.ttl }), // no persistimos loading
    }
  )
);
