"use client"

import type React from "react"

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import Link from "next/link"
import { useRef, useState } from "react"

interface CTAButtonProps {
  href: string
  children: React.ReactNode
  className?: string
}

export function CTAButton({ href, children, className = "" }: CTAButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 })
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 })

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"])

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5

    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    setIsHovered(false)
  }

  return (
    <Link href={href} ref={ref} className={`relative inline-block ${className}`}>
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        whileTap={{ scale: 0.95 }}
        className="relative"
      >
        {/* Animated glow background */}
        <motion.div
          className="absolute -inset-1 bg-gradient-to-r from-[#F15A25] via-[#FF7A47] to-[#F15A25] rounded-full opacity-0 blur-xl"
          animate={{
            opacity: isHovered ? [0.4, 0.7, 0.4] : 0,
            scale: isHovered ? [1, 1.1, 1] : 1,
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        {/* Floating particles */}
        {isHovered && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-[#F15A25] rounded-full"
                initial={{
                  x: 0,
                  y: 0,
                  opacity: 0,
                }}
                animate={{
                  x: [0, (Math.random() - 0.5) * 60],
                  y: [0, -40 - Math.random() * 20],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 1.5 + Math.random(),
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.2,
                  ease: "easeOut",
                }}
                style={{
                  left: `${20 + i * 15}%`,
                  top: "50%",
                }}
              />
            ))}
          </>
        )}

        {/* Main button */}
        <motion.button
          className="relative bg-gradient-to-r from-[#F15A25] to-[#FF7A47] text-white font-semibold px-6 py-2.5 rounded-full text-sm shadow-lg shadow-[#F15A25]/30 overflow-hidden"
          style={{
            transformStyle: "preserve-3d",
            transform: "translateZ(20px)",
          }}
        >
          {/* Animated gradient overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{
              x: isHovered ? ["-200%", "200%"] : "-200%",
            }}
            transition={{
              duration: 1.5,
              repeat: isHovered ? Number.POSITIVE_INFINITY : 0,
              ease: "linear",
            }}
          />

          {/* Ripple effect on hover */}
          {isHovered && (
            <motion.div
              className="absolute inset-0 bg-white/20 rounded-full"
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{
                duration: 1,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeOut",
              }}
            />
          )}

          {/* Text with character animation */}
          <span className="relative z-10 inline-flex">
            {children
              ?.toString()
              .split("")
              .map((char, i) => (
                <motion.span
                  key={i}
                  className="inline-block"
                  animate={{
                    y: isHovered ? [0, -3, 0] : 0,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.03,
                    repeat: isHovered ? Number.POSITIVE_INFINITY : 0,
                    repeatDelay: 1,
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
          </span>

          {/* Inner glow */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-white/0 via-white/10 to-white/0 rounded-full"
            animate={{
              opacity: isHovered ? [0.3, 0.6, 0.3] : 0,
            }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        </motion.button>

        {/* 3D shadow */}
        <motion.div
          className="absolute inset-0 bg-[#F15A25]/40 rounded-full blur-md"
          style={{
            transform: "translateZ(-10px)",
            transformStyle: "preserve-3d",
          }}
          animate={{
            opacity: isHovered ? 0.6 : 0.3,
          }}
        />
      </motion.div>
    </Link>
  )
}
