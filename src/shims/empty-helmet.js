// src/shims/empty-helmet.js
// Shim mínimo para compilar si queda algún import rezagado de react-helmet-async
// Evita romper la app en runtime; puedes borrar este archivo cuando no haya imports.
export const Helmet = () => null;
export const HelmetProvider = ({ children }) => children;
export default {};
