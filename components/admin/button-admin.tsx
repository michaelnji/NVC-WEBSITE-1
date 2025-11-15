"use client"

import * as React from "react"

type ButtonAdminProps = {
  children: React.ReactNode
  onClick?: () => Promise<void> | void
  type?: "button" | "submit" | "reset"
  disabled?: boolean
  className?: string
  fullWidth?: boolean
}

export function ButtonAdmin({
  children,
  onClick,
  type = "button",
  disabled = false,
  className = "",
  fullWidth = true,
}: ButtonAdminProps) {
  const [isLoading, setIsLoading] = React.useState(false)

  const handleClick = async () => {
    if (disabled || isLoading) return
    if (!onClick) return
    try {
      setIsLoading(true)
      await onClick()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={`${fullWidth ? "w-full" : ""} rounded-md border border-[#F15A25] bg-[#F15A25] text-white px-3 py-2 text-sm hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading && (
        <span className="inline-flex h-3 w-3 items-center justify-center">
          <span className="h-3 w-3 animate-spin rounded-full border-[2px] border-white/70 border-t-transparent" />
        </span>
      )}
      {children}
    </button>
  )
}
