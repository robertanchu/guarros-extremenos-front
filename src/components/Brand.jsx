import React from "react";

export default function Brand(){
  // rutas estáticas servidas por Vite desde /public
  const srcMain = "/logo/Logo_final_sinletras.png";
  const srcFallback = "/logo/Logo_final_letras.png"; // opcional si lo tienes

  return (
    <a href="/" className="inline-flex items-center" aria-label="Inicio">
      <img
        src={srcMain}
        onError={(e)=>{ e.currentTarget.src = srcFallback; }}
        alt="Guarros Extremeños"
        className="h-10 md:h-12 lg:h-14 w-auto select-none"
        draggable="false"
      />
    </a>
  );
}
