"use client"

import { useState, type MouseEvent } from "react"
import { FlipCountdown } from "@/components/flip-count-down"
import { CTAButton } from "@/components/cta-button"
import { useLanguage } from "@/contexts/language-context"

export function FlipCountdownSection() {
  const { t } = useLanguage()
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setMousePos({ x, y })
  }

  const makeParallaxStyle = (strengthX: number, strengthY: number) => ({
    transform: `translate3d(${mousePos.x * strengthX}px, ${mousePos.y * strengthY}px, 0)`,
    transition: "transform 0.08s ease-out",
  })

  return (
    <main
      className="relative overflow-hidden min-h-screen flex items-center justify-center px-4 py-8"
      style={{
        backgroundColor: "#0f0f0f",
        backgroundImage: "url('/background%20temoignages.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      onMouseMove={handleMouseMove}
    >
      <div className="relative z-10 w-full max-w-6xl text-center py-12 px-6 sm:py-16 sm:px-8 md:py-20 md:px-10 bg-white rounded-3xl">
        <h1 className="font-display uppercase text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-7xl 2xl:text-8xl font-bold leading-[1.1] text-balance tracking-wide mb-3 sm:mb-4 md:mb-5 lg:mb-[8px]">
          <span className="text-[#020202]">We’re still cooking </span>
          <span className="text-[#F15A25]">the good stuff.</span>
        </h1>
        <p className="subtext text-normal text-black font-sans sm:text-lg md:text-xl mb-8 sm:mb-10 md:mb-12 text-black-400 max-w-2xl mx-auto px-4">
          <span>We’re putting </span>
          <span className="text-[#F15A25]">the final touches </span>
          <span>on ours ... we’ll be live before the caffeine wears off.</span>
        </p>

        <div className="countdown flex justify-center">
          <FlipCountdown />
        </div>

        <div className="cta mt-10 flex justify-center gap-3 flex-wrap">
          <div className="w-48 flex justify-center">
            <div className="w-full flex justify-center">
              <CTAButton href="/">{t.common.buttons.backHome}</CTAButton>
            </div>
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-[20%] -left-[5%] w-50 h-50 -rotate-[8.38deg] flex items-center justify-center pointer-events-none z-0"
        style={makeParallaxStyle(-40, 30)}
      >
        <img src="/hero-images/image1.png" alt="image-1" />
      </div>

      <div
        className="absolute bottom-[30%] -right-[6%] w-50 h-50 -rotate-[8.38deg] flex items-center justify-center pointer-events-none z-0"
        style={makeParallaxStyle(50, -40)}
      >
        <img src="/hero-images/image4.png" alt="image-1" />
      </div>

      <div
        className="absolute bottom-[20%] -right-[6%] w-50 h-50 rotate-[20.71deg] flex items-center justify-center pointer-events-none z-0"
        style={makeParallaxStyle(30, 35)}
      >
        <img src="/hero-images/image6.png" alt="image-2" />
      </div>

      <div
        className="absolute -bottom-[10%] right-[50%] w-50 h-50 -rotate-[20.87deg] flex items-center justify-center pointer-events-none z-0"
        style={makeParallaxStyle(-25, -20)}
      >
        <img src="/hero-images/image2.png" alt="image-2" />
      </div>

      <div
        className="absolute -bottom-[15%] right-[42%] w-50 h-50 rotate-[9.13deg] flex items-center justify-center pointer-events-none z-0"
        style={makeParallaxStyle(20, -15)}
      >
        <img src="/hero-images/image3.png" alt="image-2" />
      </div>

      <div
        className="absolute -top-20 -left-20 w-50 h-50 rotate-26 flex items-center justify-center pointer-events-none z-0"
        style={makeParallaxStyle(-35, -30)}
      >
        <img src="/hero-images/image6.png" alt="image-1" />
      </div>

      <div
        className="absolute -top-[7%] left-[2%] w-50 h-50 rotate-11 flex items-center justify-center pointer-events-none z-0"
        style={makeParallaxStyle(-20, 25)}
      >
        <img src="/hero-images/image5.png" alt="image-1" />
      </div>

      <div
        className="absolute -top-[7%] right-0 w-50 h-50 -rotate-20 flex items-center justify-center pointer-events-none z-0"
        style={makeParallaxStyle(40, 20)}
      >
        <img src="/hero-images/image2.png" alt="image-1" />
      </div>
    </main>
  )
}
