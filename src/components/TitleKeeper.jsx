// src/components/TitleKeeper.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Mantiene el <title> del tab siempre con el nombre de marca.
 * Permite opcionalmente añadir un sufijo de página usando un evento:
 *   setPageTitle("Jamones") -> "Guarros Extremeños — Jamones"
 * Si no se establece nada, será siempre "Guarros Extremeños".
 */
const BRAND = "Guarros Extremeños";

export default function TitleKeeper(){
  const location = useLocation();

  useEffect(() => {
    // Título por defecto al cambiar de ruta
    document.title = BRAND;
  }, [location]);

  useEffect(() => {
    // Handler para eventos de título puntuales
    const handler = (e) => {
      const page = (e.detail || "").trim();
      if (page) document.title = `${BRAND} — ${page}`;
      else document.title = BRAND;
    };
    window.addEventListener("guarros:set-title", handler);
    return () => window.removeEventListener("guarros:set-title", handler);
  }, []);

  return null;
}
