"use client"

import ImageWithSkeleton from "@/components/image-with-skeleton"
import Shimmer from "@/components/shimmer"
import { useLanguage } from "@/contexts/language-context"
import type { Project } from "@/lib/types"
import { AnimatePresence, motion } from "framer-motion"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

interface Category {
  id: string
  label: string
  labelFr: string
  count: number
}

const ITEMS_PER_PAGE = 6

export default function ProjectsListSection() {
  const { language } = useLanguage()
  const [projects, setProjects] = useState<Project[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [activeFilter, setActiveFilter] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)
  const [hasEntered, setHasEntered] = useState(false)
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE)
  const sectionRef = useRef<HTMLElement>(null)

  // Intersection Observer
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
    return () => observer.disconnect()
  }, [])

  // Fetch projects
  useEffect(() => {
    if (!hasEntered) return

    let mounted = true
    setIsLoading(true)

    ;(async () => {
      try {
        const response = await fetch("/api/projects", { cache: "no-store" })
        if (!response.ok) throw new Error("Failed to fetch projects")
        const data = await response.json()

        if (mounted) {
          setProjects(Array.isArray(data) ? data : [])

          // Generate categories with counts
          const categoryCounts: Record<string, number> = {}
          data.forEach((project: Project) => {
            const cat = project.service_id || "uncategorized"
            categoryCounts[cat] = (categoryCounts[cat] || 0) + 1
          })

          const cats: Category[] = [
            {
              id: "all",
              label: "All",
              labelFr: "Tous",
              count: data.length,
            },
            {
              id: "brand-design",
              label: "Brand Design",
              labelFr: "Design de Marque",
              count: categoryCounts["brand-design"] || 0,
            },
            {
              id: "product-design",
              label: "Product Design",
              labelFr: "Design Produit",
              count: categoryCounts["product-design"] || 0,
            },
            {
              id: "graphic-design",
              label: "Graphic Design",
              labelFr: "Design Graphique",
              count: categoryCounts["graphic-design"] || 0,
            },
            {
              id: "communication",
              label: "Communication",
              labelFr: "Communication",
              count: categoryCounts["communication"] || 0,
            },
            {
              id: "photography",
              label: "Photography",
              labelFr: "Photographie",
              count: categoryCounts["photography"] || 0,
            },
            {
              id: "motion-design",
              label: "Motion Design",
              labelFr: "Motion Design",
              count: categoryCounts["motion-design"] || 0,
            },
            {
              id: "videography",
              label: "Videography",
              labelFr: "Vidéographie",
              count: categoryCounts["videography"] || 0,
            },
          ]

          setCategories(cats)
        }
      } catch (error) {
        console.error("Error fetching projects:", error)
        if (mounted) {
          setProjects([])
          setCategories([])
        }
      } finally {
        if (mounted) setIsLoading(false)
      }
    })()

    return () => {
      mounted = false
    }
  }, [hasEntered])

  // Filter projects
  const filteredProjects =
    activeFilter === "all"
      ? projects
      : projects.filter((project) => project.service_id === activeFilter)

  const visibleProjects = filteredProjects.slice(0, displayCount)
  const hasMore = displayCount < filteredProjects.length

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + ITEMS_PER_PAGE)
  }

  const handleFilterChange = (filterId: string) => {
    setActiveFilter(filterId)
    setDisplayCount(ITEMS_PER_PAGE) // Reset pagination on filter change
  }

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white py-20 md:py-28 lg:py-32 px-6 md:px-12 lg:px-16 xl:px-24 2xl:px-32"
    >
      <div className="w-full max-w-[1600px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 text-center md:mb-16 lg:mb-20"
        >
          <h2 className="font-display text-4xl font-bold uppercase leading-[1.1]  text-brand-ink md:text-5xl lg:text-6xl xl:text-7xl">
            {language === "En" ? (
              <>
                WE DON&apos;T JUST DELIVER PROJECTS.
                <br />
                WE CRAFT{" "}
                <span className="text-brand">EXPERIENCES</span>.
              </>
            ) : (
              <>
                NOUS NE LIVRONS PAS JUSTE DES PROJETS.
                <br />
                NOUS CRÉONS DES{" "}
                <span className="text-brand">EXPÉRIENCES</span>.
              </>
            )}
          </h2>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="mb-12 md:mb-16 lg:mb-20"
        >
          {isLoading ? (
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              {Array.from({ length: 8 }).map((_, idx) => (
                <div
                  key={idx}
                  className="relative h-12 w-32 rounded-full overflow-hidden bg-brand-surface-dark"
                >
                  <Shimmer />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              {categories.map((category, idx) => (
                <motion.button
                  key={category.id}
                  onClick={() => handleFilterChange(category.id)}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.05, ease: "easeOut" }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    relative px-4 py-2 rounded-full text-sm  font-semibold
                    transition-all duration-300 overflow-hidden
                    ${
                      activeFilter === category.id
                        ? "bg-brand-ink text-white shadow-lg"
                        : "bg-transparent text-brand-ink border-2 border-brand-ink/20 hover:border-brand-ink/40"
                    }
                  `}
                >
                  <span className="relative z-10">
                    {language === "En" ? category.label : category.labelFr}
                    <sup className="ml-1 text-xs opacity-70">{category.count}</sup>
                  </span>

                  {activeFilter === category.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-brand-ink"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
            {Array.from({ length: 6 }).map((_, idx) => (
              <ProjectCardSkeleton key={idx} />
            ))}
          </div>
        ) : (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFilter}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10"
              >
                {visibleProjects.map((project, idx) => (
                  <ProjectCard key={project.id} project={project} index={idx} />
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Load More Button */}
            {hasMore && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mt-12 md:mt-16 text-center"
              >
                <motion.button
                  onClick={handleLoadMore}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 bg-brand-ink text-white font-semibold rounded-full
                           shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {language === "En" ? "Load More Projects" : "Charger Plus de Projets"}
                </motion.button>
              </motion.div>
            )}

            {/* Empty State */}
            {visibleProjects.length === 0 && !isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center py-20"
              >
                <p className="text-xl text-brand-ink/60">
                  {language === "En"
                    ? "No projects found in this category."
                    : "Aucun projet trouvé dans cette catégorie."}
                </p>
              </motion.div>
            )}
          </>
        )}
      </div>
    </section>
  )
}

// Project Card Component
function ProjectCard({ project, index }: { project: Project; index: number }) {
  const { language } = useLanguage()
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative"
    >
      <Link
        href={`/projets/${project.id}`}
        className="block rounded-2xl lg:rounded-3xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-500"
      >
        {/* Image Container */}
        <motion.div
          className="relative w-full aspect-4/3 bg-brand-surface-dark overflow-hidden"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <ImageWithSkeleton
            src={project.image_url || "/placeholder.svg"}
            alt={project.title}
            wrapperClassName="w-full h-full"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, 50vw"
          />

          {/* Overlay on hover */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-linear-to-t from-brand-ink/90 via-brand-ink/50 to-transparent
                       flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: isHovered ? 1 : 0.8,
                opacity: isHovered ? 1 : 0,
              }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="text-white text-center px-6"
            >
              <p className="text-2xl md:text-3xl font-bold mb-2">
                {language === "En" ? "VIEW PROJECT" : "VOIR LE PROJET"}
              </p>
              <div className="w-12 h-0.5 bg-brand mx-auto" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Content */}
        <div className="p-6 md:p-8 bg-white">
          <h3 className="text-2xl md:text-3xl font-bold text-brand-ink mb-4 group-hover:text-brand transition-colors duration-300">
            {project.title}
          </h3>

          <div className="grid grid-cols-2 gap-4 text-sm md:text-base">
            <div>
              <p className="text-brand-gray-muted uppercase tracking-wider text-xs mb-1">
                {language === "En" ? "CLIENT" : "CLIENT"}
              </p>
              <p className="text-brand-ink font-medium">
                {project.title || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-brand-gray-muted uppercase tracking-wider text-xs mb-1">
                {language === "En" ? "YEAR" : "ANNÉE"}
              </p>
              <p className="text-brand-ink font-medium">
                {new Date(project.created_at).getFullYear()}
              </p>
            </div>

            <div className="col-span-2">
              <p className="text-brand-gray-muted uppercase tracking-wider text-xs mb-1">
                {language === "En" ? "CATEGORY" : "CATÉGORIE"}
              </p>
              <p className="text-brand-ink font-medium">
                {project.description || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}

// Skeleton Component
function ProjectCardSkeleton() {
  return (
    <div className="rounded-2xl lg:rounded-3xl overflow-hidden bg-white shadow-lg">
      {/* Image Skeleton */}
      <div className="relative w-full aspect-4/3 bg-brand-surface-dark overflow-hidden">
        <Shimmer />
      </div>

      {/* Content Skeleton */}
      <div className="p-6 md:p-8">
        <div className="h-8 bg-brand-surface-dark rounded-lg mb-4 w-3/4 overflow-hidden relative">
          <Shimmer />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="h-3 bg-brand-surface-dark rounded w-16 mb-2 overflow-hidden relative">
              <Shimmer />
            </div>
            <div className="h-5 bg-brand-surface-dark rounded w-24 overflow-hidden relative">
              <Shimmer />
            </div>
          </div>

          <div>
            <div className="h-3 bg-brand-surface-dark rounded w-16 mb-2 overflow-hidden relative">
              <Shimmer />
            </div>
            <div className="h-5 bg-brand-surface-dark rounded w-20 overflow-hidden relative">
              <Shimmer />
            </div>
          </div>

          <div className="col-span-2">
            <div className="h-3 bg-brand-surface-dark rounded w-20 mb-2 overflow-hidden relative">
              <Shimmer />
            </div>
            <div className="h-5 bg-brand-surface-dark rounded w-32 overflow-hidden relative">
              <Shimmer />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
