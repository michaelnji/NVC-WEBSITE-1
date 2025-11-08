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
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`inline-flex items-center gap-2 sm:gap-3 bg-[#FCC727] text-black font-semibold rounded-full text-sm sm:text-base hover:bg-[#e6b522] transition-colors shadow-lg shadow-[#FCC727]/30 whitespace-nowrap justify-center w-[260px] h-12 sm:h-14 ${className}`}
    >
      {children}
    </motion.a>
  )
}

interface SecondaryProps extends BaseProps {
  href?: string
  onClick?: () => void
  variant?: "outline" | "dark"
}

export function SecondaryCTAButton({ href, onClick, className = "", variant = "outline", children }: SecondaryProps) {
  const base = "inline-flex items-center gap-2 sm:gap-3 font-semibold rounded-full text-sm sm:text-base transition-colors whitespace-nowrap justify-center w-[260px] h-12 sm:h-14"
  const outline = "bg-transparent border-2 border-foreground/20 text-foreground hover:border-foreground/40 hover:bg-foreground/5"
  const dark = "bg-[#1e1e1e] text-white border-transparent hover:bg-[#1e1e1e]/90"
  const variantClass = variant === "dark" ? dark : outline
  const content = (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${base} ${variantClass} ${className}`}
      onClick={onClick}
    >
      {children}
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
