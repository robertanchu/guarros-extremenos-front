import React, { useEffect, useRef } from "react";

/**
 * CartDrawer robust: soporta distintas firmas de acciones del carrito.
 * Intentos por orden: fn(item), fn(item.id), fn(item.key), fn(item.lineId), fn(item.slug), fn(index)
 */
export default function CartDrawer({
  isOpen = false,
  onClose = () => {},
  items = [],
  removeItem = () => {},
  checkout = () => {},
  increment = () => {},
  decrement = () => {},
}) {
  const panelRef = useRef(null);

  // Close on ESC
  useEffect(() => {
    function onKey(e){
      if (e.key === "Escape" && isOpen) onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [isOpen]);

  const subtotal = items.reduce((sum, it) => sum + (Number(it.price) || 0) * (Number(it.qty) || 1), 0);
  const hasItems = items && items.length > 0;

  // Robust invoker: prueba varias firmas sin romper
  const robustCall = (fn, item, index) => {
    if (typeof fn !== "function") return;
    const candidates = [item, item?.id, item?.key, item?.lineId, item?.slug, index];
    for (let arg of candidates) {
      try {
        const ret = fn(arg);
        // si la función no lanza, damos por bueno el intento
        return ret;
      } catch (e) {
        // prueba siguiente
      }
    }
  };

  return (
    <div className={isOpen ? "pointer-events-auto" : "pointer-events-none"} aria-hidden={!isOpen}>
      {/* Backdrop */}
      <div
        className={
          "fixed inset-0 bg-black/60 transition-opacity duration-300 z-[90] " +
          (isOpen ? "opacity-100" : "opacity-0")
        }
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Carrito"
        className={[
            "fixed inset-y-0 right-0 h-full w-[94%] sm:w-[28rem] bg-black/95",
            "border-l border-white/10 shadow-2xl z-[100]",
            "transform transition-transform duration-300 will-change-transform",
            isOpen ? "translate-x-0" : "translate-x-full",
          ].join(" ")}
        style={{ ["--sat"]: "env(safe-area-inset-bottom)" }}
      >
        {/* Shell: flex column */}
        <div className="h-full flex flex-col">
          {/* Header sticky */}
          <div className="flex-none sticky top-0 px-4 sm:px-5 py-4 border-b border-white/10 bg-black/95 z-10">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-white text-lg font-semibold">Tu carrito</h2>
              <button
                type="button"
                onClick={onClose}
                className="h-9 px-3 rounded-lg border border-white/15 text-white/80 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
                aria-label="Cerrar carrito"
              >
                Cerrar
              </button>
            </div>
          </div>

          {/* Content scrollable */}
          <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-5 py-4 space-y-4">
            {!hasItems ? (
              <div className="text-white/70 text-sm">
                Tu carrito está vacío. Sigue explorando nuestros jamones y suscripciones.
              </div>
            ) : (
              items.map((it, idx) => (
                <div
                  key={(it.id ?? it.key ?? it.lineId ?? it.slug ?? it.name) + String(it.kind ?? "")}
                  className="rounded-xl border border-white/10 p-3 sm:p-4 bg-white/[0.03]"
                >
                  <div className="flex gap-3">
                    {it.image ? (
                      <img
                        src={it.image}
                        alt={it.name}
                        className="h-16 w-16 rounded-lg object-cover border border-white/10"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-lg border border-white/10 grid place-items-center text-white/50 text-xs">
                        IMG
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="text-white truncate">{it.name}</div>
                          {it.kind === "subscription" && (
                            <div className="text-[11px] text-brand mt-0.5">Suscripción</div>
                          )}
                        </div>
                        <div className="text-white font-semibold whitespace-nowrap">
                          {formatEUR((Number(it.price) || 0) * (Number(it.qty) || 1))}
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-3">
                        <div className="inline-flex items-center rounded-xl border border-white/15 overflow-hidden">
                          <button type="button" onClick={() => robustCall(decrement, it, idx)} className="h-9 w-9 text-white/80 hover:bg-white/10" aria-label="Disminuir">−</button>
                          <span className="w-10 text-center text-white/90">{it.qty ?? 1}</span>
                          <button type="button" onClick={() => robustCall(increment, it, idx)} className="h-9 w-9 text-white/80 hover:bg-white/10" aria-label="Aumentar">+</button>
                        </div>
                        <button
                          type="button"
                          onClick={() => robustCall(removeItem, it, idx)}
                          className="h-9 px-3 rounded-lg border border-white/15 text-white/70 hover:bg-white/10"
                          aria-label="Eliminar"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer sticky */}
          <div className="flex-none sticky bottom-0 px-4 sm:px-5 pt-3 pb-4 border-t border-white/10 bg-black/95 z-10">
            <div className="flex items-center justify-between text-white">
              <span className="text-sm text-white/70">Subtotal</span>
              <span className="text-lg font-semibold">{formatEUR(subtotal)}</span>
            </div>
            <p className="text-xs text-white/50 mt-1">Impuestos incluidos. Gastos de envío calculados en el checkout.</p>
            <button
              type="button"
              disabled={!hasItems}
              onClick={checkout}
              className={
                "mt-3 w-full h-11 rounded-xl text-white font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 " +
                (hasItems ? "bg-brand hover:bg-brand-700" : "bg-white/10 cursor-not-allowed")
              }
              aria-label="Finalizar compra"
            >
              Finalizar compra
            </button>
          </div>

          {/* Safe area padding */}
          <div className="flex-none" style={{ paddingBottom: "env(safe-area-inset-bottom)" }} />
        </div>
      </aside>
    </div>
  );
}

// Util: currency formatter (EUR)
function formatEUR(n){
  try {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 }).format(n || 0);
  } catch {
    return (n || 0).toFixed(2) + " €";
  }
}
