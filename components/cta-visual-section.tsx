"use client"

import { motion, useAnimation, useInView } from "framer-motion"
import { useEffect, useRef } from "react"
import { WhatsAppButton } from "@/components/cta-buttons"
import { AngledPanel } from "@/components/angled-panel"
import { useLanguage } from "@/contexts/language-context"

export default function CtaVisualSection() {
  const controls = useAnimation()
  const { t } = useLanguage()
  const sectionRef = useRef<HTMLElement | null>(null)
  const isInView = useInView(sectionRef, { amount: 0.3 })

  // Animation de l'overlay au scroll (entrée/sortie du viewport), plus rapide
  useEffect(() => {
    if (isInView) {
      controls.start({ opacity: 0.7, transition: { duration: 3, ease: "easeOut" } })
    } else {
      controls.start({ opacity: 1, transition: { duration: 0.8, ease: "easeOut" } })
    }
  }, [isInView, controls])

  return (
    <main
      ref={sectionRef}
      className="relative z-20 -mt-10 w-full h-full flex items-center justify-center"
    >
      <div className="relative w-full">
        <AngledPanel
          color="transparent"
          className="w-full h-[740px] flex items-center justify-center"
        >
          {/* GIF en arrière-plan */}
          <img
            src="/video-cta.gif"
            alt="projet animation"
            className="absolute inset-0 w-full h-full object-cover z-0"
          />

          {/* Couche de couleur découpée par AngledPanel, animée à l'opacité au scroll */}
          <motion.div
            className="absolute inset-0 z-10"
            style={{ backgroundColor: "#F15A25" }}
            animate={controls}
          />

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-3 sm:px-5 md:px-6 text-center z-20">
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.1}}
              className="font-display text-white font-extrabold tracking-wide leading-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl uppercase mb-4 sm:mb-5 md:mb-6 lg:mb-7 xl:mb-8"
              style={{ fontFamily: 'Bigger, sans-serif' }}
            >
              {t.cta_visual.title1}
              <br />
              <span className="text-[#F9C22E]">{t.cta_visual.title2}</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-2 sm:mt-3 md:mt-4 lg:mt-[8px] text-white/90 text-sm sm:text-base md:text-lg lg:text-xl max-w-xl sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto leading-relaxed"
            >
              {t.cta_visual.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-4 sm:mt-5 md:mt-6 lg:mt-8"
            >
              <WhatsAppButton
                href="https://wa.me/237650749592?text=Hello%20New%20Vision%20Creatives%2C%20I%27d%20love%20to%20book%20an%20intro%20call%20to%20craft%20my%20next%20visual%20story."
                className="pointer-events-auto w-auto h-auto text-xs sm:text-sm md:text-base lg:text-lg px-4 sm:px-6 md:px-8 lg:px-10 py-2 sm:py-3 md:py-3.5 lg:py-4"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                <span>{t.cta_visual.button}</span>
              </WhatsAppButton>

            </motion.div>
          </div>
        </AngledPanel>
      </div>
    </main>
  )
}