"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"
import { SecondaryCTAButton } from "@/components/cta-buttons"
import { ArrowUpRight } from "lucide-react"

// Cache des images déjà chargées (persiste tant que la page est ouverte)
const loadedImages = new Set<string>()

function ImageWithSkeleton({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [loaded, setLoaded] = useState(loadedImages.has(src))
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-white ${className || ""}`}>
      <img
        src={src || "/placeholder.svg"}
        alt={alt}
        className={`w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110 ${
          loaded ? "" : ""
        }`}
        onLoad={() => {
          loadedImages.add(src)
          setLoaded(true)
        }}
      />
    </div>
  )
}

const mockProjects = [
  {
    id: 1,
    title: "PARKSPOT",
    category: "Brand Design",
    image: "/parkspot-branding-yellow-black.jpg",
  },
  {
    id: 2,
    title: "ApexCare+",
    category: "Brand Design",
    image: "/medical-healthcare-branding-green.jpg",
  },
  {
    id: 3,
    title: "Sports Photography",
    category: "Visual Identity",
    image: "/basketball-players-action-sports.jpg",
  },
  {
    id: 4,
    title: "Mobile App UI",
    category: "User Interface Design",
    image: "/mobile-app-interface-dark-yellow.jpg",
  },
  {
    id: 5,
    title: "Fashion Portrait",
    category: "Visual Identity",
    image: "/fashion-portrait-orange-jacket.jpg",
  },
  {
    id: 6,
    title: "AI-Driven Spaces",
    category: "Web Design",
    image: "/architectural-real-estate-design.jpg",
  },
  {
    id: 7,
    title: "Product Launch Video",
    category: "Motion Graphics",
    image: "/motion-graphics-video-production.jpg",
  },
  {
    id: 8,
    title: "Luxury Packaging",
    category: "Product Packaging",
    image: "/luxury-packaging.png",
  },
  {
    id: 9,
    title: "E-commerce Platform",
    category: "User Interface Design",
    image: "/ecommerce-website-interface.png",
  },
  {
    id: 10,
    title: "Corporate Identity",
    category: "Brand Design",
    image: "/corporate-brand-identity-design.jpg",
  },
  {
    id: 11,
    title: "Animated Logo",
    category: "Motion Graphics",
    image: "/animated-logo-motion-design.jpg",
  },
  {
    id: 12,
    title: "Cosmetics Packaging",
    category: "Product Packaging",
    image: "/cosmetics-packaging-design.jpg",
  },
  {
    id: 13,
    title: "Creative Branding",
    category: "Brand Design",
    image: "/creative-branding-project.jpg",
  },
  {
    id: 14,
    title: "Brand Identity Concept",
    category: "Brand Design",
    image: "/brand-identity-concept.png",
  },
  {
    id: 15,
    title: "Digital Campaign",
    category: "Motion Graphics",
    image: "/creative-campaign.jpg",
  },
  {
    id: 16,
    title: "Animated Product Mockup",
    category: "Motion Graphics",
    image: "/animated-product-design-mockup-display.jpg",
  },
  {
    id: 17,
    title: "Animated Photography",
    category: "Visual Identity",
    image: "/animated-photography-mockup-display.jpg",
  },
  {
    id: 18,
    title: "Spotify Visual",
    category: "Visual Identity",
    image: "/animated-spotify-logo-green-on-black.jpg",
  },
  {
    id: 19,
    title: "E-commerce UX",
    category: "User Interface Design",
    image: "/modern-web-design.png",
  },
  {
    id: 20,
    title: "UI/UX Concept",
    category: "User Interface Design",
    image: "/ui-ux-design-concept.png",
  },
  {
    id: 21,
    title: "Digital Strategy",
    category: "Web Design",
    image: "/digital-marketing-strategy.png",
  },
  {
    id: 22,
    title: "Product Photo",
    category: "Visual Identity",
    image: "/product-photography-still-life.png",
  },
  {
    id: 23,
    title: "Video Production",
    category: "Motion Graphics",
    image: "/video-production-team.png",
  },
]

export default function ProjectsIntroSection() {
  const { t } = useLanguage()
  const defaultCategory = t.projectsIntro.categories[0]
  const [activeCategory, setActiveCategory] = useState<string>(defaultCategory)

  const filteredProjects = mockProjects.filter((p) => p.category === activeCategory)
  const allForCategory = filteredProjects.length ? filteredProjects : mockProjects
  const [items, setItems] = useState(allForCategory.slice(0, Math.min(4, allForCategory.length)))

  // Déterministe par filtre: fixe un nombre d'items par catégorie et prend les N premiers (ordre stable)
  useEffect(() => {
    const layoutCountsByCategory: Record<string, number[]> = {
      "Brand Design": [4, 2, 6],
      "Visual Identity": [3, 4, 6],
      "Motion Graphics": [4, 3, 2],
      "User Interface Design": [6, 4, 2],
      "Web Design": [3, 4],
      "Product Packaging": [4, 3],
    }
    const max = Math.min(8, allForCategory.length)
    const preferred = layoutCountsByCategory[activeCategory] || []
    const primary = preferred[0] ?? Math.min(4, max)
    const count = Math.max(1, Math.min(max, primary))
    setItems(allForCategory.slice(0, count))
  }, [activeCategory])

  // Règles d'agencement: carrés
  const n = items.length
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
      className="relative py-50 md:py-40 lg:py-50 px-4 md:px-8 lg:px-12 -my-40  xl:px-16"
      style={{
        backgroundColor: "#FCDBCF",
        zIndex: 1,
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center mb-0">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold leading-tight tracking-wide uppercase">
            <span className="text-[#1e1e1e]">{t.projectsIntro.titlePart1} </span>
            <span className="text-[#F15A25]">{t.projectsIntro.titleHighlight}</span>
            <span className="text-[#1e1e1e]"> {t.projectsIntro.titlePart2}</span>
          </h2>
        </div>

        <div className="text-center mt-2 md:mt-3 mb-6 md:mb-8 max-w-3xl mx-auto">
          <p className="text-sm md:text-base lg:text-lg text-[#1e1e1e]/80">
            {t.projectsIntro.descriptionPart1}
            <span className="text-[#F15A25] font-semibold">{t.projectsIntro.descriptionHighlight}</span>
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8 md:mb-10">
          {t.projectsIntro.categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setActiveCategory(category)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-3 md:px-5 py-1.5 md:py-2 rounded-full text-sm md:text-base font-medium transition-all duration-300 ${
                activeCategory === category
                  ? "bg-[#1e1e1e] text-white shadow-lg"
                  : "bg-white/50 text-[#1e1e1e] hover:bg-white/80"
              }`}
            >
              {category}
            </motion.button>
          ))}
        </div>

        

        {/* Grille adaptative (cas spécial pour 4 items) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={isFour ? "w-full" : containerClass}
          >
            {isFour ? (
              <>
                {/* Mobile: 2 par ligne (carrés) */}
                <div className="grid grid-cols-2 gap-4 md:gap-6 lg:hidden">
                  {items.map((it) => (
                    <motion.div
                      key={it.id}
                      whileHover={{ y: -8, transition: { duration: 0.3 } }}
                      className="group relative rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-300 aspect-square"
                    >
                      <ImageWithSkeleton src={it.image || "/placeholder.svg"} alt={it.title} className="w-full h-full" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <h3 className="text-white text-sm font-bold mb-1">{it.title}</h3>
                        <p className="text-white/80 text-xs">{it.category}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Desktop: layout spécial */}
                <div className="hidden lg:grid grid-cols-3 gap-4 md:gap-6 items-stretch w-full">
                  {/* Left big (items[0]) */}
                  {items[0] && (
                    <motion.div
                      key={items[0].id}
                      whileHover={{ y: -8, transition: { duration: 0.3 } }}
                      className="group relative rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-300 col-span-2 row-span-2"
                    >
                      <ImageWithSkeleton src={items[0].image || "/placeholder.svg"} alt={items[0].title} className="w-full h-[520px]" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <h3 className="text-white text-2xl font-bold mb-1">{items[0].title}</h3>
                        <p className="text-white/80 text-sm">{items[0].category}</p>
                      </div>
                    </motion.div>
                  )}

                  {/* Right column container (items[1..3]) */}
                  <div className="flex flex-col gap-4 md:gap-6">
                    {/* Top wide (items[1]) */}
                    {items[1] && (
                      <motion.div
                        key={items[1].id}
                        whileHover={{ y: -8, transition: { duration: 0.3 } }}
                        className="group relative rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-300"
                      >
                        <ImageWithSkeleton src={items[1].image || "/placeholder.svg"} alt={items[1].title} className="w-full h-[260px]" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <h3 className="text-white text-xl font-bold mb-1">{items[1].title}</h3>
                          <p className="text-white/80 text-xs md:text-sm">{items[1].category}</p>
                        </div>
                      </motion.div>
                    )}

                    {/* Bottom two small side-by-side (items[2], items[3]) */}
                    <div className="grid grid-cols-2 gap-4 md:gap-6">
                      {items[2] && (
                        <motion.div
                          key={items[2].id}
                          whileHover={{ y: -8, transition: { duration: 0.3 } }}
                          className="group relative rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-300"
                        >
                          <ImageWithSkeleton src={items[2].image || "/placeholder.svg"} alt={items[2].title} className="w-full h-[220px]" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <h3 className="text-white text-lg font-bold mb-1">{items[2].title}</h3>
                            <p className="text-white/80 text-xs md:text-sm">{items[2].category}</p>
                          </div>
                        </motion.div>
                      )}
                      {items[3] && (
                        <motion.div
                          key={items[3].id}
                          whileHover={{ y: -8, transition: { duration: 0.3 } }}
                          className="group relative rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-300"
                        >
                          <ImageWithSkeleton src={items[3].image || "/placeholder.svg"} alt={items[3].title} className="w-full h-[220px]" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <h3 className="text-white text-lg font-bold mb-1">{items[3].title}</h3>
                            <p className="text-white/80 text-xs md:text-sm">{items[3].category}</p>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              items.map((item, idx) => (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className={`group relative rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-300 aspect-square ${sizeClass} ${
                    isThree && idx === 2 ? "col-span-2 md:col-span-1 justify-self-center" : ""
                  }`}
                >
                  <ImageWithSkeleton src={item.image || "/placeholder.svg"} alt={item.title} className="w-full h-full" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="text-white text-lg md:text-xl font-bold mb-1">{item.title}</h3>
                    <p className="text-white/80 text-xs md:text-sm">{item.category}</p>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </AnimatePresence>
        
        <div className="flex justify-center mt-6 md:mt-10">
          <SecondaryCTAButton href="/projets" variant="dark">
            <span className="text-sm md:text-base">Our Portfolio</span>
            <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
          </SecondaryCTAButton>
        </div>
      </div>
    </div>
  )
}