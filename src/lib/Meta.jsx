// src/lib/Meta.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const STATIC_TITLE = "Guarros Extremeños";

export default function Meta() {
  const location = useLocation();

  useEffect(() => {
    // Forzamos el título de forma limpia cada vez que cambiamos de ruta
    document.title = STATIC_TITLE;
  }, [location]); // Solo se ejecuta al navegar, no cada 150ms

  return null;
}