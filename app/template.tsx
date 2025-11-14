"use client"

import type React from "react"

import { motion, useReducedMotion } from "framer-motion"

export default function Template({ children }: { children: React.ReactNode }) {
  const prefersReduced = useReducedMotion()
  const initial = prefersReduced ? false : { opacity: 0, y: 20 }
  const animate = prefersReduced ? {} : { opacity: 1, y: 0 }
  const exit = prefersReduced ? {} : { opacity: 0, y: -20 }

  return (
    <motion.div
      initial={initial as any}
      animate={animate}
      exit={exit}
      transition={prefersReduced ? undefined : {
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
    >
      {children}
    </motion.div>
  )
}
