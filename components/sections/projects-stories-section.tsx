"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useTransform, useScroll } from "framer-motion"
import ImageWithSkeleton from "@/components/image-with-skeleton"

interface StoryProjectCard {
  id: string
  title: string
  client: string
  year: string
  location: string
  categories: string[]
  image: string
}

const STATIC_PROJECTS: StoryProjectCard[] = [
  {
    id: "sellium-masterpiece",
    title: "A place to display your masterpiece.",
    client: "Sellium",
    year: "2024",
    location: "Yaoundé, Cameroon",
    categories: ["Branding", "Product Design", "Animation"],
    image: "/hero-images/image1.png",
  },
  {
    id: "invision-brand",
    title: "Immersive visual brand stories.",
    client: "Invision",
    year: "2023",
    location: "Douala, Cameroon",
    categories: ["Branding", "Motion"],
    image: "/Calque_1.png",
  },
  {
    id: "campaign-digital",
    title: "Campaigns that move your audience.",
    client: "Various brands",
    year: "2022",
    location: "Central Africa",
    categories: ["Campaign", "Digital"],
    image: "/Layer_1.svg",
  },
  {
    id: "hero-campaign-1",
    title: "Campaign visuals that stand out.",
    client: "Hero Brand",
    year: "2023",
    location: "Yaoundé, Cameroon",
    categories: ["Branding", "Social Media"],
    image: "/hero-images/image2.png",
  },
  {
    id: "hero-campaign-2",
    title: "Motion-led product storytelling.",
    client: "Hero Brand",
    year: "2023",
    location: "Douala, Cameroon",
    categories: ["Animation", "Product"],
    image: "/hero-images/image3.png",
  },
]

export function ProjectsStoriesSection() {
  const [projects] = useState<StoryProjectCard[]>(STATIC_PROJECTS)

  const sectionRef = useRef<HTMLElement | null>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const [scrollRange, setScrollRange] = useState(0)
  const [viewportWidth, setViewportWidth] = useState(0)
  const [initialOffset, setInitialOffset] = useState(0)
  const [viewportHeight, setViewportHeight] = useState(800)
  const cardRefs = useRef<HTMLElement[]>([])
  const [activeIndex, setActiveIndex] = useState(0)

  const SCROLL_START_OFFSET = 0.1
  const SCROLL_END_OFFSET = 0.8
  const EXTRA_SCROLL_PADDING = 100
  const CARD_WIDTH_PX = 960
  const EXTRA_VERTICAL_SPACE = 200

  const isMobileViewport = viewportWidth < 1024

  useEffect(() => {
    const measure = () => {
      if (!trackRef.current) return
      const contentWidth = trackRef.current.scrollWidth
      const vw = window.innerWidth || 0
      const vh = window.innerHeight || 800
      const actualCardWidth = Math.min(CARD_WIDTH_PX, vw * 0.96)
      const centerOffset = (vw - actualCardWidth) / 2

      setInitialOffset(centerOffset)
      setScrollRange(contentWidth - vw + EXTRA_SCROLL_PADDING + centerOffset)
      setViewportWidth(vw)
      setViewportHeight(vh)
    }

    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [projects, EXTRA_SCROLL_PADDING])

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window === "undefined") return
      const cards = cardRefs.current
      if (!cards.length) return

      const viewportCenterX = window.innerWidth / 2
      let bestIdx = 0
      let bestDist = Number.POSITIVE_INFINITY

      cards.forEach((el, idx) => {
        if (!el) return
        const rect = el.getBoundingClientRect()
        const cardCenterX = rect.left + rect.width / 2
        const dist = Math.abs(cardCenterX - viewportCenterX)
        if (dist < bestDist) {
          bestDist = dist
          bestIdx = idx
        }
      })

      setActiveIndex(bestIdx)
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleScroll)
    }
  }, [projects.length])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start center", "end center"],
  })

  const scrollInputRange = isMobileViewport
    ? [0, 0.05, 0.95, 1]
    : [0, SCROLL_START_OFFSET, SCROLL_END_OFFSET, 1]

  const x = useTransform(
    scrollYProgress,
    scrollInputRange,
    [initialOffset, initialOffset, -scrollRange + initialOffset, -scrollRange + initialOffset],
  )

  const cardWidth = "w-[960px] max-w-[96vw]"

  return (
    <section
      ref={sectionRef}
      id="projects-stories-section"
      className="relative lg:-mt-13 bg-brand-cream"
      style={{
        height: `${scrollRange + viewportHeight + EXTRA_VERTICAL_SPACE}px`,
      }}
    >
      <div
        className="sticky top-10 sm:top-14 md:top-16 lg:-top-10 overflow-hidden py-10 sm:py-12 md:py-16 lg:py-[120px] flex flex-col items-center justify-center"
        style={{
          backgroundImage: "url('/Calque_1.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 w-full">
          <motion.div
            className="text-center mb-10 sm:mb-12 md:mb-14"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-[64px] font-extrabold uppercase tracking-wide text-brand-ink">
              THE STORIES WE&apos;RE <span className="text-brand">MOST PROUD OF</span>
            </h2>
          </motion.div>
        </div>

        <div className="relative overflow-visible select-none w-full">
          <motion.div
            ref={trackRef}
            className="flex gap-8 will-change-transform"
            style={{ x }}
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {projects.map((project, i) => (
              <motion.article
                key={`${project.id}-${i}`}
                ref={(el) => {
                  if (el) cardRefs.current[i] = el
                }}
                className={`${cardWidth} aspect-[16/9] rounded-[32px] bg-[#1e1e1e]/96 shadow-[0_18px_60px_rgba(0,0,0,0.45)] overflow-hidden flex-shrink-0 relative group`}
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 220, damping: 26 }}
              >
                <motion.div
                  className="w-full h-full will-change-transform"
                  initial={false}
                  animate={{ scale: activeIndex === i ? 1.06 : 1 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <ImageWithSkeleton
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    wrapperClassName="w-full h-full"
                    className="w-full h-full object-cover transition-opacity duration-500"
                  />
                </motion.div>

                <motion.div
                  className="absolute inset-0 bg-linear-to-t from-brand-ink/90 via-brand-ink/60 to-transparent"
                  initial={false}
                  animate={{ opacity: activeIndex === i ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />

                <motion.div
                  className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8 md:p-10"
                  initial={false}
                  animate={{ opacity: activeIndex === i ? 1 : 0 }}
                  transition={{ duration: 0.35 }}
                >
                  <motion.div
                    className="flex-1 flex flex-col items-center justify-center text-center gap-3"
                    initial={false}
                    animate={
                      activeIndex === i
                        ? { scale: 1, opacity: 1 }
                        : { scale: 0.9, opacity: 0 }
                    }
                    transition={{ duration: 0.35 }}
                  >
                    <p className="font-display text-3xl md:text-5xl lg:text-7xl text-white uppercase mb-2">
                      VIEW PROJECT
                    </p>
                    <div className="w-12 h-0.5 bg-brand mx-auto" />
                  </motion.div>

                  <div className="flex items-start justify-between text-[10px] sm:text-xs md:text-sm text-white">
                    <div className="space-y-1">
                      <p className="flex items-baseline gap-2">
                        <span className="font-semibold font-display lg:text-[24px]">CLIENT : </span>
                        <span className="text-[10px] sm:text-xs md:text-sm">{project.client}</span>
                      </p>
                      <p className="flex items-baseline gap-2">
                        <span className="font-semibold font-display lg:text-[24px]">YEAR : </span>
                        <span className="text-[10px] sm:text-xs md:text-sm">{project.year}</span>
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="flex items-baseline gap-2">
                        <span className="font-semibold font-display lg:text-[24px]">LOCATION : </span>
                        <span className="text-[10px] sm:text-xs md:text-sm">{project.location}</span>
                      </p>
                      <div className="flex items-baseline gap-3">
                        <span className="font-semibold font-display lg:text-[24px]">CATEGORY : </span>
                        <div className="flex flex-wrap gap-2 max-w-[260px]">
                          {project.categories.map((cat) => (
                            <span
                              key={cat}
                              className="inline-flex items-center rounded-full border border-brand bg-black/90 px-3 py-0.5 text-[11px] sm:text-xs md:text-sm font-medium text-brand shadow-[0_4px_10px_rgba(0,0,0,0.45)]"
                            >
                              {cat}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
