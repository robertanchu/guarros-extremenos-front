import React from "react";

/**
 * Logo seguro:
 * - Sirve desde /public/logo/...
 * - Si falla el primer src, intenta en minúsculas
 * - Si vuelve a fallar, muestra marca tipográfica (no bloquea render)
 */
export default function Brand(){
  const src1 = `${import.meta.env.BASE_URL}logo/Logo_final_sinletras.png`;
  const src2 = `${import.meta.env.BASE_URL}logo/logo_final_sinletras.png`;
  const handleError = (e) => {
    const img = e.currentTarget;
    if (img.dataset.altTried === "1") {
      img.style.display = "none";
      const sib = img.nextElementSibling;
      if (sib) sib.style.display = "inline-flex";
      return;
    }
    img.dataset.altTried = "1";
    img.onerror = null;
    img.src = src2;
  };

  return (
    <a href="/" className="inline-flex items-center" aria-label="Inicio">
      <img
        src={src1}
        alt="Guarros Extremeños"
        className="h-10 md:h-12 lg:h-14 w-auto select-none block"
        width={168}
        height={56}
        draggable="false"
        onError={handleError}
      />
      <span style={{display:"none"}} className="ml-2 font-stencil text-xl md:text-2xl text-white tracking-wide">
        GUARROS EXTREMEÑOS
      </span>
    </a>
  );
}\n