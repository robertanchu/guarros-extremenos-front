import React from "react";
import { Helmet } from "react-helmet-async";
export default function SeoBase(){
  const org = {"@context":"https://schema.org","@type":"Organization","name":"Guarros Extremeños","url":"https://guarros-extremenos-front.vercel.app","logo":"/src/assets/favicons/logo192.png","brand":{"@type":"Brand","name":"Guarros Extremeños"}};
  const site = {"@context":"https://schema.org","@type":"WebSite","url":"https://guarros-extremenos-front.vercel.app","name":"Guarros Extremeños","potentialAction":{"@type":"SearchAction","target":"https://guarros-extremenos-front.vercel.app/jamones?q={search_term_string}","query-input":"required name=search_term_string"}};
  return (
    <Helmet>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(org)}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(site)}} />
    </Helmet>
  );
}
