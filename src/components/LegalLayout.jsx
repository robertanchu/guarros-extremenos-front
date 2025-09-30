import React from "react";
import "@/styles/legal.css";

export default function LegalLayout({ title, children, toc = [] }){
  return (
    <main className="py-10 md:py-12">
      <div className="container max-w-6xl px-4 mx-auto">
        <header className="mb-6 md:mb-10 text-center">
          <h1 className="mt-2 text-3xl md:text-5xl font-stencil text-brand">{title}</h1>
          <p className="mt-2 text-white/60 text-sm">Última actualización: {new Date().toISOString().slice(0,10)}</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* TOC */}
          <aside className="hidden lg:block lg:col-span-3">
            <nav aria-label="Índice legal" className="sticky top-24 rounded-2xl border border-white/10 p-4 bg-white/[0.03]">
              <ol className="space-y-2 text-sm">
                {toc.map((item) => (
                  <li key={item.id}>
                    <a href={`#${item.id}`} className="text-white/70 hover:text-white transition-colors">{item.label}</a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>

          {/* Content */}
          <section className="lg:col-span-9">
            <div className="rounded-2xl border border-white/10 p-6 md:p-8 bg-white/[0.03] legal-prose">
              {children}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
