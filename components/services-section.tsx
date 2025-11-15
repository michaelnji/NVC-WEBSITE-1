"use client"

import { useLanguage } from "@/contexts/language-context"
import { useRef, useState, useEffect } from "react"
import ImageWithSkeleton from "@/components/image-with-skeleton"
import Shimmer from "@/components/shimmer"
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
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchServices = async () => {
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
  }, [])

  return (
    <div
      ref={sectionRef}
      className="relative rounded-[28px] md:rounded-[40px] md:p-10 lg:p-14 xl:p-16 -mt-8 md:-mt-12 lg:-mt-16 pt-10 pb-40 md:py-30 lg:py-36 xl:py-40 2xl:py-44 mb-16 md:mb-24 lg:-mb-8 xl:-mb-12 2xl:-mb-16 overflow-hidden lg:min-h-[75vh] xl:min-h-[80vh]"
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
  cardsRef,
  services,
  isLoading,
}: {
  cardsRef: React.MutableRefObject<(HTMLDivElement | null)[]>
  services: Service[]
  isLoading: boolean
}) {
  const MAX_SERVICES = 6

  if (isLoading) {
    const skeletons = Array.from({ length: MAX_SERVICES })
    return (
      <>
        <div className="block md:hidden space-y-0">
          {skeletons.map((_, index) => (
            <div
              key={index}
              className="sticky top-16"
              style={{
                zIndex: skeletons.length - index,
                transform: index > 0 ? `scale(${0.95 - index * 0.02}) translateY(${index * 20}px)` : "none",
              }}
            >
              <ServiceCardSkeleton />
            </div>
          ))}
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
        {cards.map((card, index) => (
          <div
            key={index}
            ref={(el) => {
              cardsRef.current[index] = el
            }}
            className="sticky top-16"
            style={{
              zIndex: cards.length - index,
              transform: index > 0 ? `scale(${0.95 - index * 0.02}) translateY(${index * 20}px)` : "none",
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
        ))}
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
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <h2 className="text-sm sm:text-base md:text-lg mb-2 font-sans font-bold text-white leading-tight tracking-wide">
            Slot disponible
          </h2>
          <p className="font-sans text-white/75 text-xs sm:text-sm leading-relaxed max-w-xs">
            Add more service in the admin to fill this gallery slot.
          </p>
        </div>
      ) : (
        <>
          <div
            className={`px-5 py-5 sm:px-7 sm:pt-7 flex-shrink-0 transition-all duration-300 ease-out ${
              isHovered ? "md:opacity-0 md:max-h-0 md:py-0 md:overflow-hidden" : "opacity-100 max-h-[200px]"
            }`}
          >
            <h2 className="text-sm sm:text-base md:text-lg mb-1.5 font-sans font-bold text-[#1e1e1e] leading-tight tracking-wide">
              {service?.title}
            </h2>
            <p className="font-sans text-[#404040] text-xs sm:text-sm leading-relaxed whitespace-pre-line max-w-xs sm:max-w-sm md:max-w-md break-words">
              {service?.description}
            </p>
          </div>

          <div className="flex-1 relative overflow-hidden rounded-b-[18px] md:rounded-t-[18px] min-h-[200px] md:min-h-0">
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
