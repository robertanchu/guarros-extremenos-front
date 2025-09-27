import ogHome from "@/assets/social/og_home.jpg";
import ogJamones from "@/assets/social/og_jamones.jpg";
import ogSuscripcion from "@/assets/social/og_suscripcion.jpg";
import ogDehesa from "@/assets/social/og_dehesa.jpg";
import ogContacto from "@/assets/social/og_contacto.jpg";

import enteroHero from "@/assets/products/entero_hero.jpg";
import loncheadoHero from "@/assets/products/loncheado_hero.jpg";
import sub500Hero from "@/assets/products/sub_500_hero.jpg";
import sub1000Hero from "@/assets/products/sub_1000_hero.jpg";

export const MEDIA = {
  og: {
    home: ogHome,
    jamones: ogJamones,
    suscripcion: ogSuscripcion,
    dehesa: ogDehesa,
    contacto: ogContacto,
  },
  products: {
    entero: enteroHero,
    loncheado: loncheadoHero,
  },
  sub_500: { gallery: [sub500Hero] },
  sub_1000:{ gallery: [sub1000Hero] },
};
