import React from "react";
export default function Marquee(){
  return (
    <div className="overflow-hidden border-y border-white/10">
      <div className="animate-[marquee_22s_linear_infinite] whitespace-nowrap py-3 text-zinc-300">
        <span className="mx-6">TAN GUARROS QUE SÓLO COMEN BELLOTAS</span>·
        <span className="mx-6">Jamón 100% bellota</span>·
        <span className="mx-6">D.O.P Dehesa de Extremadura</span>·
        <span className="mx-6">Curación lenta</span>·
      </div>
      <style>{`@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>
    </div>
  );
}
