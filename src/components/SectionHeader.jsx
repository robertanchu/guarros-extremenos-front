import React from "react";

export default function SectionHeader({
  eyebrow = null,
  title,
  subtitle = null,
  align = "left",
  titleUppercase = false,
  titleClassName = ""
}){
  const alignCls = align === "center" ? "items-center text-center" : "items-start text-left";
  const caseCls = titleUppercase ? "uppercase tracking-wider" : "";
  return (
    <div className={\`flex flex-col \${alignCls} gap-1\`}>
      {eyebrow && (
        <span className="uppercase tracking-wider text-[11px] font-semibold text-brand/90">
          {eyebrow}
        </span>
      )}
      <h1 className={\`text-4xl md:text-5xl font-semibold text-white leading-tight \${caseCls} \${titleClassName}\`}>
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
