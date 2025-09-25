import React from "react";
import { Link } from "react-router-dom";
export default function Success(){
  return (
    <section className="py-24">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h1 className="text-4xl font-stencil text-dorado">¡Pedido completado!</h1>
        <p className="text-gray-300 mt-4">Gracias por tu compra. Te hemos enviado un email con los detalles.</p>
        <Link to="/jamones" className="inline-block mt-8 px-6 py-3 rounded-full bg-rojo text-white font-bold uppercase hover:brightness-110">Seguir comprando</Link>
      </div>
    </section>
  );
}
