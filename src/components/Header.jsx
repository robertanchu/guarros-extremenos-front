import { Link, NavLink } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/store/cart";
import { useUI } from "@/store/ui";

export default function Header(){
  const { items } = useCart();
  const { openCart } = useUI();
  const itemsCount = items.reduce((a, x) => a + (x.qty ?? 1), 0);

  return (
    <header
      className="sticky top-0 z-50 w-full bg-black/70 backdrop-blur border-b border-white/10"
      style={{ position: "sticky", top: 0, zIndex: 50, width: "100%", background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", borderBottom: "1px solid rgba(255,255,255,0.1)" }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 h-14 md:h-16"
           style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 1rem", height: "64px" }}>
        {/* Logo + Home (fallback) */}
        <div className="flex items-center gap-3">
          <Link to="/" className="text-white font-semibold">Home</Link>
        </div>

        {/* Botón carrito */}
        <button
          onClick={openCart}
          className="relative ml-3 inline-flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 transition-all h-11 w-11 md:h-12 md:w-12"
          style={{ position: "relative", marginLeft: "0.75rem", display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: "0.75rem", background: "rgba(255,255,255,0.05)", height: "44px", width: "44px" }}
          aria-label="Abrir carrito"
        >
          <ShoppingCart className="h-6 w-6 text-white" />
          {itemsCount > 0 && (
            <span
              className="absolute -top-1 -right-1 text-[11px] font-bold leading-none bg-[#E53935] text-white rounded-full px-1.5 py-0.5 shadow"
              style={{ position: "absolute", top: "-6px", right: "-6px", fontSize: "11px", fontWeight: 700, background: "#E53935", color: "#fff", borderRadius: "999px", padding: "2px 6px" }}
            >
              {itemsCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
