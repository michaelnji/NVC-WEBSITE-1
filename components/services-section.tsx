"use client"

import { useLanguage } from "@/contexts/language-context"
import { useRef, useState, useEffect } from "react"
import ImageWithSkeleton from "@/components/image-with-skeleton"
import Shimmer from "@/components/shimmer"
import { AvailableSlotCard } from "@/components/available-slot-card"
import { SectionEyebrow } from "@/components/section-eyebrow"
import type { Service } from "@/lib/types"
import { motion } from "framer-motion"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export default function ServicesSection() {
  const { t } = useLanguage()
  const sectionRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasEntered, setHasEntered] = useState(false)

  // Déclencher le chargement uniquement quand la section entre dans le viewport
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
    if (!hasEntered) return

    const fetchServices = async () => {
      setIsLoading(true)
      try {
        const res = await fetch("/api/services")
        if (!res.ok) {
          console.error("Failed to fetch services:", res.status)
          setServices([])
          return
        }
        const data = await res.json()
        setServices(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error("Failed to fetch services:", error)
        setServices([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchServices()
  }, [hasEntered])

  return (
    <div
      ref={sectionRef}
      className="relative rounded-[28px] md:rounded-[40px] md:p-10 lg:p-14 xl:p-16 -mt-8 md:-mt-12 lg:-mt-16 pb-40 md:py-30 lg:py-30 xl:py-40 2xl:py-44 mb-16 md:mb-24 lg:-mb-8 xl:-mb-12 2xl:-mb-16 overflow-hidden lg:min-h-[75vh] xl:min-h-[80vh]"
      style={{
        backgroundImage: `url('/background-section.png')`,
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        zIndex: 2,
      }}
    >
      {/* Header Section */}
      <div className="text-center mb-6 sm:mb-10 md:mb-14 lg:mb-16">
        <div className="flex justify-center mb-3 sm:mb-4 md:mb-5">
          <SectionEyebrow>{t.services.subtitle}</SectionEyebrow>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 md:mb-5 lg:mb-6 leading-[1.1] max-w-xs sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto tracking-wide text-balance uppercase">
          <span className="text-[#1e1e1e]">{t.services.titlePart1} </span>
          <span className="text-[#f15a25]">{t.services.titlePart2}</span>
        </h1>
        <div className="max-w-lg md:max-w-xl mx-auto font-sans px-2 sm:px-3 space-y-1.5 sm:space-y-2 md:space-y-2.5">
          <p className="text-[#1e1e1e] text-xs sm:text-sm leading-relaxed md:leading-relaxed">
            {t.services.description}
          </p>
          <p className="text-[#1e1e1e] text-xs sm:text-sm leading-relaxed md:leading-relaxed">
            {t.services.descriptionPrefix}{" "}
            <span className="text-[#f15a25] font-semibold">{t.services.descriptionHighlight}</span>
          </p>
        </div>
      </div>

      <div className="px-4 sm:px-4 md:px-8">
        <ServicesGrid
          sectionRef={sectionRef}
          cardsRef={cardsRef}
          services={services}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}

type ServiceCardProps = {
  service?: Service
  isPlaceholder?: boolean
}

function ServicesGrid({
  sectionRef,
  cardsRef,
  services,
  isLoading,
}: {
  sectionRef: React.MutableRefObject<HTMLDivElement | null>
  cardsRef: React.MutableRefObject<(HTMLDivElement | null)[]>
  services: Service[]
  isLoading: boolean
}) {
  const MAX_SERVICES = 6

  // Suivi du scroll pour l'effet d'empilement mobile (déclenche les re-renders)
  const [scrollY, setScrollY] = useState(0)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    const handleScroll = () => {
      if (typeof window === "undefined") return

      // On utilise seulement scrollY pour forcer le recalcul des transforms des cartes
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  if (isLoading) {
    const skeletons = Array.from({ length: MAX_SERVICES })
    return (
      <>
        <div className="block md:hidden space-y-0">
          {skeletons.map((_, index) => {
            // Empilement mobile pendant le chargement
            let scale = 1
            let yOffset = 0

            if (isMounted && index > 0) {
              const sectionElement = sectionRef.current
              if (sectionElement) {
                const sectionRect = sectionElement.getBoundingClientRect()
                const sectionTop = sectionRect.top
                const sectionHeight = sectionRect.height
                const viewportHeight = window.innerHeight

                const scrollProgress = Math.max(
                  0,
                  Math.min(1, -sectionTop / Math.max(1, sectionHeight - viewportHeight))
                )

                const cardStartProgress = (index - 1) * 0.15
                const cardEndProgress = cardStartProgress + 0.3
                const cardProgress = Math.max(
                  0,
                  Math.min(1, (scrollProgress - cardStartProgress) / Math.max(0.001, cardEndProgress - cardStartProgress))
                )

                scale = 0.85 + 0.15 * cardProgress
                const baseMargin = 40
                yOffset = index * baseMargin * (1 - cardProgress * 0.7)
              } else {
                scale = 0.85
                yOffset = index * 40
              }
            }

            return (
              <div
                key={index}
                className="sticky top-16 sm:top-20"
                style={{
                  zIndex: skeletons.length - index,
                  transform:
                    index === 0
                      ? "none"
                      : `translateY(${yOffset}px) scale(${scale})`,
                  transformOrigin: "center center",
                }}
              >
                <ServiceCardSkeleton />
              </div>
            )
          })}
        </div>

        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
          {skeletons.map((_, index) => (
            <ServiceCardSkeleton key={index} />
          ))}
        </div>
      </>
    )
  }

  const limited = services.slice(0, MAX_SERVICES)
  const placeholdersCount = Math.max(0, MAX_SERVICES - limited.length)
  const cards: { service?: Service; isPlaceholder?: boolean }[] = [
    ...limited.map((s) => ({ service: s })),
    ...Array.from({ length: placeholdersCount }).map(() => ({ isPlaceholder: true })),
  ]

  return (
    <>
      <div className="block md:hidden space-y-0">
        {cards.map((card, index) => {
          let scale = 1
          let yOffset = 0

          if (isMounted && index > 0) {
            const sectionElement = sectionRef.current
            if (sectionElement) {
              const sectionRect = sectionElement.getBoundingClientRect()
              const sectionTop = sectionRect.top
              const sectionHeight = sectionRect.height
              const viewportHeight = window.innerHeight

              const scrollProgress = Math.max(
                0,
                Math.min(1, -sectionTop / Math.max(1, sectionHeight - viewportHeight))
              )

              // L'effet commence après la pleine présentation du premier bloc (index 0)
              const cardStartProgress = (index - 1) * 0.15
              const cardEndProgress = cardStartProgress + 0.3
              const cardProgress = Math.max(
                0,
                Math.min(1, (scrollProgress - cardStartProgress) / Math.max(0.001, cardEndProgress - cardStartProgress))
              )

              scale = 0.85 + 0.15 * cardProgress
              const baseMargin = 40
              yOffset = index * baseMargin * (1 - cardProgress * 0.7)
            } else {
              scale = 0.85
              yOffset = index * 40
            }
          }

          return (
            <div
              key={index}
              ref={(el) => {
                cardsRef.current[index] = el
              }}
              className="sticky top-16 sm:top-20"
              style={{
                zIndex: cards.length - index,
                transform:
                  index === 0
                    ? "none"
                    : `translateY(${yOffset}px) scale(${scale})`,
                transformOrigin: "center center",
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.45, delay: index * 0.08, ease: "easeOut" }}
              >
                <ServiceCard service={card.service} isPlaceholder={card.isPlaceholder} />
              </motion.div>
            </div>
          )
        })}
      </div>

      {/* Sur desktop: grille classique */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45, delay: index * 0.07, ease: "easeOut" }}
          >
            <ServiceCard service={card.service} isPlaceholder={card.isPlaceholder} />
          </motion.div>
        ))}
      </div>
    </>
  )
}

function ServiceCard({ service, isPlaceholder }: ServiceCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={`rounded-[18px] overflow-hidden flex flex-col w-full shadow-sm group cursor-pointer mb-4 md:mb-0 h-[350px] md:h-auto md:min-h-[360px] lg:min-h-[380px] xl:min-h-[420px] 2xl:min-h-[460px] ${
        isPlaceholder ? "bg-black" : "bg-[#EDEDED]"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isPlaceholder ? (
        <AvailableSlotCard
          title="Slot disponible"
          description="Add more service in the admin to fill this gallery slot."
        />
      ) : (
        <>
          <div
            className={`px-5 py-5 sm:px-7 sm:pt-7 flex-shrink-0 transition-all duration-300 ease-out ${
              isHovered ? "md:opacity-0 md:max-h-0 md:py-0 md:overflow-hidden" : "opacity-100 max-h-[200px]"
            }`}
          >
            <h2 className="text-sm sm:text-base md:text-lg mb-[8px] font-sans font-bold text-[#1e1e1e] leading-tight tracking-wide">
              {service?.title}
            </h2>
            <p className="font-sans text-[#404040] text-xs sm:text-sm   max-w-xs sm:max-w-sm md:max-w-md ">
              {service?.description}
            </p>
          </div>

          <div className="flex-1 relative overflow-hidden rounded-b-[18px] md:rounded-t-[18px] min-h-[100px] md:min-h-0">
            <div className="absolute inset-0 transition-all duration-500 ease-out bg-black">
              <ImageWithSkeleton
                src={service?.image_url || "/placeholder.svg"}
                alt={service?.title || "Service"}
                wrapperClassName="w-full h-full"
                className={`w-full h-full transition-all duration-500 ease-out ${
                  isHovered ? "md:object-cover md:scale-110" : "object-cover object-center md:scale-100"
                }`}
              />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function ServiceCardSkeleton() {
  return (
    <div className="bg-[#050505] rounded-[18px] overflow-hidden flex flex-col w-full shadow-sm mb-4 md:mb-0 h-[350px] md:h-auto md:min-h-[360px] lg:min-h-[380px] xl:min-h-[420px] 2xl:min-h-[460px]">
      <div className="pl-5 py-5 sm:pl-7 sm:pt-7 flex-shrink-0">
        <div className="h-4 w-32 rounded-full bg-gradient-to-r from-white/10 via-white/40 to-white/10 animate-pulse mb-2" />
        <div className="h-3 w-48 rounded-full bg-gradient-to-r from-white/5 via-white/25 to-white/5 animate-pulse" />
      </div>
      <div className="flex-1 relative overflow-hidden rounded-b-[18px] md:rounded-t-[18px] min-h-[200px] md:min-h-0">
        <div className="absolute inset-0">
          <Shimmer />
        </div>
      </div>
    </div>
  )
}
