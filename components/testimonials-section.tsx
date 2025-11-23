"use client"

import { motion, useAnimationFrame, useMotionValue, type Variants } from "framer-motion"
import ImageWithSkeleton from "@/components/image-with-skeleton"
import Image from "next/image"

import { useRef, useEffect, useMemo, useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { AvailableSlotCard } from "@/components/available-slot-card"
import type { Testimonial } from "@/lib/types"

type TestimonialsSectionProps = {
  initialTestimonials?: Testimonial[]
}

export default function TestimonialsSection({ initialTestimonials }: TestimonialsSectionProps) {
  const { t } = useLanguage()
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials ?? [])
  const sectionRef = useRef<HTMLElement>(null)

  const Star = ({ filled }: { filled: boolean }) => (
    <svg
      className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5"
      viewBox="0 0 24 24"
      fill={filled ? "#ff6b35" : "none"}
      stroke="#ff6b35"
      strokeWidth="2"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />
    </svg>
  )

  // Seamless marquee state (component scope)
  const trackX = useMotionValue(0)
  const trackRef = useRef<HTMLDivElement>(null)
  const seqRef = useRef<HTMLDivElement>(null)
  const seqWidthRef = useRef(0)
  const speed = 60 // px per second
  const containerRef = useRef<HTMLDivElement>(null)
  const holdUntilRef = useRef<number>(0)
  const [isVisible, setIsVisible] = useState(false)
  const prefersReduced = useMemo(() =>
    typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  , [])

  // Hover variants for card and stars cascade
  const cardVariants = prefersReduced
    ? { initial: { y: 0 }, hovered: { y: -2 } }
    : { initial: { y: 0 }, hovered: { y: -6 } }
  const starVariants: Variants = {
    initial: { scale: 1, rotateY: 0, y: 0 },
    hovered: (i: number) => ({
      // progressive enlargement and subtle pop by index
      scale: 1.08 + i * 0.06,
      rotateY: 8 + i * 1.2,
      y: -i * 1,
      transition: { duration: 0.3, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] },
    }),
  }

  useAnimationFrame((t, delta) => {
    if (prefersReduced) return
    if (!isVisible) return
    // pause auto-scroll while user is interacting
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

  // Enable manual scroll: wheel (horizontal/vertical) and drag
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const HOLD_DRAG_MS = 1500
    const HOLD_WHEEL_MS = 150

    const onWheel = (e: WheelEvent) => {
      const absX = Math.abs(e.deltaX)
      const absY = Math.abs(e.deltaY)
      const H_DEADZONE = 4 // px minimal horizontal intent to intercept

      // Let the page scroll when vertical clearly dominates, unless user forces horizontal with Shift
      if (!e.shiftKey && (absY > absX * 1.2 || absX < H_DEADZONE)) {
        // ensure no stale pause remains during vertical scroll
        if (holdUntilRef.current > Date.now()) holdUntilRef.current = Date.now() - 1
        return
      }

      // Otherwise, treat as horizontal intent
      e.preventDefault()
      const delta = e.deltaX !== 0 ? e.deltaX : e.deltaY
      const seqW = seqWidthRef.current
      if (!seqW) return
      let next = trackX.get() - delta
      if (next <= -seqW) next += seqW
      if (next >= 0) next -= seqW
      trackX.set(next)
      // brief pause only for horizontal wheel interactions
      holdUntilRef.current = Date.now() + HOLD_WHEEL_MS
    }

    let dragging = false
    let dragged = false
    let lastX = 0
    let startX = 0
    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return // primary button only
      dragging = true
      dragged = false
      startX = lastX = e.clientX
      ;(e.target as Element).setPointerCapture?.(e.pointerId)
      // don't pause yet; wait for actual movement
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
    const onPointerUp = (e: PointerEvent) => {
      dragging = false
      if (dragged) holdUntilRef.current = Date.now() + HOLD_DRAG_MS
    }
    const onPointerCancel = (e: PointerEvent) => {
      dragging = false
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerCancel)
    return () => {
      el.removeEventListener('wheel', onWheel as any)
      el.removeEventListener('pointerdown', onPointerDown as any)
      window.removeEventListener('pointermove', onPointerMove as any)
      window.removeEventListener('pointerup', onPointerUp as any)
      window.removeEventListener('pointercancel', onPointerCancel as any)
    }
  }, [])

  // Load testimonials from API (BD) uniquement si aucune donnée n'a été fournie côté serveur
  useEffect(() => {
    if (initialTestimonials && initialTestimonials.length) return

    let cancelled = false
    const load = async () => {
      try {
        const res = await fetch("/api/testimonials")
        if (!res.ok) return
        const data: Testimonial[] = await res.json()
        if (!cancelled) setTestimonials(data || [])
      } catch (e) {
        console.error("Failed to load testimonials", e)
      }
    }
    load()
    // option: could refetch on interval if needed
    return () => {
      cancelled = true
    }
  }, [initialTestimonials])

  const hasTestimonials = testimonials.length > 0

  // Ensure we always have enough cards to visually fill the marquee track
  const visibleTestimonials = useMemo(() => {
    if (!testimonials.length) return []
    const MIN_CARDS = 4
    const result: Testimonial[] = []

    // Repeat testimonials until we reach at least MIN_CARDS
    while (result.length < Math.max(MIN_CARDS, testimonials.length)) {
      result.push(...testimonials)
    }

    // Trim to the exact target length
    return result.slice(0, Math.max(MIN_CARDS, testimonials.length))
  }, [testimonials])

  // Observe visibility of the section to avoid running marquee when offscreen
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.1 },
    )

    observer.observe(section)

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="relative z-10 pt-20 sm:pt-24 md:pt-32 lg:pt-40 pb-20 sm:pb-24 md:pb-32 lg:pb-40 -mt-8 md:-mt-10 lg:-mt-12 xl:-mt-14 2xl:-mt-16 overflow-x-hidden lg:min-h-[75vh] xl:min-h-[85vh]"
      style={{
        backgroundColor: "#0f0f0f",
        backgroundImage: "url('/background%20temoignages.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* decorative layer */}
      <div className="relative mx-auto text-center">
        <h2 className="testimonials-title font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-wide leading-tight text-white uppercase text-balance mb-4 sm:mb-5 md:mb-6 lg:mb-7">
          {t.testimonials.headingLine1}
          <br />
          <span className="text-[#ff6b35]">{t.testimonials.headingLine2}</span>
        </h2>

        {/* Cards row - auto-scrolling marquee (seamless) with manual user control */}
        <div ref={containerRef} className="mt-6 sm:mt-8 md:mt-9 lg:mt-10 relative overflow-visible z-10 cursor-grab active:cursor-grabbing select-none touch-pan-y md:touch-auto">
          <motion.div ref={trackRef} className="flex gap-5 sm:gap-6 md:gap-7 lg:gap-8 will-change-transform" style={{ x: trackX }}>
            <div ref={seqRef} className="flex gap-5 sm:gap-6 md:gap-7 lg:gap-8">
              {hasTestimonials
                ? visibleTestimonials.map((item, i) => (
                    <motion.div
                      key={`a-${i}`}
                      className="group relative w-[280px] sm:w-[300px] md:w-[320px] lg:w-[340px] min-h-[340px] sm:min-h-[360px] md:min-h-[380px] lg:min-h-[400px] flex-shrink-0 rounded-2xl sm:rounded-3xl bg-[#efefef] p-4 sm:p-5 md:p-6 shadow-[0_6px_24px_rgba(0,0,0,0.15)] transition-all flex flex-col overflow-visible hover:z-20"
                      variants={cardVariants}
                      initial="initial"
                      whileHover="hovered"
                      transition={{ type: 'spring', stiffness: 180, damping: 22, mass: 0.7 }}
                    >
                      <div className="pointer-events-none absolute inset-0 rounded-2xl overflow-hidden">
                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                      </div>
                      <motion.div className="flex items-center justify-center gap-1 sm:gap-1.5 mb-2" style={{ perspective: 600 }}>
                        {Array.from({ length: 5 }).map((_, s) => (
                          <motion.div key={s} variants={starVariants} custom={s} className="origin-center">
                            <Star filled={s < item.rating} />
                          </motion.div>
                        ))}
                      </motion.div>
                      <h3 className="font-display text-lg sm:text-xl md:text-2xl text-[#1e1e1e] leading-tight mb-2 whitespace-pre-line uppercase font-extrabold tracking-wider transition-transform duration-500 group-hover:translate-x-1">
                        {item.title}
                      </h3>
                      <p className="text-[#1e1e1e]/80 text-xs sm:text-sm md:text-base leading-relaxed mb-2 break-words whitespace-pre-line transition-transform duration-500 group-hover:translate-x-[2px]">{item.description}</p>
                      <div className="flex flex-col items-center justify-center mt-auto transition-transform duration-500 group-hover:-translate-y-1">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-[#d9d9d9] shadow-inner flex items-center justify-center ring-1 ring-black/10 mb-2">
                          <ImageWithSkeleton src={item.photo_url || "/avatar.svg"} alt={item.author_name} wrapperClassName="w-full h-full" className="w-full h-full rounded-full object-cover" />
                        </div>
                        <p className="text-[#1e1e1e] font-semibold leading-tight">{item.author_name}</p>
                        <p className="text-[#ff6b35] text-xs sm:text-sm leading-tight">{item.position}</p>
                      </div>
                    </motion.div>
                  ))
                : Array.from({ length: 4 }).map((_, i) => (
                    <motion.div
                      key={`placeholder-a-${i}`}
                      className="group relative w-[280px] sm:w-[300px] md:w-[320px] lg:w-[340px] min-h-[340px] sm:min-h-[360px] md:min-h-[380px] lg:min-h-[400px] flex-shrink-0 rounded-2xl sm:rounded-3xl bg-black/95 border border-white/10 p-4 sm:p-5 md:p-6 shadow-[0_6px_32px_rgba(0,0,0,0.45)] transition-all flex flex-col overflow-visible hover:z-20"
                    >
                      <AvailableSlotCard className="h-full" />
                    </motion.div>
                  ))}
            </div>
            <div className="flex gap-5 sm:gap-6 md:gap-7 lg:gap-8">
              {hasTestimonials
                ? visibleTestimonials.map((item, i) => (
                    <motion.div
                      key={`b-${i}`}
                      className="group relative w-[280px] sm:w-[300px] md:w-[320px] lg:w-[340px] min-h-[340px] sm:min-h-[360px] md:min-h-[380px] lg:min-h-[400px] flex-shrink-0 rounded-2xl sm:rounded-3xl bg-[#efefef] p-4 sm:p-5 md:p-6 shadow-[0_6px_24px_rgba(0,0,0,0.15)] transition-all flex flex-col overflow-visible hover:z-20"
                      variants={cardVariants}
                      initial="initial"
                      whileHover="hovered"
                      transition={{ type: 'spring', stiffness: 180, damping: 22, mass: 0.7 }}
                    >
                      <div className="pointer-events-none absolute inset-0 rounded-2xl overflow-hidden">
                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                      </div>
                      <motion.div className="flex items-center justify-center gap-1 sm:gap-1.5 mb-2">
                        {Array.from({ length: 5 }).map((_, s) => (
                          <motion.div key={s} variants={starVariants} custom={s} className="origin-center">
                            <Star filled={s < item.rating} />
                          </motion.div>
                        ))}
                      </motion.div>
                      <h3 className="font-display text-lg sm:text-xl md:text-2xl text-[#1e1e1e] leading-tight mb-2 whitespace-pre-line uppercase font-extrabold tracking-wider transition-transform duration-500 group-hover:translate-x-1">
                        {item.title}
                      </h3>
                      <p className="text-[#1e1e1e]/80 text-xs sm:text-sm md:text-base leading-relaxed mb-2 break-words whitespace-pre-line transition-transform duration-500 group-hover:translate-x-[2px]">{item.description}</p>
                      <div className="flex flex-col items-center justify-center mt-auto transition-transform duration-500 group-hover:-translate-y-1">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-[#d9d9d9] shadow-inner flex items-center justify-center ring-1 ring-black/10 mb-2">
                          <ImageWithSkeleton src={item.photo_url || "/avatar.svg"} alt={item.author_name} wrapperClassName="w-full h-full" className="w-full h-full rounded-full object-cover" />
                        </div>
                        <p className="text-[#1e1e1e] font-semibold leading-tight">{item.author_name}</p>
                        <p className="text-[#ff6b35] text-xs sm:text-sm leading-tight">{item.position}</p>
                      </div>
                    </motion.div>
                  ))
                : Array.from({ length: 4 }).map((_, i) => (
                    <motion.div
                      key={`placeholder-b-${i}`}
                      className="group relative w-[280px] sm:w-[300px] md:w-[320px] lg:w-[340px] min-h-[340px] sm:min-h-[360px] md:min-h-[380px] lg:min-h-[400px] flex-shrink-0 rounded-2xl sm:rounded-3xl bg-black/95 border border-white/10 p-4 sm:p-5 md:p-6 shadow-[0_6px_32px_rgba(0,0,0,0.45)] transition-all flex flex-col overflow-visible hover:z-20"
                    >
                      <AvailableSlotCard className="h-full" />
                    </motion.div>
                  ))}
            </div>
          </motion.div>
        </div>
        {/* subtle premium edge haze (hidden on mobile) */}

      </div>

      {/* bottom stamp */}
      <div className="relative mt-12 sm:mt-14 flex flex-col items-center justify-center">
        <div className="text-white/80 text-xs sm:text-sm mb-3 sm:mb-4">
          Designing with <span className="text-[#ff6b35]">❤</span> from our HQ in
        </div>
        <motion.div 
          className="relative cursor-pointer"
          whileHover={{
            scale: 1.30,
            rotate: 8,
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 20,
            }
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
        >
          <Image src="/Layer_1.svg" alt="DAMAS" width={192} height={192} className="w-36 sm:w-44 md:w-48 h-auto object-cover rounded-[12px] shadow-lg hover:shadow-xl transition-shadow" />
        </motion.div>
      </div>
    </section>
  )
}