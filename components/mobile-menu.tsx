"use client"

import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useEffect } from "react"
import { LanguageSelector } from "./language-selector"
import { HamburgerButton } from "./hamburger-button"

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  activeItem: string
  menuItems: { name: string; href: string }[]
}

export function MobileMenu({ isOpen, onClose, activeItem, menuItems }: MobileMenuProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const handleItemClick = () => {
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[60]"
            onClick={onClose}
          >
            {/* Animated gradient background */}
            <motion.div
              className="absolute inset-0 bg-[#0a0a0a]"
              animate={{
                background: [
                  "radial-gradient(circle at 20% 30%, rgba(241, 90, 37, 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(0, 217, 255, 0.15) 0%, transparent 50%)",
                  "radial-gradient(circle at 80% 30%, rgba(241, 90, 37, 0.2) 0%, transparent 50%), radial-gradient(circle at 20% 70%, rgba(0, 217, 255, 0.15) 0%, transparent 50%)",
                  "radial-gradient(circle at 20% 30%, rgba(241, 90, 37, 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(0, 217, 255, 0.15) 0%, transparent 50%)",
                ],
              }}
              transition={{
                duration: 10,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />

            {/* Backdrop blur layer */}
            <div className="absolute inset-0 backdrop-blur-3xl" />
          </motion.div>

          <motion.div
            initial={{ clipPath: "circle(0% at 95% 5%)" }}
            animate={{ clipPath: "circle(150% at 95% 5%)" }}
            exit={{ clipPath: "circle(0% at 95% 5%)" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[65] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full flex flex-col items-center justify-center px-4 sm:px-6">
              {/* Close button: reuse animated HamburgerButton for a coherent transition */}
              <div className="absolute top-4 right-4 z-[70]">
                <HamburgerButton isOpen={true} onClick={onClose} />
              </div>
              {/* Menu items */}
              <nav className="flex flex-col items-center gap-1.5 sm:gap-2.5 mb-10">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: 60, rotateX: -90 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    exit={{ opacity: 0, y: -60, rotateX: 90 }}
                    transition={{
                      delay: index * 0.08 + 0.2,
                      duration: 0.7,
                      ease: [0.76, 0, 0.24, 1],
                    }}
                  >
                    <Link href={item.href} onClick={handleItemClick} className="relative group">
                      <motion.span
                        className="text-2xl sm:text-3xl md:text-4xl font-bold block py-2 px-4 sm:py-3 sm:px-6 relative"
                        animate={{
                          color: activeItem === item.name ? "#F15A25" : "#ffffff",
                        }}
                        whileHover={{
                          scale: 1.04,
                          color: "#F15A25",
                        }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      >
                        {item.name.split("").map((char, i) => (
                          <motion.span
                            key={i}
                            className="inline-block"
                            whileHover={{
                              y: -4,
                              transition: { delay: i * 0.02, duration: 0.3, ease: [0.22, 1, 0.36, 1] },
                            }}
                          >
                            {char === " " ? "\u00A0" : char}
                          </motion.span>
                        ))}
                      </motion.span>

                      {/* Active indicator */}
                      {activeItem === item.name && (
                        <motion.div
                          layoutId="mobileActiveUnderline"
                          className="absolute -bottom-1 left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-[#F15A25] to-transparent rounded-full"
                          initial={false}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 35,
                          }}
                        />
                      )}

                      {/* Hover glow effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-[#F15A25]/0 via-[#F15A25]/20 to-[#F15A25]/0 blur-3xl rounded-full opacity-0 group-hover:opacity-100"
                        transition={{ duration: 0.5 }}
                      />
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Language selector only (theme switcher removed) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: 0.6, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="mt-6 flex items-center gap-4"
              >
                <div className="hidden sm:block scale-100">
                  <LanguageSelector />
                </div>
              </motion.div>

              {/* Decorative elements */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="absolute bottom-8 sm:bottom-10 text-[#F15A25]/40 text-xs sm:text-sm font-mono tracking-wider"
              >
                NEW VISION CREATIVES
              </motion.div>

              {/* Animated particles */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1.5 h-1.5 rounded-full"
                  style={{
                    background: i % 2 === 0 ? "#F15A25" : "#00d9ff",
                  }}
                  initial={{
                    x: typeof window !== "undefined" ? Math.random() * window.innerWidth : 0,
                    y: typeof window !== "undefined" ? Math.random() * window.innerHeight : 0,
                    opacity: 0,
                    scale: 0,
                  }}
                  animate={{
                    y: typeof window !== "undefined" ? [null, Math.random() * window.innerHeight] : 0,
                    opacity: [0, 0.8, 0],
                    scale: [0, 1.5, 0],
                  }}
                  transition={{
                    delay: i * 0.15,
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
