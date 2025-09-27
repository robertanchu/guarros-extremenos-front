import React from "react";

export default function Brand(){
  // Servimos desde /public si existe
  const src1 = `${import.meta.env.BASE_URL}logo/Logo_final_sinletras.png`;
  const src2 = `${import.meta.env.BASE_URL}logo/logo_final_sinletras.png`;
  const onErr = (e) => {
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
        className="h-[3.75rem] md:h-[4.5rem] lg:h-[5.25rem] w-auto select-none block"
        width={252}
        height={84}
        draggable="false"
        onError={onErr}
      />
      {/* fallback tipográfico oculto */}
      <span style={{display:"none"}} className="ml-2 font-stencil text-2xl md:text-3xl text-white tracking-wide">
        GUARROS EXTREMEÑOS
      </span>
    </a>
  );
}
