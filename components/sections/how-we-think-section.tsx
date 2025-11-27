"use client"

import { motion } from "framer-motion"

export default function HowWeThinkSection() {
  const items = [
    {
      title: "Understanding the brand",
      description:
        "We dive deep into the essence, problems, and ambitions of each client.",
    },
    {
      title: "Crafting the experience",
      description:
        "The magic happens when everything starts aligning visually and emotionally.",
    },
    {
      title: "Delivering impact",
      description: "We don’t stop until it works, feels right, and creates real value.",
    },
  ]

  return (
    <section className="relative bg-white py-16 md:py-24 lg:py-28 lg:px-16">
      <div className="mx-auto w-full">
        <motion.div
          className="text-center mb-8 sm:mb-10 md:mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="inline-flex items-center rounded-full border-2 border-brand px-4 py-1 text-[10px] sm:text-xs lg:text-[12px] font-semibold uppercase tracking-wide text-brand mb-4"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <span># Our process</span>
          </motion.div>
          <motion.h2
            className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[64px] font-extrabold uppercase tracking-wide text-brand-ink"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <span>HOW </span>
            <span className="text-brand">WE THINK</span>
            <span> — NOT JUST WHAT WE MAKE</span>
          </motion.h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {items.map((item, idx) => (
            <motion.div
              key={idx}
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.45 }}
              transition={{
                duration: 0.7,
                delay: idx * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="w-full aspect-[4/3] rounded-2xl bg-neutral-300/80" />
              <h3 className="mt-6 font-display text-lg sm:text-xl md:text-2xl  uppercase font-extrabold text-brand-ink">
                {item.title}
              </h3>
              <p className="mt-2 max-w-[360px] text-sm sm:text-base text-brand-ink/70">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
