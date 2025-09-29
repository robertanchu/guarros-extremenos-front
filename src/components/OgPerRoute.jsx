// src/components/OgPerRoute.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { setOgImage } from "@/lib/seo";

const MAP = {
  "/": "/og/og-default.jpg",
  "/jamones": "/og/og-jamones.jpg",
  "/suscripcion": "/og/og-suscripcion.jpg",
  "/dehesa": "/og/og-dehesa.jpg",
  "/contacto": "/og/og-contacto.jpg",
  "/terminos": "/og/og-default.jpg",
  "/privacidad": "/og/og-default.jpg",
  "/cookies": "/og/og-default.jpg",
};

export default function OgPerRoute() {
  const { pathname } = useLocation();
  useEffect(() => {
    const img = MAP[pathname] || MAP["/"];
    setOgImage(img);
  }, [pathname]);
  return null;
}
