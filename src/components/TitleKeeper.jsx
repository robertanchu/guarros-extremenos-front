// src/components/TitleKeeper.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Fuerza siempre el <title> a la marca, sin subtítulos.
 */
const BRAND = "Guarros Extremeños";

export default function TitleKeeper(){
  const location = useLocation();

  useEffect(() => {
    document.title = BRAND;
  }, [location]);

  // Defensa extra: si algún código intenta cambiar el título, lo reponemos al siguiente tick.
  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (document.title !== BRAND) {
        Promise.resolve().then(() => { document.title = BRAND; });
      }
    });
    observer.observe(document.querySelector("title"), { childList: true });
    return () => observer.disconnect();
  }, []);

  return null;
}
