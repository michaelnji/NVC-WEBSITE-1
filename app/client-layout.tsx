"use client"

import type React from "react"
import { CustomCursor } from "@/components/custom-cursor"
import { Navbar } from "@/components/navbar"
import { LanguageProvider } from "@/contexts/language-context"
import SiteFooter from "@/components/site-footer"
import { ThemeProvider } from "@/contexts/theme-context"
import { useEffect, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Particles, { initParticlesEngine } from "@tsparticles/react"
import { loadSlim } from "@tsparticles/slim"
import NextTopLoader from "nextjs-toploader"
import { usePathname } from "next/navigation"

export const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const [init, setInit] = useState(false)
  const pathname = usePathname()
  const hideChrome = ["/projets", "/a-propos", "/contact"].some((route) =>
    pathname?.startsWith(route)
  )

  useEffect(() => {
    // Register GSAP plugins once on mount
    gsap.registerPlugin(ScrollTrigger)

    // Respect reduced motion
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const ctx = gsap.context(() => {
      if (prefersReduced) return

      const sections = gsap.utils.toArray<HTMLElement>("section")

      sections.forEach((el) => {
        // Skip if element is hidden
        if (!el || el.offsetParent === null) return

        gsap.from(el, {
          opacity: 0,
          y: 28,
          duration: 0.8,
          ease: "power3.out",
          clearProps: "opacity,transform",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            end: "top 40%",
            once: true,
          },
        })
      })
    })

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => {
      setInit(true)
    })
  }, [])

  return (
    <ThemeProvider>
      <LanguageProvider>
        <NextTopLoader
          color="#F15A25"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #F15A25,0 0 5px #F15A25"
        />

        {init && (
          <Particles
            id="tsparticles"
            className="fixed inset-0 z-[1]"
            options={{
              background: {
                color: {
                  value: "transparent",
                },
              },
              fpsLimit: 60,
              particles: {
                number: {
                  value: 100,
                  density: {
                    enable: true,
                  },
                },
                color: {
                  value: ["#F15A25", "#FF4500", "#FF6347", "#FFD700", "#FFA500"],
                },
                shape: {
                  type: ["triangle", "polygon"],
                },
                opacity: {
                  value: { min: 0.3, max: 0.9 },
                  animation: {
                    enable: true,
                    speed: 2,
                    sync: false,
                  },
                },
                size: {
                  value: { min: 1, max: 4 },
                  animation: {
                    enable: true,
                    speed: 4,
                    sync: false,
                  },
                },
                rotate: {
                  value: { min: 0, max: 360 },
                  animation: {
                    enable: true,
                    speed: 20,
                    sync: false,
                  },
                },
                move: {
                  enable: true,
                  speed: { min: 0.5, max: 2 },
                  direction: "top",
                  random: true,
                  straight: false,
                  outModes: {
                    default: "out",
                    top: "destroy",
                    bottom: "none",
                  },
                },
                links: {
                  enable: false,
                },
                shadow: {
                  enable: true,
                  color: "#F15A25",
                  blur: 8,
                },
              },
              interactivity: {
                detectsOn: "window",
                events: {
                  onHover: {
                    enable: true,
                    mode: "repulse",
                  },
                  resize: {
                    enable: true,
                  },
                },
                modes: {
                  repulse: {
                    distance: 100,
                    duration: 0.4,
                  },
                },
              },
              detectRetina: true,
            }}
          />
        )}

        <div className="relative z-10">
          <CustomCursor />
          {!hideChrome && <Navbar />}
          {children}
          {!hideChrome && <SiteFooter />}
        </div>
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default ClientLayout
