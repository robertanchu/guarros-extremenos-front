// src/lib/Meta.jsx
import { useEffect } from "react";
const BRAND = "Guarros Extremeños";

export default function Meta() {
  useEffect(() => {
    if (typeof document !== 'undefined' && document.title !== BRAND) {
      document.title = BRAND;
    }
  }, []);
  return null;
}
