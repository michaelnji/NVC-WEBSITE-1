"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function AnimatedBackground() {
  const bgRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!bgRef.current) return

    const ctx = gsap.context(() => {
      gsap.to(bgRef.current, {
        scale: 1.5,
        ease: "none",
        force3D: true,
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      })
    })

    return () => {
      ctx.revert()
    }
  }, [])

  return (
    <>
      <div
        ref={bgRef}
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: "url(/background.png)",
          backgroundPosition: "top ",
          backgroundSize: "1800px auto",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          willChange: "transform",
        }}
      />
      <div
        ref={overlayRef}
        className="fixed inset-0 z-0 bg-background/40 dark:bg-background/20 transition-colors duration-500 pointer-events-none"
      />
    </>
  )
}
