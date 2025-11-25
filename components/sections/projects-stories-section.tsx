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

  useEffect(() => {
    const measure = () => {
      if (!trackRef.current) return
      const contentWidth = trackRef.current.scrollWidth
      const vw = window.innerWidth
      setScrollRange(contentWidth - vw)
      setViewportWidth(vw)
    }

    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [projects])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  })

  // Transformer le progress vertical (0-1) en déplacement horizontal
  const x = useTransform(scrollYProgress, [0, 1], [0, -scrollRange])

  const cardWidth = "w-[960px] max-w-[96vw]"

  return (
    <section
      ref={sectionRef}
      className="relative -mt-10 bg-brand-cream"
      style={{
        height: `${scrollRange + (typeof window !== "undefined" ? window.innerHeight : 800)}px`,
      }}
    >
      <div
        className="sticky top-0 h-screen overflow-hidden py-20 sm:py-24 md:py-28 lg:py-32 flex flex-col justify-center"
        style={{
          backgroundImage: "url('/Calque_1.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 w-full">
          <div className="text-center mb-10 sm:mb-12 md:mb-14">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-extrabold uppercase tracking-wide text-brand-ink">
              THE STORIES WE&apos;RE <span className="text-brand">MOST PROUD OF</span>
            </h2>
          </div>
        </div>

        <div className="relative overflow-visible select-none w-full pl-4 sm:pl-6 md:pl-8">
          <motion.div ref={trackRef} className="flex gap-8 will-change-transform" style={{ x }}>
            {projects.map((project, i) => (
              <motion.article
                key={`${project.id}-${i}`}
                className={`${cardWidth} aspect-[16/9] rounded-[32px] bg-[#1e1e1e]/96 shadow-[0_18px_60px_rgba(0,0,0,0.45)] overflow-hidden flex-shrink-0 relative group`}
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 220, damping: 26 }}
              >
                <ImageWithSkeleton
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  wrapperClassName="w-full h-full"
                  className="w-full h-full object-cover transition-opacity duration-500"
                />
                <div className="absolute inset-0 bg-black/55" />

                <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8 md:p-10">
                  <div className="flex-1 flex flex-col items-center justify-center text-center gap-3">
                    <p className="font-display text-2xl sm:text-3xl md:text-4xl text-white font-extrabold tracking-[0.25em] uppercase">
                      VIEW PROJECT
                    </p>
                  </div>

                  <div className="flex items-end justify-between text-[10px] sm:text-xs md:text-sm text-white/80">
                    <div className="space-y-1">
                      <p>
                        <span className="font-semibold tracking-[0.2em] mr-1">CLIENT :</span>
                        <span>{project.client}</span>
                      </p>
                      <p>
                        <span className="font-semibold tracking-[0.2em] mr-1">YEAR :</span>
                        <span>{project.year}</span>
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p>
                        <span className="font-semibold tracking-[0.2em] mr-1">LOCATION :</span>
                        <span>{project.location}</span>
                      </p>
                      <p>
                        <span className="font-semibold tracking-[0.2em] mr-1">CATEGORY :</span>
                      </p>
                      <div className="flex flex-wrap gap-2 justify-end">
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
              </motion.article>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
