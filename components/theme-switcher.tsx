"use client"

import { motion } from "framer-motion"
import { useTheme } from "@/contexts/theme-context"

export function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === "dark"

  return (
    <motion.button
      // onClick={toggleTheme}
      className="relative w-10 h-10 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 transition-colors duration-300 hover:bg-white/10 flex items-center justify-center cursor-not-allowed opacity-50"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label="Toggle theme (disabled)"
    >
      <motion.svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={{
          rotate: isDark ? 0 : 180,
          scale: isDark ? 1 : 1.1,
        }}
        transition={{
          duration: 0.5,
          ease: "easeInOut",
        }}
      >
        {isDark ? (
          // Moon icon for dark mode
          <motion.path
            d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            exit={{ pathLength: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-blue-200"
            stroke="currentColor"
          />
        ) : (
          // Sun icon for light mode
          <>
            <motion.circle
              cx="12"
              cy="12"
              r="5"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-yellow-400"
              stroke="currentColor"
            />
            <motion.g
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="text-yellow-400"
              stroke="currentColor"
            >
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </motion.g>
          </>
        )}
      </motion.svg>
    </motion.button>
  )
}
