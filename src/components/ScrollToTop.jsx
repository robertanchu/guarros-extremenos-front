import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Sube el scroll a la posición (0, 0)
    window.scrollTo(0, 0);
  }, [pathname]); // Esto se ejecuta cada vez que la URL (pathname) cambia

  return null; // Este componente no renderiza nada
}