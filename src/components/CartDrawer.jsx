import React from "react";

export default function CartDrawer({
  isOpen,
  onClose,
  items = [],
  removeItem = () => {},
  checkout = () => {},
  increment = () => {},
  decrement = () => {},
}) {
  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 transition-opacity ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-[92%] sm:w-[28rem] max-w-[32rem] bg-black/95 border-l border-white/10 transition-transform ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        role="dialog"
        aria-modal="true"
        aria-label="Carrito"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-white text-lg font-semibold">Tu carrito</h2>
          <button onClick={onClose} className="text-white/70 hover:text-white">Cerrar</button>
        </div>

        {/* Items */}
        <div className="p-5 space-y-4 overflow-y-auto h-[calc(100%-7.5rem)]">
          {items.length === 0 ? (
            <p className="text-white/60">Tu carrito está tristemente vacío.</p>
          ) : (
            items.map((it) => (
              <div key={it.id} className="flex items-start gap-3 rounded-xl border border-white/10 p-3">
                <div className="flex-1">
                  <div className="font-medium text-white">{it.name}</div>
                  <div className="text-white/70 text-sm">
                    {(Number(it.price ?? 0) * Number(it.qty ?? 1)).toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
                  </div>

                  {it.type !== "subscription" && (
                    <div className="mt-2 flex items-center gap-2">
                      <button onClick={() => decrement(it.id)} className="h-8 w-8 rounded-lg border border-white/15 text-white/80 hover:bg-white/10">−</button>
                      <span className="text-white/90">{it.qty ?? 1}</span>
                      <button onClick={() => increment(it.id)} className="h-8 w-8 rounded-lg border border-white/15 text-white/80 hover:bg-white/10">+</button>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => removeItem(it.id)}
                  className="mt-3 inline-flex items-center gap-2 text-white bg-[#E53935] hover:bg-[#d23431] rounded-lg px-3 py-1.5"
                >
                  Eliminar
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={checkout}
            className="w-full rounded-xl bg-white text-black hover:bg-white/90 font-medium px-5 py-3"
          >
            Finalizar compra
          </button>
        </div>
      </aside>
    </>
  );
}
