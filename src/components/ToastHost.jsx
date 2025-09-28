// src/components/ToastHost.jsx
import React from "react";
import { useToastStore } from "@/store/toast";

const VARIANTS = {
  info: "bg-white/10 backdrop-blur text-white border border-white/15",
  success: "bg-emerald-600/95 text-white",
  warning: "bg-amber-600/95 text-white",
  error: "bg-red-600/95 text-white",
};

export default function ToastHost(){
  const toasts = useToastStore((s) => s.toasts);
  const remove = useToastStore((s) => s.remove);

  return (
    <div className="pointer-events-none fixed top-4 right-4 z-[100] flex flex-col gap-3">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={
            "pointer-events-auto w-[92vw] max-w-sm rounded-2xl shadow-xl p-4 animate-in slide-in-from-top-2 fade-in " +
            (VARIANTS[t.variant] || VARIANTS.info)
          }
          role="status"
          aria-live="polite"
        >
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              {t.title && <div className="font-semibold">{t.title}</div>}
              {t.message && <div className="text-sm opacity-90 break-words">{t.message}</div>}
            </div>
            <button
              onClick={() => remove(t.id)}
              className="ml-2 p-1 rounded-lg hover:bg-black/10"
              aria-label="Cerrar"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="currentColor" d="M18.3 5.71 12 12l6.3 6.29-1.41 1.42L10.59 13.4 4.29 19.7 2.88 18.3 9.17 12 2.88 5.71 4.29 4.3l6.3 6.29 6.29-6.3Z"/>
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
