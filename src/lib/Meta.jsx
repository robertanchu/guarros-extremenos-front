import React from "react";
import { Helmet } from "react-helmet-async";
export default function Meta({ title, description, image, url, schemas = [] }){
  const site = "Guarros Extremeños";
  const fullTitle = title ? `${title} · ${site}` : site;
  const desc = description || "Jamón Ibérico 100% de Bellota D.O.P Extremadura. El único 'guarro' que querrás en tu mesa.";
  const ogImg = image || "/src/assets/social/og_home.jpg";
  const schemaScripts = (Array.isArray(schemas) ? schemas : [schemas]).filter(Boolean).map((obj,i)=>(
    <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{__html: typeof obj === 'string' ? obj : JSON.stringify(obj)}} />
  ));
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content="website" />
      {url && <meta property="og:url" content={url} />}
      <meta property="og:image" content={ogImg} />
      <meta name="twitter:card" content="summary_large_image" />
      {schemaScripts}
    </Helmet>
  );
}
