"use client"

import type React from "react"
import dynamic from "next/dynamic"
import { Navbar } from "@/components/layout/navbar"
import { LanguageProvider } from "@/contexts/language-context"
import SiteFooter from "@/components/layout/site-footer"
import { ThemeProvider } from "@/contexts/theme-context"
import { useEffect, useState } from "react"
import NextTopLoader from "nextjs-toploader"
import { usePathname } from "next/navigation"

const CustomCursor = dynamic(
  () => import("@/components/custom-cursor").then((mod) => ({ default: mod.CustomCursor })),
  { ssr: false },
)

const Particles = dynamic(
  () => import("@tsparticles/react").then((mod) => mod.default),
  { ssr: false },
)

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
    if (!isHome || isAdmin || prefersReduced || !isDesktop) return

    let cancelled = false
    ;(async () => {
      const [{ initParticlesEngine }, { loadSlim }] = await Promise.all([
        import("@tsparticles/react"),
        import("@tsparticles/slim"),
      ])

      if (cancelled) return

      await initParticlesEngine(async (engine: any) => {
        await loadSlim(engine)
      })

      if (!cancelled) setInit(true)
    })()

    return () => {
      cancelled = true
    }
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
