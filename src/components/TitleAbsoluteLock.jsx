// src/components/TitleAbsoluteLock.jsx
import { useEffect } from "react";

/**
 * Fuerza 100% el <title> a "Guarros Extremeños" incluso si Helmet u otro código intenta cambiarlo.
 * - Sobrescribe el setter de document.title
 * - Asegura y limpia nodos <title> duplicados en <head>
 * - Reaplica en intervalos cortos para cubrir writes inmediatos
 */
const BRAND = "Guarros Extremeños";

export default function TitleAbsoluteLock(){
  useEffect(() => {
    const ensureOneTitle = () => {
      let titleEl = document.head.querySelector("title");
      if (!titleEl) {
        titleEl = document.createElement("title");
        document.head.appendChild(titleEl);
      }
      titleEl.textContent = BRAND;

      // eliminar títulos extra que algunas libs inyectan
      const titles = Array.from(document.head.querySelectorAll("title"));
      titles.forEach((el, idx) => {
        if (idx > 0) el.remove();
      });
    };

    // 1) Set inicial
    ensureOneTitle();

    // 2) Override duro del setter de document.title
    try {
      const setHard = (val) => {
        // ignoramos el valor entrante y aplicamos siempre la marca
        ensureOneTitle();
        // devuelve el valor forzado
        return BRAND;
      };

      // Soporte para __defineSetter__ (webkit/legacy)
      if (document.__defineSetter__) {
        document.__defineSetter__("title", setHard);
      }

      // Redefinir propiedad en la instancia document (algunos navegadores lo permiten)
      try {
        Object.defineProperty(document, "title", {
          configurable: true,
          enumerable: true,
          set: setHard,
          get: () => BRAND,
        });
      } catch {}

      // Redefinir en el prototipo (fallback)
      try {
        const proto = Object.getPrototypeOf(document) || Document.prototype;
        const desc = Object.getOwnPropertyDescriptor(proto, "title");
        if (desc && desc.configurable) {
          Object.defineProperty(proto, "title", {
            configurable: true,
            enumerable: desc.enumerable ?? true,
            set: setHard,
            get: () => BRAND,
          });
        }
      } catch {}
    } catch {}

    // 3) Observer de todo el head
    const observer = new MutationObserver(() => ensureOneTitle());
    observer.observe(document.head, { childList: true, characterData: true, subtree: true });

    // 4) Intervalo corto para cubrir writes encadenados
    const id = setInterval(ensureOneTitle, 150);

    return () => {
      observer.disconnect();
      clearInterval(id);
    };
  }, []);

  return null;
}
