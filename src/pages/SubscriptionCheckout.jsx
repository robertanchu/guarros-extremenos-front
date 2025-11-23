// src/pages/SubscriptionCheckout.jsx
import React, { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useConfig } from "@/store/config"; // Usamos el nuevo store

const API_BASE = import.meta.env.VITE_API_BASE || "https://guarros-extremenos-api.onrender.com";
const FRONT_BASE = import.meta.env.VITE_FRONT_BASE || "https://guarrosextremenos.com";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function SubscriptionCheckout() {
  const query = useQuery();
  const location = useLocation();
  
  // --- LÓGICA DINÁMICA ---
  const { getPrice, getGramsList, fetchConfig } = useConfig();
  
  // Aseguramos datos frescos al cargar
  useEffect(() => { fetchConfig(); }, []);

  // Recuperar gramos de la URL o estado
  const urlGrams = Number(query.get("grams"));
  const stateGrams = location.state?.grams;
  
  // Validar si los gramos existen en nuestra lista; si no, usar el más cercano
  const grams = useMemo(() => {
    const target = stateGrams || urlGrams || 500;
    const list = getGramsList();
    if (list.length === 0) return 500; // Fallback de seguridad
    if (list.includes(target)) return target;
    // Fallback al más cercano
    return list.reduce((prev, curr) => Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev);
  }, [stateGrams, urlGrams, getGramsList]);

  // Obtener precio del store
  const priceEur = getPrice(grams);
  const planOk = priceEur != null;
  // ------------------------

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const priceFmt = (priceEur || 0).toLocaleString("es-ES", { 
    style: "currency", 
    currency: "EUR", 
    maximumFractionDigits: 2 
  });

  async function handleStart() {
    if (!planOk) return;
    try {
      setErr(""); 
      setLoading(true);
      
      const res = await fetch(`${API_BASE}/create-subscription-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grams,
          success_url: `${FRONT_BASE}/success`,
          cancel_url: `${FRONT_BASE}/cancel`,
          metadata: { source: "v3-dynamic-checkout" },
        }),
      });
      
      const data = await res.json().catch(() => ({}));
      
      if (!res.ok || !data.url) {
        throw new Error(data.error || "No se pudo iniciar la suscripción");
      }
      
      window.location.href = data.url;
    } catch (e) {
      console.error(e);
      setErr(e.message || "Error de conexión");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] w-full px-4 bg-black">
      <div className="mx-auto max-w-4xl py-10">
        <h1 className="mt-2 text-3xl md:text-5xl font-stencil text-brand">
          Suscripción — Resumen
        </h1>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Resumen plan */}
          <section className="lg:col-span-7 bg-white/5 border border-white/10 rounded-2xl p-5">
            <h2 className="text-lg font-black text-white tracking-wide mb-3 uppercase">
              Tu elección
            </h2>

            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-white font-bold text-lg">
                  Suscripción Jamón Canalla
                </p>
                <p className="text-white/70 text-lg mt-1">
                  <span className="text-brand font-bold">{grams} g</span> / mes — {priceFmt}
                </p>
                <p className="mt-4 text-white/60 text-sm leading-relaxed">
                  Gestiona o cancela tu suscripción fácilmente desde el portal de cliente.
                  Recibirás el acceso por correo tras el primer pago.
                </p>
              </div>
            </div>
          </section>

          {/* Acción y Totales */}
          <aside className="lg:col-span-5 bg-white/5 border border-white/10 rounded-2xl p-5 h-fit">
            <h2 className="text-lg font-black text-white tracking-wide mb-3 uppercase">
              Total primer mes
            </h2>

            <div className="flex items-center justify-between py-3 border-b border-white/10">
              <span className="text-white/70">Importe</span>
              <span className="text-white font-bold">{priceFmt}</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-white/70">Impuestos y envío</span>
              <span className="text-white/60 text-sm">
                Incluidos
              </span>
            </div>

            {err && (
              <div className="mt-3 text-sm text-red-200 bg-red-900/30 border border-red-500/30 rounded-lg px-3 py-2">
                {err}
              </div>
            )}

            <button
              type="button"
              onClick={handleStart}
              disabled={loading || !planOk}
              className="mt-5 w-full inline-flex items-center justify-center rounded-2xl px-5 py-4 font-black uppercase tracking-wide btn-primary btn-shiny disabled:opacity-60 disabled:cursor-not-allowed transition-all hover:scale-[1.02]"
              aria-label="Continuar al pago"
            >
              {loading ? "Conectando..." : "Suscribirme ahora"}
            </button>

            <div className="mt-6 flex justify-between gap-3 text-sm">
              <Link
                to="/suscripcion"
                className="group relative inline-flex items-center justify-center rounded-xl px-6 py-3 text-base font-stencil tracking-wide text-black bg-[#E53935] transition-colors duration-200 shadow-lg hover:bg-[#992623] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 active:scale-[0.98]"
              >
                <span className="relative z-10">Volver</span>
                <span className="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-[#E53935]/50 group-hover:ring-[#992623]/50 transition-all" />
              </Link>

              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-base font-stencil tracking-wide text-white border border-white/20 transition-colors duration-200 hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 active:scale-[0.98]"
              >
                Inicio
              </Link>
            </div>

            {!planOk && (
              <p className="mt-4 text-center text-xs text-yellow-300/80">
                Cantidad no válida. Vuelve atrás y selecciona un tramo permitido.
              </p>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}