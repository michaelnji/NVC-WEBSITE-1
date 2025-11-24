"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, useMotionValue, useSpring } from "framer-motion"
import { gsap } from "gsap"
import { LanguageSelector } from "@/components/language-selector"
import { MobileMenu } from "@/components/mobile-menu"
import { HamburgerButton } from "@/components/hamburger-button"
// Theme switcher removed per request
import { useLanguage } from "@/contexts/language-context"
import { useTheme } from "@/contexts/theme-context"

export function Navbar() {
  const { t } = useLanguage()
  const { theme } = useTheme()

  const menuItems = [
    { name: t.nav.home, href: "/" },
    { name: t.nav.projects, href: "/projets" },
    { name: t.nav.about, href: "/a-propos" },
    { name: t.nav.contact, href: "/contact" },
  ]

  const pathname = usePathname()
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isNavbarVisible, setIsNavbarVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const navRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([])

  const activeItem = menuItems.find((item) => item.href === pathname)?.name || menuItems[0].name

  const magneticX0 = useMotionValue(0)
  const magneticY0 = useMotionValue(0)
  const magneticX1 = useMotionValue(0)
  const magneticY1 = useMotionValue(0)
  const magneticX2 = useMotionValue(0)
  const magneticY2 = useMotionValue(0)
  const magneticX3 = useMotionValue(0)
  const magneticY3 = useMotionValue(0)

  const magneticXSpring0 = useSpring(magneticX0, { stiffness: 150, damping: 15 })
  const magneticYSpring0 = useSpring(magneticY0, { stiffness: 150, damping: 15 })
  const magneticXSpring1 = useSpring(magneticX1, { stiffness: 150, damping: 15 })
  const magneticYSpring1 = useSpring(magneticY1, { stiffness: 150, damping: 15 })
  const magneticXSpring2 = useSpring(magneticX2, { stiffness: 150, damping: 15 })
  const magneticYSpring2 = useSpring(magneticY2, { stiffness: 150, damping: 15 })
  const magneticXSpring3 = useSpring(magneticX3, { stiffness: 150, damping: 15 })
  const magneticYSpring3 = useSpring(magneticY3, { stiffness: 150, damping: 15 })

  const magneticXValues = [magneticX0, magneticX1, magneticX2, magneticX3]
  const magneticYValues = [magneticY0, magneticY1, magneticY2, magneticY3]
  const magneticXSprings = [magneticXSpring0, magneticXSpring1, magneticXSpring2, magneticXSpring3]
  const magneticYSprings = [magneticYSpring0, magneticYSpring1, magneticYSpring2, magneticYSpring3]

  useEffect(() => {
    const hasPlayedEntrance = sessionStorage.getItem("navbar-entrance-played")
    const isFirstLoad =
      !window.performance.getEntriesByType("navigation")[0] ||
      (window.performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming).type === "navigate"

    if (!hasPlayedEntrance && navRef.current && isFirstLoad) {
      const ctx = gsap.context(() => {
        gsap.from(navRef.current, {
          y: -100,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
        })
      })

      sessionStorage.setItem("navbar-entrance-played", "true")

      return () => ctx.revert()
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Only hide/show navbar after scrolling past 100px
      if (currentScrollY < 100) {
        setIsNavbarVisible(true)
        setLastScrollY(currentScrollY)
        return
      }

      // Determine scroll direction
      if (currentScrollY > lastScrollY) {
        // Scrolling down - hide navbar
        setIsNavbarVisible(false)
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - show navbar
        setIsNavbarVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [isMobileMenuOpen])

  const handleMouseMove = (e: React.MouseEvent, index: number) => {
    if (!itemRefs.current[index]) return
    const rect = itemRefs.current[index]!.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    magneticXValues[index].set((e.clientX - centerX) * 0.3)
    magneticYValues[index].set((e.clientY - centerY) * 0.3)
  }

  const handleMouseLeave = (index: number) => {
    setHoveredItem(null)
    magneticXValues[index].set(0)
    magneticYValues[index].set(0)
  }

  return (
    <>
      <motion.nav
        ref={navRef}
        animate={{
          y: isNavbarVisible ? 0 : -100,
        }}
        transition={{
          duration: 0.3,
          ease: [0.25, 0.46, 0.45, 0.94], // Custom easing for smooth animation
        }}
        className="fixed top-0 left-0 right-0 z-50 bg-background/25 backdrop-blur-md border-b border-border/20"
      >
        <motion.div
          className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-700"
          style={{
            background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(241, 90, 37, 0.06), transparent 0%)`,
          }}
        />

        <div className="w-full px-6 md:px-12 lg:px-16 xl:px-24 2xl:px-32">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center group relative z-10">
              <motion.div
                whileHover={{ scale: 1.08, rotate: 2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="relative"
              >
                <Image
                  src={theme === "dark" ? "/logo-dark.svg" : "/logo.svg"}
                  alt="New Vision Creatives"
                  width={130}
                  height={34}
                  className="h-10 w-auto transition-all duration-300 group-hover:brightness-110 group-hover:drop-shadow-[0_0_15px_rgba(241,90,37,0.5)]"
                  priority
                />
                <motion.div
                  className="absolute inset-0 bg-[#F15A25]/20 blur-xl rounded-full"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ opacity: 1, scale: 1.2 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </Link>

            <div className="hidden lg:flex items-center gap-1 relative z-10">
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
                >
                  <Link
                    ref={(el) => {
                      itemRefs.current[index] = el
                    }}
                    href={item.href}
                    onMouseEnter={() => {
                      if (activeItem !== item.name) setHoveredItem(item.name)
                    }}
                    onMouseLeave={() => handleMouseLeave(index)}
                    onMouseMove={(e) => {
                      if (activeItem !== item.name) handleMouseMove(e, index)
                    }}
                    className="relative px-4 py-2 text-sm md:text-[17px] lg:text-lg font-medium transition-colors duration-300 block"
                  >
                    <motion.div
                      style={{
                        x: magneticXSprings[index],
                        y: magneticYSprings[index],
                      }}
                    >
                      <motion.span
                        className="relative z-10 inline-block"
                        animate={{
                          color:
                            activeItem === item.name
                              ? "#F15A25"
                              : hoveredItem === item.name
                                ? "#FF7A47"
                                : "hsl(var(--muted-foreground))",
                        }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      >
                        <span className="inline-flex gap-[1px]">
                          {item.name.split("").map((char, i) => (
                            <motion.span
                              key={i}
                              className="inline-block"
                              whileHover={
                                activeItem === item.name
                                  ? undefined
                                  : {
                                      y: -2,
                                      transition: { delay: i * 0.03, duration: 0.2 },
                                    }
                              }
                            >
                              {char === " " ? "\u00A0" : char}
                            </motion.span>
                          ))}
                        </span>
                      </motion.span>

                      {activeItem === item.name && (
                        <motion.div
                          layoutId="activeUnderline"
                          className="absolute bottom-0 left-0 right-0 h-[3px]"
                          initial={false}
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 30,
                          }}
                        >
                          <div className="w-full h-full bg-gradient-to-r from-[#F15A25] to-[#FF7A47] rounded-full" />
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-[#F15A25] to-[#FF7A47] blur-md"
                            animate={{
                              opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: "easeInOut",
                            }}
                          />
                        </motion.div>
                      )}

                      {hoveredItem === item.name && activeItem !== item.name && (
                        <>
                          <motion.div
                            className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#F15A25] to-transparent"
                            initial={{ opacity: 0, scaleX: 0 }}
                            animate={{ opacity: 1, scaleX: 1 }}
                            exit={{ opacity: 0, scaleX: 0 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                          />
                          <motion.div
                            className="absolute bottom-0 left-1/2 w-1 h-1 bg-[#F15A25] rounded-full blur-sm"
                            initial={{ opacity: 0, y: 0, x: "-50%" }}
                            animate={{
                              opacity: [0, 1, 0],
                              y: [-10, -20],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: "easeOut",
                            }}
                          />
                         
                        </>
                      )}
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="flex items-center gap-4 relative z-10">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="hidden lg:block"
              >
                <LanguageSelector />
              </motion.div>

              <div className={`lg:hidden ${isMobileMenuOpen ? 'invisible' : ''}`}>
                <HamburgerButton isOpen={isMobileMenuOpen} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
              </div>
            </div>
          </div>
        </div>

        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#F15A25]/50 to-transparent"
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </motion.nav>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        activeItem={activeItem}
        menuItems={menuItems}
      />
    </>
  )
}
