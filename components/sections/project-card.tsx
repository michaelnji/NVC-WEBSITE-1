"use client";

import ImageWithSkeleton from "@/components/image-with-skeleton";
import { useLanguage } from "@/contexts/language-context";
import type { Project } from "@/lib/types";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const { language } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);

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
        className="block rounded-2xl lg:rounded-3xl overflow-hidden bg-white  transition-all shadow duration-500"
      >
        {/* Image Container */}
        <motion.div
          className="relative w-full aspect-4/3 bg-stone-300! dark:bg-gray-800 overflow-hidden"
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
              <p className="text-3xl md:text-5xl lg:text-7xl font-display font-bold mb-2">
                {language === "En" ? "VIEW PROJECT" : "VOIR LE PROJET"}
              </p>
              <div className="w-12 h-0.5 bg-brand mx-auto" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Content */}
        <div className="p-6 md:p-8 bg-white">
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
  );
}
