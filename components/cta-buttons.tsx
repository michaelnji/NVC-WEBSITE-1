"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import type React from "react"

interface BaseProps {
  className?: string
  children: React.ReactNode
}

interface WhatsAppProps extends BaseProps {
  href: string
  target?: string
  rel?: string
}

export function WhatsAppButton({ href, target = "_blank", rel = "noopener noreferrer", className = "", children }: WhatsAppProps) {
  return (
    <motion.a
      href={href}
      target={target}
      rel={rel}
      className={`group relative inline-flex items-center gap-2 sm:gap-3 bg-[#e09e00] text-[#1e1e1e] font-semibold rounded-full text-sm sm:text-base transition-colors duration-500 shadow-lg whitespace-nowrap justify-center w-[260px] h-12 sm:h-14 overflow-hidden ${className}`}
    >
      <div className="pointer-events-none absolute -top-full -left-full w-[300%] h-[300%] bg-[#FFBA00] transform rotate-45 -translate-x-full -translate-y-full group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700 ease-out" />
      <span className="relative z-10 inline-flex items-center gap-2 sm:gap-3 transition-colors duration-500">
        {children}
      </span>
    </motion.a>
  )
}

interface SecondaryProps extends BaseProps {
  href?: string
  onClick?: () => void
  variant?: "outline" | "dark"
}

export function SecondaryCTAButton({ href, onClick, className = "", variant = "outline", children }: SecondaryProps) {
  const base = "group relative inline-flex items-center gap-2 sm:gap-3 font-semibold rounded-full text-sm sm:text-base transition-colors duration-500 whitespace-nowrap justify-center w-[260px] h-12 sm:h-14 overflow-hidden"
  const outline = "bg-transparent border-2 border-foreground/20 text-foreground"
  const dark = "bg-[#1e1e1e] text-white border-transparent"
  const variantClass = variant === "dark" ? dark : outline
  const content = (
    <motion.div
      className={`${base} ${variantClass} ${className}`}
      onClick={onClick}
    >
      <div className="pointer-events-none absolute -top-full -left-full w-[300%] h-[300%] bg-[#F15A25] transform rotate-45 -translate-x-full -translate-y-full group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700 ease-out" />
      <span className="relative z-10 inline-flex items-center gap-2 sm:gap-3 group-hover:text-white transition-colors duration-500">
        {children}
      </span>
    </motion.div>
  )

  if (href) {
    return (
      <Link href={href} className="inline-block">
        {content}
      </Link>
    )
  }

  return content
}
