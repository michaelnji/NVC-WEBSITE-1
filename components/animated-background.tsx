"use client"

import { useEffect, useRef, useState } from "react"

export function AnimatedBackground() {
  const bgRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const [isDesktop, setIsDesktop] = useState(false)
  const [prefersReduced, setPrefersReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReduced(mq.matches)
    const onChange = () => setPrefersReduced(mq.matches)
    mq.addEventListener?.("change", onChange)
    const onResize = () => setIsDesktop(window.innerWidth >= 1024)
    onResize()
    window.addEventListener("resize", onResize)
    return () => {
      mq.removeEventListener?.("change", onChange)
      window.removeEventListener("resize", onResize)
    }
  }, [])

  useEffect(() => {
    if (prefersReduced || !isDesktop) return
    if (!bgRef.current) return
    // Plus d'animation au scroll : le fond reste fixe
  }, [prefersReduced, isDesktop])

  return (
    <>
      <div
        ref={bgRef}
        className="fixed inset-0 z-0 pointer-events-none hidden lg:block motion-reduce:hidden"
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
