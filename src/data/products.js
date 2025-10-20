// src/data/products.js
// Asegúrate de que sea un **named export** llamado 'products'
export const products = [
  {
    id: "jamon-6-7",
    name: "Jamón Canalla 6–7 kg",
    kind: "jamon-weight",
    image: "/images/jamones/jamon_6-7.webp", // asegúrate que existe
    imageSet: {
      src: "/images/jamones/jamon_6-7.webp",
      srcSet: "/images/jamones/jamon_6-7_1000.webp 1000w, /images/jamones/jamon_6-7.webp 1500w",
      sizes: "(max-width: 768px) 100vw, 33vw"
    },
    basePrice: 18900,
    slicedUpchargeHint: 1500,
    stripe: {
      unsliced: "price_1SK1S7RPLp0YiQTHnULknVOE",
      sliced:   "price_1SKKs5RPLp0YiQTHrgbZp8Am"
    },
    badges: ["D.O.P. Extremadura", "Curación lenta"],
    short: "Selección 6–7 kg. Sabor largo, textura sedosa.",
  },
  {
    id: "jamon-7-8",
    name: "Jamón Canalla 7–8 kg",
    kind: "jamon-weight",
    image: "/images/jamones/jamon_7-8.webp",
    imageSet: {
      src: "/images/jamones/jamon_7-8.webp",
      srcSet: "/images/jamones/jamon_7-8_1000.webp 1000w, /images/jamones/jamon_7-8.webp 1500w",
      sizes: "(max-width: 768px) 100vw, 33vw"
    },
    basePrice: 21900,
    slicedUpchargeHint: 1500,
    stripe: {
      unsliced: "price_1SK1fPRPLp0YiQTHAx0Ymfht", 
      sliced:   "price_1SKKr0RPLp0YiQTHsvrM3Zil" 
    },
    badges: ["D.O.P. Extremadura", "Curación lenta"],
    short: "Selección 7–8 kg. Corte limpio, veta impecable.",
  },
  {
    id: "jamon-8-9",
    name: "Jamón Canalla 8–9 kg",
    kind: "jamon-weight",
    image: "/images/jamones/jamon_8-9.webp",
    imageSet: {
      src: "/images/jamones/jamon_8-9.webp",
      srcSet: "/images/jamones/jamon_8-9_1000.webp 1000w, /images/jamones/jamon_8-9.webp 1500w",
      sizes: "(max-width: 768px) 100vw, 33vw"
    },
    basePrice: 24900,
    slicedUpchargeHint: 1500,
    stripe: {
      unsliced: "price_1SK1hnRPLp0YiQTHGy4mFkcB",    
      sliced:   "price_1SKKphRPLp0YiQTHXq4jEPvW"  
    },
    badges: ["D.O.P. Extremadura", "Curación lenta"],
    short: "Selección 8–9 kg. Potente, canalla, elegante.",
  },
];

