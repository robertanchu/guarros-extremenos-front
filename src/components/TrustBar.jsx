import React from "react";
const ITEMS = [
  { t: "D.O.P Extremadura", s: "Auténtico 100% bellota" },
  { t: "Curación lenta",    s: "Tiempo, no atajos" },
  { t: "Pago seguro",       s: "Stripe · PCI DSS" },
  { t: "Envío 24/48h",      s: "Península" },
];
export default function TrustBar(){
  return (
    <section className="border-b border-white/10 bg-black/50">
      <div className="shell py-5 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        {ITEMS.map((x,i)=>(
          <div key={i} className="flex flex-col items-start md:items-center">
            <span className="text-white">{x.t}</span>
            <span className="text-zinc-400">{x.s}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
