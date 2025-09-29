// src/pages/legales/Cookies.jsx
import React from "react";

export default function Cookies(){
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 text-white/90 leading-relaxed">
      <h1 className="text-3xl font-black text-white mb-6">Política de Cookies</h1>
      <p className="text-sm text-white/60 mb-10">Última actualización: [[FECHA_ACTUALIZACION]]</p>

      <p>
        Este Sitio utiliza cookies y tecnologías similares. Algunas son necesarias para que la web funcione (no requieren consentimiento). 
        Otras (analítica, marketing) se activan solo si las aceptas.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-2">¿Qué es una cookie?</h2>
      <p>Archivo que se guarda en tu dispositivo para recordar información y mejorar tu experiencia.</p>

      <h2 className="text-xl font-bold mt-8 mb-2">Tipos de cookies</h2>
      <ul className="list-disc pl-6">
        <li><strong>Necesarias:</strong> sesión, carrito, seguridad, checkout.</li>
        <li><strong>Preferencias:</strong> idioma, configuración.</li>
        <li><strong>Analíticas:</strong> medir uso del Sitio (solo con tu consentimiento).</li>
        <li><strong>Marketing:</strong> anuncios/remarketing (solo con tu consentimiento).</li>
      </ul>

      <h2 className="text-xl font-bold mt-8 mb-2">Cookies que podríamos usar</h2>
      <ul className="list-disc pl-6">
        <li>Necesarias (propias): sesión, carrito, consentimiento (<code>guarros-consent</code>).</li>
        <li>Pasarela de pago (Stripe): cookies técnicas de seguridad/prevención de fraude.</li>
        <li>Analítica (si se implementa): <code>_ga</code>, <code>_gid</code> (solo si aceptas analíticas).</li>
        <li>Marketing (si se implementa): identificadores publicitarios (solo si aceptas marketing).</li>
      </ul>

      <h2 className="text-xl font-bold mt-8 mb-2">Gestión del consentimiento</h2>
      <p>
        Al entrar verás un banner para aceptar, rechazar o personalizar. 
        Puedes cambiar tu decisión en cualquier momento desde “Preferencias de cookies”.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-2">Cómo cambiar cookies en el navegador</h2>
      <p>
        Puedes borrar o bloquear cookies desde la configuración del navegador. 
        Si bloqueas las necesarias, algunas funciones pueden dejar de funcionar.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-2">Actualizaciones</h2>
      <p>Podemos actualizar esta política. La versión vigente es la publicada en este Sitio.</p>
    </main>
  );
}
