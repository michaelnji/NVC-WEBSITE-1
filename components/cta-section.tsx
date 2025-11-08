"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useLanguage } from "@/contexts/language-context"
import Image from "next/image"

gsap.registerPlugin(ScrollTrigger)

export function CTASection() {
  const { t } = useLanguage()
  const sectionRef = useRef<HTMLDivElement>(null)
  const leftColumnRef = useRef<HTMLDivElement>(null)
  const rightColumnRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      gsap.set(leftColumnRef.current, {
        z: -120,
        y: 100,
        opacity: 1,
        rotateY: -25,
        rotateX: 12,
        scale: 0.85,
        x: 0,
      })

      gsap.set(rightColumnRef.current, {
        z: -120,
        y: 100,
        opacity: 1,
        rotateY: 25,
        rotateX: 12,
        scale: 0.85,
        x: 0,
      })

      gsap.set([titleRef.current, descRef.current, buttonRef.current], {
        opacity: 0,
      })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=200%",
          scrub: 0.5,
          pin: ".pin-container",
          anticipatePin: 1,
        },
      })

      tl.to(
        leftColumnRef.current,
        {
          z: 0,
          y: 0,
          opacity: 1,
          rotateY: -15,
          rotateX: 8,
          scale: 1,
          x: 0,
          ease: "power3.out",
          duration: 2,
        },
        0,
      )

      tl.to(
        rightColumnRef.current,
        {
          z: 0,
          y: 0,
          opacity: 1,
          rotateY: 15,
          rotateX: 8,
          scale: 1,
          x: 0,
          ease: "power3.out",
          duration: 2,
        },
        0,
      )

      tl.to(
        leftColumnRef.current,
        {
          x: -500,
          rotateY: -42,
          rotateX: 10,
          y: -180,
          scale: 0.88,
          opacity: 1,
          ease: "power3.inOut",
          duration: 3,
        },
        2,
      )

      tl.to(
        rightColumnRef.current,
        {
          x: 500,
          rotateY: 42,
          rotateX: 10,
          y: -180,
          scale: 0.88,
          opacity: 1,
          ease: "power3.inOut",
          duration: 3,
        },
        2,
      )

      tl.fromTo(
        titleRef.current,
        {
          opacity: 0,
          y: 60,
          scale: 0.8,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          ease: "power3.out",
          duration: 3,
        },
        3.5,
      )

      tl.fromTo(
        descRef.current,
        {
          opacity: 0,
          y: 40,
        },
        {
          opacity: 1,
          y: 0,
          ease: "power3.out",
          duration: 2.5,
        },
        4.2,
      )

      tl.fromTo(
        buttonRef.current,
        {
          opacity: 0,
          y: 30,
          scale: 0.85,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          ease: "back.out(1.7)",
          duration: 2,
        },
        5,
      )

      tl.to({}, { duration: 1 })
    }, sectionRef)

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window
      const x = (e.clientX / innerWidth - 0.5) * 15
      const y = (e.clientY / innerHeight - 0.5) * 15

      if (leftColumnRef.current) {
        gsap.to(leftColumnRef.current, {
          rotateY: -15 + x,
          rotateX: 8 - y,
          duration: 1.5,
          ease: "power2.out",
        })
      }

      if (rightColumnRef.current) {
        gsap.to(rightColumnRef.current, {
          rotateY: 15 + x,
          rotateX: 8 - y,
          duration: 1.5,
          ease: "power2.out",
        })
      }
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      ctx.revert()
    }
  }, [])

  const leftImages = [
    {
      src: "/creative-branding-project.jpg",
      alt: "Creative Branding Project",
      title: t.cta.projects.branding.title,
      description: t.cta.projects.branding.description,
    },
    {
      src: "/modern-web-design.png",
      alt: "Modern Web Design",
      title: t.cta.projects.webDesign.title,
      description: t.cta.projects.webDesign.description,
    },
  ]

  const rightImages = [
    {
      src: "/product-photography-still-life.png",
      alt: "Product Photography",
      title: t.cta.projects.photography.title,
      description: t.cta.projects.photography.description,
    },
    {
      src: "/ui-ux-design-concept.png",
      alt: "UI/UX Design",
      title: t.cta.projects.uiux.title,
      description: t.cta.projects.uiux.description,
    },
  ]

  return (
    <section ref={sectionRef} className="relative h-[300vh]">
      <div className="absolute top-0 left-0 right-0 pt-40 pb-48 z-20">
        <div className="container mx-auto px-6 md:px-12 lg:px-16 xl:px-24 2xl:px-32">
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-6xl font-normal text-foreground text-center tracking-wider uppercase">
            {t.cta.sectionTitle}
          </h2>
        </div>
      </div>

      <div
        className="pin-container sticky top-0 w-full h-screen flex items-center justify-center pt-40"
        style={{ perspective: "2000px", transformStyle: "preserve-3d" }}
      >
        <div
          ref={leftColumnRef}
          className="absolute left-1/2 flex flex-col gap-6 -ml-[510px]"
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          {leftImages.map((img, i) => (
            <div
              key={i}
              className="w-[420px] h-[300px] rounded-2xl shadow-2xl relative group cursor-pointer overflow-hidden"
              style={{
                transform: `translateY(${i * 15}px) translateZ(${-i * 20}px)`,
                transformStyle: "preserve-3d",
                zIndex: 20 + i,
              }}
            >
              <div className="absolute inset-0 rounded-2xl overflow-hidden bg-background">
                <Image src={img.src || "/placeholder.svg"} alt={img.alt} fill className="object-cover" />
              </div>

              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#F15A25] to-[#F15A25]/90 p-8 flex flex-col justify-center transition-all duration-1000 ease-in-out diagonal-reveal">
                <h3 className="font-display text-3xl font-normal text-white mb-4 tracking-wide uppercase">{img.title}</h3>
                <p className="font-sans text-white/95 text-base leading-relaxed">{img.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div ref={textRef} className="relative z-10 text-center px-8 max-w-3xl">
          <h2
            ref={titleRef}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-6xl font-normal text-foreground mb-6 leading-tight tracking-wider uppercase"
          >
            {t.cta.title.split("\n").map((line, i) => (
              <span key={i}>
                {line}
                {i < t.cta.title.split("\n").length - 1 && <br />}
              </span>
            ))}
          </h2>
          <p ref={descRef} className="font-sans text-2xl text-foreground/70 mb-10 leading-relaxed">
            {t.cta.subtitle}
          </p>
          <button
            ref={buttonRef}
            className="font-sans px-10 py-5 bg-[#F15A25] text-white text-lg rounded-full font-semibold hover:bg-[#F15A25]/90 hover:scale-105 transition-all shadow-xl"
          >
            {t.cta.button}
          </button>
        </div>

        <div
          ref={rightColumnRef}
          className="absolute right-1/2 flex flex-col gap-6 -mr-[510px]"
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          {rightImages.map((img, i) => (
            <div
              key={i}
              className="w-[420px] h-[300px] rounded-2xl shadow-2xl relative group cursor-pointer overflow-hidden"
              style={{
                transform: `translateY(${i * 15}px) translateZ(${-i * 20}px)`,
                transformStyle: "preserve-3d",
                zIndex: 20 + i,
              }}
            >
              <div className="absolute inset-0 rounded-2xl overflow-hidden bg-background">
                <Image src={img.src || "/placeholder.svg"} alt={img.alt} fill className="object-cover" />
              </div>

              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#F15A25] to-[#F15A25]/90 p-8 flex flex-col justify-center transition-all duration-1000 ease-in-out diagonal-reveal">
                <h3 className="font-display text-3xl font-normal text-white mb-4 tracking-wide uppercase">{img.title}</h3>
                <p className="font-sans text-white/95 text-base leading-relaxed">{img.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style jsx>
        {`
          .group {
            transform-style: preserve-3d;
            perspective: 1000px;
            isolation: isolate;
            position: relative;
            z-index: 0;
          }

          .diagonal-reveal {
            clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
            transition: clip-path 1s ease-in-out;
            pointer-events: none;
          }

          .group:hover .diagonal-reveal {
            clip-path: polygon(0 0, 0 0, 100% 100%, 100% 100%);
          }
        `}
      </style>
    </section>
  )
}
