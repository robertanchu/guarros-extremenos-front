// src/consent/ConsentContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const ConsentCtx = createContext();

export function ConsentProvider({ children }){
  const [consent, setConsent] = useState({ necessary: true, analytics: false, marketing: false, decided: false });

  useEffect(() => {
    try{
      const raw = localStorage.getItem("guarros-consent");
      if (raw) setConsent(JSON.parse(raw));
    }catch{}
  }, []);

  const save = (next) => {
    const merged = { ...consent, ...next, decided: true };
    setConsent(merged);
    try{ localStorage.setItem("guarros-consent", JSON.stringify(merged)); }catch{}
  };

  const reset = () => {
    setConsent({ necessary: true, analytics: false, marketing: false, decided: false });
    try{ localStorage.removeItem("guarros-consent"); }catch{}
  };

  return (
    <ConsentCtx.Provider value={{ consent, save, reset }}>
      {children}
    </ConsentCtx.Provider>
  );
}

export const useConsent = () => useContext(ConsentCtx);
