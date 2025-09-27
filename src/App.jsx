import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CheckoutBar from "./components/CheckoutBar";
import Home from "./pages/Home";
import Jamones from "./pages/Jamones";
import Producto from "./pages/Producto";
import Suscripcion from "./pages/Suscripcion";
import Dehesa from "./pages/Dehesa";
import Contacto from "./pages/Contacto";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Cookies from "./pages/Cookies";

export default function App(){
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jamones" element={<Jamones />} />
          <Route path="/producto/:slug" element={<Producto />} />
          <Route path="/suscripcion" element={<Suscripcion />} />
          <Route path="/dehesa" element={<Dehesa />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />
          <Route path="/terminos" element={<Terms />} />
          <Route path="/privacidad" element={<Privacy />} />
          <Route path="/cookies" element={<Cookies />} />
        </Routes>
      </main>
      <CheckoutBar />
      <Footer />
    </div>
  );
}
