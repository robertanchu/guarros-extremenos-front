// src/data/products.js
// Export nombrado 'products'
export const products = [
  {
    id: "jamon-6-7",
    name: "Jamón Canalla 6–7 kg",
    kind: "jamon-weight",

    // IMÁGENES — entero vs loncheado (ambas soportadas por JamonCard)
    image: "/images/jamones/jamon_6-7.webp",               // fallback / entero
    imageUnsliced: "/images/jamones/jamon_6-7.webp",
    imageUnsliced2x: "/images/jamones/jamon_6-7@2x.webp",  // opcional (si existe)
    imageSliced: "/images/jamones/jamon_6-7_sliced.webp",
    imageSliced2x: "/images/jamones/jamon_6-7_sliced@2x.webp", // opcional

    // (Opcional) También lo dejamos en objeto 'images' por compatibilidad
    images: {
      unsliced: "/images/jamones/jamon_6-7.webp",
      unsliced2x: "/images/jamones/jamon_6-7@2x.webp",
      sliced: "/images/jamones/jamon_6-7_sliced.webp",
      sliced2x: "/images/jamones/jamon_6-7_sliced@2x.webp",
      default: "/images/jamones/jamon_6-7.webp",
    },

    // (Opcional) Para <img srcSet> si lo usas en alguna grid
    imageSet: {
      src: "/images/jamones/jamon_6-7.webp",
      srcSet: "/images/jamones/jamon_6-7_1000.webp 1000w, /images/jamones/jamon_6-7.webp 1500w",
      sizes: "(max-width: 768px) 100vw, 33vw",
    },

    // Fallback de precio en céntimos (por si Stripe tarda)
    baseCents: 46100,          // 189,00 €
    slicedDeltaCents: 3000,    // +15,00 € si loncheado

    // (Campos legacy que ya tenías: los mantenemos por compatibilidad)
    basePrice: 46100,
    slicedUpchargeHint: 3000,

    // Stripe (IDs reales)
    stripe: {
      unsliced: "price_1SK1S7RPLp0YiQTHnULknVOE",
      sliced:   "price_1SKKs5RPLp0YiQTHrgbZp8Am",
    },

    badges: ["D.O.P. Extremadura", "Curación lenta"],
    short: "Selección 6–7 kg. Sabor largo, textura sedosa.",
  },

  {
    id: "jamon-7-8",
    name: "Jamón Canalla 7–8 kg",
    kind: "jamon-weight",

    image: "/images/jamones/jamon_7-8.webp",
    imageUnsliced: "/images/jamones/jamon_7-8.webp",
    imageUnsliced2x: "/images/jamones/jamon_7-8@2x.webp",
    imageSliced: "/images/jamones/jamon_7-8_sliced.webp",
    imageSliced2x: "/images/jamones/jamon_7-8_sliced@2x.webp",

    images: {
      unsliced: "/images/jamones/jamon_7-8.webp",
      unsliced2x: "/images/jamones/jamon_7-8@2x.webp",
      sliced: "/images/jamones/jamon_7-8_sliced.webp",
      sliced2x: "/images/jamones/jamon_7-8_sliced@2x.webp",
      default: "/images/jamones/jamon_7-8.webp",
    },

    imageSet: {
      src: "/images/jamones/jamon_7-8.webp",
      srcSet: "/images/jamones/jamon_7-8_1000.webp 1000w, /images/jamones/jamon_7-8.webp 1500w",
      sizes: "(max-width: 768px) 100vw, 33vw",
    },

    baseCents: 52000,          // 219,00 €
    slicedDeltaCents: 3000,    // +15,00 €

    basePrice: 52000,
    slicedUpchargeHint:3000,

    stripe: {
      unsliced: "price_1SK1fPRPLp0YiQTHAx0Ymfht",
      sliced:   "price_1SKKr0RPLp0YiQTHsvrM3Zil",
    },

    badges: ["D.O.P. Extremadura", "Curación lenta"],
    short: "Selección 7–8 kg. Corte limpio, veta impecable.",
  },

  {
    id: "jamon-8-9",
    name: "Jamón Canalla 8–9 kg",
    kind: "jamon-weight",

    image: "/images/jamones/jamon_8-9.webp",
    imageUnsliced: "/images/jamones/jamon_8-9.webp",
    imageUnsliced2x: "/images/jamones/jamon_8-9@2x.webp",
    imageSliced: "/images/jamones/jamon_8-9_sliced.webp",
    imageSliced2x: "/images/jamones/jamon_8-9_sliced@2x.webp",

    images: {
      unsliced: "/images/jamones/jamon_8-9.webp",
      unsliced2x: "/images/jamones/jamon_8-9@2x.webp",
      sliced: "/images/jamones/jamon_8-9_sliced.webp",
      sliced2x: "/images/jamones/jamon_8-9_sliced@2x.webp",
      default: "/images/jamones/jamon_8-9.webp",
    },

    imageSet: {
      src: "/images/jamones/jamon_8-9.webp",
      srcSet: "/images/jamones/jamon_8-9_1000.webp 1000w, /images/jamones/jamon_8-9.webp 1500w",
      sizes: "(max-width: 768px) 100vw, 33vw",
    },

    baseCents: 58000,          // 249,00 €
    slicedDeltaCents: 3000,    // +15,00 €

    basePrice: 58000,
    slicedUpchargeHint: 3000,

    stripe: {
      unsliced: "price_1SK1hnRPLp0YiQTHGy4mFkcB",
      sliced:   "price_1SKKphRPLp0YiQTHXq4jEPvW",
    },

    badges: ["D.O.P. Extremadura", "Curación lenta"],
    short: "Selección 8–9 kg. Potente, canalla, elegante.",
  },
];
