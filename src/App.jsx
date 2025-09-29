// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import Meta from "@/lib/Meta";
import OgPerRoute from "@/components/OgPerRoute";
import { ConsentProvider } from "@/consent/ConsentContext";
import CookieBanner from "@/components/CookieBanner";

// Tus páginas
import Home from "@/pages/Home";
import Jamones from "@/pages/Jamones";          // si existe
import Suscripcion from "@/pages/Suscripcion";  // si existe
import Dehesa from "@/pages/Dehesa";            // si existe
import Contacto from "@/pages/Contacto";        // si existe

// Legales
import Terminos from "@/pages/legales/Terminos";
import Privacidad from "@/pages/legales/Privacidad";
import CookiesPage from "@/pages/legales/Cookies";
import CookiePreferences from "@/components/CookiePreferences";

export default function App() {
  return (
    <ConsentProvider>
      <Meta />
      <OgPerRoute />

      {/* Header aquí si lo tienes, y Footer al final */}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jamones" element={<Jamones />} />
        <Route path="/suscripcion" element={<Suscripcion />} />
        <Route path="/dehesa" element={<Dehesa />} />
        <Route path="/contacto" element={<Contacto />} />

        {/* Legales */}
        <Route path="/terminos" element={<Terminos />} />
        <Route path="/privacidad" element={<Privacidad />} />
        <Route path="/cookies" element={<><CookiesPage /><CookiePreferences /></>} />

        {/* Fallback opcional */}
        <Route path="*" element={<Home />} />
      </Routes>

      <CookieBanner />
      {/* Footer */}
    </ConsentProvider>
  );
}

