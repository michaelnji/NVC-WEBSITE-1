"use client"

import { motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useLanguage } from "@/contexts/language-context"
import { ArrowUpRight } from "lucide-react"
import { WhatsAppButton, SecondaryCTAButton } from "@/components/cta-buttons"
import ImageWithSkeleton from "@/components/image-with-skeleton"

gsap.registerPlugin(ScrollTrigger)

export function HeroSection() {
  const { t } = useLanguage()
  const heroContentRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const buttonsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const hasPlayedEntrance = sessionStorage.getItem("hero-entrance-played")
    const isFirstLoad =
      !window.performance.getEntriesByType("navigation")[0] ||
      (window.performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming).type === "navigate"

    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const play = () => {
      const ctx = gsap.context(() => {
        if (prefersReduced) {
          gsap.set([heroContentRef.current, headingRef.current, subtitleRef.current, buttonsRef.current], { autoAlpha: 1, y: 0 })
          return
        }
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
        tl.from(heroContentRef.current, { y: '8vh', autoAlpha: 0, duration: 0.9 })
          .from(headingRef.current, { y: 40, skewY: 2, autoAlpha: 0, duration: 0.8 }, '-=0.3')
          .to(headingRef.current, { skewY: 0, duration: 0.4 }, '<')
          .from(subtitleRef.current, { y: 24, autoAlpha: 0, duration: 0.6 }, '-=0.2')
          .from(buttonsRef.current, { y: 16, autoAlpha: 0, duration: 0.5 }, '-=0.15')
          .add(() => {
            // Safety: ensure all are visible at the end
            gsap.set([headingRef.current, subtitleRef.current, buttonsRef.current], { autoAlpha: 1 })
          })
      })
      sessionStorage.setItem("hero-entrance-played", "true")
      return () => ctx.revert()
    }

    if (!hasPlayedEntrance && isFirstLoad) {
      let cleaned = false
      const cleanupFns: Array<() => void> = []
      const start = () => { if (!cleaned) cleanupFns.push(play() || (() => {})) }
      const fontReady = (document as any).fonts?.ready as Promise<any> | undefined
      const t = window.setTimeout(start, 800)
      // Safety fallback in case timeline doesn’t run for any reason
      const safety = window.setTimeout(() => {
        gsap.set([heroContentRef.current, headingRef.current, subtitleRef.current, buttonsRef.current], { autoAlpha: 1, y: 0 })
      }, 1600)
      if (fontReady) fontReady.then(start)
      return () => { cleaned = true; window.clearTimeout(t); window.clearTimeout(safety); cleanupFns.forEach(fn => fn()) }
    }
  }, [])

  return (
    <div className="relative min-h-screen flex flex-col items-start overflow-hidden  px-6 md:px-12 lg:px-16 xl:px-24 2xl:px-32 3xl:px-40 pb-20 max-w-full ">
      <div className="relative w-full max-w-full min-h-screen overflow-hidden">
        {/* Hero content */}
        <div
          ref={heroContentRef}
          className="relative z-10 w-full max-w-full min-h-screen flex flex-col lg:flex-row pt-20 overflow-hidden"
        >
          <div className="font-500 w-full lg:w-7/10 2xl:w-6/10 flex items-center justify-center lg:justify-start  pt-10 lg:pt-0">
            <div className="text-center lg:text-left max-w-full">
              <h1 ref={headingRef} className="font-display text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-bold leading-[1.1] text-balance tracking-wide">
                <span className="text-foreground">{t.hero.title}</span>
                <br />
                <span className="text-white">{t.hero.line2} </span>
                <span className="text-[#F15A25]">{t.hero.line3Emotions}</span>
                <br />
                <span className="text-[#F15A25]">{t.hero.line3ThatStick}</span>
              </h1>
              <p ref={subtitleRef} className="font-sans  tracking-tight text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-foreground/80 max-w-xl lg:max-w-2xl xl:max-w-3xl 2xl:max-w-4xl lg:mx-0 text-balance leading-relaxed">
                {t.hero.subtitle}
              </p>

              <div ref={buttonsRef} className="mt-6 md:mt-8 lg:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center md:items-center md:justify-center lg:items-start lg:justify-start pt-2">
                <WhatsAppButton href="https://wa.me/YOUR_PHONE_NUMBER">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  <span className="text-base sm:text-lg">{t.hero.cta}</span>
                </WhatsAppButton>

                <SecondaryCTAButton>
                  <span className="text-base sm:text-lg">{t.hero.ctaSecondary}</span>
                  <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                </SecondaryCTAButton>
              </div>
            </div>
          </div>
          <ScrollingGallery />
        </div>
      </div>

      <div className="hidden lg:block relative z-40 w-full" />
    </div>
  )
}

function ScrollingGallery() {
  const galleryRef = useRef<HTMLDivElement>(null)
  const [images, setImages] = useState<Array<{ src: string; height: number }>>([])
  const [isFetching, setIsFetching] = useState(true)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(galleryRef.current, {
        x: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.5,
      })

      gsap.to(galleryRef.current, {
        y: -30,
        ease: "none",
        scrollTrigger: {
          trigger: galleryRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      })
    })

    return () => ctx.revert()
  }, [])

  // Fetch images managed by admin HeroManager API
  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch("/api/hero-images", { cache: "no-store" })
        if (!res.ok) throw new Error("Failed to fetch hero images")
        const data = await res.json()
        const mapped: Array<{ src: string; height: number }> = Array.isArray(data)
          ? data.map((it: any) => ({ src: it.image_url || "/placeholder.svg", height: 300 }))
          : []
        if (mounted) setImages(mapped)
      } catch (_e) {
        if (mounted) setImages([])
      } finally {
        if (mounted) setIsFetching(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  const placeholders: Array<{ src: string; height: number }> = [
    { src: "/hero-images/image1.png", height: 300 },
    { src: "/hero-images/image2.png", height: 300 },
    { src: "/hero-images/image3.png", height: 300 },
    { src: "/hero-images/image4.png", height: 300 },
    { src: "/hero-images/image5.png", height: 300 },
    { src: "/hero-images/image6.png", height: 300 },
  ]

  const MAX_TILES = 8
  const real = images.slice(0, MAX_TILES)
  const tiles: Array<{ src: string; height: number }> = [...real]
  while (tiles.length < MAX_TILES) {
    tiles.push({ src: "/placeholder.svg", height: 300 })
  }
  const col1 = tiles.filter((_, i) => i % 2 === 0)
  const col2 = tiles.filter((_, i) => i % 2 === 1)

  const allImages = [...col1.slice(0, 3), ...col2.slice(0, 3)]
  return (
    <>
      {/* Desktop only (>=1024) - Vertical scrolling columns */}
      <div
        ref={galleryRef}
        className="hidden lg:flex w-full lg:w-5/12 gap-3 xl:gap-5 2xl:gap-6 lg:absolute lg:-top-32 lg:right-4 xl:right-8 2xl:right-16 3xl:right-24 bottom-0 overflow-hidden lg:pr-4 will-change-transform max-w-full"
      >
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />

        {/* Column 1 - scrolls down */}
        <div className="flex-1 relative min-w-0 group hover:z-20 transition-all duration-300">
          <motion.div
            className="flex flex-col gap-3 xl:gap-5"
            animate={{
              y: ["0%", "-50%"],
            }}
            transition={{
              duration: 90,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            {[
              ...col1,
              ...col1,
              ...col1,
            ].map((img, i) => (
              <div
                key={i}
                className="relative rounded-2xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-white/[0.02] to-black/20 border border-white/[0.03] w-full before:absolute before:inset-0 before:bg-black/40 before:z-10 before:transition-opacity before:duration-300 before:rounded-inherit group-hover:before:opacity-0 group-hover:bg-gradient-to-br group-hover:from-white/20 group-hover:to-white/15 group-hover:border-white/30 group-hover:shadow-[0_25px_70px_rgba(0,0,0,0.6)] transition-all duration-300 transform-gpu will-change-[transform,opacity] [backface-visibility:hidden] [clip-path:inset(0_round_1rem)]"
                style={{
                  height: `${img.height}px`,
                }}
              >
                <ImageWithSkeleton
                  src={img.src || "/placeholder.svg"}
                  alt="Project showcase"
                  wrapperClassName="w-full h-full"
                  className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity duration-300 rounded-inherit [backface-visibility:hidden] will-change-[opacity,transform]"
                />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Column 2 - scrolls up */}
        <div className="flex-1 relative min-w-0 group hover:z-20 transition-all duration-300">
          <motion.div
            className="flex flex-col gap-3 xl:gap-5"
            animate={{
              y: ["-50%", "0%"],
            }}
            transition={{
              duration: 90,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            {[
              ...col2,
              ...col2,
              ...col2,
            ].map((img, i) => (
              <div
                key={i}
                className="relative rounded-2xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-white/[0.02] to-black/20 border border-white/[0.03] w-full before:absolute before:inset-0 before:bg-black/40 before:z-10 before:transition-opacity before:duration-300 before:rounded-inherit group-hover:before:opacity-0 group-hover:bg-gradient-to-br group-hover:from-white/20 group-hover:to-white/15 group-hover:border-white/30 group-hover:shadow-[0_25px_70px_rgba(0,0,0,0.6)] transition-all duration-300 transform-gpu will-change-[transform,opacity] [backface-visibility:hidden] [clip-path:inset(0_round_1rem)]"
                style={{
                  height: `${img.height}px`,
                }}
              >
                <ImageWithSkeleton
                  src={img.src || "/placeholder.svg"}
                  alt="Project showcase"
                  wrapperClassName="w-full h-full"
                  className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity duration-300 rounded-inherit [backface-visibility:hidden] will-change-[opacity,transform]"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Mobile & Tablet (<1024) - Two horizontal carousels with opposite scroll */}
      <div className="lg:hidden w-full mt-8 flex flex-col gap-4">
        <MobileCarousel images={col1} direction="left" />
        <MobileCarousel images={col2} direction="right" />
      </div>
    </>
  )
}

function MobileCarousel({
  images,
  direction = "left",
}: {
  images: Array<{ src: string; height: number }>
  direction?: "left" | "right"
}) {
  const carouselRef = useRef<HTMLDivElement>(null)
  const extendedImages = [...images, ...images, ...images, ...images, ...images, ...images]

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(carouselRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.6,
      })
    })

    return () => ctx.revert()
  }, [])

  const mobileWidth = 140
  const mobileHeight = 180

  return (
    <div
      ref={carouselRef}
      className="w-full overflow-hidden relative max-w-full"
      style={{ height: `${mobileHeight}px` }}
    >
      <div className="absolute top-0 left-0 bottom-0 w-12 sm:w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 right-0 bottom-0 w-12 sm:w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      <motion.div
        className="flex items-center h-full"
        animate={{
          x: direction === "left" ? [0, -((mobileWidth + 12) * 3)] : [-((mobileWidth + 12) * 3), 0],
        }}
        transition={{
          duration: 45,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      >
        {extendedImages.map((img, i) => (
          <div
            key={i}
            className="relative rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 mr-3 before:absolute before:inset-0 before:bg-black/20 before:pointer-events-none"
            style={{
              width: `${mobileWidth}px`,
              height: `${mobileHeight}px`,
            }}
          >
            <ImageWithSkeleton
              src={img.src || "/placeholder.svg"}
              alt="Project showcase"
              wrapperClassName="w-full h-full"
              className="w-full h-full object-cover"
              priority={i === 0}
                  sizes="(max-width: 1024px) 100vw, 42vw"
            />
          </div>
        ))}
      </motion.div>
    </div>
  )
}
