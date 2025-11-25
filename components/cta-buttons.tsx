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
      className={`group relative inline-flex items-center gap-2 sm:gap-3 bg-brand-accent text-brand-ink font-semibold rounded-full text-sm sm:text-base transition-colors duration-500 shadow-lg whitespace-nowrap justify-center w-[260px] h-12 sm:h-14 overflow-hidden ${className}`}
    >
      <div className="pointer-events-none absolute -top-full -left-full w-[300%] h-[300%] bg-brand-accent transform rotate-45 -translate-x-full -translate-y-full group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700 ease-out" />
      <span className="relative z-10 inline-flex items-center gap-2 sm:gap-3 transition-colors duration-500">
        {children}
      </span>
    </motion.a>
  )
}

interface SecondaryProps extends BaseProps {
  href?: string
  onClick?: () => void
  variant?: "outline" | "dark" | "white"
}

export function SecondaryCTAButton({ href, onClick, className = "", variant = "outline", children }: SecondaryProps) {
  const base = "group relative inline-flex items-center gap-2 sm:gap-3 font-semibold rounded-full text-sm sm:text-base transition-colors duration-500 whitespace-nowrap justify-center w-[260px] h-12 sm:h-14 overflow-hidden"
  const outline = "bg-transparent border-2 border-foreground/20 text-foreground"
  const dark = "bg-brand-ink text-white border-transparent"
  const white = "bg-white text-brand-ink border-transparent shadow-lg"
  const variantClass =
    variant === "dark" ? dark : variant === "white" ? white : outline
  const textHoverClass = variant === "white" ? "group-hover:text-brand-ink" : "group-hover:text-white"
  const content = (
    <motion.div
      className={`${base} ${variantClass} ${className}`}
      onClick={onClick}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-y-[-80%] left-[-20%] w-[80%] bg-brand skew-x-[-18deg] origin-left transform -translate-x-full transition-transform duration-500 ease-out group-hover:translate-x-0"
        />
        <div
          className="absolute inset-y-[-80%] right-[-20%] w-[80%] bg-brand skew-x-[-18deg] origin-right transform translate-x-full transition-transform duration-500 ease-out group-hover:translate-x-0"
        />
      </div>
      <span className={`relative z-10 inline-flex items-center gap-2 sm:gap-3 transition-colors duration-500 ${textHoverClass}`}>
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
