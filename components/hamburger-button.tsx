"use client"

import { motion } from "framer-motion"

interface HamburgerButtonProps {
  isOpen: boolean
  onClick: () => void
}
export function HamburgerButton({ isOpen, onClick }: HamburgerButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className="relative z-[70] w-12 h-12 flex items-center justify-center group"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle menu"
    >
      <motion.div
        className="absolute inset-0 rounded-full bg-[#ff6b35]/10 backdrop-blur-sm"
        animate={{
          scale: isOpen ? 1.2 : 1,
          opacity: isOpen ? 0.3 : 0,
        }}
        transition={{ duration: 0.3 }}
      />

      <motion.div
        className="absolute inset-0 rounded-full bg-[#ff6b35]/20 blur-xl"
        animate={{
          scale: isOpen ? 1.5 : 0.8,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{ duration: 0.4 }}
      />

      {/* Hamburger state */}
      {!isOpen && (
        <motion.div
          className="relative w-6 h-5 flex flex-col justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.span
            className="w-full h-0.5 bg-white rounded-full origin-center"
            animate={{
              rotate: 0,
              y: 0,
            }}
            transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
          />

          <motion.span
            className="w-full h-0.5 bg-white rounded-full"
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{ duration: 0.2 }}
          />

          <motion.span
            className="w-full h-0.5 bg-white rounded-full origin-center"
            animate={{
              rotate: 0,
              y: 0,
            }}
            transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
          />
        </motion.div>
      )}

      {/* Close button state */}
      {isOpen && (
        <motion.div
          className="relative w-6 h-5"
          initial={{ opacity: 0, rotate: -90 }}
          animate={{ opacity: 1, rotate: 0 }}
          exit={{ opacity: 0, rotate: 90 }}
          transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-white">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </motion.div>
      )}
    </motion.button>
  )
}
