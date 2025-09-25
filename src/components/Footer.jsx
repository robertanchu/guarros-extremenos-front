import React from "react";
export default function Footer() {
  return (
    <footer className="bg-black border-t border-rojo">
      <div className="max-w-6xl mx-auto px-6 py-10 text-gray-400 grid md:grid-cols-3 gap-8">
        <div>
          <h4 className="font-stencil text-white text-xl mb-3">Guarros Extremeños</h4>
          <p>El único “guarro” que querrás en tu mesa.</p>
        </div>
        <div>
          <h5 className="text-white font-semibold mb-3">Legal</h5>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white">Términos y Condiciones</a></li>
            <li><a href="#" className="hover:text-white">Política de Privacidad</a></li>
            <li><a href="#" className="hover:text-white">Política de Cookies</a></li>
          </ul>
        </div>
        <div id="contacto">
          <h5 className="text-white font-semibold mb-3">Contacto</h5>
          <p>hola@guarrosextremenos.com</p>
          <p>+34 600 000 000</p>
        </div>
      </div>
      <div className="text-center text-gray-500 py-6 text-sm">
        © {new Date().getFullYear()} Guarros Extremeños — Todos los derechos reservados
      </div>
    </footer>
  );
}
