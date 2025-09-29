export default function CartDrawer({
  isOpen,
  onClose,
  items = [],
  removeItem = () => {},
  checkout = () => {},
  increment = () => {},
  decrement = () => {},
}) {
  const styleFallback = {
    position: "fixed",
    top: 0,
    right: 0,
    height: "100%",
    width: "94%",
    backgroundColor: "rgba(0,0,0,0.95)",
    borderLeft: "1px solid rgba(255,255,255,0.1)",
    transform: isOpen ? "translateX(0)" : "translateX(100%)",
    transition: "transform 300ms ease",
  };

  return (
    <aside
      className={`fixed top-0 right-0 h-full w-[94%] sm:w-[28rem] bg-black/95 border-l border-white/10 transition-transform ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      style={styleFallback}
    >
      {/* Header del drawer */}
      <div className="flex items-center justify-between p-4 border-b border-white/10" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <h2 className="text-white text-lg font-semibold" style={{ color: "#fff", fontSize: "1.125rem", fontWeight: 600 }}>Tu carrito</h2>
        <button onClick={onClose} className="text-white/70 hover:text-white" style={{ color: "rgba(255,255,255,0.7)" }}>Cerrar</button>
      </div>

      <div className="p-5 space-y-4 overflow-y-auto h-[calc(100%-7.5rem)]" style={{ padding: "1.25rem", overflowY: "auto", height: "calc(100% - 7.5rem)" }}>
        {items.length === 0 ? (
          <p className="text-white/60" style={{ color: "rgba(255,255,255,0.6)" }}>Tu carrito está tristemente vacío.</p>
        ) : (
          items.map((it) => (
            <div
              key={it.id}
              className="flex items-start gap-3 rounded-xl border border-white/10 p-3"
              style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", borderRadius: "0.75rem", border: "1px solid rgba(255,255,255,0.1)", padding: "0.75rem" }}
            >
              <div className="flex-1" style={{ flex: 1 }}>
                <div className="font-medium text-white" style={{ color: "#fff", fontWeight: 500 }}>{it.name}</div>
                <div className="text-white/70 text-sm" style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.875rem" }}>
                  {(Number(it.price ?? 0) * Number(it.qty ?? 1)).toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
                </div>

                {it.type !== "subscription" && (
                  <div className="mt-2 flex items-center gap-2" style={{ marginTop: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <button
                      onClick={() => decrement(it.id)}
                      className="h-8 w-8 rounded-lg border border-white/15 text-white/80 hover:bg-white/10"
                      style={{ height: "32px", width: "32px", borderRadius: "0.5rem", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.8)", background: "transparent" }}
                    >
                      −
                    </button>
                    <span className="text-white/90" style={{ color: "rgba(255,255,255,0.9)" }}>{it.qty ?? 1}</span>
                    <button
                      onClick={() => increment(it.id)}
                      className="h-8 w-8 rounded-lg border border-white/15 text-white/80 hover:bg-white/10"
                      style={{ height: "32px", width: "32px", borderRadius: "0.5rem", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.8)", background: "transparent" }}
                    >
                      +
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => removeItem(it.id)}
                className="mt-3 inline-flex items-center gap-2 text-white bg-[#E53935] hover:bg-[#d23431] rounded-lg px-3 py-1.5"
                style={{ marginTop: "0.75rem", display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "#fff", background: "#E53935", borderRadius: "0.5rem", padding: "0.375rem 0.75rem" }}
              >
                Eliminar
              </button>
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t border-white/10" style={{ padding: "1rem", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <button
          onClick={checkout}
          className="w-full rounded-xl bg-white text-black hover:bg-white/90 font-medium px-5 py-3"
          style={{ width: "100%", borderRadius: "0.75rem", background: "#fff", color: "#000", fontWeight: 500, padding: "0.75rem 1.25rem" }}
        >
          Finalizar compra
        </button>
      </div>
    </aside>
  );
}
