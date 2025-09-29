import { Link, NavLink } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/store/cart";
import { useUI } from "@/store/ui";

export default function Header(){
  const { items } = useCart();
  const { openCart } = useUI();
  const itemsCount = items.reduce((a, x) => a + (x.qty ?? 1), 0);

  return (
    <header className="sticky top-0 z-50 w-full bg-black/70 backdrop-blur border-b border-white/10">
      {/* ...resto de tu header (logo, nav, etc.)... */}
      <button
        onClick={openCart}
        className="relative ml-3 inline-flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 transition-all h-11 w-11 md:h-12 md:w-12"
        aria-label="Abrir carrito"
      >
        <ShoppingCart className="h-6 w-6 text-white" />
        {itemsCount > 0 && (
          <span className="absolute -top-1 -right-1 text-[11px] font-bold leading-none bg-[#E53935] text-white rounded-full px-1.5 py-0.5 shadow">
            {itemsCount}
          </span>
        )}
      </button>
    </header>
  );
}
