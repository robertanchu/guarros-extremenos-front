// src/components/TitleKeeper.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Fuerza SIEMPRE el <title> a la marca, vigilando todo el <head>.
 * Esto neutraliza Helmet/react-helmet, cambios de páginas y cualquier seteo posterior.
 */
const BRAND = "Guarros Extremeños";

export default function TitleKeeper(){
  const location = useLocation();

  useEffect(() => {
    // Forzar en cada navegación
    if (document.title !== BRAND) 
  }, [location]);

  useEffect(() => {
    const ensure = () => {
      if (document.title !== BRAND) {
        
      }
      // si no hay <title>, lo creamos
      let t = document.head.querySelector("title");
      if (!t) {
        t = document.createElement("title");
        t.textContent = BRAND;
        document.head.appendChild(t);
      }
    };

    // 1) Asegurar ahora mismo
    ensure();

    // 2) Observar TODO el head (subtree) para cualquier cambio
    const observer = new MutationObserver(() => {
      ensure();
    });
    observer.observe(document.head, {
      childList: true,
      characterData: true,
      subtree: true,
    });

    // 3) Tick corto por si alguna librería reescribe justo después
    const id = setInterval(ensure, 200);

    return () => {
      observer.disconnect();
      clearInterval(id);
    };
  }, []);

  return null;
}
