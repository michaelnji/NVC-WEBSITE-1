import { HeroSection } from "@/components/hero-section"
import ServicesSection from "@/components/services-section"
import ProjectsIntroSection from "@/components/projects-intro-section"
import TeamIntroSection from "@/components/team-intro-section"
import TestimonialsSection from "@/components/testimonials-section"
import CtaVisualSection from "@/components/cta-visual-section"
import { createAdminClient } from "@/lib/supabase/admin"
import type { HeroImage, Service, TeamMember, Testimonial } from "@/lib/types"

export default async function Home() {
  const supabase = createAdminClient()

  const [heroImagesResult, servicesResult, teamMembersResult, testimonialsResult] = await Promise.all([
    supabase.from("hero_images").select("*").order("order_index"),
    supabase.from("services").select("*").order("order_index"),
    supabase.from("team_members").select("*").order("order_index"),
    supabase.from("testimonials").select("*").order("order_index"),
  ])

  const heroImages = (heroImagesResult.data || []) as HeroImage[]
  const services = (servicesResult.data || []) as Service[]
  const teamMembers = (teamMembersResult.data || []) as TeamMember[]
  const testimonials = (testimonialsResult.data || []) as Testimonial[]

  return (
    <>
      <HeroSection initialHeroImages={heroImages} />
      <ServicesSection initialServices={services} />
      <ProjectsIntroSection initialServices={services} />
      <TeamIntroSection initialMembers={teamMembers} />
      <TestimonialsSection initialTestimonials={testimonials} />
      <CtaVisualSection />
    </>
  )
}
