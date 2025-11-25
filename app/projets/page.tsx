"use client"

import { PresentationProjetSection } from "@/components/sections/presentation-projets-section"
import { ProjectsHeroSection } from "@/components/sections/projects-hero-section"
import { ProjectsCategoriesSection } from "@/components/sections/projects-categories-section"
import { ProjectsStoriesSection } from "@/components/sections/projects-stories-section"
import TestimonialsSection from "@/components/sections/testimonials-section"
import CtaVisualSection from "@/components/sections/cta-visual-section"

export default function ProjetsPage() {
  return (
    <>
      <div className="relative">
        <ProjectsHeroSection />
        <PresentationProjetSection />
      </div>

      <ProjectsCategoriesSection />
      <ProjectsStoriesSection />
      <TestimonialsSection />
      <CtaVisualSection />
    </>
  )
}
