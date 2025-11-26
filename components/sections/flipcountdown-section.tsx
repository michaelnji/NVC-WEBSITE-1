"use client"

import { CTAButton } from "@/components/cta-button";
import { FlipCountdown } from "@/components/flip-count-down";
import ImageWithSkeleton from "@/components/image-with-skeleton"
import { useLanguage } from "@/contexts/language-context";
import { useState, type MouseEvent } from "react";

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
        backgroundColor: "var(--brand-ink-strong)",
        backgroundImage: "url('/background%20temoignages.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      onMouseMove={handleMouseMove}
    >
      <div className="relative z-10 w-full max-w-6xl text-center py-12 px-4 sm:py-16 sm:px-8 md:py-20 md:px-10 bg-white rounded-3xl">
        <h1 className="font-display uppercase text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-7xl  font-bold leading-[1.1] text-balance tracking-wide mb-3 sm:mb-4 md:mb-5 lg:mb-2">
          <span className="text-brand-ink-strong">
            {t.common.comingSoon.title1}
          </span>
          <span className="text-brand">{t.common.comingSoon.title2}</span>
        </h1>
        <p className="subtext text-normal text-brand-ink font-sans text-[10px] sm:text-lg md:text-xl mb-8 sm:mb-10 md:mb-12 px-4">
          <span>{t.common.comingSoon.subtitle1}</span>
          <span className="text-brand">{t.common.comingSoon.subtitle2}</span>
          <span>{t.common.comingSoon.subtitle3}</span>
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
        className="absolute bottom-4 left-[-12%] sm:bottom-[18%] sm:-left-[6%] lg:bottom-[20%] lg:-left-[5%] w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-50 lg:h-50 -rotate-[8.38deg] flex items-center justify-center pointer-events-none z-20"
        style={makeParallaxStyle(-40, 30)}
      >
        <ImageWithSkeleton
          src="/hero-images/image1.png"
          alt="image-1"
          wrapperClassName="w-full h-full"
        />
      </div>

      <div
        className="absolute bottom-6 right-[-14%] sm:bottom-[26%] sm:-right-[6%] lg:bottom-[30%] lg:-right-[6%] w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-50 lg:h-50 -rotate-[8.38deg] flex items-center justify-center pointer-events-none z-20"
        style={makeParallaxStyle(50, -40)}
      >
        <ImageWithSkeleton
          src="/hero-images/image4.png"
          alt="image-1"
          wrapperClassName="w-full h-full"
        />
      </div>

      <div
        className="absolute bottom-10 right-[-10%] sm:bottom-[20%] sm:-right-[6%] lg:bottom-[20%] lg:-right-[6%] w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-50 lg:h-50 rotate-[20.71deg] flex items-center justify-center pointer-events-none z-20"
        style={makeParallaxStyle(30, 35)}
      >
        <ImageWithSkeleton
          src="/hero-images/image6.png"
          alt="image-2"
          wrapperClassName="w-full h-full"
        />
      </div>

      <div
        className="absolute -bottom-[6%] right-[40%] sm:-bottom-[10%] sm:right-[50%] w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-50 lg:h-50 -rotate-[20.87deg] flex items-center justify-center pointer-events-none z-10"
        style={makeParallaxStyle(-25, -20)}
      >
        <ImageWithSkeleton
          src="/hero-images/image2.png"
          alt="image-2"
          wrapperClassName="w-full h-full"
        />
      </div>

      <div
        className="absolute -bottom-[10%] right-[28%] sm:-bottom-[15%] sm:right-[42%] w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-50 lg:h-50 rotate-[9.13deg] flex items-center justify-center pointer-events-none z-10"
        style={makeParallaxStyle(20, -15)}
      >
        <ImageWithSkeleton
          src="/hero-images/image3.png"
          alt="image-2"
          wrapperClassName="w-full h-full"
        />
      </div>

      <div
        className="absolute -top-8 -left-10 sm:-top-16 sm:-left-16 lg:-top-20 lg:-left-20 w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-50 lg:h-50 rotate-26 flex items-center justify-center pointer-events-none z-20"
        style={makeParallaxStyle(-35, -30)}
      >
        <ImageWithSkeleton
          src="/hero-images/image6.png"
          alt="image-1"
          wrapperClassName="w-full h-full"
        />
      </div>

      <div
        className="absolute -top-[4%] left-[4%] sm:-top-[7%] sm:left-[2%] w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-50 lg:h-50 rotate-11 flex items-center justify-center pointer-events-none z-20"
        style={makeParallaxStyle(-20, 25)}
      >
        <ImageWithSkeleton
          src="/hero-images/image5.png"
          alt="image-1"
          wrapperClassName="w-full h-full"
        />
      </div>

      <div
        className="absolute -top-[4%] right-[-4%] sm:-top-[7%] sm:right-0 w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-50 lg:h-50 -rotate-20 flex items-center justify-center pointer-events-none z-20"
        style={makeParallaxStyle(40, 20)}
      >
        <ImageWithSkeleton
          src="/hero-images/image2.png"
          alt="image-1"
          wrapperClassName="w-full h-full"
        />
      </div>
    </main>
  );
}
