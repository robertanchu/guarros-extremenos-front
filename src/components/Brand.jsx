import React, { useMemo, useState, useCallback } from "react";

export default function Brand(){
  // Rutas candidatas (orden de preferencia)
  const candidates = useMemo(() => [
    `${import.meta.env.BASE_URL}logo/Logo_final_sinletras.png`,
    `${import.meta.env.BASE_URL}logo/logo_final_sinletras.png`,  // por si el repo tiene el nombre en minúsculas
    `${import.meta.env.BASE_URL}logo/Logo_final_letras.png`,     // fallback opcional
  ], []);

  const [idx, setIdx] = useState(0);
  const src = candidates[idx];

  const onError = useCallback(() => {
    setIdx(i => (i < candidates.length - 1 ? i + 1 : i));
  }, [candidates.length]);

  return (
    <a href="/" className="inline-flex items-center" aria-label="Inicio">
      <img
        src={src}
        onError={onError}
        alt="Guarros Extremeños"
        className="h-10 md:h-12 lg:h-14 w-auto select-none block"
        width={160}
        height={56}
        draggable="false"
      />
    </a>
  );
}
