import React from "react";
import { Link } from "react-router-dom";
import pig from "@/assets/logo/logo_pig.png";
import letters from "@/assets/logo/logo_letters.png";

export default function Brand(){
  return (
    <Link to="/" className="inline-flex" aria-label="Inicio">
      <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2 leading-none">
        <img src={pig} alt="Guarros Extremeños" className="h-10 md:h-12 w-auto block" />
        <img src={letters} alt="" aria-hidden="true" className="h-7 md:h-10 w-auto block md:-ml-1" />
      </div>
    </Link>
  );
}
