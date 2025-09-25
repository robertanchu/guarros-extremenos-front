import React, { useState } from "react";
export default function Gallery({ images=[] }) {
  const [active, setActive] = useState(images[0]);
  return (
    <div>
      <div className="aspect-square rounded-2xl border border-[#222] overflow-hidden bg-[#0f0f0f]">
        {active ? (
          <img src={active} alt="Producto" className="w-full h-full object-contain hover:scale-105 transition" />
        ) : <div className="w-full h-full" />}
      </div>
      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2">
          {images.map((src) => (
            <button key={src} onClick={()=>setActive(src)} className={`border rounded overflow-hidden ${active===src ? "border-dorado" : "border-[#333]"}`}>
              <img src={src} alt="" className="w-full h-20 object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
