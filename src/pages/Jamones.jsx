// src/pages/Jamones.jsx
import React from "react";
import { motion } from "framer-motion";
import { products as ALL_PRODUCTS } from "@/data/products";
import JamonCard from "@/components/JamonCard";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 110, damping: 18 }
  }
};

export default function Jamones(){
  const jamones = Array.isArray(ALL_PRODUCTS)
    ? ALL_PRODUCTS.filter((p) => p?.kind === "jamon-weight")
    : [];

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <h1 className="mt-2 text-3xl md:text-5xl font-stencil text-brand">JAMONES</h1>

        {jamones.length === 0 ? (
          <p className="mt-6 text-white/70">
            No hay jamones configurados. Revisa el export de <code>src/data/products.js</code> y que las rutas de imagen existan.
          </p>
        ) : (
          <motion.div
            className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {jamones.map((p) => (
              <motion.div key={p.id} variants={itemVariants}>
                <JamonCard product={p} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
