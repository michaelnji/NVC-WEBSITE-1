"use client"

import { motion, useAnimationFrame, useMotionValue } from "framer-motion"
import { useEffect, useMemo, useRef, useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { SecondaryCTAButton } from "./cta-buttons"
import { ArrowUpRight } from "lucide-react"
import Reveal from "@/components/reveal"
import ImageWithSkeleton from "@/components/image-with-skeleton"
import { AvailableSlotCard } from "@/components/available-slot-card"
import type { TeamMember } from "@/lib/types"
import Shimmer from "@/components/shimmer"

type TeamIntroSectionProps = {
  initialMembers?: TeamMember[]
}

export default function TeamIntroSection({ initialMembers }: TeamIntroSectionProps) {
  const { t } = useLanguage()
  const sectionRef = useRef<HTMLElement | null>(null)
  const [hasEntered, setHasEntered] = useState(false)
  const [members, setMembers] = useState<TeamMember[]>(() => {
    if (!initialMembers) return []
    return [...initialMembers].sort((a, b) => a.order_index - b.order_index)
  })
  const [isLoading, setIsLoading] = useState(!initialMembers)
  const [isVisible, setIsVisible] = useState(false)

  // Lazy-load: déclencher le fetch uniquement quand la section entre dans le viewport
  useEffect(() => {
    const node = sectionRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEntered(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )

    observer.observe(node)

    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    const node = sectionRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.1 },
    )

    observer.observe(node)

    return () => {
      observer.disconnect()
    }
  }, [])

  // Fetch des membres d'équipe (fallback si aucune donnée initiale)
  useEffect(() => {
    if (!hasEntered) return
    if (initialMembers && initialMembers.length) return

    let mounted = true
    setIsLoading(true)

    ;(async () => {
      try {
        const res = await fetch("/api/team-members", { cache: "no-store" })
        if (!res.ok) throw new Error("Failed to fetch team members")
        const data = await res.json()
        const list = Array.isArray(data) ? (data as TeamMember[]) : []
        if (mounted) {
          setMembers(list.sort((a, b) => a.order_index - b.order_index))
        }
      } catch (_e) {
        if (mounted) {
          setMembers([])
        }
      } finally {
        if (mounted) setIsLoading(false)
      }
    })()

    return () => {
      mounted = false
    }
  }, [hasEntered, initialMembers])

  // Base card sizes
  const CARD_W = 180
  const CARD_H = 220

  // Dev-only flag: enable/disable vertical yoyo animation for all columns
  const ENABLE_YOYO = false

  // Desktop: keep 7 columns static
  const desktopCounts = [5, 4, 4, 3, 4, 4, 5]
  const desktopShifts = [0, 150, 300, 450, 300, 150, 0]

  // Mobile/Tablet: exactly 3 columns, auto-scrolling horizontally
  const mobileCols = 3
  const mobileCountPerCol = [3, 3, 3]

  type TeamCard = {
    member?: TeamMember
    isPlaceholder?: boolean
  }

  // Construire une liste de cartes pour alimenter toutes les colonnes (desktop) puis mobile/tablette
  const allCards: TeamCard[] = useMemo(() => {
    const totalDesktopCards = desktopCounts.reduce((acc, n) => acc + n, 0)
    const base = members
    const result: TeamCard[] = []
    for (let i = 0; i < totalDesktopCards; i++) {
      const member = base[i]
      if (member) result.push({ member })
      else result.push({ isPlaceholder: true })
    }
    return result
  }, [members])

  const desktopColumns: TeamCard[][] = useMemo(() => {
    const cols: TeamCard[][] = []
    let index = 0
    for (const count of desktopCounts) {
      cols.push(allCards.slice(index, index + count))
      index += count
    }
    return cols
  }, [allCards])

  const mobileColumns: TeamCard[][] = useMemo(() => {
    const cols: TeamCard[][] = []
    let index = 0
    for (let col = 0; col < mobileCols; col++) {
      const count = mobileCountPerCol[col]
      cols.push(allCards.slice(index, index + count))
      index += count
    }
    return cols
  }, [allCards])
  const desktopColumnsWithSkeletons: TeamCard[][] = useMemo(
    () =>
      isLoading
        ? desktopCounts.map((n) => Array.from({ length: n }, () => ({} as TeamCard)))
        : desktopColumns,
    [isLoading, desktopCounts, desktopColumns],
  )
  const mobileTrackRef = useRef<HTMLDivElement>(null)
  const mobileTrackX = useMotionValue(0)
  const MOBILE_SPEED = 30 // px/s
  useAnimationFrame((_, delta) => {
    if (typeof window === "undefined") return
    if (!isVisible) return
    if (window.innerWidth >= 1024) return // mobile + tablet only
    const el = mobileTrackRef.current
    if (!el) return
    const totalW = el.scrollWidth
    if (!totalW) return
    const seqW = totalW / 3 // one 3-column sequence
    let next = mobileTrackX.get() - (MOBILE_SPEED * delta) / 1000
    if (next <= -seqW) next += seqW
    mobileTrackX.set(next)
  })
  return (
    <section
      ref={sectionRef}
      className="relative z-40 py-20 md:py-28 lg:py-32  lg:px-16    overflow-hidden bg-[url('/background-section.png')] bg-[length:100%_100%] bg-center bg-no-repeat lg:min-h-[70vh] xl:min-h-[80vh]"
    >
      <div className="relative z-30 max-w-6xl mx-auto text-center">
        <Reveal>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-6xl font-bold leading-[1.05] tracking-wide text-balance mb-3 sm:mb-4 md:mb-5 lg:mb-6">
            <span className="text-[#1e1e1e]">{t.teamIntro.titlePart1} </span>
            <span className="text-[#F15A25]">{t.teamIntro.titleEmphasis}</span>
            <span className="text-[#1e1e1e]"> {t.teamIntro.titlePart2}</span>
          </h2>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="mt-2 md:mt-3 max-w-2xl mx-auto text-sm md:text-base text-[#1e1e1e]/80 text-pretty leading-relaxed">
            {t.teamIntro.descriptionPart1}
            <span className="text-[#F15A25] font-semibold">{t.teamIntro.descriptionEmphasis}</span>
          </p>
        </Reveal>

        <Reveal delay={0.14}>
          <div className="mt-6 sm:mt-7 md:mt-8 lg:mt-9">
            <SecondaryCTAButton href="#teams" variant="dark">
              <span className="text-sm md:text-base">Discover our teams</span>
              <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
            </SecondaryCTAButton>
          </div>
        </Reveal>
      </div>

      <div className="relative   lg:-my-10 pb-0">
        {(() => {
          const FlipCard = ({
            width,
            height,
            data,
            isSkeleton = false,
          }: {
            width: number
            height: number
            data?: TeamCard
            isSkeleton?: boolean
          }) => {
            const member = data?.member
            const isPlaceholder = data?.isPlaceholder || !member
            return (
              <div
                className="group rounded-xl cursor-pointer [perspective:1000px]"
                style={{ width: `${width}px`, height: `${height}px` }}
              >
                <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                  {/* Front face: loading skeleton ou contenu */}
                  <div className="absolute inset-0 w-full h-full rounded-xl overflow-hidden [backface-visibility:hidden] bg-black">
                    {isSkeleton ? (
                      <div className="relative w-full h-full bg-[#050505]">
                        <div className="absolute inset-0">
                          <Shimmer />
                        </div>
                      </div>
                    ) : member && member.photo_url ? (
                      <ImageWithSkeleton
                        src={member.photo_url || "/placeholder.svg"}
                        alt={member.name}
                        wrapperClassName="w-full h-full"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex w-full h-full items-center justify-center bg-[#111] px-4 text-center">
                        <AvailableSlotCard
                          title="Slot available"
                          description=""
                        />
                      </div>
                    )}
                  </div>

                  {/* Back face: infos du membre ou placeholder */}
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#F15A25] to-[#ff7a4d] rounded-xl [backface-visibility:hidden] [transform:rotateY(180deg)] p-4 flex flex-col items-center justify-center">
                    {isSkeleton ? null : member ? (
                      <div className="w-full flex flex-col items-center justify-center text-center space-y-2">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 rounded-full bg-black/15 shadow-inner flex items-center justify-center ring-1 ring-white/25 mb-1">
                          <ImageWithSkeleton
                            src={member.photo_url || "/avatar.svg"}
                            alt={member.name}
                            wrapperClassName="w-full h-full rounded-full overflow-hidden"
                            className="w-full h-full object-cover rounded-full"
                          />
                        </div>
                        <p className="text-sm sm:text-base md:text-lg font-semibold text-white truncate max-w-[90%]">
                          {member.name}
                        </p>
                        <p className="text-xs sm:text-sm text-white/85 font-medium mb-1">
                          {member.position}
                        </p>
                        {member.description && (
                          <p className="text-[11px] sm:text-xs md:text-sm text-white/80 leading-relaxed line-clamp-4">
                            {member.description}
                          </p>
                        )}
                      </div>
                    ) : (
                      <AvailableSlotCard
                        title="Slot available"
                        description=""
                      />
                    )}
                  </div>
                </div>
              </div>
            )
          }

          const YoyoColumn = ({
            cards,
            shift,
            cardW,
            cardH,
            amp = 180,
            periodMs = 10000,
            columnKey,
          }: {
            cards: TeamCard[]
            shift: number
            cardW: number
            cardH: number
            amp?: number
            periodMs?: number
            columnKey: string | number
          }) => {
            const yMv = useMotionValue(0)
            useAnimationFrame((t) => {
              const phase = (t % periodMs) / periodMs
              const y = -amp * (0.5 - 0.5 * Math.cos(phase * Math.PI * 2))
              yMv.set(y)
            })
            return (
              <div key={columnKey} className="relative overflow-hidden">
                <motion.div className="flex flex-col items-start gap-3 will-change-transform" style={{ marginTop: shift, y: yMv }}>
                  {cards.map((card, i) => (
                    <FlipCard
                      key={`${columnKey}-${i}`}
                      width={cardW}
                      height={cardH}
                      data={card}
                    />
                  ))}
                </motion.div>
              </div>
            )
          }

          return (
            <>
              {/* Mobile & tablet: auto-scrolling 3 columns (pixel loop) */}
              <div className="lg:hidden relative overflow-hidden mt-10 [mask-image:linear-gradient(to_top,rgba(0,0,0,0)_0%,rgba(0,0,0,0.08)_10%,rgba(0,0,0,0.25)_22%,rgba(0,0,0,0.55)_38%,rgba(0,0,0,0.8)_50%,#000_62%)] [webkit-mask-image:linear-gradient(to_top,rgba(0,0,0,0)_0%,rgba(0,0,0,0.08)_10%,rgba(0,0,0,0.25)_22%,rgba(0,0,0,0.55)_38%,rgba(0,0,0,0.8)_50%,#000_62%)] [mask-size:100%_100%] [webkit-mask-size:100%_100%]">
                <motion.div
                  ref={mobileTrackRef}
                  className="flex gap-4 pr-0 md:pr-4 will-change-transform w-max"
                  style={{ x: mobileTrackX }}
                >
                  {[0, 1, 2].flatMap((loop) =>
                    Array.from({ length: mobileCols }).map((_, colIdx) => (
                      <div
                        key={`mcol-${loop}-${colIdx}`}
                        className={`shrink-0 flex flex-col items-start gap-3 ${colIdx % 2 === 1 ? "pt-20" : "pt-0"} md:pt-0`}
                      >
                        {(isLoading
                          ? Array.from({ length: mobileCountPerCol[colIdx] }, () => ({} as TeamCard))
                          : mobileColumns[colIdx] || []
                        ).map((card, i) => (
                          <FlipCard
                            key={`m-${colIdx}-${i}-${loop}`}
                            width={Math.max(140, CARD_W - 30)}
                            height={Math.max(180, CARD_H - 30)}
                            data={isLoading ? undefined : card}
                            isSkeleton={isLoading}
                          />
                        ))}
                      </div>
                    )),
                  )}
                </motion.div>
              </div>

              {/* Desktop: 7 columns, optional deterministic yoyo (pixel-driven) */}
              {ENABLE_YOYO ? (
                <div className="hidden lg:grid relative z-10 h-[640px] md:h-[760px] overflow-hidden grid grid-cols-7 gap-x-3 md:gap-x-3 items-start [mask-image:linear-gradient(to_bottom,white_0%,white_85%,transparent_100%)] [webkit-mask-image:linear-gradient(to_bottom,white_0%,white_85%,transparent_100%)]">
                  {desktopColumnsWithSkeletons.map((cardsOrPlaceholders, colIdx) => (
                    <YoyoColumn
                      key={`desk-col-${colIdx}`}
                      columnKey={`desk-${colIdx}`}
                      cards={cardsOrPlaceholders}
                      shift={desktopShifts[colIdx]}
                      cardW={CARD_W}
                      cardH={CARD_H}
                    />
                  ))}
                </div>
              ) : (
                <div className="hidden lg:grid relative z-10 h-[640px] md:h-[760px] overflow-hidden grid grid-cols-7 gap-x-3 md:gap-x-3 items-start [mask-image:linear-gradient(to_bottom,white_0%,white_85%,transparent_100%)] [webkit-mask-image:linear-gradient(to_bottom,white_0%,white_85%,transparent_100%)]">
                  {desktopColumnsWithSkeletons.map((cardsOrPlaceholders, colIdx) => (
                    <div key={`desk-static-${colIdx}`} className="relative overflow-hidden">
                      <div
                        className="flex flex-col items-start gap-3"
                        style={{ marginTop: desktopShifts[colIdx] }}
                      >
                        {(cardsOrPlaceholders as TeamCard[]).map((cardOrPlaceholder, i) => (
                          <FlipCard
                            key={`desk-static-${colIdx}-${i}`}
                            width={CARD_W}
                            height={CARD_H}
                            data={cardOrPlaceholder}
                            isSkeleton={isLoading && !cardOrPlaceholder.member && !cardOrPlaceholder.isPlaceholder}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )
        })()}
      </div>
    </section>
  )
}
