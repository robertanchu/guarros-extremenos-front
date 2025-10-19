import React from "react";

// API base por si necesitamos pedir un precio individual (fallback)
const API = import.meta.env.VITE_API_BASE || "https://guarros-extremenos-api.onrender.com";

function classNames(...xs) {
  return xs.filter(Boolean).join(" ");
}

export default function JamonCard({
  product,
  priceBase,   // { id, unit_amount, currency, text, ... } precargado desde Jamones.jsx (opcional)
  priceSliced,  // idem
  onAdd,        // (product, qty, activePriceId, variantLabel) => void
}) {
  const [qty, setQty] = React.useState(1);
  const [variant, setVariant] = React.useState("base"); // "base" | "sliced"
  const [loadingFallback, setLoadingFallback] = React.useState(false);
  const [fallbackPrice, setFallbackPrice] = React.useState(null);

  // priceId activo
  const activePriceId =
    variant === "sliced" ? product?.priceIdSliced || priceSliced?.id : product?.priceIdBase || priceBase?.id;

  const priceObj = variant === "sliced" ? priceSliced : priceBase;

  // Fallback: si no nos llega price precargado, pedimos al backend
  React.useEffect(() => {
    let alive = true;
    async function loadOne() {
      if (priceObj || !activePriceId) {
        setFallbackPrice(null);
        return;
      }
      setLoadingFallback(true);
      try {
        const res = await fetch(`${API}/price/${encodeURIComponent(activePriceId)}`);
        if (!res.ok) throw new Error("No price");
        const p = await res.json();
        if (alive) setFallbackPrice(p);
      } catch {
        if (alive) setFallbackPrice(null);
      } finally {
        if (alive) setLoadingFallback(false);
      }
    }
    loadOne();
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePriceId]);

  const priceText =
    priceObj?.text ??
    (fallbackPrice?.unit_amount != null
      ? new Intl.NumberFormat("es-ES", {
          style: "currency",
          currency: fallbackPrice.currency?.toUpperCase() || "EUR",
        }).format(fallbackPrice.unit_amount / 100)
      : loadingFallback
      ? "…"
      : "—");

  const variantLabel = variant === "sliced" ? "Loncheado" : "Pieza entera";

  // Estilos de botón “canalla” (coherente con los que venimos usando)
  const btnCanalla = classNames(
    "relative inline-flex items-center justify-center select-none",
    "px-4 py-2 rounded-xl font-extrabold tracking-wide uppercase",
    "bg-gradient-to-b from-[#D62828] to-[#a61f1f] text-white",
    "shadow-[0_10px_25px_rgba(214,40,40,0.35)]",
    "transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-0",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#D62828] focus-visible:ring-offset-black"
  );

  const outlineBtn = (active) =>
    classNames(
      "h-10 px-3 rounded-lg text-sm transition-colors",
      "border",
      active
        ? "border-[#D62828] text-white bg-[#D62828]/10"
        : "border-white/15 text-white/80 hover:border-white/30 hover:text-white"
    );

  const qtyBtn = classNames(
    "h-9 w-9 inline-flex items-center justify-center rounded-lg border border-white/15",
    "text-lg leading-none hover:border-white/30 active:scale-95 transition"
  );

  return (
    <article className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
      {/* Imagen */}
      <div className="aspect-[4/3] w-full overflow-hidden bg-black">
        <img
          src={product?.image || "/images/placeholder-ham.jpg"}
          alt={product?.title || "Jamón"}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* Contenido */}
      <div className="p-4">
        <h3 className="text-lg font-bold">{product?.title}</h3>
        {product?.subtitle ? (
          <p className="mt-1 text-sm text-white/70">{product.subtitle}</p>
        ) : null}

        {/* Selector variante */}
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => setVariant("base")}
            className={outlineBtn(variant === "base")}
            aria-pressed={variant === "base"}
          >
            Pieza entera
          </button>
          <button
            type="button"
            onClick={() => setVariant("sliced")}
            className={outlineBtn(variant === "sliced")}
            aria-pressed={variant === "sliced"}
            disabled={!product?.priceIdSliced && !priceSliced}
            title={(!product?.priceIdSliced && !priceSliced) ? "No disponible" : "Loncheado"}
          >
            Loncheado
          </button>
        </div>

        {/* Precio */}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-xl font-extrabold">{priceText}</span>
          {variant === "sliced" ? (
            <span className="text-xs text-white/60">incluye loncheado</span>
          ) : null}
        </div>

        {/* Cantidad + Añadir */}
        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className={qtyBtn}
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              aria-label="Disminuir cantidad"
            >
              −
            </button>
            <span className="w-8 text-center font-semibold">{qty}</span>
            <button
              type="button"
              className={qtyBtn}
              onClick={() => setQty((q) => Math.min(99, q + 1))}
              aria-label="Aumentar cantidad"
            >
              +
            </button>
          </div>

          <button
            type="button"
            className={btnCanalla}
            onClick={() => onAdd && onAdd(product, qty, activePriceId, variantLabel)}
            disabled={!activePriceId}
            aria-disabled={!activePriceId}
            title={!activePriceId ? "Falta configurar priceId de Stripe" : "Añadir al carrito"}
          >
            Añadir al carrito
          </button>
        </div>
      </div>
    </article>
  );
}
