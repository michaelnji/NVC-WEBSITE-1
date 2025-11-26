"use client"

import { HeroManager } from "@/components/admin/hero-manager";
import { ProjectsManager } from "@/components/admin/projects-manager";
import { ServicesManager } from "@/components/admin/services-manager";
import { TeamManager } from "@/components/admin/team-manager";
import { TestimonialsManager } from "@/components/admin/testimonials-manager";
import { useLanguage } from "@/contexts/language-context";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function AdminHomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const [section, setSection] = useState<
    null | "hero" | "services" | "projects" | "team" | "testimonials"
  >(null);

  if (section === null) {
    const cards = [
      {
        key: "hero",
        title: t.admin.nav.home,
        desc: t.admin.descriptions?.hero ?? "",
      },
      {
        key: "services",
        title: t.admin.nav.projects,
        desc: t.admin.descriptions?.services ?? "",
      },
      {
        key: "projects",
        title: t.admin.nav.projects,
        desc: t.admin.descriptions?.projects ?? "",
      },
      {
        key: "team",
        title: t.admin.nav.about,
        desc: t.admin.descriptions?.team ?? "",
      },
      {
        key: "testimonials",
        title: t.admin.panelTitle,
        desc: t.admin.descriptions?.testimonials ?? "",
      },
    ];
    return (
      <div className="mt-2 sm:mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
        {cards.map((card) => (
          <button
            key={card.key}
            onClick={() => setSection(card.key as any)}
            className="group relative rounded-xl border border-border bg-card p-6 text-left shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg hover:border-[#F15A25] hover:ring-1 hover:ring-[#F15A25]/30 focus:outline-none focus:ring-2 focus:ring-ring min-h-36 lg:min-h-40"
          >
            <div className="mb-1.5 lg:mb-2 text-[1.05rem] lg:text-[1.15rem] font-semibold tracking-tight leading-snug">
              {card.title}
            </div>
            <p className="text-[0.85rem] lg:text-sm text-muted-foreground">
              {card.desc}
            </p>
            <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-transparent group-hover:ring-border/80" />
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3 lg:space-y-4">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSection(null)}
          className="text-[0.9rem] rounded-md border border-border px-2.5 py-1.5 hover:bg-accent hover:text-accent-foreground transition-colors"
          aria-label={t.common?.buttons?.backHome || "Back to sections"}
        >
          ←
        </button>
        <div>
          <h2 className="text-[1.15rem] lg:text-[1.35rem] font-semibold tracking-tight leading-snug">
            {section === "hero" && t.admin.nav.home}
            {section === "services" && t.admin.nav.projects}
            {section === "projects" && t.admin.nav.projects}
            {section === "team" && t.admin.nav.about}
            {section === "testimonials" && t.admin.panelTitle}
          </h2>
          <p className="text-[0.85rem] lg:text-sm text-muted-foreground mt-0.5">
            {section === "hero" && (t.admin.descriptions?.hero ?? "")}
            {section === "services" && (t.admin.descriptions?.services ?? "")}
            {section === "projects" && (t.admin.descriptions?.projects ?? "")}
            {section === "team" && (t.admin.descriptions?.team ?? "")}
            {section === "testimonials" &&
              (t.admin.descriptions?.testimonials ?? "")}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-3 lg:p-4">
        {section === "hero" && <HeroManager />}
        {section === "services" && <ServicesManager />}
        {section === "projects" && <ProjectsManager />}
        {section === "team" && <TeamManager />}
        {section === "testimonials" && <TestimonialsManager />}
      </div>
    </div>
  );
}
