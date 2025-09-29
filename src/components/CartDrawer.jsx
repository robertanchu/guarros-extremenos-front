export default function CartDrawer({
  isOpen, onClose, items = [], removeItem = () => {}, checkout = () => {}
}) {
  return (
    <aside className={`fixed top-0 right-0 h-full w-[94%] sm:w-[420px] bg-[#0c0c0c] border-l border-white/10 shadow-2xl transition-transform ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
      <div className="flex items-center justify-between px-5 h-14 border-b border-white/10">
        <h3 className="text-white font-black">Tu carrito</h3>
        <button onClick={onClose} className="text-white/70 hover:text-white" aria-label="Cerrar carrito">✕</button>
      </div>

      <div className="p-5 space-y-4 overflow-y-auto h-[calc(100%-7.5rem)]">
        {items.length === 0 ? (
          <p className="text-white/60">Tu carrito está tristemente vacío.</p>
        ) : items.map((it) => (
          <div key={it.id} className="flex items-start gap-3 rounded-xl border border-white/10 p-3">
            <img src={it.image || "/og/og-default.jpg"} alt={it.name} className="h-16 w-16 object-cover rounded-lg" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-white font-bold">{it.name}</h4>
                <span className="text-white/80 font-semibold">{(it.price/100).toFixed(2)}€</span>
              </div>
              <p className="text-xs text-white/50 mt-1">{it.variant || "Producto"}</p>

              {/* Sin +/- si es suscripción */}
              {it.type !== "subscription" && (
                <div className="mt-2 flex items-center gap-2">
                  <button onClick={() => it.decrease?.(it.id)} className="h-7 w-7 rounded-lg border border-white/15 text-white/80 hover:bg-white/10">−</button>
                  <span className="text-white/90">{it.qty ?? 1}</span>
                  <button onClick={() => it.increase?.(it.id)} className="h-7 w-7 rounded-lg border border-white/15 text-white/80 hover:bg-white/10">+</button>
                </div>
              )}

              <button
                onClick={() => removeItem(it.id)}
                className="mt-3 inline-flex items-center gap-2 text-sm font-bold text_white bg-[#E53935] hover:bg-[#d23431] rounded-lg px-3 py-1.5"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-5 border-t border-white/10">
        <button
          onClick={checkout}
          className="w-full inline-flex items-center justify-center rounded-xl px-5 py-3 text-base font-extrabold text-black bg-[#E53935] hover:bg-[#d23431] transition shadow-lg"
        >
          Pagar
        </button>
      </div>
    </aside>
  );
}
