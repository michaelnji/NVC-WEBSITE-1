"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { useLanguage } from "@/contexts/language-context"

interface PendingSectionProps {
  title: string
  subtitle?: string
  actionLabel?: string
  actionHref?: string
}

export default function PendingSection({ title, subtitle, actionHref, actionLabel }: PendingSectionProps) {
  return (
    <section className="relative w-full py-24 md:py-32">
      {/* Low-opacity background image */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 flex flex-col items-center text-center">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-col items-center">
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-wide leading-tight text-white uppercase text-balance">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-4 text-white/70 text-base sm:text-lg md:text-xl max-w-2xl">
              {subtitle}
            </p>
          ) : null}
          {actionHref && actionLabel ? (
            <Link href={actionHref} className="mt-8 inline-flex items-center justify-center px-5 py-3 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors">
              {actionLabel}
            </Link>
          ) : null}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-12 w-full max-w-3xl mx-auto"
        >
          <FlipCountdown />
        </motion.div>
        <style jsx>{`
          .perspective-1000 { perspective: 1200px; }
          .preserve-3d { transform-style: preserve-3d; }
          @keyframes flipTop {
            0% { transform: rotateX(0deg); }
            100% { transform: rotateX(-90deg); }
          }
          @keyframes flipBottom {
            0% { transform: rotateX(90deg); }
            100% { transform: rotateX(0deg); }
          }
          .flip-top { animation: flipTop 0.6s cubic-bezier(0.25, 0.8, 0.25, 1) forwards; }
          .flip-bottom { animation: flipBottom 0.6s cubic-bezier(0.25, 0.8, 0.25, 1) forwards; }
        `}</style>
      </div>
    </section>
  )
}

export function FlipCountdown() {
  const { t } = useLanguage()
  // Fixed global target date (UTC). Adjust as needed.
  const TARGET_DATE = new Date("2025-12-31T23:59:59Z").getTime()

  const compute = () => {
    const now = Date.now()
    let diff = Math.max(0, TARGET_DATE - now)
    const minutes = Math.floor(diff / 60000) % 60
    const hours = Math.floor(diff / 3600000) % 24
    const days = Math.floor(diff / 86400000)
    return { days, hours, minutes }
  }

  const init = compute()
  const [days, setDays] = useState(init.days)
  const [hours, setHours] = useState(init.hours)
  const [minutes, setMinutes] = useState(init.minutes)

  useEffect(() => {
    const id = setInterval(() => {
      const r = compute()
      setDays(r.days)
      setHours(r.hours)
      setMinutes((prev) => (prev !== r.minutes ? r.minutes : prev))
    }, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
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
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2 md:gap-3">
        <FlipCard digit={digits[0]} />
        <FlipCard digit={digits[1]} />
      </div>
      <span className="text-2xl md:text-3xl font-black text-[#F15A25]">{label}</span>
    </div>
  )
}

function FlipCard({ digit }: { digit: string }) {
  const [currentDigit, setCurrentDigit] = useState(digit)
  const [nextDigit, setNextDigit] = useState(digit)
  const [flipTop, setFlipTop] = useState(false)
  const [flipBottom, setFlipBottom] = useState(false)

  useEffect(() => {
    if (digit !== currentDigit) {
      setNextDigit(digit)
      setFlipTop(true)
      const topTimer = setTimeout(() => {
        setCurrentDigit(digit)
        setFlipTop(false)
        setFlipBottom(true)
        const bottomTimer = setTimeout(() => setFlipBottom(false), 350)
        return () => clearTimeout(bottomTimer)
      }, 350)
      return () => clearTimeout(topTimer)
    }
  }, [digit, currentDigit])

  return (
    <div className="relative w-16 h-20 md:w-24 md:h-32 perspective-1000">
      {/* Static upper half (shows currentDigit) */}
      <div className="absolute top-0 left-0 right-0 h-1/2 bg-black rounded-t-xl md:rounded-t-2xl overflow-hidden z-10">
        <div className="absolute inset-0 flex justify-center items-start">
          <span className="text-6xl md:text-9xl font-black text-[#F15A25] leading-none">{currentDigit}</span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
      </div>

      {/* Static lower half (shows nextDigit) */}
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-black rounded-b-xl md:rounded-b-2xl overflow-hidden z-0">
        <div className="absolute top-0 left-0 right-0 flex justify-center -translate-y-1/2">
          <span className="text-6xl md:text-9xl font-black text-[#F15A25] leading-none">{nextDigit}</span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
      </div>

      {/* Animated top flap (currentDigit flips down) */}
      {flipTop && (
        <div className="absolute top-0 left-0 right-0 h-1/2 overflow-hidden z-20">
          <div className="preserve-3d origin-bottom bg-black rounded-t-xl md:rounded-t-2xl flip-top">
            <div className="h-1/2" />
            <div className="absolute inset-0 flex justify-center items-start">
              <span className="text-6xl md:text-9xl font-black text-[#F15A25] leading-none">{currentDigit}</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
          </div>
        </div>
      )}

      {/* Animated bottom flap (nextDigit flips up) */}
      {flipBottom && (
        <div className="absolute bottom-0 left-0 right-0 h-1/2 overflow-hidden z-30">
          <div className="preserve-3d origin-top bg-black rounded-b-xl md:rounded-b-2xl flip-bottom">
            <div className="absolute top-0 left-0 right-0 flex justify-center -translate-y-1/2">
              <span className="text-6xl md:text-9xl font-black text-[#F15A25] leading-none">{nextDigit}</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
          </div>
        </div>
      )}

      <div className="absolute top-1/2 left-0 right-0 h-[2px] md:h-[3px] bg-white/90 -translate-y-1/2 z-40" />
      <div className="absolute inset-0 rounded-xl md:rounded-2xl shadow-2xl pointer-events-none z-50" />
    </div>
  )
}

function Separator() {
  return (
    <div className="flex flex-col gap-2 md:gap-3 pb-16 md:pb-20">
      <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-[#F15A25]" />
      <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-[#F15A25]" />
    </div>
  )
}
