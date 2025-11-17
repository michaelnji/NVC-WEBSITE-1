"use client"

import { motion, useAnimation, useInView } from "framer-motion"
import { useEffect, useRef } from "react"
import { WhatsAppButton } from "@/components/cta-buttons"

export default function CtaVisualSection() {
  const controls = useAnimation()
  const sectionRef = useRef<HTMLElement | null>(null)
  const isInView = useInView(sectionRef, { amount: 0.3 })

  useEffect(() => {
    if (isInView) {
      controls.start({ opacity: 0.7, transition: { duration: 5, ease: "easeOut" } })
    } else {
      controls.stop()
      controls.set({ opacity: 1 })
    }
  }, [isInView, controls])

  return (
    <section
      ref={sectionRef}
      className="relative z-40 -mt-12 md:-mt-16 lg:-mt-20 xl:-mt-24 2xl:-mt-28 py-32 md:py-40 lg:py-48 px-6 md:px-12 lg:px-16 xl:px-24 -mb-10 lg:mb-0 2xl:px-32 overflow-hidden lg:min-h-[75vh] xl:min-h-[85vh]"
      style={{
        backgroundImage: "url('/background custom section.png')",
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none z-0">
        <img
          src="/video-cta.gif"
          alt="cta animation"
          className="absolute inset-0 w-full h-full object-cover z-0"
          style={{
            WebkitMaskImage: "url('/background custom section.png')",
            maskImage: "url('/background custom section.png')",
            WebkitMaskSize: "cover",
            maskSize: "cover",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            maskPosition: "center",
          }}
        />
        <motion.img
          src="/background custom section.png"
          alt="cta background"
          className="absolute inset-0 w-full h-full object-cover z-10"
          initial={{ opacity: 1 }}
          animate={controls}
        />
      </div>

      <div className="relative max-w-7xl mx-auto text-center z-20">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="font-display text-white font-extrabold tracking-wide leading-tight text-5xl sm:text-6xl md:text-7xl lg:text-8xl uppercase mb-4 sm:mb-5 md:mb-6 lg:mb-7"
          style={{ fontFamily: 'Bigger, sans-serif' }}
        >
          READY TO TELL YOUR NEXT
          <br />
          <span className="text-[#F9C22E]">VISUAL STORY?</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-4 sm:mt-5 md:mt-6 lg:mt-7 text-white/90 text-base md:text-lg lg:text-xl max-w-4xl mx-auto leading-relaxed"
        >
          Have an idea, a product, or just a spark of ambition? Let's talk.
          <span className="opacity-80"> (We promise we won't bite — unless you say, "Can you make me a quick logo?")</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 md:mt-12"
        >
          <WhatsAppButton
            href="https://wa.me/237650749592?text=Hello%20New%20Vision%20Creatives%2C%20I%27d%20love%20to%20book%20an%20intro%20call%20to%20craft%20my%20next%20visual%20story."
            className="w-auto h-auto px-8 py-4"
          >
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            <span>Book Your Intro Call</span>
          </WhatsAppButton>
        </motion.div>
      </div>
    </section>
  )
}
