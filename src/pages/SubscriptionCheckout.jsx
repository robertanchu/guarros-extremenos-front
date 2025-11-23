// src/pages/SubscriptionCheckout.jsx
import React, { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useConfig } from "@/store/config"; // <--- USAMOS EL STORE NUEVO

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
  
  // Aseguramos datos frescos
  useEffect(() => { fetchConfig(); }, []);

  // Recuperar gramos de la URL o estado
  const urlGrams = Number(query.get("grams"));
  const stateGrams = location.state?.grams;
  
  // Validar si los gramos existen en nuestra lista, si no, usar el más cercano
  const grams = useMemo(() => {
    const target = stateGrams || urlGrams || 500;
    const list = getGramsList();
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

  const priceFmt = (priceEur || 0).toLocaleString("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

  async function handleStart() {
    if (!planOk) return;
    try {
      setErr(""); setLoading(true);
      // ... (El resto del fetch es IGUAL que antes, el backend ya valida los gramos)
      const res = await fetch(`${API_BASE}/create-subscription-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grams, // Enviamos los gramos validados
          success_url: `${FRONT_BASE}/success`,
          cancel_url: `${FRONT_BASE}/cancel`,
          metadata: { source: "v3-dynamic-checkout" },
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "Error al iniciar");
      window.location.href = data.url;
    } catch (e) {
      console.error(e);
      setErr(e.message);
      setLoading(false);
    }
  }

  // ... (El JSX es idéntico al anterior, solo asegúrate de usar las variables nuevas)
  return (
    <div className="min-h-[70vh] w-full px-4">
       {/* ... código UI igual al anterior ... */}
       <div className="text-white font-bold text-lg">Suscripción Jamón Canalla</div>
       <div className="text-white/70">{grams} g / mes — {priceFmt}</div>
       {/* ... resto del componente ... */}
       <button onClick={handleStart} disabled={loading || !planOk} className="btn-primary btn-shiny mt-5 w-full py-3 rounded-2xl font-black uppercase">
         {loading ? "Conectando..." : "Suscribirme"}
       </button>
       {/* ... */}
    </div>
  );
}