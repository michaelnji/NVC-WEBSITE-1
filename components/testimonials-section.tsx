"use client"

import { motion, useAnimationFrame, useMotionValue } from "framer-motion"
import { useRef } from "react"
import { useLanguage } from "@/contexts/language-context"

export default function TestimonialsSection() {
  const { t } = useLanguage()
  const testimonials = t.testimonials.items

  const Star = ({ filled }: { filled: boolean }) => (
    <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill={filled ? "#ff6b35" : "none"} stroke="#ff6b35" strokeWidth="2">
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

  return (
    <section
      id="testimonials"
      className="relative z-10 py-14 sm:py-18 md:py-24 lg:py-28 -mt-8 md:-mt-12 lg:-mt-14"
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
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-wide leading-tight text-white uppercase text-balance">
          {t.testimonials.headingLine1}
          <br />
          <span className="text-[#ff6b35]">{t.testimonials.headingLine2}</span>
        </h2>

        {/* Cards row - auto-scrolling marquee (seamless) */}
        <div className="mt-8 sm:mt-10 relative overflow-hidden">
          <motion.div ref={trackRef} className="flex will-change-transform" style={{ x: trackX }}>
            <div ref={seqRef} className="flex gap-4 sm:gap-5 md:gap-7 pr-0 sm:pr-6">
              {testimonials.map((t, i) => (
                <div
                  key={`a-${i}`}
                  className="min-w-[200px] sm:w-[300px] md:w-[300px] lg:w-[300px] min-h-[200px] md:h-[300px] lg:h-[360px] rounded-2xl sm:rounded-3xl bg-[#efefef] p-2 sm:p-3 md:p-4 shadow-[0_6px_24px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.2)] transition-all flex flex-col overflow-visible"
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
                      <img src="/avatar.svg" alt={t.name} className="w-full h-full rounded-full object-cover" />
                    </div>
                    <p className="text-[#1e1e1e] font-semibold leading-tight">{t.name}</p>
                    <p className="text-[#ff6b35] text-xs sm:text-sm leading-tight">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-4 sm:gap-5 md:gap-7 pr-0 sm:pr-6">
              {testimonials.map((t, i) => (
                <div
                  key={`b-${i}`}
                  className="min-w-[200px] sm:w-[300px] md:w-[300px] lg:w-[300px] min-h-[200px] md:h-[300px] lg:h-[360px] rounded-2xl sm:rounded-3xl bg-[#efefef] p-2 sm:p-3 md:p-4 shadow-[0_6px_24px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.2)] transition-all flex flex-col overflow-visible"
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
                      <img src="/avatar.svg" alt={t.name} className="w-full h-full rounded-full object-cover" />
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
        <div className="hidden sm:block pointer-events-none absolute inset-y-0 left-0 w-14 sm:w-20 md:w-24" style={{ background: "linear-gradient(to right, #0f0f0f 0%, rgba(15,15,15,0.85) 40%, rgba(15,15,15,0.5) 75%, transparent 100%)", backdropFilter: "blur(1.5px)" }} />
        <div className="hidden sm:block pointer-events-none absolute inset-y-0 right-0 w-14 sm:w-20 md:w-24" style={{ background: "linear-gradient(to left, #0f0f0f 0%, rgba(15,15,15,0.85) 40%, rgba(15,15,15,0.5) 75%, transparent 100%)", backdropFilter: "blur(1.5px)" }} />
      </div>

      {/* bottom stamp */}
      <div className="relative mt-12 sm:mt-14 flex flex-col items-center justify-center">
        <div className="text-white/80 text-xs sm:text-sm mb-3 sm:mb-4">Designing with <span className="text-[#ff6b35]">❤</span> from our HQ in</div>
        <div className="relative">
          <img src="/layer_1.svg" alt="DAMAS" className="w-36 sm:w-44 md:w-48 h-auto object-cover rounded-[12px]" />
        </div>
      </div>
    </section>
  )
}