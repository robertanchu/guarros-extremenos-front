import React from "react";
import logoFull from "@/assets/logo/logo_full_1024.webp";
import logoStacked from "@/assets/logo/logo_stacked_768.webp";
export default function Brand(){
  return (
    <a href="/" className="inline-block" aria-label="Guarros Extremeños — inicio">
      <img src={logoFull} alt="Guarros Extremeños" className="hidden md:block h-14 w-auto" fetchpriority="high" />
      <img src={logoStacked} alt="Guarros Extremeños" className="md:hidden h-12 w-auto" />
    </a>
  );
}
