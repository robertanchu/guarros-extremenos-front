import React from "react";
export default function Contacto(){
  return (
    <section className="py-16">
      <div className="max-w-5xl mx-auto px-6">
        <h1 className="text-4xl font-stencil text-dorado mb-6">Contacto</h1>
        <form className="grid gap-4 max-w-xl">
          <input className="bg-[#111] border border-[#333] rounded px-4 py-3 text-white" placeholder="Nombre" />
          <input className="bg-[#111] border border-[#333] rounded px-4 py-3 text-white" placeholder="Email" />
          <textarea rows="5" className="bg-[#111] border border-[#333] rounded px-4 py-3 text-white" placeholder="Mensaje" />
          <button className="px-6 py-3 rounded bg-rojo text-white font-bold uppercase hover:brightness-110">Enviar</button>
        </form>
      </div>
    </section>
  );
}
