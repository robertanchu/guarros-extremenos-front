// src/pages/legales/Privacidad.jsx
import React from "react";

export default function Privacidad(){
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 text-white/90 leading-relaxed">
      <h1 className="text-3xl font-black text-white mb-6">Política de Privacidad</h1>
      <p className="text-sm text-white/60 mb-10">Última actualización: [[FECHA_ACTUALIZACION]]</p>

      <h2 className="text-xl font-bold mt-8 mb-2">1. Responsable</h2>
      <p>
        <strong>[[RAZON_SOCIAL]]</strong> — CIF [[CIF_NIF]] — [[DIRECCION_COMPLETA]] — Email: <strong>[[EMAIL_PRIVACIDAD]]</strong>.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-2">2. Datos que tratamos</h2>
      <ul className="list-disc pl-6">
        <li>Identificativos y contacto (nombre, email, teléfono, dirección).</li>
        <li>Compra y facturación (productos, importes, direcciones de envío/factura).</li>
        <li>Suscripción (plan, renovaciones, histórico).</li>
        <li>Datos técnicos (IP, navegador, cookies/analytics si consientes).</li>
      </ul>

      <h2 className="text-xl font-bold mt-8 mb-2">3. Finalidades y bases legales</h2>
      <ul className="list-disc pl-6">
        <li>Ejecución de contrato: pedidos, envíos, suscripciones, atención al cliente.</li>
        <li>Obligación legal: facturación y obligaciones fiscales.</li>
        <li>Consentimiento: newsletter, comunicaciones comerciales, analítica no esencial, cookies no necesarias.</li>
        <li>Interés legítimo: prevención de fraude y mejora del servicio (ponderado).</li>
      </ul>

      <h2 className="text-xl font-bold mt-8 mb-2">4. Destinatarios</h2>
      <p>
        Proveedores necesarios (pago: Stripe; hosting/infraestructura; logística). 
        Con acceso limitado y acuerdos de encargo cuando corresponde.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-2">5. Transferencias internacionales</h2>
      <p>
        Si un proveedor está fuera del EEE, exigimos garantías adecuadas (cláusulas contractuales tipo u otras).
      </p>

      <h2 className="text-xl font-bold mt-8 mb-2">6. Plazos de conservación</h2>
      <p>
        Mientras dure la relación y lo que exija la ley. Marketing hasta que retires el consentimiento. 
        Facturación: mínimo 5–6 años (normativa fiscal).
      </p>

      <h2 className="text-xl font-bold mt-8 mb-2">7. Derechos</h2>
      <p>
        Acceso, rectificación, supresión, oposición, limitación y portabilidad en <strong>[[EMAIL_PRIVACIDAD]]</strong>. 
        Puedes reclamar ante la AEPD (www.aepd.es).
      </p>

      <h2 className="text-xl font-bold mt-8 mb-2">8. Menores</h2>
      <p>El Sitio no está dirigido a menores de 18 años y no recabamos datos de menores de forma consciente.</p>

      <h2 className="text-xl font-bold mt-8 mb-2">9. Cookies</h2>
      <p>
        Usamos cookies técnicas y, con tu consentimiento, analíticas/marketing. 
        Detalles y opciones en la <a className="text-[#E53935]" href="/cookies">Política de Cookies</a>.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-2">10. Cambios</h2>
      <p>
        Podemos actualizar esta política. La versión vigente es la publicada en el Sitio.
      </p>
    </main>
  );
}
