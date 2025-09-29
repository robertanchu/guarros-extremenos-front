// src/components/CookieBanner.jsx
import React from "react";
import { useConsent } from "@/consent/ConsentContext";

export default function CookieBanner(){
  const { consent, save } = useConsent();
  if (consent.decided) return null;

  const acceptAll = () => save({ analytics: true, marketing: true });
  const rejectAll = () => save({ analytics: false, marketing: false });

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] sm:w-[720px] rounded-2xl bg-[#111] border border-white/15 shadow-2xl p-5">
      <h4 className="text-white font-black mb-2">¿Te damos jamón… y cookies?</h4>
      <p className="text-white/80 text-sm">
        Usamos cookies necesarias y, si aceptas, analíticas y de marketing.
        <a className="text-[#E53935] ml-1 underline" href="/cookies">Saber más</a>
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={rejectAll} className="px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10">Rechazar</button>
        <button onClick={acceptAll} className="px-4 py-2 rounded-lg bg-[#E53935] text-black font-bold hover:bg-[#d23431]">Aceptar todo</button>
        <button onClick={() => save({})} className="px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10">
          Aceptar solo necesarias
        </button>
        <a href="#cookie-preferences" className="px-4 py-2 rounded-lg text-white/80 underline">Preferencias</a>
      </div>
    </div>
  );
}
