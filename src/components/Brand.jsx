import React from "react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo/logo_full_1024.webp";
export default function Brand(){
  return (
    <Link to="/" className="inline-flex items-center gap-3" aria-label="Inicio">
      <img src={logo} alt="Guarros Extremeños" className="h-10 w-auto" />
    </Link>
  );
}
