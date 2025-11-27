"use client"

import Image from "next/image"

const PARTNER_LOGOS = [
  { name: "Samsung Pay", src: "/partenaire/SamsungPay.png" },
  { name: "Klarna", src: "/partenaire/Klarna.png" },
  { name: "Western Union", src: "/partenaire/westernunion.png" },
  { name: "Amazon Pay", src: "/partenaire/Paypal.png" },
  { name: "Stripe", src: "/partenaire/Stripe.png" },
  { name: "Google Pay", src: "/partenaire/GooglePay.png" },
  { name: "MoneyGram", src: "/partenaire/MoneyGram.png" },
  { name: "Visa & Mastercard", src: "/partenaire/Visa&mastercard.png" },
]

export function PartnersSection() {
  return (
    <section
      className="relative bg-brand-cream"
      style={{
        backgroundImage: "url('/Calque_1.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className=" py-16 lg:py-24">
        <div className="text-center mb-10 sm:mb-12 md:mb-14">
          <div className="inline-flex items-center rounded-full border-2 border-brand px-4 py-1 text-xs sm:text-sm lg:text-[12px] font-semibold uppercase tracking-wide text-brand mb-4">
            <span> # Partenaires</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-[64px] font-extrabold uppercase tracking-wide text-brand-ink">
            BRANDS WHO <span className="text-brand">TRUSTED US</span>
          </h2>
        </div>
        <div className="relative mt-8 sm:mt-10 overflow-hidden">
          <div className="partners-marquee">
            {[...PARTNER_LOGOS, ...PARTNER_LOGOS].map((logo, index) => (
              <div
                key={`${logo.name}-${index}`}
                className="flex items-center justify-center w-32 sm:w-40 md:w-48 lg:w-[185.946px] lg:h-[74.378px]"
              >
                <Image
                  src={logo.src}
                  alt={logo.name}
                  width={186}
                  height={74}
                  className="w-full h-auto object-contain filter grayscale hover:grayscale-0 transition duration-300 ease-out"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
