import React from "react";
import LegalLayout from "@/components/LegalLayout";
import Meta from "@/lib/Meta";

const TOC = [
  { id: "que-son", label: "1. ¿Qué son las cookies?" },
  { id: "tipos", label: "2. Tipos de cookies" },
  { id: "gestion", label: "3. Gestión y configuración" },
  { id: "tabla", label: "4. Tabla de cookies" },
  { id: "cambios", label: "5. Cambios en la política" },
];

export default function Cookies(){
  return (
    <>
      <Meta title="Política de cookies" />
      <LegalLayout title="Política de cookies" toc={TOC}>
        <section id="que-son">
          <h2>1. ¿Qué son las cookies?</h2>
          <p>Pequeños ficheros que se descargan en tu dispositivo al navegar. Permiten, entre otras cosas, recordar tus preferencias o analizar el uso del sitio.</p>
        </section>

        <section id="tipos">
          <h2>2. Tipos de cookies</h2>
          <ul>
            <li><strong>Técnicas</strong>: necesarias para el funcionamiento del sitio.</li>
            <li><strong>Preferencias</strong>: recuerdan configuraciones (idioma, región).</li>
            <li><strong>Analíticas</strong>: miden el uso del sitio de forma agregada.</li>
            <li><strong>Publicitarias</strong>: personalizan anuncios (si se emplean).</li>
          </ul>
        </section>

        <section id="gestion">
          <h2>3. Gestión y configuración</h2>
          <p>Puedes configurar o revocar tu consentimiento desde el <a href="/legal/cookies">panel de preferencias</a> y en la configuración de tu navegador.</p>
          <p className="muted">Recomendación: incluye aquí enlaces a guías de los principales navegadores.</p>
        </section>

        <section id="tabla">
          <h2>4. Tabla de cookies</h2>
          <p>A continuación un ejemplo (sustituye por tu inventario real):</p>
          <div className="overflow-x-auto mt-3">
            <table className="w-full text-left text-sm">
              <thead className="text-white/70">
                <tr><th className="py-2 pr-4">Nombre</th><th className="py-2 pr-4">Proveedor</th><th className="py-2 pr-4">Finalidad</th><th className="py-2 pr-4">Duración</th></tr>
              </thead>
              <tbody className="text-white/80">
                <tr><td className="py-2 pr-4">_ga</td><td className="py-2 pr-4">Google</td><td className="py-2 pr-4">Analítica</td><td className="py-2 pr-4">2 años</td></tr>
                <tr><td className="py-2 pr-4">consent</td><td className="py-2 pr-4">Sitio</td><td className="py-2 pr-4">Preferencias</td><td className="py-2 pr-4">6 meses</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="cambios">
          <h2>5. Cambios en la política</h2>
          <p>Podremos actualizar esta política para reflejar cambios en cookies utilizadas o requisitos legales.</p>
        </section>
      </LegalLayout>
    </>
  );
}
