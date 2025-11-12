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

      <div className="relative w-6 h-5 flex flex-col justify-between">
        <motion.span
          className="w-full h-0.5 bg-white rounded-full origin-center"
          animate={{
            rotate: isOpen ? 45 : 0,
            y: isOpen ? 9 : 0,
            backgroundColor: "#ffffff",
          }}
          transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
        />

        <motion.span
          className="w-full h-0.5 bg-white rounded-full"
          animate={{
            opacity: isOpen ? 0 : 1,
            x: isOpen ? -20 : 0,
          }}
          transition={{ duration: 0.2 }}
        />

        <motion.span
          className="w-full h-0.5 bg-white rounded-full origin-center"
          animate={{
            rotate: isOpen ? -45 : 0,
            y: isOpen ? -9 : 0,
            backgroundColor: "#ffffff",
          }}
          transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
        />
      </div>

      <motion.div
        animate={{
          rotate: isOpen ? 180 : 0,
          scale: isOpen ? 1.3 : 1,
          opacity: isOpen ? 0 : 1,
        }}
        whileHover={{
          rotate: 90,
          scale: 1.2,
        }}
        transition={{ duration: 0.4 }}
      />
    </motion.button>
  )
}
