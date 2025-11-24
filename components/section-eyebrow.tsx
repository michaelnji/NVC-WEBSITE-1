"use client"

import type { ReactNode } from "react"

interface SectionEyebrowProps {
  children: ReactNode
  className?: string
}

export function SectionEyebrow({ children, className = "" }: SectionEyebrowProps) {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <span className="relative flex h-3.5 w-3.5 sm:h-4 sm:w-4">
        <span className="absolute inline-flex h-full w-full rounded-full bg-brand/40 animate-ping" />
        <span className="relative inline-flex h-3.5 w-3.5 sm:h-4 sm:w-4 rounded-full bg-brand" />
      </span>
      <span className="font-sans text-[8px] sm:text-[9px] md:text-[10px] font-semibold tracking-[0.22em] uppercase text-brand">
        {children}
      </span>
    </div>
  )
}
