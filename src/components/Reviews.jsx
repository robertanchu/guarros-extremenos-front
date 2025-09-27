import React, { useState, useEffect } from "react";

const DATA = [
  { n:"Lucía G.", t:"“De escándalo. Sabor largo, cero postureo.”" },
  { n:"Carles M.", t:"“El loncheado vuela en casa. Textura brutal.”" },
  { n:"Marta R.",  t:"“Suscripción 1 kg/mes y a vivir. Tal cual.”" },
];

function StarRow(){
  return (
    <div className="flex gap-1 text-amber-300">
      {Array.from({length:5}).map((_,i)=>(
        <svg key={i} viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
          <path fill="currentColor" d="M10 1.5 12.9 7l6.1.9-4.4 4.3 1 6.1L10 15.9 4.4 18.3l1-6.1L1 7.9 7.1 7z"/>
        </svg>
      ))}
    </div>
  );
}

function Avatar({name}){
  const initials = name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
  return (
    <div className="w-10 h-10 rounded-full bg-brand/90 text-white flex items-center justify-center text-sm font-semibold ring-2 ring-dorado/50">
      {initials}
    </div>
  );
}

export default function Reviews(){
  const [i,setI]=useState(0);
  useEffect(()=>{ const id=setInterval(()=> setI(s=>(s+1)%DATA.length), 3500); return ()=>clearInterval(id); },[]);
  const r = DATA[i];
  return (
    <section className="py-16 border-y border-white/10 bg-gradient-to-b from-black/40 via-black/60 to-black/40">
      <div className="container">
        <div className="text-center mb-8">
          <p className="text-amber-300 tracking-wide text-sm">La gente habla</p>
          <h3 className="mt-2 text-2xl md:text-3xl font-stencil text-white">Opiniones sin filtro</h3>
        </div>
        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
            <div className="flex items-center gap-4">
              <Avatar name={r.n} />
              <div>
                <div className="text-white font-medium">{r.n}</div>
                <StarRow />
              </div>
            </div>
            <p className="mt-5 md:mt-6 text-xl md:text-2xl text-zinc-100">{r.t}</p>
            <div className="mt-6 h-1 w-24 rounded-full bg-gradient-to-r from-brand to-dorado" />
          </div>
          <div className="flex justify-center gap-2 mt-6">
            {DATA.map((_,idx)=>(
              <span key={idx} className={"h-2 w-2 rounded-full " + (idx===i ? "bg-amber-300" : "bg-zinc-600")}></span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
