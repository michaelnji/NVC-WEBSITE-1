"use client"

import type React from "react"
import { CustomCursor } from "@/components/custom-cursor"
import { Navbar } from "@/components/navbar"
import { LanguageProvider } from "@/contexts/language-context"
import SiteFooter from "@/components/site-footer"
import { ThemeProvider } from "@/contexts/theme-context"
import { useEffect, useMemo, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Particles, { initParticlesEngine } from "@tsparticles/react"
import { loadSlim } from "@tsparticles/slim"
import NextTopLoader from "nextjs-toploader"
import { usePathname } from "next/navigation"

export const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const [init, setInit] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [prefersReduced, setPrefersReduced] = useState(false)
  const pathname = usePathname()
  const hideChrome = ["/projets", "/a-propos", "/contact", "/portfolio", "/admin"].some((route) =>
    pathname?.startsWith(route)
  )
  const isAdmin = pathname?.startsWith("/admin")
  const isHome = pathname === "/"

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReduced(mq.matches)
    const onChange = () => setPrefersReduced(mq.matches)
    mq.addEventListener?.("change", onChange)
    return () => mq.removeEventListener?.("change", onChange)
  }, [])

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 1024)
    onResize()
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  useEffect(() => {
    if (prefersReduced || !isDesktop || isAdmin) return
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>("section")
      sections.forEach((el) => {
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
  }, [prefersReduced, isDesktop, isAdmin])

  useEffect(() => {
    if (!isHome || isAdmin || prefersReduced || !isDesktop) return
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => {
      setInit(true)
    })
  }, [isHome, isAdmin, prefersReduced, isDesktop])

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

        {init && isHome && isDesktop && (
          <Particles
            id="tsparticles"
            className="fixed inset-0 z-[1]"
            options={{
              background: {
                color: {
                  value: "transparent",
                },
              },
              fpsLimit: 48,
              particles: {
                number: {
                value: 40,
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
                  value: { min: 0.3, max: 0.6 },
                  animation: {
                    enable: true,
                    speed: 1.2,
                    sync: false,
                  },
                },
                size: {
                  value: { min: 1, max: 3 },
                  animation: {
                    enable: true,
                    speed: 2.5,
                    sync: false,
                  },
                },
                rotate: {
                  value: { min: 0, max: 360 },
                  animation: {
                    enable: false,
                    speed: 10,
                    sync: false,
                  },
                },
                move: {
                  enable: true,
                  speed: { min: 0.3, max: 1.2 },
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
                shadow: { enable: false },
              },
              interactivity: {
                detectsOn: "window",
                events: {
                  onHover: { enable: false },
                  resize: {
                    enable: true,
                  },
                },
                modes: {},
              },
              detectRetina: true,
            }}
          />
        )}

        <div className={`relative z-10 ${isAdmin ? "h-screen overflow-hidden" : ""}`}>
          {!isAdmin && <CustomCursor />}
          {!hideChrome && <Navbar />}
          {children}
          {!hideChrome && <SiteFooter />}
        </div>
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default ClientLayout
