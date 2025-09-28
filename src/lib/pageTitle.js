// src/lib/pageTitle.js
/**
 * Establece un subtítulo de página manteniendo siempre la marca.
 * Ejemplo: setPageTitle("Jamones") -> "Guarros Extremeños — Jamones"
 * Para limpiar y dejar solo la marca: setPageTitle("")
 */
export function setPageTitle(subtitle = ""){
  window.dispatchEvent(new CustomEvent("guarros:set-title", { detail: subtitle }));
}
