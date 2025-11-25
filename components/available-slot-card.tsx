"use client"

import React from "react"

type AvailableSlotCardProps = {
  title?: string
  description?: string
  className?: string
}

export function AvailableSlotCard({
  title = "Slot available",
  description = "Add more items in the admin to fill this gallery slot.",
  className = "",
}: AvailableSlotCardProps) {
  const hasDescription = Boolean(description)
  return (
    <div
      className={`flex-1 flex flex-col items-center justify-center px-6 text-center  ${className}`}
    >
      <h2
        className={`text-xs sm:text-sm md:text-base font-sans font-bold text-white leading-tight tracking-wide ${
          hasDescription ? "mb-2" : "mb-0"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p className="font-sans text-white/75 text-xs sm:text-sm leading-relaxed max-w-xs">
          {description}
        </p>
      )}
    </div>
  )
}
