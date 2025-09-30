import React from "react";
import LegalLayout from "@/components/LegalLayout";
import Meta from "@/lib/Meta";

const TOC = [
  { id: "titular", label: "1. Titularidad del sitio" },
  { id: "contacto", label: "2. Contacto" },
  { id: "propiedad", label: "3. Propiedad intelectual e industrial" },
  { id: "exencion", label: "4. Exención de responsabilidad" },
  { id: "enlaces", label: "5. Enlaces" },
  { id: "ley", label: "6. Ley aplicable" },
];

export default function AvisoLegal(){
  return (
    <>
      <Meta title="Aviso legal" />
      <LegalLayout title="Aviso legal" toc={TOC}>
        <section id="titular">
          <h2>1. Titularidad del sitio</h2>
          <p>Este sitio web pertenece a <span className="muted">[Razón social]</span>, con NIF <span className="muted">[NIF]</span>, domicilio en <span className="muted">[Dirección]</span>. Email de contacto: <a href="mailto:hola@guarrosextremenos.com">hola@guarrosextremenos.com</a>.</p>
        </section>

        <section id="contacto">
          <h2>2. Contacto</h2>
          <p>Para cualquier consulta, puedes escribirnos a <a href="mailto:hola@guarrosextremenos.com">hola@guarrosextremenos.com</a>.</p>
        </section>

        <section id="propiedad">
          <h2>3. Propiedad intelectual e industrial</h2>
          <p>Salvo indicación en contrario, todos los contenidos (textos, imágenes, marcas, logotipos, código) son titularidad de sus respectivos propietarios y están protegidos por la normativa aplicable. No se permite su reproducción sin autorización.</p>
        </section>

        <section id="exencion">
          <h2>4. Exención de responsabilidad</h2>
          <p>No garantizamos la ausencia de errores ni la continuidad del servicio. No nos hacemos responsables de decisiones tomadas a partir de la información de este sitio.</p>
        </section>

        <section id="enlaces">
          <h2>5. Enlaces</h2>
          <p>Los enlaces a terceros se proporcionan únicamente como referencia. No controlamos ni somos responsables de su contenido o políticas.</p>
        </section>

        <section id="ley">
          <h2>6. Ley aplicable</h2>
          <p>La relación con el usuario se regirá por la legislación española y, en su caso, la normativa de consumidores vigente.</p>
        </section>
      </LegalLayout>
    </>
  );
}
