"use client"

export default function Shimmer() {
  return (
    <div className="relative overflow-hidden rounded-lg bg-neutral-800 h-40 w-full">
      <div
        className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent rotate-12"
      />
    </div>
  )
}
