import React from 'react';
export default function CookieBanner(){
  const [seen, setSeen] = React.useState(()=> localStorage.getItem('cookieSeen')==='1');
  const allow = ()=>{ localStorage.setItem('cookieSeen','1'); setSeen(true); };
  if (seen) return null;
  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 z-[60] max-w-xl rounded-2xl bg-black/85 border border-white/10 p-4 backdrop-blur">
      <p className="text-sm text-zinc-200">
        Usamos cookies esenciales y analíticas opcionales para mejorar la experiencia. Puedes cambiarlas en “Cookies”.
      </p>
      <div className="mt-3 flex gap-3">
        <button onClick={allow} className="btn-primary">Aceptar</button>
        <a className="btn-secondary" href="/cookies">Configurar</a>
      </div>
    </div>
  );
}
