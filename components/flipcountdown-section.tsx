"use client"

import { useLayoutEffect, useRef } from "react"
import { gsap } from "gsap"
import { FlipCountdown } from "@/components/flip-count-down"
import { CTAButton } from "@/components/cta-button"
import { useLanguage } from "@/contexts/language-context"

export function FlipCountdownSection() {
  const { t } = useLanguage()
  const containerRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const ctx = gsap.context(() => {
      if (prefersReduced) return
      const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.8 } })
      tl.from(containerRef.current, { opacity: 0, y: 20 })
        .from([".heading", ".subtext"], { opacity: 0, y: 20, stagger: 0.1 }, "-=0.4")
        .from(".countdown", { opacity: 0, scale: 0.95 }, "-=0.4")
        .from(".cta", { opacity: 0, y: 10 }, "-=0.5")
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="w-full max-w-6xl text-center py-12 px-6 sm:py-16 sm:px-8 md:py-20 md:px-10 bg-white rounded-3xl">
      <h1 className="heading text-3xl text-black sm:text-4xl md:text-5xl lg:text-7xl font-black font-display mb-4 sm:mb-6 leading-wide tracking-wide px-2">
        {t.cta.sectionTitle}
      </h1>

      <p className="subtext text-base text-black font-sans sm:text-lg md:text-xl mb-8 sm:mb-10 md:mb-12 text-black-800 max-w-2xl mx-auto px-4">
        {t.cta.subtitle}
      </p>

      <div className="countdown flex justify-center"><FlipCountdown /></div>

      <div className="cta mt-10 flex justify-center gap-3 flex-wrap">
        <div className="w-48 flex justify-center">
          <div className="w-full flex justify-center">
            <CTAButton href="https://wa.me/237650749592?text=Hello%20New%20Vision%20Creatives%2C%20I%27d%20love%20to%20book%20an%20intro%20call%20to%20craft%20my%20next%20visual%20story.">
              {t.hero.cta}
            </CTAButton>
          </div>
        </div>
        <div className="w-48 flex justify-center">
          <div className="w-full flex justify-center">
            <CTAButton href="/">{t.common.buttons.backHome}</CTAButton>
          </div>
        </div>
      </div>
    </div>
  )
}
