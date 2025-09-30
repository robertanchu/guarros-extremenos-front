
import React from "react";

export default function FAQ({ items = [] }){
  return (
    <div className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.03]">
      {items.map((it, idx) => (
        <Disclosure key={idx} question={it.q} answer={it.a} defaultOpen={idx === 0} />
      ))}
    </div>
  );
}

function Disclosure({ question, answer, defaultOpen = false }){
  const [open, setOpen] = React.useState(defaultOpen);
  const id = React.useId();
  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen(o => !o)}
        className="w-full text-left px-4 md:px-5 py-4 flex items-center justify-between gap-4 hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
      >
        <span className="text-white font-medium">{question}</span>
        <svg className={`h-5 w-5 transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"/>
        </svg>
      </button>
      <div id={id} hidden={!open} className="px-4 md:px-5 pb-4 text-white/80">
        <p className="text-sm leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}
