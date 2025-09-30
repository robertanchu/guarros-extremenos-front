import React from "react";

export default function SectionHeader({
  eyebrow = null,       // texto pequeño encima (opcional)
  title,                // título principal
  subtitle = null,      // subtítulo (opcional)
  align = "left"        // 'left' | 'center'
}){
  const alignCls = align === "center" ? "items-center text-center" : "items-start text-left";
  return (
    <div className={`flex flex-col ${alignCls} gap-1`}>
      {eyebrow && (
        <span className="uppercase tracking-wider text-[11px] font-semibold text-brand/90">
          {eyebrow}
        </span>
      )}
      <h1 className="text-4xl md:text-5xl font-semibold text-white leading-tight">
        {title}
      </h1>
      {subtitle && (
        <p className="text-white/70 max-w-2xl mt-1">
          {subtitle}
        </p>
      )}
    </div>
  );
}
