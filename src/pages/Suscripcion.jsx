import React, { useState } from "react"; 
import Meta from "../lib/Meta";
import FAQ from "@/components/FAQ";
import PlansCompare from "@/components/PlansCompare";
import "@/styles/effects.css";

import { useCart } from "@/store/cart";
import { useUI } from "@/store/ui";
import { isSubscription } from "@/lib/subscription";

// --- URL API ---
const API_BASE = import.meta.env.VITE_API_BASE || "https://guarros-extremenos-api.onrender.com";

const FAQS = [
  { q: "¿Hay compromiso de permanencia?", a: "No. Puedes pausar o cancelar cuando quieras desde tu cuenta o escribiéndonos." },
  { q: "¿Los sobres son al vacío?", a: "Sí, para preservar sabor y textura. Abre y sirve." },
  { q: "¿Puedo cambiar de plan más adelante?", a: "Claro, puedes subir o bajar de gramos cuando quieras." },
];

// --- COMPONENTE NUEVO: Formulario de recuperación ---
function SubscriptionRecovery() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email) return;
    
    setStatus("loading");
    try {
      const res = await fetch(`${API_BASE}/api/recover-subscription`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  return (
    <section className="py-12 border-t border-white/10 bg-white/5">
      <div className="max-w-xl mx-auto px-4 text-center">
        <h2 className="text-xl md:text-2xl font-stencil text-white mb-3">
          ¿Ya tienes una suscripción?
        </h2>
        <p className="text-zinc-400 mb-6 text-sm md:text-base">
          Si necesitas cambiar tu tarjeta, ver facturas o cancelar y no encuentras el correo de acceso,
          introduce tu email y te enviaremos un enlace mágico de acceso instantáneo.
        </p>

        {status === "success" ? (
          <div className="bg-green-500/20 border border-green-500/30 text-green-200 p-4 rounded-xl animate-fade-in">
            <p className="font-bold">¡Correo enviado!</p>
            <p className="text-sm mt-1 opacity-80">Revisa tu bandeja de entrada (y spam) para acceder a tu cuenta.</p>
            <button 
              onClick={() => setStatus("idle")} 
              className="mt-3 text-xs underline hover:text-white transition-colors"
            >
              Volver a enviar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              required
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-black/40 border border-white/20 text-white placeholder-white/30 rounded-xl px-4 py-3 outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="btn-primary rounded-xl px-6 py-3 text-black font-black font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {status === "loading" ? "Enviando..." : "Gestionar mi plan"}
            </button>
          </form>
        )}
        
        {status === "error" && (
          <p className="mt-3 text-sm text-red-400">
            Ocurrió un error al conectar. Por favor, inténtalo de nuevo.
          </p>
        )}
      </div>
    </section>
  );
}

export default function Suscripcion() {
  const { items } = useCart();
  const openCart = () => useUI.getState().openCart();
  const hasSubscription = items.some(isSubscription);

  return (
    <main className="shell py-12 md:py-16">
      <Meta
        title="Suscripción Jamón Canalla | Guarros Extremeños"
        description="Tu jamón favorito en suscripción mensual, sin ataduras."
      />

      {/* Cabecera */}
      <header className="mb-8 md:mb-12">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h1 className="text-3xl md:text-5xl font-stencil text-brand">Suscripción Jamón Canalla</h1>
          <p className="mt-4 text-zinc-300">
            El sabor que manda, cada mes en tu casa. Sin postureo, sin esperas y con la pureza del 100% ibérico D.O.P Dehesa de Extremadura.
          </p>
        </div>
      </header>

      {/* Aviso carrito */}
      {hasSubscription && (
        <div className="max-w-4xl mx-auto px-4 mb-8">
          <div className="alert">
            <div className="flex items-start gap-3">
              <div className="shrink-0 mt-0.5">
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.75-11.5a.75.75 0 011.5 0V9a.75.75 0 01-1.5 0V6.5zm.75 6a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="alert-title">Ya tienes una suscripción en el carrito</div>
                <div className="alert-desc">Solo puede haber una por carrito. Puedes cambiar de plan eliminando la actual.</div>
              </div>
              <div>
                <button type="button" onClick={openCart} className="btn-secondary">
                  Ver carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comparativa de planes */}
      <PlansCompare />

      {/* NUEVA SECCIÓN DE RECUPERACIÓN */}
      <SubscriptionRecovery />

      {/* FAQ */}
      <section className="mt-16 md:mt-24">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 text-center md:text-left">
            Preguntas frecuentes
          </h2>
          <FAQ items={FAQS} />
        </div>
      </section>
    </main>
  );
}