"use client"

import { useEffect, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

export function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  const mainCursorConfig = { damping: 30, stiffness: 800, mass: 0.1 }
  const cursorXSpring = useSpring(cursorX, mainCursorConfig)
  const cursorYSpring = useSpring(cursorY, mainCursorConfig)

  const outerCursorConfig = { damping: 20, stiffness: 300, mass: 0.3 }
  const outerX = useSpring(cursorX, outerCursorConfig)
  const outerY = useSpring(cursorY, outerCursorConfig)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    checkMobile()

    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    if (isMobile) return

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === "A" || target.tagName === "BUTTON" || target.closest("a") || target.closest("button")) {
        setIsHovering(true)
      } else {
        setIsHovering(false)
      }
    }

    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)

    window.addEventListener("mousemove", moveCursor)
    window.addEventListener("mouseover", handleMouseOver)
    window.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("mouseup", handleMouseUp)

    return () => {
      window.removeEventListener("mousemove", moveCursor)
      window.removeEventListener("mouseover", handleMouseOver)
      window.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [cursorX, cursorY, isMobile])

  if (isMobile) return null

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-[#FFBA00] rounded-full pointer-events-none z-[9999]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isClicking ? 0.5 : 1,
        }}
        transition={{ duration: 0.1 }}
      />
      
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 border-2 border-[#F15A25]/40 rounded-full pointer-events-none z-[9998]"
        style={{
          x: outerX,
          y: outerY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isHovering ? 1.8 : 1,
          opacity: isHovering ? 0.6 : 0.3,
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />

      {isHovering && (
        <motion.div
          className="fixed top-0 left-0 w-20 h-20 bg-[#FFBA00]/12 rounded-full pointer-events-none z-[9997] blur-xl"
          style={{
            x: outerX,
            y: outerY,
            translateX: "-50%",
            translateY: "-50%",
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </>
  )
}
