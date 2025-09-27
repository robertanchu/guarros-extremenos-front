import React from "react";
import { MEDIA } from "@/data/media";
import { Link } from "react-router-dom";

export default function DehesaTeaser(){
  return (
    <section className="relative my-12">
      <div className="container">
        <div className="relative overflow-hidden rounded-2xl border border-white/10">
          <img src={MEDIA.og.dehesa} alt="La Dehesa" className="w-full h-[360px] md:h-[420px] object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10" />
          <div className="absolute inset-0 p-6 md:p-10 flex items-end">
            <div className="max-w-2xl">
              <h3 className="text-2xl md:text-4xl font-stencil text-white">La Dehesa, nuestra verdad</h3>
              <p className="text-zinc-200 mt-2">Encinas, bellotas y tiempo. Así se cría un jamón que no necesita ceremonia.</p>
              <Link to="/dehesa" className="mt-4 inline-block btn-secondary">Conoce la historia</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
