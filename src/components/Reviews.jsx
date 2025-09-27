import React, { useState, useEffect } from "react";
const DATA = [
  { n:"Lucía", t:"“De escándalo. Sabor largo, cero postureo.”" },
  { n:"Carles", t:"“El loncheado vuela en casa. Textura brutal.”" },
  { n:"Marta",  t:"“Suscripción 1 kg/mes y a vivir. Tal cual.”" },
];
export default function Reviews(){
  const [i,setI]=useState(0);
  useEffect(()=>{ const id=setInterval(()=> setI(s=>(s+1)%DATA.length), 3500); return ()=>clearInterval(id); },[]);
  const r = DATA[i];
  return (
    <section className="py-12 border-y border-white/10 bg-black/50">
      <div className="container text-center">
        <p className="text-amber-300 text-sm">Reseñas</p>
        <p className="mt-3 text-xl md:text-2xl text-white">{r.t}</p>
        <p className="mt-2 text-zinc-400">— {r.n}</p>
      </div>
    </section>
  );
}
