import { HeroSection } from "@/components/hero-section"
import ServicesSection from "@/components/services-section"
import ProjectsIntroSection from "@/components/projects-intro-section"
import TeamIntroSection from "@/components/team-intro-section"
import TestimonialsSection from "@/components/testimonials-section"
import CtaVisualSection from "@/components/cta-visual-section"

export default function Home() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <ProjectsIntroSection />
      <TeamIntroSection />
      <TestimonialsSection />
      <CtaVisualSection />
    </>
  )
}
