"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ImageWithSkeleton from "@/components/image-with-skeleton"
import { AvailableSlotCard } from "@/components/available-slot-card"
import Shimmer from "@/components/shimmer"

import { useLanguage } from "@/contexts/language-context"
import { SecondaryCTAButton } from "@/components/cta-buttons"
import { ArrowUpRight } from "lucide-react"
import type { Project, Service } from "@/lib/types"

type ProjectsIntroSectionProps = {
  initialServices?: Service[]
}

type ProjectCard = {
  id: string
  title: string
  category: string
  image: string
  isPlaceholder?: boolean
}

export default function ProjectsIntroSection({ initialServices }: ProjectsIntroSectionProps) {
  const { t } = useLanguage()
  const [projects, setProjects] = useState<ProjectCard[]>([])
  const [services, setServices] = useState<Service[]>(initialServices ?? [])
  // Chargement des projets : commence à false et ne passe à true que lorsqu'un service actif est défini
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [activeServiceId, setActiveServiceId] = useState<string | null>(() => {
    if (initialServices && initialServices.length) return initialServices[0].id
    return null
  })
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const [hasEntered, setHasEntered] = useState(false)
  const [isFetchingServices, setIsFetchingServices] = useState<boolean>(!initialServices)

  // 0) Observer l'entrée de la section dans le viewport
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

  // 1) Charger les services quand la section est visible (fallback si pas de données serveur)
  useEffect(() => {
    if (!hasEntered) return
    if (initialServices && initialServices.length) return

    let mounted = true
    setIsFetchingServices(true)
    ;(async () => {
      try {
        const servicesRes = await fetch("/api/services", { cache: "no-store" })
        if (!servicesRes.ok) throw new Error("Failed to fetch services")

        const servicesData = (await servicesRes.json()) as Service[]
        if (mounted) {
          setServices(Array.isArray(servicesData) ? servicesData : [])
          if (!activeServiceId && servicesData.length > 0) {
            setActiveServiceId(servicesData[0].id)
          }
        }
      } catch (_e) {
        if (mounted) {
          setServices([])
        }
      } finally {
        if (mounted) setIsFetchingServices(false)
      }
    })()

    return () => {
      mounted = false
    }
  }, [hasEntered, activeServiceId, initialServices])

  useEffect(() => {
    if (!hasEntered || !activeServiceId) return

    let mounted = true
    setIsLoading(true)

    ;(async () => {
      try {
        const projectsRes = await fetch(`/api/projects?service_id=${activeServiceId}`, {
          cache: "no-store",
        })
        if (!projectsRes.ok) throw new Error("Failed to fetch projects")

        const projectsData = (await projectsRes.json()) as Project[]
        const activeService = services.find((s) => s.id === activeServiceId)

        const mapped: ProjectCard[] = Array.isArray(projectsData)
          ? projectsData.map((p) => ({
              id: p.id,
              title: p.title,
              category: activeService?.title || "Other",
              image: p.image_url || "/placeholder.svg",
            }))
          : []

        if (mounted) {
          setProjects(mapped)
        }
      } catch (_e) {
        if (mounted) {
          setProjects([])
        }
      } finally {
        if (mounted) setIsLoading(false)
      }
    })()

    return () => {
      mounted = false
    }
  }, [hasEntered, activeServiceId, services])

  // Catégories = services (id + titre)
  const serviceCategories = useMemo(
    () => services.filter((s) => s.title).map((s) => ({ id: s.id, title: s.title })),
    [services]
  )

  // Slots de services (4 max, utilisés pour tous les breakpoints)
  const SERVICE_SLOTS = 4
  const serviceSlots = useMemo(
    () => Array.from({ length: SERVICE_SLOTS }, (_, idx) => serviceCategories[idx] || null),
    [serviceCategories]
  )

  const allForCategory: ProjectCard[] = projects
  const [items, setItems] = useState<ProjectCard[]>([])

  // Nombre d'items par catégorie : on prend jusqu'à 4 projets (complétés par des placeholders)
  useEffect(() => {
    const max = Math.min(4, allForCategory.length)
    const count = max === 0 ? 0 : max
    setItems(allForCategory.slice(0, count))
  }, [allForCategory])

  // Toujours forcer un layout 4 cartes en complétant avec des placeholders si besoin
  const MAX_SLOTS = 4
  const filledItems: ProjectCard[] = [...items]
  while (filledItems.length < MAX_SLOTS) {
    filledItems.push({
      id: `placeholder-${filledItems.length + 1}`,
      title: "",
      category: "",
      image: "",
      isPlaceholder: true,
    })
  }

  // Règles d'agencement: carrés
  const n = filledItems.length
  const isOne = n === 1
  const isTwo = n === 2
  const isThree = n === 3
  const isFour = n === 4
  const containerClass = isThree
    ? "grid grid-cols-2 md:grid-cols-3 items-center justify-center gap-4 md:gap-6"
    : isTwo
    ? "flex flex-row items-center justify-center gap-3 sm:gap-4 flex-nowrap"
    : "flex flex-row items-center justify-center gap-4 md:gap-6 flex-wrap"

  // Tailles adaptatives des carrés selon le nombre d'items
  const sizeClass = isOne
    ? "w-64 sm:w-72 md:w-80 lg:w-[28rem] xl:w-[32rem] 2xl:w-[36rem]"
    : isTwo
    ? "w-40 sm:w-60 md:w-72 lg:w-96 xl:w-[28rem] 2xl:w-[32rem]"
    : isThree
    ? "w-44 sm:w-52 md:w-64 lg:w-80 xl:w-96 2xl:w-[28rem]"
    : "w-36 sm:w-44 md:w-56 lg:w-72 xl:w-80 2xl:w-96"

  return (
    <div
      ref={sectionRef}
      className="relative bg-[url('/Calque_1.png')] py-50 sm:py-32 lg:py-40 xl:py-48 px-4 md:px-8 lg:px-12 xl:px-16 -my-35  sm:-my-32 lg:-my-16 lg:min-h-[75vh] xl:min-h-[80vh] bg-brand-cream"
      style={{
        backgroundColor: "var(--brand-cream)",
        zIndex: 1,
      }}
    >
      <div className="max-w-7xl mx-auto ">
        {/* Title */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8 lg:mb-2">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[64px] font-bold  tracking-wide uppercase mb-2 sm:mb-3 md:mb-4 lg:mb-2">
            <span className="text-brand-ink">
              {t.projectsIntro.titlePart1}{" "}
            </span>
            <span className="text-brand">{t.projectsIntro.titleHighlight}</span>
            <span className="text-brand-ink">
              {" "}
              {t.projectsIntro.titlePart2}
            </span>
          </h2>
        </div>
        <div className="text-center mb-6 md:mb-8 lg:mb-10 max-w-3xl mx-auto">
          <p className="text-sm md:text-base lg:text-lg text-brand-ink/80 ">
            {t.projectsIntro.descriptionPart1}
            <span className="text-brand font-semibold">
              {t.projectsIntro.descriptionHighlight}
            </span>
          </p>
        </div>
        {/* Filtres services : 4 slots max, même forme (pills) sur mobile et desktop */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-6 mb-6 md:mb-8 lg:mb-10 min-h-10">
          {isFetchingServices
            ? // Skeletons de chargement (4 pills noirs avec shimmer)
              Array.from({ length: SERVICE_SLOTS }).map((_, idx) => (
                <div
                  key={idx}
                  className="relative h-8 md:h-9 w-24 md:w-32 lg:w-40 rounded-full overflow-hidden bg-brand-surface-dark"
                >
                  <div className="absolute inset-0">
                    <Shimmer />
                  </div>
                </div>
              ))
            : serviceSlots.map((slot, idx) =>
                slot ? (
                  <motion.button
                    key={slot.id}
                    onClick={() => setActiveServiceId(slot.id)}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.35,
                      delay: idx * 0.05,
                      ease: "easeOut",
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-3 md:px-5 py-1.5 md:py-2 rounded-full text-sm md:text-base font-medium transition-all duration-300 ${
                      activeServiceId === slot.id
                        ? "bg-brand-ink text-white shadow-lg"
                        : "bg-white/50 text-brand-ink hover:bg-white/80"
                    }`}
                  >
                    {slot.title}
                  </motion.button>
                ) : (
                  <motion.div
                    key={`service-slot-${idx}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.35,
                      delay: idx * 0.05,
                      ease: "easeOut",
                    }}
                    className="px-3 md:px-5 py-1.5 md:py-2 rounded-full text-sm md:text-base font-medium bg-brand-surface-dark text-white/90 flex items-center justify-center"
                  >
                    <AvailableSlotCard title="Slot available" description="" />
                  </motion.div>
                )
              )}
        </div>
        {/* Grille adaptative (cas spécial pour 4 items) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeServiceId || "loading"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={isFour ? "w-full" : containerClass}
          >
            {isLoading ? (
              // Skeletons pendant le chargement des projets, en reprenant les layouts finaux
              isFour ? (
                <>
                  {/* Mobile: 2 par ligne (carrés) */}
                  <div className="grid grid-cols-2 gap-4 md:gap-6 lg:hidden">
                    {Array.from({ length: MAX_SLOTS }).map((_, idx) => (
                      <ProjectCardSkeleton
                        key={idx}
                        className="aspect-square"
                      />
                    ))}
                  </div>

                  {/* Desktop: layout spécial */}
                  <div className="hidden lg:grid grid-cols-3 gap-4 md:gap-6 items-stretch w-full">
                    {/* Left big */}
                    <ProjectCardSkeleton className="col-span-2 row-span-2 h-[518px] w-full" />

                    {/* Right column container */}
                    <div className="flex flex-col gap-4 h-full">
                      {/* Top wide */}
                      <ProjectCardSkeleton className="h-[260px] w-full" />

                      {/* Bottom two small side-by-side */}
                      <div className="grid grid-cols-2 gap-4 flex-1">
                        <ProjectCardSkeleton className="h-[244px] w-full" />
                        <ProjectCardSkeleton className="h-[244px] w-full" />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className={containerClass}>
                  {Array.from({ length: MAX_SLOTS }).map((_, idx) => (
                    <ProjectCardSkeleton
                      key={idx}
                      className={`aspect-square ${sizeClass} ${
                        isThree && idx === 2
                          ? "col-span-2 md:col-span-1 justify-self-center"
                          : ""
                      }`}
                    />
                  ))}
                </div>
              )
            ) : isFour ? (
              <>
                {/* Mobile: 2 par ligne (carrés) */}
                <div className="grid grid-cols-2 gap-4 md:gap-6 lg:hidden">
                  {filledItems.map((it, idx) => (
                    <motion.div
                      key={it.id}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{
                        duration: 0.4,
                        delay: idx * 0.06,
                        ease: "easeOut",
                      }}
                      whileHover={{ y: -8, transition: { duration: 0.3 } }}
                      className="group relative rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-300 aspect-square"
                    >
                      {it.isPlaceholder ? (
                        <div className="flex h-full w-full items-center justify-center bg-brand-surface-dark text-center px-3">
                          <AvailableSlotCard
                            title="Slot available"
                            description="Add a new project for this category in the admin to showcase it here."
                          />
                        </div>
                      ) : (
                        <>
                          <ImageWithSkeleton
                            src={it.image || "/placeholder.svg"}
                            alt={it.title}
                            wrapperClassName="w-full h-full"
                            className="object-cover transform transition-transform duration-500 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <h3 className="text-white text-sm font-bold mb-1">
                              {it.title}
                            </h3>
                            <p className="text-white/80 text-xs">
                              {it.category}
                            </p>
                          </div>
                        </>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Desktop: layout spécial */}
                <div className="hidden lg:grid grid-cols-3 gap-4 md:gap-6 items-stretch w-full">
                  {/* Left big (items[0]) */}
                  {filledItems[0] && (
                    <motion.div
                      key={filledItems[0].id}
                      initial={{ opacity: 0, y: 32 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.45,
                        delay: 0.04,
                        ease: "easeOut",
                      }}
                      whileHover={{ y: -8, transition: { duration: 0.3 } }}
                      className="group relative rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-300 col-span-2 row-span-2 h-[518px]"
                    >
                      {filledItems[0].isPlaceholder ? (
                        <div className="flex h-full w-full items-center justify-center bg-brand-surface-dark text-center px-6">
                          <AvailableSlotCard
                            title="Highlight slot"
                            description="Add a highlight project for this category in the admin to feature it here."
                          />
                        </div>
                      ) : (
                        <>
                          <ImageWithSkeleton
                            src={filledItems[0].image || "/placeholder.svg"}
                            alt={filledItems[0].title}
                            wrapperClassName="w-full h-full"
                            className="object-cover transform transition-transform duration-500 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute bottom-0 left-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <h3 className="text-white text-2xl font-bold mb-1">
                              {filledItems[0].title}
                            </h3>
                            <p className="text-white/80 text-sm">
                              {filledItems[0].category}
                            </p>
                          </div>
                        </>
                      )}
                    </motion.div>
                  )}

                  {/* Right column container (items[1..3]) */}
                  <div className="flex flex-col gap-4 h-full">
                    {/* Top wide (items[1]) */}
                    {filledItems[1] && (
                      <motion.div
                        key={filledItems[1].id}
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.45,
                          delay: 0.1,
                          ease: "easeOut",
                        }}
                        whileHover={{ y: -8, transition: { duration: 0.3 } }}
                        className="group relative rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-300"
                      >
                        {filledItems[1].isPlaceholder ? (
                          <div className="flex h-[260px] w-full items-center justify-center bg-brand-surface-dark text-center px-4">
                            <AvailableSlotCard
                              title="Slot available"
                              description="Add another project in the admin to complete this showcase row."
                            />
                          </div>
                        ) : (
                          <>
                            <ImageWithSkeleton
                              src={filledItems[1].image || "/placeholder.svg"}
                              alt={filledItems[1].title}
                              wrapperClassName="w-full h-[260px]"
                              className="object-cover transform transition-transform duration-500 group-hover:scale-110"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <h3 className="text-white text-xl font-bold mb-1">
                                {filledItems[1].title}
                              </h3>
                              <p className="text-white/80 text-xs md:text-sm">
                                {filledItems[1].category}
                              </p>
                            </div>
                          </>
                        )}
                      </motion.div>
                    )}

                    {/* Bottom two small side-by-side (items[2], items[3]) */}
                    <div className="grid grid-cols-2 gap-4 flex-1">
                      {filledItems[2] && (
                        <motion.div
                          key={filledItems[2].id}
                          initial={{ opacity: 0, y: 24 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.45,
                            delay: 0.16,
                            ease: "easeOut",
                          }}
                          whileHover={{ y: -8, transition: { duration: 0.3 } }}
                          className="group relative rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-300"
                        >
                          {filledItems[2].isPlaceholder ? (
                            <div className="flex h-[244px] w-full items-center justify-center bg-brand-surface-dark text-center px-3">
                              <AvailableSlotCard
                                title="Slot available"
                                description="Add more projects in the admin to fill this gallery slot."
                              />
                            </div>
                          ) : (
                            <>
                              <ImageWithSkeleton
                                src={filledItems[2].image || "/placeholder.svg"}
                                alt={filledItems[2].title}
                                wrapperClassName="w-full h-[244px]"
                                className="object-cover transform transition-transform duration-500 group-hover:scale-110"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <h3 className="text-white text-lg font-bold mb-1">
                                  {filledItems[2].title}
                                </h3>
                                <p className="text-white/80 text-xs md:text-sm">
                                  {filledItems[2].category}
                                </p>
                              </div>
                            </>
                          )}
                        </motion.div>
                      )}
                      {filledItems[3] && (
                        <motion.div
                          key={filledItems[3].id}
                          initial={{ opacity: 0, y: 24 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.45,
                            delay: 0.2,
                            ease: "easeOut",
                          }}
                          whileHover={{ y: -8, transition: { duration: 0.3 } }}
                          className="group relative rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-300"
                        >
                          {filledItems[3].isPlaceholder ? (
                            <div className="flex h-[244px] w-full items-center justify-center bg-brand-surface-dark text-center px-3">
                              <AvailableSlotCard
                                title="Slot available"
                                description="Add more projects in the admin to fill this gallery slot."
                              />
                            </div>
                          ) : (
                            <>
                              <ImageWithSkeleton
                                src={filledItems[3].image || "/placeholder.svg"}
                                alt={filledItems[3].title}
                                wrapperClassName="w-full h-[244px]"
                                className="object-cover transform transition-transform duration-500 group-hover:scale-110"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <h3 className="text-white text-lg font-bold mb-1">
                                  {filledItems[3].title}
                                </h3>
                                <p className="text-white/80 text-xs md:text-sm">
                                  {filledItems[3].category}
                                </p>
                              </div>
                            </>
                          )}
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              filledItems.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: 0.4,
                    delay: idx * 0.06,
                    ease: "easeOut",
                  }}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className={`group relative rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-300 aspect-square ${sizeClass} ${
                    isThree && idx === 2
                      ? "col-span-2 md:col-span-1 justify-self-center"
                      : ""
                  }`}
                >
                  {item.isPlaceholder ? (
                    <div className="flex h-full w-full items-center justify-center bg-brand-surface-dark text-center px-4">
                      <AvailableSlotCard
                        title="Slot available"
                        description="Add more projects in the admin to fill this gallery."
                      />
                    </div>
                  ) : (
                    <>
                      <ImageWithSkeleton
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        wrapperClassName="w-full h-full"
                        className="object-cover transform transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <h3 className="text-white text-lg md:text-xl font-bold mb-1">
                          {item.title}
                        </h3>
                        <p className="text-white/80 text-xs md:text-sm">
                          {item.category}
                        </p>
                      </div>
                    </>
                  )}
                </motion.div>
              ))
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-center mt-6 md:mt-10">
          <SecondaryCTAButton href="/portfolio" variant="dark">
            <span className="text-sm md:text-base">Our Portfolio</span>
            <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
          </SecondaryCTAButton>
        </div>
      </div>
    </div>
  );
}

function ProjectCardSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`group relative rounded-2xl overflow-hidden bg-brand-surface-dark shadow-lg ${className}`}>
      <div className="absolute inset-0">
        <Shimmer />
      </div>
    </div>
  )
}