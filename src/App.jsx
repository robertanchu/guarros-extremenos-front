// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import Meta from "@/lib/Meta";
import OgPerRoute from "@/components/OgPerRoute";
import { ConsentProvider } from "@/consent/ConsentContext";
import CookieBanner from "@/components/CookieBanner";

import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";
import { useCart } from "@/store/cart"; // <-- tu store real

// Páginas
import Home from "@/pages/Home";
import Jamones from "@/pages/Jamones";
import Suscripcion from "@/pages/Suscripcion";
import Dehesa from "@/pages/Dehesa";
import Contacto from "@/pages/Contacto";
import Terminos from "@/pages/legales/Terminos";
import Privacidad from "@/pages/legales/Privacidad";
import CookiesPage from "@/pages/legales/Cookies";
import CookiePreferences from "@/components/CookiePreferences";

function Layout(){
  // ADAPTA estos selectores a tu store real:
  const {
    isOpen, closeCart, items, removeItem, checkout
  } = useCart?.() ?? { isOpen:false, closeCart:()=>{}, items:[], removeItem:()=>{}, checkout:()=>{} };

  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jamones" element={<Jamones />} />
        <Route path="/suscripcion" element={<Suscripcion />} />
        <Route path="/dehesa" element={<Dehesa />} />
        <Route path="/contacto" element={<Contacto />} />

        <Route path="/terminos" element={<Terminos />} />
        <Route path="/privacidad" element={<Privacidad />} />
        <Route path="/cookies" element={<><CookiesPage /><CookiePreferences /></>} />

        <Route path="*" element={<Home />} />
      </Routes>

      <CartDrawer
        isOpen={isOpen}
        onClose={closeCart}
        items={items}
        removeItem={removeItem}
        checkout={checkout}
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
