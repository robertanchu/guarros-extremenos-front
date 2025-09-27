import React, { useState, useEffect } from "react";

export default function ClubGuarro(){
  const [email, setEmail] = useState("");
  const [ok, setOk] = useState(false);
  useEffect(()=>{
    const saved = localStorage.getItem("club_guarro_email");
    if(saved) { setEmail(saved); setOk(true); }
  },[]);
  const submit = (e)=>{
    e.preventDefault();
    const valid = /.+@.+\..+/.test(email);
    if(!valid) return alert("Pon un email válido, sin postureo 😉");
    localStorage.setItem("club_guarro_email", email);
    setOk(true);
  };
  return (
    <section className="py-16">
      <div className="container grid md:grid-cols-2 gap-8 items-center">
        <div>
          <p className="text-amber-300 text-sm">Club Guarro</p>
          <h3 className="text-3xl md:text-4xl font-stencil text-white mt-1">Únete al club (sin tonterías)</h3>
          <p className="text-zinc-300 mt-3">Descuentos puntuales, lotes exclusivos y acceso temprano a campañas. Cero spam. Cero latas.</p>
        </div>
        <form onSubmit={submit} className="rounded-2xl border border-white/10 bg-white/5 p-4 md:p-6">
          {!ok ? (
            <div className="flex flex-col sm:flex-row gap-3">
              <input value={email} onChange={e=>setEmail(e.target.value)} type="email" required
                     placeholder="tu@email.com"
                     className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand" />
              <button className="btn-primary btn-shiny">Apuntarme</button>
            </div>
          ) : (
            <div className="text-amber-300">¡Dentro! Te avisamos de lo bueno.</div>
          )}
        </form>
      </div>
    </section>
  );
}
