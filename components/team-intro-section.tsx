"use client"

import { motion } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"
import { SecondaryCTAButton } from "./cta-buttons"
import { ArrowUpRight } from "lucide-react"

export default function TeamIntroSection() {
  const { t } = useLanguage()
  return (
    <section
      className="relative z-10 py-20 md:py-28 lg:py-32 px-0 md:px-12 lg:px-16 xl:px-24  2xl:px-32 overflow-hidden"
      style={{
        backgroundImage: "url('/background-section.png')",
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        zIndex:26
      }}
    >
      <div className="relative z-30 max-w-6xl mx-auto text-center"><h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-6xl font-bold leading-[1.05] tracking-wide text-balance">
          <span className="text-[#1e1e1e]">{t.teamIntro.titlePart1} </span>
          <span className="text-[#F15A25]">{t.teamIntro.titleEmphasis}</span>
          <span className="text-[#1e1e1e]"> {t.teamIntro.titlePart2}</span>
        </h2>
        

        <p className="mt-3 md:mt-4 max-w-2xl mx-auto text-sm md:text-base text-[#1e1e1e]/80 text-pretty">
          {t.teamIntro.descriptionPart1}
          <span className="text-[#F15A25] font-semibold">{t.teamIntro.descriptionEmphasis}</span>
        </p>

        <div className="mt-6">
          <SecondaryCTAButton href="#teams" variant="dark">
            <span className="text-sm md:text-base">Discover our teams</span>
             <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
          </SecondaryCTAButton>
        </div>
      </div>

      <div className="relative  mx-auto pb-0">

        {(() => {
          // Base card sizes
          const CARD_W = 180
          const CARD_H = 220

          // Desktop: keep 7 columns static
          const desktopCounts = [5, 4, 4, 3, 4, 4, 5]
          const desktopShifts = [0, 150, 300, 450, 300, 150, 0]

          // Mobile/Tablet: exactly 3 columns, auto-scrolling horizontally
          const mobileCols = 3
          const mobileCountPerCol = [3, 3, 3]

          return (
            <>
              {/* Mobile only: auto-scrolling 3 columns */}
              <div
                className="md:hidden relative overflow-hidden mt-10"
                style={{
                  WebkitMaskImage:
                    "linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,0.08) 10%, rgba(0,0,0,0.25) 22%, rgba(0,0,0,0.55) 38%, rgba(0,0,0,0.8) 50%, #000 62%)",
                  maskImage:
                    "linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,0.08) 10%, rgba(0,0,0,0.25) 22%, rgba(0,0,0,0.55) 38%, rgba(0,0,0,0.8) 50%, #000 62%)",
                  WebkitMaskSize: "100% 100%",
                  maskSize: "100% 100%",
                }}
              >
                <motion.div
                  className="flex gap-4 pr-0 md:pr-4 will-change-transform"
                  animate={{ x: ["0%", "-50%"] }}
                  transition={{ duration: 28, ease: "linear", repeat: Infinity }}
                >
                  {[0, 1].flatMap((loop) => (
                    Array.from({ length: mobileCols }).map((_, colIdx) => (
                      <div
                        key={`mcol-${loop}-${colIdx}`}
                        className={`flex flex-col items-start gap-3 ${colIdx % 2 === 1 ? 'pt-20' : 'pt-0'} md:pt-0`}
                      >
                        {Array.from({ length: mobileCountPerCol[colIdx] }).map((_, i) => (
                          <div
                            key={`m-${colIdx}-${i}-${loop}`}
                            className="rounded-xl bg-black"
                            style={{ width: `${Math.max(140, CARD_W - 30)}px`, height: `${Math.max(180, CARD_H - 30)}px` }}
                          />
                        ))}
                      </div>
                    ))
                  ))}
                </motion.div>
              </div>

              {/* Tablet static 7 columns (smaller blocks) */}
              <div
                className="hidden md:grid lg:hidden relative z-10 h-[540px] overflow-hidden grid grid-cols-7 gap-x-2 items-start"
                style={{ WebkitMaskImage: "linear-gradient(to top, transparent 0%, black 35%, black 100%)", maskImage: "linear-gradient(to top, transparent 0%, black 35%, black 100%)" }}
              >
                {desktopCounts.map((n, colIdx) => (
                  <div key={`tab-${colIdx}`} className="flex flex-col items-start gap-2" style={{ marginTop: Math.max(0, desktopShifts[colIdx] - 100) }}>
                    {Array.from({ length: n }).map((_, i) => (
                      <div
                        key={`tab-${colIdx}-${i}`}
                        className="rounded-xl bg-black"
                        style={{ width: `${Math.max(120, CARD_W - 40)}px`, height: `${Math.max(150, CARD_H - 60)}px` }}
                      />
                    ))}
                  </div>
                ))}
              </div>

              {/* Desktop static 7 columns */}
              <div
                className="hidden lg:grid relative z-10 h-[640px] md:h-[760px] overflow-hidden grid grid-cols-7 gap-x-3 md:gap-x-3 items-start"
                style={{ WebkitMaskImage: "linear-gradient(to top, transparent 0%, black 35%, black 100%)", maskImage: "linear-gradient(to top, transparent 0%, black 35%, black 100%)" }}
              >
                {desktopCounts.map((n, colIdx) => (
                  <div key={colIdx} className="flex flex-col items-start gap-3" style={{ marginTop: desktopShifts[colIdx] }}>
                    {Array.from({ length: n }).map((_, i) => (
                      <div
                        key={i}
                        className="rounded-xl bg-black"
                        style={{ width: `${CARD_W}px`, height: `${CARD_H}px` }}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </>
          )
        })()}
      </div>
    </section>
  )
}
