"use client"

import { useState } from "react"

export function AdminProjectsPage() {
  const [section, setSection] = useState<null | "liste" | "categories">(null)

  if (section === null) {
    return (
      <div className="mt-2 sm:mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
        {[
          { key: "liste", title: "Liste des projets", desc: "Gérez les projets du site" },
          { key: "categories", title: "Catégories", desc: "Organisez les projets par catégorie" },
        ].map((card) => (
          <button
            key={card.key}
            onClick={() => setSection(card.key as any)}
            className="group relative rounded-xl border border-border bg-card p-6 text-left shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg hover:border-[#F15A25] hover:ring-1 hover:ring-[#F15A25]/30 focus:outline-none focus:ring-2 focus:ring-ring min-h-36 lg:min-h-40"
          >
            <div className="mb-1.5 lg:mb-2 text-[1.05rem] lg:text-[1.15rem] font-semibold tracking-tight leading-snug">
              {card.title}
            </div>
            <p className="text-[0.85rem] lg:text-sm text-muted-foreground">{card.desc}</p>
            <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-transparent group-hover:ring-border/80" />
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-3 lg:space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[1.15rem] lg:text-[1.35rem] font-semibold tracking-tight leading-snug">
            {section === "liste" && "Liste des projets"}
            {section === "categories" && "Catégories"}
          </h2>
          <p className="text-[0.85rem] lg:text-sm text-muted-foreground mt-0.5">
            {section === "liste" && "Créez, modifiez et réorganisez vos projets."}
            {section === "categories" && "Gérez les catégories et l’assignation des projets."}
          </p>
        </div>
        <button
          onClick={() => setSection(null)}
          className="text-[0.85rem] rounded-md border border-border px-3 py-1.5 hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          ← Retour aux sections
        </button>
      </div>

      <div className="rounded-xl border border-border bg-card p-3 lg:p-4 min-h-[40vh]">
        {section === "liste" && (
          <p className="text-sm text-muted-foreground">Sections projets à définir.</p>
        )}
        {section === "categories" && (
          <p className="text-sm text-muted-foreground">Catégories à définir.</p>
        )}
      </div>
    </div>
  )
}
