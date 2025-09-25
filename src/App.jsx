import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Jamones from "./pages/Jamones";
import Dehesa from "./pages/Dehesa";
import Suscripcion from "./pages/Suscripcion";
import Contacto from "./pages/Contacto";
import Producto from "./pages/Producto";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";
import { CartProvider } from "./context/CartContext";

export default function App() {
  return (
    <CartProvider>
      <div className="bg-negro text-white min-h-screen flex flex-col">
        <Header />
        <div className="pt-24 flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jamones" element={<Jamones />} />
            <Route path="/dehesa" element={<Dehesa />} />
            <Route path="/suscripcion" element={<Suscripcion />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/producto/:slug" element={<Producto />} />
            <Route path="/success" element={<Success />} />
            <Route path="/cancel" element={<Cancel />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </CartProvider>
  );
}
