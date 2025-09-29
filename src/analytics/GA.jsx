// src/analytics/GA.jsx
import React, { useEffect } from "react";
import { useConsent } from "@/consent/ConsentContext";

export default function GA(){
  const { consent } = useConsent();

  useEffect(() => {
    if (!consent.analytics) return;
    // Carga condicional de Google Analytics
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=[[TU_GA_ID]]";
    document.head.appendChild(s);

    const inline = document.createElement("script");
    inline.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '[[TU_GA_ID]]');
    `;
    document.head.appendChild(inline);
  }, [consent.analytics]);

  return null;
}
