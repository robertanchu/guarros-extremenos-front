// src/store/config.js
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Valores por defecto (Fallback de seguridad por si el servidor se cae)
const FALLBACK_TABLE = {
  100: 4600, 200: 5800, 300: 6900, 400: 8000, 500: 9100, 
  600: 10300, 700: 11400, 800: 12500, 900: 13600, 1000: 14800, 
  1500: 20400, 2000: 26000,
};

const API = import.meta.env.VITE_API_BASE || "https://guarros-extremenos-api.onrender.com";

export const useConfig = create(
  persist(
    (set, get) => ({
      prices: FALLBACK_TABLE,
      loading: false,
      fetchedAt: 0,

      // Acción para actualizar precios desde el servidor
      fetchConfig: async () => {
        // Si ya los pedimos hace menos de 5 minutos, no molestamos al servidor (Cache)
        if (Date.now() - get().fetchedAt < 5 * 60 * 1000) return;

        set({ loading: true });
        try {
          const res = await fetch(`${API}/api/config`);
          if (res.ok) {
            const data = await res.json();
            if (data.subscriptionTable) {
              set({ prices: data.subscriptionTable, fetchedAt: Date.now() });
            }
          }
        } catch (e) {
          console.warn("Usando precios offline:", e);
        } finally {
          set({ loading: false });
        }
      },

      // Helper para obtener precio (devuelve en EUROS para pintar)
      getPrice: (grams) => {
        const cents = get().prices[grams];
        return cents ? cents / 100 : null;
      },
      
      // Helper para obtener tramos válidos
      getGramsList: () => Object.keys(get().prices).map(Number).sort((a, b) => a - b),
    }),
    {
      name: "guarros-config", // Se guarda en localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);