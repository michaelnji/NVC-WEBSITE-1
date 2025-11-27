"use client";

import PhotographyProjectCard from "@/components/sections/photography-project-card";
import ProjectCard from "@/components/sections/project-card";
import ProjectCardSkeleton from "@/components/sections/project-card-skeleton";
import Shimmer from "@/components/shimmer";
import { useLanguage } from "@/contexts/language-context";
import type { Project } from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { AngledPanel } from "../angled-panel";

interface Category {
  id: string;
  label: string;
  labelFr: string;
  count: number;
}

const ITEMS_PER_PAGE = 6;

export default function ProjectsListSection() {
  const { language } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [hasEntered, setHasEntered] = useState(false);
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEntered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasEntered) return;

    let mounted = true;
    setIsLoading(true);
    (async () => {
      try {
        const response = await fetch("/api/projects", { cache: "no-store" });

        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }

        const data: Project[] = await response.json();

        if (mounted) {
          setProjects(data);

          // Generate categories with counts
          const categoryCounts: Record<string, number> = {};
          data.forEach((project: Project) => {
            const cat = project.service_id || "uncategorized";
            categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
          });

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
              labelFr: "Videographie",
              count: categoryCounts["videography"] || 0,
            },
          ];

          setCategories(cats);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        if (mounted) {
          setProjects([]);
          setCategories([]);
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [hasEntered]);

  const filteredProjects =
    activeFilter === "all"
      ? projects
      : projects.filter((project) => project.service_id === activeFilter);

  const visibleProjects = filteredProjects.slice(0, displayCount);
  const hasMore = displayCount < filteredProjects.length;

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + ITEMS_PER_PAGE);
  };

  const handleFilterChange = (filterId: string) => {
    setActiveFilter(filterId);
    setDisplayCount(ITEMS_PER_PAGE); // Reset pagination on filter change
  };

  return (
         <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white py-20 md:pt-28 lg:py-70 px-6 md:px-12 lg:px-16 xl:px-24 2xl:px-32"
    >
      <div className="w-full  mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 text-center md:mb-16 lg:mb-20"
        >
          <h2 className="font-display text-3xl font-bold uppercase leading-[1.1]  text-brand-ink md:text-5xl lg:text-6xl xl:text-7xl">
            {language === "En" ? (
              <>
                WE DON&apos;T JUST DELIVER PROJECTS.
                <br />
                WE CRAFT <span className="text-brand">EXPERIENCES</span>.
              </>
            ) : (
              <>
                NOUS NE LIVRONS PAS JUSTE DES PROJETS.
                <br />
                >
                NOUS CREONS DES <span className="text-brand">EXPERIENCES</span>.
              </motion.h1>
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
                  className="relative h-12 w-32 rounded-full overflow-hidden bg-stone-300! dark:bg-gray-800"
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
                  transition={{
                    duration: 0.4,
                    delay: idx * 0.05,
                    ease: "easeOut",
                  }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    relative px-4 py-2 rounded-full text-xs md:text-sm  font-semibold
                    transition-all duration-300 overflow-hidden
                    ${
                      activeFilter === category.id
                        ? "bg-brand-ink text-white  shadow-lg"
                        : "bg-transparent text-brand-ink border-2 border-brand-ink/20 hover:border-brand-ink/40"
                    }
                  `}
                >
                  <span className="relative z-10">
                    {language === "En" ? category.label : category.labelFr}
                    <sup className="ml-1 text-xs text-brand-soft!">
                      {category.count}
                    </sup>
                  </span>

                  {activeFilter === category.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-brand-ink"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
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
                className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-16"
              >
                {visibleProjects.map((project, idx) => {
                  // Use special card for photography projects
                  if (
                    activeFilter === "photography" ||
                    project.service_id === "photography"
                  ) {
                    return (
                      <PhotographyProjectCard
                        key={project.id}
                        project={project}
                        index={idx}
                      />
                    );
                  }
                  return (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      index={idx}
                    />
                  );
                })}
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
                  {language === "En"
                    ? "Load More Projects"
                    : "Charger Plus de Projets"}
                </motion.button>
              </motion.div>
            )}

            {/* Empty State */}
            {visibleProjects.length === 0 && !isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="text-center py-20 md:py-32"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="max-w-2xl mx-auto"
                >
                  <h3 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold uppercase leading-[1.1] text-brand-ink mb-4">
                    {language === "En" ? (
                      <>
                        NO PROJECTS <span className="text-brand">YET</span>
                      </>
                    ) : (
                      <>
                        AUCUN PROJET{" "}
                        <span className="text-brand">POUR L'INSTANT</span>
                      </>
                    )}
                  </h3>
                  <p className="text-md md:text-lg text-brand-ink/60 mb-8">
                    {language === "En"
                      ? "We're working on exciting projects in this category. Check back soon!"
                      : "Nous travaillons sur des projets passionnants dans cette categorie. Revenez bientot !"}
                  </p>
                  {activeFilter !== "all" && (
                    <motion.button
                      onClick={() => handleFilterChange("all")}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-8 py-4 bg-brand-ink text-white font-semibold rounded-full
                             shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {language === "En"
                        ? "View All Projects"
                        : "Voir Tous les Projets"}
                    </motion.button>
                  )}
                </motion.div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
