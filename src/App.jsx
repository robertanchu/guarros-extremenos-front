import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from '@/components/Header';
import CartDrawer from '@/components/CartDrawer';
import Home from '@/pages/Home';
import Jamones from '@/pages/Jamones';
import Producto from '@/pages/Producto';
import Suscripcion from '@/pages/Suscripcion';
import Dehesa from '@/pages/Dehesa';
import Contacto from '@/pages/Contacto';

export default function App(){
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 full-bleed">
      <Header />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/jamones" element={<Jamones/>} />
        <Route path="/producto/:slug" element={<Producto/>} />
        <Route path="/suscripcion" element={<Suscripcion/>} />
        <Route path="/dehesa" element={<Dehesa/>} />
        <Route path="/contacto" element={<Contacto/>} />
      </Routes>
      <CartDrawer />
    </div>
  );
}
