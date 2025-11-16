"use client"

export default function Shimmer() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  )
}
