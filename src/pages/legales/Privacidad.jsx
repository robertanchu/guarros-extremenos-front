import React from "react";
import LegalLayout from "@/components/LegalLayout";
import Meta from "@/lib/Meta";

const TOC = [
  { id: "responsable", label: "1. Responsable del tratamiento" },
  { id: "datos", label: "2. Datos que tratamos" },
  { id: "finalidades", label: "3. Finalidades y base legal" },
  { id: "plazos", label: "4. Plazos de conservación" },
  { id: "destinatarios", label: "5. Destinatarios" },
  { id: "derechos", label: "6. Derechos" },
  { id: "cookies", label: "7. Cookies y tecnologías similares" },
  { id: "seguridad", label: "8. Seguridad" },
  { id: "cambios", label: "9. Cambios en la política" },
];

export default function Privacidad(){
  return (
    <>
      <Meta title="Política de privacidad" />
      <LegalLayout title="Política de privacidad" toc={TOC}>
        <section id="responsable">
          <h2>1. Responsable del tratamiento</h2>
          <p><span className="muted">[Razón social]</span> — NIF <span className="muted">[NIF]</span>, domicilio en <span className="muted">[Dirección]</span>. Email: <a href="mailto:hola@guarrosextremenos.com">hola@guarrosextremenos.com</a>.</p>
        </section>

        <section id="datos">
          <h2>2. Datos que tratamos</h2>
          <ul>
            <li>Identificativos y de contacto (nombre, email, teléfono).</li>
            <li>Datos transaccionales (productos, importes, direcciones de envío).</li>
            <li>Datos técnicos (IP, dispositivo, navegador) de forma pseudonimizada.</li>
            <li>Preferencias de comunicación y consentimiento.</li>
          </ul>
        </section>

        <section id="finalidades">
          <h2>3. Finalidades y base legal</h2>
          <ul>
            <li><strong>Prestación del servicio</strong> (ejecución de contrato): tramitar compras y gestionar tu cuenta.</li>
            <li><strong>Comunicaciones comerciales</strong> (consentimiento/ interés legítimo): newsletter y ofertas. Puedes darte de baja en cualquier momento.</li>
            <li><strong>Seguridad y prevención del fraude</strong> (interés legítimo/obligación legal).</li>
            <li><strong>Atención al cliente</strong> (interés legítimo/ejecución de contrato).</li>
          </ul>
        </section>

        <section id="plazos">
          <h2>4. Plazos de conservación</h2>
          <p>Conservaremos tus datos mientras mantengas la relación contractual o solicites su supresión, y los necesarios exigidos por ley (p. ej., facturación) durante <span className="muted">[X años]</span>.</p>
        </section>

        <section id="destinatarios">
          <h2>5. Destinatarios</h2>
          <p>Proveedores que actúan como encargados del tratamiento (p. ej., pasarelas de pago, logística, analítica) con garantías adecuadas y contratos de encargo.</p>
        </section>

        <section id="derechos">
          <h2>6. Derechos</h2>
          <p>Puedes ejercer acceso, rectificación, supresión, oposición, limitación y portabilidad en <a href="mailto:hola@guarrosextremenos.com">hola@guarrosextremenos.com</a>. Si no estás de acuerdo, puedes reclamar ante la AEPD.</p>
        </section>

        <section id="cookies">
          <h2>7. Cookies y tecnologías similares</h2>
          <p>Consulta la <a href="/legal/cookies">Política de cookies</a> y el panel de preferencias para configurar tu consentimiento.</p>
        </section>

        <section id="seguridad">
          <h2>8. Seguridad</h2>
          <p>Aplicamos medidas técnicas y organizativas apropiadas para proteger la información frente a accesos no autorizados.</p>
        </section>

        <section id="cambios">
          <h2>9. Cambios en la política</h2>
          <p>Podremos modificar esta política para reflejar cambios normativos o de servicio. Te avisaremos por canales razonables.</p>
        </section>
      </LegalLayout>
    </>
  );
}
