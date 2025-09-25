export const PRODUCTS = [
  {
    id: "entero",
    slug: "jamon-iberico-100-bellota-dop-extremadura-entero",
    name: "Jamón Ibérico 100% de Bellota D.O.P Extremadura (entero)",
    description: "Pieza entera con curación lenta y controlada. Intensidad y aroma inconfundibles.",
    priceFrom: 500,
    images: ["/src/assets/entero_1.jpg","/src/assets/entero_2.jpg","/src/assets/entero_3.jpg"],
    variants: [
      { id:"ent-unique", label:"Pieza única", price: 500, priceId: "price_ENT_UNIQUE_REPLACE" }
    ]
  },
  {
    id: "loncheado",
    slug: "jamon-iberico-100-bellota-dop-extremadura-loncheado",
    name: "Jamón Ibérico 100% de Bellota D.O.P Extremadura (loncheado)",
    description: "Selección de cortes finos, listos para servir. Comodidad premium sin renunciar al sabor.",
    priceFrom: 530,
    images: ["/src/assets/loncheado_1.jpg","/src/assets/loncheado_2.jpg"],
    variants: [
      { id:"lon-unique", label:"Formato loncheado", price: 530, priceId: "price_LON_UNIQUE_REPLACE" }
    ]
  },
  {
    id: "sub",
    slug: "suscripcion-mensual-de-jamon",
    name: "Suscripción Mensual de Jamón",
    description: "Cada mes, loncheados premium entregados en tu casa. Cancela cuando quieras.",
    priceFrom: 40,
    images: ["/src/assets/suscrip_1.jpg"],
    variants: [
      { id:"sub-500", label:"500 g / mes", price: 40, priceId: "price_SUB_500_REPLACE" },
      { id:"sub-1000", label:"1 kg / mes", price: 70, priceId: "price_SUB_1000_REPLACE" }
    ]
  }
];
