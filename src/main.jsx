// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

// 🚫 Eliminado HelmetProvider (react-helmet-async).
// Si necesitas metas/SEO puntuales, podemos añadirlas en index.html
// o montar un pequeño gestor propio sin dependencias.

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
