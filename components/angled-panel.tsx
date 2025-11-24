import type { ReactNode } from "react"

interface AngledPanelProps {
  color?: string
  className?: string
  children?: ReactNode
}

export function AngledPanel({
  color = "var(--brand-primary)",
  className = "",
  children,
}: AngledPanelProps) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        backgroundColor: color,
        clipPath:
          "polygon(12.9% 0%, 87.1% 0%, 88.5% 3.9%, 100% 3.9%, 100% 96.1%, 88.5% 96.1%, 87.1% 100%, 12.9% 100%, 11.5% 96.1%, 0% 96.1%, 0% 3.9%, 11.5% 3.9%)",
      }}
    >
      {children}
    </div>
  )
}