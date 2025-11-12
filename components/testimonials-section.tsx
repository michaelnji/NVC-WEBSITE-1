"use client"

import { motion, useAnimationFrame, useMotionValue } from "framer-motion"
import ImageWithSkeleton from "@/components/image-with-skeleton"
import Image from "next/image"

import { useRef, useEffect } from "react"
import { useLanguage } from "@/contexts/language-context"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

export default function TestimonialsSection() {
  const { t } = useLanguage()
  const testimonials = t.testimonials.items
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
  const speed = 60 // px per second

  useAnimationFrame((t, delta) => {
    const dx = (speed * delta) / 1000
    const seqW = seqRef.current?.getBoundingClientRect().width || 0
    if (!seqW) return
    let next = trackX.get() - dx
    if (next <= -seqW) next += seqW
    trackX.set(next)
  })

  useEffect(() => {
    if (!sectionRef.current) return
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReduced) return

    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      gsap.from(".testimonials-title", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "top 40%",
          toggleActions: "play none none none",
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="relative z-10 pt-20 sm:pt-24 md:pt-32 lg:pt-40 pb-20 sm:pb-24 md:pb-32 lg:pb-40 -mt-8 md:-mt-12 lg:-mt-14"
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
        <h2 className="testimonials-title font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-wide leading-tight text-white uppercase text-balance">
          {t.testimonials.headingLine1}
          <br />
          <span className="text-[#ff6b35]">{t.testimonials.headingLine2}</span>
        </h2>

        {/* Cards row - auto-scrolling marquee (seamless) */}
        <div className="mt-8 sm:mt-10 relative overflow-hidden">
          <motion.div ref={trackRef} className="flex gap-5 sm:gap-6 md:gap-7 lg:gap-8 will-change-transform" style={{ x: trackX }}>
            <div ref={seqRef} className="flex gap-5 sm:gap-6 md:gap-7 lg:gap-8">
              {testimonials.map((t, i) => (
                <div
                  key={`a-${i}`}
                  className="w-[280px] sm:w-[300px] md:w-[320px] lg:w-[340px] min-h-[340px] sm:min-h-[360px] md:min-h-[380px] lg:min-h-[400px] flex-shrink-0 rounded-2xl sm:rounded-3xl bg-[#efefef] p-4 sm:p-5 md:p-6 shadow-[0_6px_24px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.2)] transition-all flex flex-col overflow-visible"
                >
                  <div className="flex items-center justify-center gap-1 sm:gap-1.5 mb-2">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star key={s} filled={s < t.rating} />
                    ))}
                  </div>
                  <h3 className="font-display text-lg sm:text-xl md:text-2xl text-[#1e1e1e] leading-tight mb-2 whitespace-pre-line uppercase font-extrabold tracking-wider">
                    {t.title}
                  </h3>
                  <p className="text-[#1e1e1e]/80 text-xs sm:text-sm md:text-base leading-relaxed mb-2">{t.text}</p>
                  <div className="flex flex-col items-center justify-center mt-auto">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-[#d9d9d9] shadow-inner flex items-center justify-center ring-1 ring-black/10 mb-2">
                      <ImageWithSkeleton src="/avatar.svg" alt={t.name} wrapperClassName="w-full h-full" className="w-full h-full rounded-full object-cover" />
                    </div>
                    <p className="text-[#1e1e1e] font-semibold leading-tight">{t.name}</p>
                    <p className="text-[#ff6b35] text-xs sm:text-sm leading-tight">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-5 sm:gap-6 md:gap-7 lg:gap-8">
              {testimonials.map((t, i) => (
                <div
                  key={`b-${i}`}
                  className="w-[280px] sm:w-[300px] md:w-[320px] lg:w-[340px] min-h-[340px] sm:min-h-[360px] md:min-h-[380px] lg:min-h-[400px] flex-shrink-0 rounded-2xl sm:rounded-3xl bg-[#efefef] p-4 sm:p-5 md:p-6 shadow-[0_6px_24px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.2)] transition-all flex flex-col overflow-visible"
                >
                  <div className="flex items-center justify-center gap-1 sm:gap-1.5 mb-2">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star key={s} filled={s < t.rating} />
                    ))}
                  </div>
                  <h3 className="font-display text-lg sm:text-xl md:text-2xl text-[#1e1e1e] leading-tight mb-2 whitespace-pre-line uppercase font-extrabold tracking-wider">
                    {t.title}
                  </h3>
                  <p className="text-[#1e1e1e]/80 text-xs sm:text-sm md:text-base leading-relaxed mb-2">{t.text}</p>
                  <div className="flex flex-col items-center justify-center mt-auto">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-[#d9d9d9] shadow-inner flex items-center justify-center ring-1 ring-black/10 mb-2">
                      <ImageWithSkeleton src="/avatar.svg" alt={t.name} wrapperClassName="w-full h-full" className="w-full h-full rounded-full object-cover" />
                    </div>
                    <p className="text-[#1e1e1e] font-semibold leading-tight">{t.name}</p>
                    <p className="text-[#ff6b35] text-xs sm:text-sm leading-tight">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
        {/* subtle premium edge haze (hidden on mobile) */}
        <div
          className="hidden sm:block pointer-events-none absolute inset-y-0 left-0 w-14 sm:w-20 md:w-24"
          style={{
            background:
              "linear-gradient(to right, #0f0f0f 0%, rgba(15,15,15,0.85) 40%, rgba(15,15,15,0.5) 75%, transparent 100%)",
            backdropFilter: "blur(1.5px)",
          }}
        />
        <div
          className="hidden sm:block pointer-events-none absolute inset-y-0 right-0 w-14 sm:w-20 md:w-24"
          style={{
            background:
              "linear-gradient(to left, #0f0f0f 0%, rgba(15,15,15,0.85) 40%, rgba(15,15,15,0.5) 75%, transparent 100%)",
            backdropFilter: "blur(1.5px)",
          }}
        />
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