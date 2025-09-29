import { useEffect } from "react";
const BRAND = "Guarros Extremeños";
export default function Meta() {
  useEffect(() => { if (document?.title !== BRAND) document.title = BRAND; }, []);
  return null;
}