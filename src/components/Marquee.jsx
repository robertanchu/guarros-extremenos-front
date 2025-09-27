import React from "react";

export default function Marquee(){
  const content = (
    <>
      <span className="mx-6">TAN GUARROS QUE SÓLO COMEN BELLOTAS</span>·
      <span className="mx-6">Jamón 100% bellota</span>·
      <span className="mx-6">D.O.P Dehesa de Extremadura</span>·
      <span className="mx-6">Curación lenta</span>·
    </>
  );

  return (
    <div className="overflow-hidden border-y border-black/20 bg-brand text-white">
      <div className="pointer-events-none h-[1px] w-full bg-white/20" />
      <div className="relative">
        <div
          className="flex whitespace-nowrap py-3"
          style={{ animation: "marquee 22s linear infinite" }}
        >
          <div className="flex">{content}{content}</div>
        </div>
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
}
