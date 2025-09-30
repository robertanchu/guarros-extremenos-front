import React from "react";

export default function SortSelect({ value, onChange, options, label = "Ordenar por" }){
  const [open, setOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(() => Math.max(0, options.findIndex(o => o.value === value)));
  const btnRef = React.useRef(null);
  const listRef = React.useRef(null);

  const current = options.find(o => o.value === value) || options[0];

  React.useEffect(() => {
    function onDocClick(e){
      if (!open) return;
      if (!btnRef.current || !listRef.current) return;
      if (btnRef.current.contains(e.target) || listRef.current.contains(e.target)) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  function toggle(){ setOpen(o => !o); }
  function selectAt(i){
    const opt = options[i]; if (!opt) return;
    onChange?.(opt.value); setOpen(false);
  }
  function onKeyDown(e){
    if (!open && (e.key === "Enter" || e.key === " ")){
      e.preventDefault(); setOpen(true);
      setActiveIndex(Math.max(0, options.findIndex(o => o.value === value))); return;
    }
    if (open){
      if (e.key === "ArrowDown"){ e.preventDefault(); setActiveIndex(i => (i + 1) % options.length); }
      else if (e.key === "ArrowUp"){ e.preventDefault(); setActiveIndex(i => (i - 1 + options.length) % options.length); }
      else if (e.key === "Enter"){ e.preventDefault(); selectAt(activeIndex); }
      else if (e.key === "Escape"){ e.preventDefault(); setOpen(false); btnRef.current?.focus(); }
    }
  }

  return (
    <div className="relative">
      <button
        ref={btnRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={toggle}
        onKeyDown={onKeyDown}
        className="h-11 inline-flex items-center gap-2 rounded-xl bg-black/60 text-white border border-white/15 px-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
      >
        <span className="text-white/80">{label}:</span>
        <span className="font-medium">{current.label}</span>
        <svg aria-hidden="true" className={`ml-1 h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor">
          <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"/>
        </svg>
      </button>

      {open && (
        <ul
          ref={listRef}
          role="listbox"
          tabIndex={-1}
          className="absolute right-0 z-50 mt-2 w-[18rem] max-w-[80vw] overflow-auto rounded-xl border border-white/15 bg-black/90 shadow-2xl backdrop-blur p-1 focus:outline-none"
          onKeyDown={onKeyDown}
        >
          {options.map((opt, i) => {
            const active = i === activeIndex;
            const selected = opt.value === value;
            return (
              <li
                key={opt.value}
                role="option"
                aria-selected={selected}
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => selectAt(i)}
                className={`flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm
                  ${active ? "bg-white/10" : ""} ${selected ? "text-brand" : "text-white/90"} hover:bg-white/10`}
              >
                <span>{opt.label}</span>
                {selected && (
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.42l-8 8a1 1 0 01-1.408 0l-4-4a1 1 0 111.408-1.42L8 12.58l7.296-7.29a1 1 0 011.408 0z" clipRule="evenodd"/>
                  </svg>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
