// src/pages/Home.jsx
import HeroPlus from "@/components/HeroPlus";
import Reviews from "@/components/Reviews";

export default function Home(){
  return (
    <>
      <HeroPlus />
      <Reviews />
      <section className="py-16 bg-gradient-to-b from-black via-[#0b0b0b] to-black border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="rounded-2xl border border-[#E53935]/30 bg-[#E53935]/5 p-8 md:p-10 text-center">
            <h3 className="text-2xl md:text-3xl font-black text-white">Club Guarro</h3>
            <p className="text-white/80 mt-3">Descuentos, novedades y acceso anticipado a lotes. Sin spam, prometido.</p>
            <form className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <input
                type="email"
                placeholder="tu@email.com"
                className="px-4 py-3 rounded-xl bg-black/60 border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#E53935]/50"
              />
              <button className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-base font-extrabold text-black bg-[#E53935] hover:bg-[#d23431] transition shadow-lg">
                Apuntarme
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
