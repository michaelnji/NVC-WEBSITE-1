"use client"

import { motion } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"
import { SecondaryCTAButton } from "./cta-buttons"
import { ArrowUpRight } from "lucide-react"
import Reveal from "@/components/reveal"

export default function TeamIntroSection() {
  const { t } = useLanguage()
  return (
    <section className="relative z-10 py-20 md:py-28 lg:py-32 px-0 md:px-12 lg:px-16 xl:px-24  2xl:px-32 overflow-hidden bg-[url('/background-section.png')] bg-[length:100%_100%] bg-center bg-no-repeat">
      <div className="relative z-30 max-w-6xl mx-auto text-center">
        <Reveal>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-6xl font-bold leading-[1.05] tracking-wide text-balance">
            <span className="text-[#1e1e1e]">{t.teamIntro.titlePart1} </span>
            <span className="text-[#F15A25]">{t.teamIntro.titleEmphasis}</span>
            <span className="text-[#1e1e1e]"> {t.teamIntro.titlePart2}</span>
          </h2>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="mt-3 md:mt-4 max-w-2xl mx-auto text-sm md:text-base text-[#1e1e1e]/80 text-pretty">
            {t.teamIntro.descriptionPart1}
            <span className="text-[#F15A25] font-semibold">{t.teamIntro.descriptionEmphasis}</span>
          </p>
        </Reveal>

        <Reveal delay={0.14}>
          <div className="mt-6">
            <SecondaryCTAButton href="#teams" variant="dark">
              <span className="text-sm md:text-base">Discover our teams</span>
              <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
            </SecondaryCTAButton>
          </div>
        </Reveal>
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

          const FlipCard = ({ width, height }: { width: number; height: number }) => (
            <div
              className="group rounded-xl cursor-pointer [perspective:1000px]"
              style={{ width: `${width}px`, height: `${height}px` }}
            >
              <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                {/* Front face */}
                <div className="absolute inset-0 w-full h-full bg-black rounded-xl [backface-visibility:hidden]" />

                {/* Back face */}
                <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#F15A25] to-[#ff7a4d] rounded-xl [backface-visibility:hidden] [transform:rotateY(180deg)] p-4 flex flex-col items-center justify-center">
                  <div className="w-full h-20 bg-white/20 rounded-lg mb-3" />
                  <div className="w-full space-y-2">
                    <div className="h-2 bg-white/40 rounded w-3/4 mx-auto" />
                    <div className="h-2 bg-white/40 rounded w-full" />
                    <div className="h-2 bg-white/40 rounded w-5/6 mx-auto" />
                  </div>
                </div>
              </div>
            </div>
          )

          return (
            <>
              {/* Mobile only: auto-scrolling 3 columns */}
              <div className="md:hidden relative overflow-hidden mt-10 [mask-image:linear-gradient(to_top,rgba(0,0,0,0)_0%,rgba(0,0,0,0.08)_10%,rgba(0,0,0,0.25)_22%,rgba(0,0,0,0.55)_38%,rgba(0,0,0,0.8)_50%,#000_62%)] [webkit-mask-image:linear-gradient(to_top,rgba(0,0,0,0)_0%,rgba(0,0,0,0.08)_10%,rgba(0,0,0,0.25)_22%,rgba(0,0,0,0.55)_38%,rgba(0,0,0,0.8)_50%,#000_62%)] [mask-size:100%_100%] [webkit-mask-size:100%_100%]">
                <motion.div
                  className="flex gap-4 pr-0 md:pr-4 will-change-transform"
                  animate={{ x: ["0%", "-50%"] }}
                  transition={{ duration: 28, ease: "linear", repeat: Number.POSITIVE_INFINITY }}
                  initial={false}
                >
                  {[0, 1].flatMap((loop) =>
                    Array.from({ length: mobileCols }).map((_, colIdx) => (
                      <div
                        key={`mcol-${loop}-${colIdx}`}
                        className={`flex flex-col items-start gap-3 ${colIdx % 2 === 1 ? "pt-20" : "pt-0"} md:pt-0`}
                      >
                        {Array.from({ length: mobileCountPerCol[colIdx] }).map((_, i) => (
                          <FlipCard
                            key={`m-${colIdx}-${i}-${loop}`}
                            width={Math.max(140, CARD_W - 30)}
                            height={Math.max(180, CARD_H - 30)}
                          />
                        ))}
                      </div>
                    )),
                  )}
                </motion.div>
              </div>

              {/* Tablet static 7 columns (smaller blocks) */}
              <div className="hidden md:grid lg:hidden relative z-10 h-[540px] overflow-hidden grid grid-cols-7 gap-x-2 items-start [mask-image:linear-gradient(to_top,transparent_0%,black_35%,black_100%)] [webkit-mask-image:linear-gradient(to_top,transparent_0%,black_35%,black_100%)]">
                {desktopCounts.map((n, colIdx) => (
                  <div
                    key={`tab-${colIdx}`}
                    className="flex flex-col items-start gap-2"
                    style={{ marginTop: Math.max(0, desktopShifts[colIdx] - 100) }}
                  >
                    {Array.from({ length: n }).map((_, i) => (
                      <FlipCard
                        key={`tab-${colIdx}-${i}`}
                        width={Math.max(120, CARD_W - 40)}
                        height={Math.max(150, CARD_H - 60)}
                      />
                    ))}
                  </div>
                ))}
              </div>

              {/* Desktop static 7 columns */}
              <div className="hidden lg:grid relative z-10 h-[640px] md:h-[760px] overflow-hidden grid grid-cols-7 gap-x-3 md:gap-x-3 items-start [mask-image:linear-gradient(to_top,transparent_0%,black_35%,black_100%)] [webkit-mask-image:linear-gradient(to_top,transparent_0%,black_35%,black_100%)]">
                {desktopCounts.map((n, colIdx) => (
                  <div
                    key={colIdx}
                    className="flex flex-col items-start gap-3"
                    style={{ marginTop: desktopShifts[colIdx] }}
                  >
                    {Array.from({ length: n }).map((_, i) => (
                      <FlipCard key={i} width={CARD_W} height={CARD_H} />
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
