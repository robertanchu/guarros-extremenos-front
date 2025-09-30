import React, { useEffect } from "react";

/**
 * CartDrawer — v53
 * - Suscripciones: oculta controles y texto de cantidad; muestra precio como "€ /mes"
 * - Productos normales: mantiene controles y totales por línea
 * - Firmas store: increment(matcher), decrement(matcher), removeItem(matcher) con matcher = id || priceId
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
  useEffect(() => {
    function onKey(e){
      if (e.key === "Escape" && isOpen) onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [isOpen]);

  const subtotal = items.reduce((sum, it) => sum + (Number(it.price) || 0) * (Number(it.qty) || 1), 0);
  const hasItems = items && items.length > 0;
  const keyOf = (it) => it?.id ?? it?.priceId;

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
        role="dialog"
        aria-modal="true"
        aria-label="Carrito"
        className={[
            "fixed inset-y-0 right-0 h-full w-[94%] sm:w-[28rem] bg-gradient-to-b from-black to-black/95",
            "border-l border-white/10 shadow-2xl z-[100]",
            "transform transition-transform duration-300 will-change-transform",
            isOpen ? "translate-x-0" : "translate-x-full",
          ].join(" ")}
        style={{ ["--sat"]: "env(safe-area-inset-bottom)" }}
      >
        {/* Inline styles for qty hover accent */}
        <style>{`
          .qty-pill {
            border-radius: 9999px;
            border: 1px solid rgba(255,255,255,.15);
            background: rgba(255,255,255,.03);
            transition: border-color .2s ease, box-shadow .2s ease, background-color .2s ease;
          }
          .qty-pill:hover {
            border-color: var(--brand-500, #C3342E);
            box-shadow: 0 0 0 1px rgba(195,52,46,.25), 0 6px 18px rgba(195,52,46,.20);
            background: rgba(195,52,46,.06);
          }
        `}</style>

        {/* Accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-brand" aria-hidden="true" />

        {/* Shell */}
        <div className="h-full flex flex-col relative">
          {/* Header */}
          <div className="flex-none sticky top-0 px-4 sm:px-5 py-4 border-b border-white/10 bg-black/95 z-10">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-brand text-xl font-stencil tracking-wide">TU CARRITO</h2>
              <button
                type="button"
                onClick={onClose}
                className="h-9 px-3 rounded-lg border border-white/15 text-white/80 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
              >
                Cerrar
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-h-0 overflow-y-auto">
            {hasItems ? (
              <ul className="divide-y divide-white/8">
                {items.map((it) => {
                  const isSub = it.kind === "subscription" || it.isSubscription === true;
                  const qty = Number(it.qty) || 1;
                  const unit = Number(it.price) || 0;
                  const lineTotal = unit * qty;
                  return (
                    <li
                      key={(it.id ?? it.priceId ?? it.slug ?? it.name) + String(it.kind ?? "")}
                      className="px-4 sm:px-5 py-4"
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
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="text-white truncate">{it.name}</div>
                              {isSub && (
                                <div className="text-[11px] text-brand mt-0.5 uppercase tracking-wide">Suscripción</div>
                              )}
                            </div>

                            {/* Precio por línea */}
                            <div className="text-white font-semibold whitespace-nowrap">
                              {isSub ? (
                                <>
                                  {formatEUR(unit)}<span className="text-white/70 text-sm">/mes</span>
                                </>
                              ) : (
                                formatEUR(lineTotal)
                              )}
                            </div>
                          </div>

                          <div className="mt-3 flex items-center justify-between gap-3">
                            {/* Qty controls — ocultos completamente si es suscripción */}
                            {isSub ? (
                              <div /> /* sin cantidad */
                            ) : (
                              <div className="inline-flex items-center qty-pill overflow-hidden">
                                <button
                                  type="button"
                                  onClick={() => decrement(keyOf(it))}
                                  className="h-9 w-9 text-white/80 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
                                  aria-label="Disminuir"
                                >
                                  −
                                </button>
                                <span className="w-10 text-center text-white/90">{qty}</span>
                                <button
                                  type="button"
                                  onClick={() => increment(keyOf(it))}
                                  className="h-9 w-9 text-white/80 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
                                  aria-label="Aumentar"
                                >
                                  +
                                </button>
                              </div>
                            )}

                            {/* Remove */}
                            <button
                              type="button"
                              onClick={() => removeItem(keyOf(it))}
                              className="inline-flex items-center gap-2 h-9 px-3 rounded-lg border border-white/15 text-white/70 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
                            >
                              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 100 2h.293l.853 10.234A2 2 0 007.142 18h5.716a2 2 0 001.996-1.766L15.707 6H16a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zm-1 6a1 1 0 112 0v7a1 1 0 11-2 0V8zm4 0a1 1 0 112 0v7a1 1 0 11-2 0V8z" clipRule="evenodd" />
                              </svg>
                              Eliminar
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="px-4 sm:px-5 py-10 text-center">
                <div className="mx-auto h-16 w-16 rounded-2xl border border-white/10 grid place-items-center text-white/50">🛒</div>
                <p className="mt-4 text-white/80">Tu carrito está vacío.</p>
                <p className="text-white/60 text-sm">Sigue explorando nuestros jamones y suscripciones.</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex-none sticky bottom-0 px-4 sm:px-5 pt-4 pb-4 border-t border-white/10 bg-black/95 z-10">
            <div className="flex items-center justify-between text-white">
              <span className="text-sm text-white/70">Subtotal</span>
              <span className="text-xl font-semibold">{formatEUR(subtotal)}</span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs text-white/65">
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M3 5a2 2 0 012-2h6a2 2 0 012 2v3h1.586a2 2 0 011.414.586l1.828 1.828A2 2 0 0119 11.828V14a2 2 0 01-2 2h-1a2 2 0 11-4 0H8a2 2 0 11-4 0H3a2 2 0 01-2-2V7a2 2 0 012-2zM6 16a1 1 0 100-2 1 1 0 000 2zm9 0a1 1 0 100-2 1 1 0 000 2z" />
              </svg>
              <span>Envío y descuentos se calculan en el checkout.</span>
            </div>
            <button
              type="button"
              disabled={!hasItems}
              onClick={checkout}
              className={
                "mt-3 w-full h-11 rounded-2xl text-white font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 " +
                (hasItems ? "bg-brand hover:bg-brand-700" : "bg-white/10 cursor-not-allowed")
              }
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
