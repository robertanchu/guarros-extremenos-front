import React from "react";
import { Link } from "react-router-dom";
import logoSVG from "@/assets/logo/logo_final.svg";
import logoWEBP from "@/assets/logo/logo_full_1024.webp";
import logoPNG from "@/assets/logo/logo_pig.png";

export default function Brand(){
  const onError = (e) => {
    if (e.currentTarget.dataset.fallback === "svg") {
      e.currentTarget.src = logoWEBP;
      e.currentTarget.dataset.fallback = "webp";
    } else if (e.currentTarget.dataset.fallback === "webp") {
      e.currentTarget.src = logoPNG;
      e.currentTarget.dataset.fallback = "png";
    }
  };

  return (
    <Link to="/" className="inline-flex items-center gap-3" aria-label="Inicio">
      <img
        src={logoSVG}
        onError={onError}
        data-fallback="svg"
        alt="Guarros Extremeños"
        className="h-12 w-auto md:h-14 block drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]"
        style={{ filter: "drop-shadow(0 1px 6px rgba(0,0,0,.5))" }}
      />
    </Link>
  );
}
