// src/components/Reviews.jsx
import { motion } from "framer-motion";

const REVIEWS = [
  { name: "María G.", text: "El mejor jamón que he probado. Sabe a dehesa y a guasa.", rating: 5 },
  { name: "Jorge L.", text: "Calidad de 10. El toque canalla de la marca me flipa.", rating: 5 },
  { name: "Ana R.", text: "Envío rápido y perfecto. Repetiré seguro.", rating: 5 },
];

export default function Reviews(){
  return (
    <section className="bg-[#0a0a0a] py-14 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-black text-white mb-8">
          La gente habla (bien)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((r, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-[#E53935]/25 bg-white/[0.03] p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] hover:shadow-[0_0_0_1px_rgba(229,57,53,0.6)] transition"
            >
              <div className="flex items-center gap-2 text-[#E53935] text-sm">
                {"★".repeat(r.rating)}<span className="text-white/50">({r.name})</span>
              </div>
              <p className="mt-3 text-white/90 leading-relaxed">{r.text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
