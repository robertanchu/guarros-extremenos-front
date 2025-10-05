import React from "react";
import { Routes, Route } from "react-router-dom";

import Meta from "@/lib/Meta";
import OgPerRoute from "@/components/OgPerRoute";
import { ConsentProvider } from "@/consent/ConsentContext";
import CookieBanner from "@/components/CookieBanner";

import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";

import { useCart } from "@/store/cart";
import { useUI } from "@/store/ui";
import { useHydrateCatalog } from "@/hooks/useHydrateCatalog";

// Pages
import Home from "@/pages/Home";
import Jamones from "@/pages/Jamones";
import Suscripcion from "@/pages/Suscripcion";
import Dehesa from "@/pages/Dehesa";
import Contacto from "@/pages/Contacto";
import Terminos from "@/pages/legales/Terminos";
import Privacidad from "@/pages/legales/Privacidad";
import CookiesPage from "@/pages/legales/Cookies";
import AvisoLegal from "@/pages/legales/AvisoLegal";
import CookiePreferences from "@/components/CookiePreferences";
import Producto from "@/pages/Producto";
import Checkout from "@/pages/Checkout";
import Success from "@/pages/Success";
import Cancel from "@/pages/Cancel";
import SubscriptionCheckout from "@/pages/SubscriptionCheckout";

function Layout(){
  // Hidrata catálogo para que /producto/:slug funcione también con refresh/URL directa
  useHydrateCatalog();

  const { items, removeItem, checkout, increment, decrement } = useCart();
  const { cartOpen, closeCart } = useUI();

  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jamones" element={<Jamones />} />
        <Route path="/producto/:slug" element={<Producto />} />
        <Route path="/suscripcion" element={<Suscripcion />} />
        <Route path="/dehesa" element={<Dehesa />} />
        <Route path="/contacto" element={<Contacto />} />

	<Route path="/checkout" element={<Checkout />} />
	<Route path="/success" element={<Success />} />
	<Route path="/cancel" element={<Cancel />} />

	<Route path="/suscripcion/checkout" element={<SubscriptionCheckout />} />

        {/* Rutas legales - nuevas /legal/* */}
        <Route path="/legal/terminos" element={<Terminos />} />
        <Route path="/legal/privacidad" element={<Privacidad />} />
        <Route path="/legal/cookies" element={<><CookiesPage /><CookiePreferences /></>} />
        <Route path="/legal/aviso-legal" element={<AvisoLegal />} />

        {/* Compat con rutas antiguas */}
        <Route path="/terminos" element={<Terminos />} />
        <Route path="/privacidad" element={<Privacidad />} />
        <Route path="/cookies" element={<><CookiesPage /><CookiePreferences /></>} />

        <Route path="*" element={<Home />} />
      </Routes>

      {/* Footer profesional */}
      <Footer />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={closeCart}
        items={items}
        removeItem={removeItem}
        checkout={checkout}
        increment={increment}
        decrement={decrement}
      />
    </>
  );
}

export default function App(){
  return (
    <ConsentProvider>
      <Meta />
      <OgPerRoute />
      <Layout />
      <CookieBanner />
    </ConsentProvider>
  );
}
