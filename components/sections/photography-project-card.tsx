"use client";

import ImageWithSkeleton from "@/components/image-with-skeleton";
import { useLanguage } from "@/contexts/language-context";
import type { Project } from "@/lib/types";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

interface PhotographyProjectCardProps {
  project: Project;
  index: number;
}

export default function PhotographyProjectCard({
  project,
  index,
}: PhotographyProjectCardProps) {
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
        className="block overflow-hidden bg-white transition-all duration-500"
      >
        {/* Large Image at Top */}
        <motion.div
          className="relative w-full aspect-16/10 bg-stone-300! dark:bg-gray-800 overflow-hidden rounded-2xl lg:rounded-3xl"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <ImageWithSkeleton
            src={project.image_url || "/placeholder.svg"}
            alt={project.title}
            wrapperClassName="w-full h-full"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
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

        <div className="py-4 bg-white">
          {/* Metadata - Theme Only */}
          <div className="text-brand-ink mt-4 md:flex justify-between">
            <p className="text-brand-gray-muted md:text-background uppercase tracking-wider text-xs md:text-xl md:font-display font-semibold mb-2">
              {language === "En" ? "THEME" : "THEME"}
            </p>
            <p className="text-brand-ink font-medium text-base">
              {project.description || "N/A"}
            </p>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
