import React from "react";
import logo from "@/assets/logo/Logo_final_sinletras.png"; // PNG sin fondo (ajusta la ruta si tu logo vive en otro sitio)

export default function Brand(){
  return (
    <a href="/" className="inline-flex items-center" aria-label="Inicio">
      <img
        src={logo}
        alt="Guarros Extremeños"
        className="h-10 md:h-12 lg:h-14 w-auto select-none"
        draggable="false"
      />
    </a>
  );
}
