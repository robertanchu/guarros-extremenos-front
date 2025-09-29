// src/components/CookiePreferences.jsx
import React, { useState, useEffect } from "react";
import { useConsent } from "@/consent/ConsentContext";

export default function CookiePreferences(){
  const { consent, save } = useConsent();
  const [analytics, setAnalytics] = useState(consent.analytics);
  const [marketing, setMarketing] = useState(consent.marketing);

  useEffect(() => {
    setAnalytics(consent.analytics);
    setMarketing(consent.marketing);
  }, [consent]);

  const apply = () => save({ analytics, marketing });

  return (
    <section id="cookie-preferences" className="mx-auto max-w-3xl px-4 py-10 text-white/90">
      <h2 className="text-2xl font-black mb-2">Preferencias de Cookies</h2>
      <p className="text-white/70 mb-6">Ajusta aquí qué cookies no esenciales quieres permitir.</p>

      <div className="space-y-4">
        <Toggle
          title="Analíticas"
          description="Nos ayudan a entender qué funciona y qué podemos mejorar."
          checked={analytics}
          onChange={setAnalytics}
        />
        <Toggle
          title="Marketing"
          description="Permite mostrarte promos y anuncios más relevantes."
          checked={marketing}
          onChange={setMarketing}
        />
      </div>

      <div className="mt-6 flex gap-3">
        <button onClick={apply} className="px-5 py-2 rounded-lg bg-[#E53935] text-black font-bold hover:bg-[#d23431]">Guardar</button>
        <a href="/cookies" className="px-5 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10">Ver política de cookies</a>
      </div>
    </section>
  );
}

function Toggle({ title, description, checked, onChange }){
  return (
    <label className="flex items-start gap-3">
      <input type="checkbox" className="mt-1 h-5 w-5" checked={checked} onChange={e => onChange(e.target.checked)} />
      <div>
        <div className="font-bold text-white">{title}</div>
        <div className="text-white/70 text-sm">{description}</div>
      </div>
    </label>
  );
}
