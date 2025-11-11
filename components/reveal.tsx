"use client"

import { motion } from "framer-motion"
import type { PropsWithChildren } from "react"

type RevealProps = PropsWithChildren<{
  className?: string
  delay?: number
}>

export default function Reveal({ children, className = "", delay = 0 }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
