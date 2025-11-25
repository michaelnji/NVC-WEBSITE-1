"use client"

import { useLanguage } from "@/contexts/language-context"
import { SecondaryCTAButton } from "@/components/cta-buttons"

export function ProjectsHeroSection() {
  const { t } = useLanguage()

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      <video
        className="absolute inset-0 w-full h-full object-cover scale-110 md:scale-125"
        src="/projets_images/video_hero_projets.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 text-center text-white">
        <h1 className="font-display  w-full   font-extrabold uppercase  text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-[120px]">
          <span className="block">
            <span className="text-white">WHERE IDEAS </span>
            <span className="text-brand">TAKE SHAPE </span>
            <span className="text-white">AND</span>
          </span>
          <span className="block">
            <span className="text-white">STORIES </span>
            <span className="text-brand">BECOME REAL.</span>
          </span>
        </h1>

        <p className="mt-4 font-sans text-xs sm:text-sm md:text-base text-white">
          Every project is a journey. Here&apos;s a closer look at the stories we&apos;ve shaped for brands who trusted
          us.
        </p>

        <div className="mt-6 sm:mt-8 flex justify-center">
          <SecondaryCTAButton
            href="/contact"
            variant="white"
            className="w-auto px-6 sm:px-8"
          >
            <span className="text-xs sm:text-sm md:text-base">Let&apos;s shape your story</span>
          </SecondaryCTAButton>
        </div>
      </div>
    </section>
  )
}
