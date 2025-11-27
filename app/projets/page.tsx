"use client"

import { PresentationProjetSection } from "@/components/sections/presentation-projets-section"
import { ProjectsHeroSection } from "@/components/sections/projects-hero-section"
import { ProjectsStoriesSection } from "@/components/sections/projects-stories-section"
import { PartnersSection } from "@/components/sections/partners-section"
import TestimonialsSection from "@/components/sections/testimonials-section"
import CtaVisualSection from "@/components/sections/cta-visual-section"
import ProjectsListSection from "@/components/sections/projects-list-section"
import HowWeThinkSection from "@/components/sections/how-we-think-section"

export default function ProjetsPage() {
  return (
    <>
      <div className="relative">
        <ProjectsHeroSection />
        <PresentationProjetSection />
      </div>
      <ProjectsListSection />
      <ProjectsStoriesSection />
      <HowWeThinkSection />
      <PartnersSection />
      <TestimonialsSection />
      <CtaVisualSection />
    </>
  )
}
