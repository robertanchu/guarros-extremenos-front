import React from "react";
export default function ProductGallery({ images=[] }){
  if (!images.length) return null;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {images.map((src,i)=>(
        <div key={i} className="relative rounded-2xl overflow-hidden border border-white/10 bg-black">
          <img src={src} alt={`Producto ${i+1}`} className="w-full h-full object-cover" loading={i>0?'lazy':'eager'} />
          <div className="pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay" style={{ backgroundImage: 'url(/src/assets/textures/grain_overlay.png)' }} />
        </div>
      ))}
    </div>
  );
}
