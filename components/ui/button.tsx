"use client"

import type React from "react"
import { motion } from "framer-motion"

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: "primary" | "secondary" | "ghost"
  size?: "sm" | "md" | "lg"
  className?: string
  disabled?: boolean
  type?: "button" | "submit" | "reset"
}

export function Button({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  type = "button",
}: ButtonProps) {
  const baseStyles =
    "relative rounded-full font-medium transition-all duration-300 inline-flex items-center justify-center"

  const variantStyles = {
    primary: "bg-gradient-to-r from-[#F15A25] to-[#FF7A47] text-white shadow-lg shadow-[#F15A25]/30",
    secondary: "bg-white/10 text-white border border-white/20 backdrop-blur-sm",
    ghost: "bg-transparent text-white hover:bg-white/10",
  }

  const sizeStyles = {
    sm: "px-4 py-1.5 text-sm",
    md: "px-6 py-2.5 text-base",
    lg: "px-8 py-3 text-lg",
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {children}
    </motion.button>
  )
}
