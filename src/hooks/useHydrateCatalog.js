import { useEffect } from "react";
import { useCatalog } from "@/store/catalog";

export function useHydrateCatalog(){
  const hydrate = useCatalog(s => s.hydrate);
  useEffect(() => {
    hydrate();
  }, [hydrate]);
}
