import React from "react";
import { Link } from "react-router-dom";
export default function Cancel(){
  return (
    <section className="py-24">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h1 className="text-4xl font-stencil text-rojo">Pago cancelado</h1>
        <p className="text-gray-300 mt-4">No se ha realizado ningún cargo. Puedes volver al carrito y reintentarlo.</p>
        <Link to="/jamones" className="inline-block mt-8 px-6 py-3 rounded-full border border-gray-500 text-gray-200 hover:bg-white hover:text-black">Volver a la tienda</Link>
      </div>
    </section>
  );
}
