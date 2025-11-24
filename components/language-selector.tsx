"use client"

import { useState } from "react"

import { motion } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage()
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      className="relative inline-flex items-center backdrop-blur-sm rounded-full p-1 border border-white/20 overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-brand/20 via-brand-soft/20 to-brand/20"
        initial={{ x: "-100%" }}
        animate={{ x: isHovered ? "100%" : "-100%" }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />

      {/* Animated orange circle background */}
      <motion.div
        className="absolute w-9 h-9 rounded-full shadow-lg"
        style={{
          background: "linear-gradient(135deg, var(--color-brand) 0%, var(--color-brand-soft) 100%)",
        }}
        animate={{
          x: language === "Fr" ? 0 : 36,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30,
        }}
      >
        <motion.div
          className="absolute inset-0 rounded-full bg-brand"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.2, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      {/* Fr Button */}
      <motion.button
        onClick={() => setLanguage("Fr")}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="relative z-10 w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300"
      >
        <motion.span
          className="text-sm font-bold"
          animate={{
            color: language === "Fr" ? "#ffffff" : "var(--color-brand-gray-muted)",
            scale: language === "Fr" ? 1 : 0.9,
            y: language === "Fr" ? [0, -2, 0] : 0,
          }}
          transition={{
            color: { duration: 0.3 },
            scale: { duration: 0.3 },
            y: { duration: 0.5, repeat: language === "Fr" ? Number.POSITIVE_INFINITY : 0, repeatDelay: 2 },
          }}
        >
          Fr
        </motion.span>
      </motion.button>

      {/* En Button */}
      <motion.button
        onClick={() => setLanguage("En")}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="relative z-10 w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300"
      >
        <motion.span
          className="text-sm font-bold"
          animate={{
            color: language === "En" ? "#ffffff" : "var(--color-brand-gray-muted)",
            scale: language === "En" ? 1 : 0.9,
            y: language === "En" ? [0, -2, 0] : 0,
          }}
          transition={{
            color: { duration: 0.3 },
            scale: { duration: 0.3 },
            y: { duration: 0.5, repeat: language === "En" ? Number.POSITIVE_INFINITY : 0, repeatDelay: 2 },
          }}
        >
          En
        </motion.span>
      </motion.button>
    </motion.div>
  )
}
