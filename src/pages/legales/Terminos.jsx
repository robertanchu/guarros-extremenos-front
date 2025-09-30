import React from "react";
import LegalLayout from "@/components/LegalLayout";
import Meta from "@/lib/Meta";

const TOC = [
  { id: "objeto", label: "1. Objeto y aceptación" },
  { id: "compras", label: "2. Proceso de compra" },
  { id: "envios", label: "3. Envíos y plazos" },
  { id: "devoluciones", label: "4. Devoluciones y desistimiento" },
  { id: "precios", label: "5. Precios, impuestos y facturación" },
  { id: "responsabilidad", label: "6. Responsabilidad" },
  { id: "cuenta", label: "7. Cuenta y seguridad" },
  { id: "ley", label: "8. Ley aplicable y jurisdicción" },
  { id: "contacto", label: "9. Contacto" },
];

export default function Terminos(){
  return (
    <>
      <Meta title="Términos y condiciones" />
      <LegalLayout title="Términos y condiciones" toc={TOC}>
        <section id="objeto">
          <h2>1. Objeto y aceptación</h2>
          <p>Estas condiciones regulan el acceso y uso de la web y la contratación de productos ofrecidos por <span className="muted">[Razón social]</span> con NIF <span className="muted">[NIF]</span> y domicilio en <span className="muted">[Dirección, Ciudad, País]</span>. El uso del sitio implica la aceptación de estas condiciones.</p>
        </section>

        <section id="compras">
          <h2>2. Proceso de compra</h2>
          <ol>
            <li>Selección del producto y, en su caso, variaciones.</li>
            <li>Añadido al carrito y confirmación de pedido.</li>
            <li>Pago seguro mediante los métodos disponibles.</li>
            <li>Recepción de email de confirmación.</li>
          </ol>
          <p>Nos reservamos el derecho a cancelar pedidos en caso de fraude, error manifiesto de precio o falta de stock.</p>
        </section>

        <section id="envios">
          <h2>3. Envíos y plazos</h2>
          <p>Envíos a <span className="muted">[Países/regiones]</span> con un plazo estimado de <span className="muted">[X–Y días laborables]</span>. El coste de envío se muestra antes de finalizar la compra. Festivos y condiciones climatológicas pueden afectar al plazo.</p>
        </section>

        <section id="devoluciones">
          <h2>4. Devoluciones y desistimiento</h2>
          <p>Dispones de <span className="muted">14 días naturales</span> para desistir (no aplicable a productos desprecintados o que, por su naturaleza, no puedan ser devueltos en condiciones de reventa). Para tramitarlo, escribe a <a href="mailto:hola@guarrosextremenos.com">hola@guarrosextremenos.com</a>.</p>
        </section>

        <section id="precios">
          <h2>5. Precios, impuestos y facturación</h2>
          <p>Todos los precios incluyen IVA salvo indicación expresa. Podrás solicitar factura electrónica en el proceso de compra o por email.</p>
        </section>

        <section id="responsabilidad">
          <h2>6. Responsabilidad</h2>
          <p>No seremos responsables por daños indirectos, lucro cesante o pérdidas de datos derivadas del uso del sitio. Nada de lo aquí expuesto limita derechos irrenunciables del consumidor.</p>
        </section>

        <section id="cuenta">
          <h2>7. Cuenta y seguridad</h2>
          <p>El usuario es responsable de la confidencialidad de sus credenciales y de todas las actividades realizadas desde su cuenta.</p>
        </section>

        <section id="ley">
          <h2>8. Ley aplicable y jurisdicción</h2>
          <p>Estas condiciones se rigen por la legislación española. Salvo que la normativa de consumidores disponga otra cosa, las partes se someten a los juzgados de <span className="muted">[Localidad]</span>.</p>
        </section>

        <section id="contacto">
          <h2>9. Contacto</h2>
          <p>Email: <a href="mailto:hola@guarrosextremenos.com">hola@guarrosextremenos.com</a> · Tel.: <span className="muted">[Teléfono]</span></p>
        </section>
      </LegalLayout>
    </>
  );
}
