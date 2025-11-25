"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { motion, useAnimationFrame, useMotionValue } from "framer-motion"
import ImageWithSkeleton from "@/components/image-with-skeleton"
import { AvailableSlotCard } from "@/components/available-slot-card"
import type { Project } from "@/lib/types"

type PresentationProjetSectionProps = {
  initialProjects?: Project[]
}

export function PresentationProjetSection({ initialProjects }: PresentationProjetSectionProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects ?? [])

  const sectionRef = useRef<HTMLElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const trackX = useMotionValue(0)
  const seqRef = useRef<HTMLDivElement | null>(null)
  const seqWidthRef = useRef(0)
  const holdUntilRef = useRef(0)
  const [isVisible, setIsVisible] = useState(false)

  const prefersReduced = useMemo(
    () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
    []
  )

  const speed = 40

  useAnimationFrame((_, delta) => {
    if (prefersReduced) return
    if (!isVisible) return
    if (Date.now() < holdUntilRef.current) return

    const dx = (speed * delta) / 1000
    const seqW = seqWidthRef.current
    if (!seqW) return

    let next = trackX.get() - dx
    if (next <= -seqW) next += seqW
    trackX.set(next)
  })

  useEffect(() => {
    const measure = () => {
      if (!seqRef.current) return
      seqWidthRef.current = seqRef.current.getBoundingClientRect().width || 0
    }

    measure()
    window.addEventListener("resize", measure)
    return () => {
      window.removeEventListener("resize", measure)
    }
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.1 }
    )

    observer.observe(section)

    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const HOLD_DRAG_MS = 1500
    const HOLD_WHEEL_MS = 150

    const onWheel = (e: WheelEvent) => {
      const absX = Math.abs(e.deltaX)
      const absY = Math.abs(e.deltaY)
      const H_DEADZONE = 4

      if (!e.shiftKey && (absY > absX * 1.2 || absX < H_DEADZONE)) {
        if (holdUntilRef.current > Date.now()) holdUntilRef.current = Date.now() - 1
        return
      }

      e.preventDefault()
      const delta = e.deltaX !== 0 ? e.deltaX : e.deltaY
      const seqW = seqWidthRef.current
      if (!seqW) return

      let next = trackX.get() - delta
      if (next <= -seqW) next += seqW
      if (next >= 0) next -= seqW
      trackX.set(next)
      holdUntilRef.current = Date.now() + HOLD_WHEEL_MS
    }

    let dragging = false
    let dragged = false
    let lastX = 0
    let startX = 0

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return
      dragging = true
      dragged = false
      startX = lastX = e.clientX
      ;(e.target as Element).setPointerCapture?.(e.pointerId)
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return
      const dx = e.clientX - lastX
      lastX = e.clientX

      if (!dragged && Math.abs(e.clientX - startX) > 4) {
        dragged = true
        holdUntilRef.current = Date.now() + HOLD_DRAG_MS
      }

      const seqW = seqWidthRef.current
      if (!seqW) return

      let next = trackX.get() + dx
      if (next <= -seqW) next += seqW
      if (next >= 0) next -= seqW
      trackX.set(next)
      if (dragged) holdUntilRef.current = Date.now() + HOLD_DRAG_MS
    }

    const onPointerUp = () => {
      dragging = false
      if (dragged) holdUntilRef.current = Date.now() + HOLD_DRAG_MS
    }

    const onPointerCancel = () => {
      dragging = false
    }

    el.addEventListener("wheel", onWheel, { passive: false })
    el.addEventListener("pointerdown", onPointerDown)
    window.addEventListener("pointermove", onPointerMove)
    window.addEventListener("pointerup", onPointerUp)
    window.addEventListener("pointercancel", onPointerCancel)

    return () => {
      el.removeEventListener("wheel", onWheel as any)
      el.removeEventListener("pointerdown", onPointerDown as any)
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("pointerup", onPointerUp)
      window.removeEventListener("pointercancel", onPointerCancel)
    }
  }, [trackX])

  useEffect(() => {
    if (initialProjects && initialProjects.length) return

    let cancelled = false

    const load = async () => {
      try {
        const res = await fetch("/api/projects", { cache: "no-store" })
        if (!res.ok) return
        const data: Project[] = await res.json()
        if (!cancelled) setProjects(data || [])
      } catch (_e) {
        if (!cancelled) setProjects([])
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [initialProjects])

  const hasProjects = projects.length > 0

  const visibleProjects = useMemo(() => {
    if (!projects.length) return []
    const MIN_CARDS = 4
    const result: Project[] = []

    while (result.length < Math.max(MIN_CARDS, projects.length)) {
      result.push(...projects)
    }

    return result.slice(0, Math.max(MIN_CARDS, projects.length))
  }, [projects])

  const cardWidth = "w-[260px] sm:w-[320px] md:w-[380px] lg:w-[659px] "

  const renderProjectCard = (project: Project, key: string) => (
    <motion.div
      key={key}
      className={`group relative ${cardWidth} aspect-[16/9] flex-shrink-0 rounded-3xl overflow-hidden bg-black/90 border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.6)]`}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 200, damping: 24 }}
    >
      <ImageWithSkeleton
        src={project.image_url || "/placeholder.svg"}
        alt={project.title}
        wrapperClassName="w-full h-full"
        className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80 group-hover:opacity-50 transition-opacity duration-500" />
      <div className="absolute bottom-4 left-4 right-4">
        <p className="text-[10px] sm:text-xs text-white/60 uppercase tracking-[0.18em] mb-1">
          Main project
        </p>
        <h3 className="font-display text-base sm:text-lg md:text-xl text-white leading-tight">
          {project.title}
        </h3>
      </div>
    </motion.div>
  )

  const renderPlaceholderCard = (key: string) => (
    <motion.div
      key={key}
      className={`group relative ${cardWidth} aspect-[16/9] flex-shrink-0 rounded-3xl overflow-hidden bg-black/95 border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.7)]`}
    >
      <AvailableSlotCard
        title="Main project slot"
        description="Add a featured project in the admin to showcase it here."
        className="h-full"
      />
    </motion.div>
  )

  return (
    <section
      ref={sectionRef}
      className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-1/2 z-20 bg-transparent"
    >
      <div className="pointer-events-auto max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div
          ref={containerRef}
          className="relative mt-4 sm:mt-6 md:mt-8 overflow-visible cursor-grab active:cursor-grabbing select-none touch-pan-y md:touch-auto"
        >
          <motion.div
            className="flex gap-5 sm:gap-6 md:gap-7 lg:gap-8 will-change-transform"
            style={{ x: trackX }}
          >
            <div ref={seqRef} className="flex gap-5 sm:gap-6 md:gap-7 lg:gap-8">
              {hasProjects
                ? visibleProjects.map((project, i) => renderProjectCard(project, `a-${project.id}-${i}`))
                : Array.from({ length: 4 }).map((_, i) => renderPlaceholderCard(`placeholder-a-${i}`))}
            </div>
            <div className="flex gap-5 sm:gap-6 md:gap-7 lg:gap-8">
              {hasProjects
                ? visibleProjects.map((project, i) => renderProjectCard(project, `b-${project.id}-${i}`))
                : Array.from({ length: 4 }).map((_, i) => renderPlaceholderCard(`placeholder-b-${i}`))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
