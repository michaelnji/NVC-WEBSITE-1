"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/contexts/language-context"

export function FlipCountdown() {
  const { t } = useLanguage()
  const [days, setDays] = useState(0)
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)

  const targetDate = new Date(2025, 10, 14, 0, 0, 0)

  const getRemaining = () => {
    const now = Date.now()
    const diff = targetDate.getTime() - now
    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0 }
    }
    const minuteMs = 60 * 1000
    const hourMs = 60 * minuteMs
    const dayMs = 24 * hourMs
    const d = Math.floor(diff / dayMs)
    const h = Math.floor((diff % dayMs) / hourMs)
    const m = Math.floor((diff % hourMs) / minuteMs)
    return { days: d, hours: h, minutes: m }
  }

  useEffect(() => {
    const update = () => {
      const { days: d, hours: h, minutes: m } = getRemaining()
      setDays(d)
      setHours(h)
      setMinutes(m)
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-nowrap items-center justify-center gap-2 sm:gap-4 md:gap-6 lg:gap-8">
      <TimeUnit value={days} label={t.common.countdown.days} />
      <Separator />
      <TimeUnit value={hours} label={t.common.countdown.hours} />
      <Separator />
      <TimeUnit value={minutes} label={t.common.countdown.minutes} />
    </div>
  )
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  const digits = String(value).padStart(2, "0").split("")

  return (
    <div className="flex flex-col items-center gap-1 sm:gap-3 md:gap-4">
      <div className="flex gap-1 sm:gap-2 md:gap-3">
        <FlipCard digit={digits[0]} />
        <FlipCard digit={digits[1]} />
      </div>
      <span className="text-xs sm:text-xl md:text-2xl lg:text-3xl font-black text-[#ff5722]">{label}</span>
    </div>
  )
}

function FlipCard({ digit }: { digit: string }) {
  const [currentDigit, setCurrentDigit] = useState(digit)
  const [nextDigit, setNextDigit] = useState(digit)
  const [isFlipping, setIsFlipping] = useState(false)
  const [bottomDigit, setBottomDigit] = useState(digit)

  useEffect(() => {
    if (digit !== currentDigit) {
      setNextDigit(digit)
      setIsFlipping(true)
      const bottomTimeout = setTimeout(() => {
        setBottomDigit(digit)
      }, 500)
      const timeout = setTimeout(() => {
        setCurrentDigit(digit)
        setIsFlipping(false)
      }, 1000)
      return () => {
        clearTimeout(timeout)
        clearTimeout(bottomTimeout)
      }
    }
  }, [digit, currentDigit])

  return (
    <div className="relative w-9 h-12 sm:w-16 sm:h-20 md:w-20 md:h-28 lg:w-24 lg:h-32 flip-card-container">
      <div className="absolute inset-0 z-10">
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-black rounded-t-md sm:rounded-t-xl md:rounded-t-2xl overflow-hidden">
          <div className="absolute inset-0 flex items-start justify-center pt-0">
            <span className="font-display translate-y-[10px] text-3xl sm:text-6xl md:text-7xl lg:text-9xl font-black text-[#ff5722] leading-none">
              {isFlipping ? nextDigit : currentDigit}
            </span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-black rounded-b-md sm:rounded-b-xl md:rounded-b-2xl overflow-hidden">
          <div className="absolute inset-0 flex items-end justify-center pb-0">
            <span className="font-display translate-y-[12px] text-3xl sm:text-6xl md:text-7xl lg:text-9xl font-black text-[#ff5722] leading-none">
              {bottomDigit}
            </span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
        </div>
      </div>

      {isFlipping && (
        <div
          className="absolute top-0 left-0 right-0 h-1/2 origin-bottom flip-top-fall"
          style={{
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
            zIndex: 30,
          }}
        >
          <div className="relative w-full h-full">
            <div className="absolute top-0 left-0 right-0 h-full bg-black rounded-t-lg sm:rounded-t-xl md:rounded-t-2xl overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display translate-y-[12px] text-5xl sm:text-6xl md:text-7xl lg:text-9xl font-black text-[#ff5722] leading-none">
                  {currentDigit}
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-black/0 falling-shadow" />
            </div>
          </div>
        </div>
      )}

      {isFlipping && (
        <div
          className="absolute bottom-0 left-0 right-0 h-1/2 origin-top flip-bottom-rise"
          style={{
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
            zIndex: 20,
          }}
        >
          <div className="relative w-full h-full">
            <div className="absolute top-0 left-0 right-0 h-full bg-black rounded-b-lg sm:rounded-b-xl md:rounded-b-2xl overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display translate-y-[40px] text-5xl sm:text-6xl md:text-7xl lg:text-9xl font-black text-[#ff5722] leading-none">
                  {nextDigit}
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-black/0 rising-shadow" />
            </div>
          </div>
        </div>
      )}

      <div className="absolute top-1/2 left-0 right-0 h-[1.5px] sm:h-[2px] md:h-[3px] bg-white/90 -translate-y-1/2 z-40" />

      <div className="absolute inset-0 rounded-lg sm:rounded-xl md:rounded-2xl shadow-2xl pointer-events-none z-50" />
    </div>
  )
}

function Separator() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="h-6 sm:h-10 md:h-14 lg:h-16" />
      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3 mb-3 rounded-full bg-[#ff5722]" />
      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3 rounded-full bg-[#ff5722]" />
      <div className="h-6 sm:h-10 md:h-14 lg:h-16" />
    </div>
  )
}
