"use client"

import { useLanguage } from "@/contexts/language-context"

export default function ServicesSection() {
  const { t } = useLanguage()

  return (
    <div
      className="relative rounded-[28px] md:rounded-[40px]  md:p-10 lg:p-14 xl:p-16 -mt-8 md:-mt-12 lg:-mt-16 pt-10 pb-40 md:py-30 lg:py-32 mb-16 md:mb-24 lg:mb-28 overflow-hidden"
      style={{
        backgroundImage: `url('/background-section.png')`,
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        zIndex: 2,
      }}
    >
      {/* Header Section */}
      <div className="text-center mb-4 sm:mb-8 md:mb-12 lg:mb-14">
        <p className="font-sans text-[#f15a25] text-xs sm:text-sm mb-1 tracking-wide">{t.services.subtitle}</p>
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 leading-[1.1] max-w-xs sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto tracking-wide text-balance uppercase">
          <span className="text-[#1e1e1e]">{t.services.titlePart1} </span>
          <span className="text-[#f15a25]">{t.services.titlePart2}</span>
        </h1>
        <div className="max-w-lg md:max-w-xl mx-auto font-sans px-2 sm:px-3">
          <p className="text-[#1e1e1e] text-xs sm:text-sm">{t.services.description}</p>
          <p className="text-[#1e1e1e] text-xs sm:text-sm">
            {t.services.descriptionPrefix}{" "}
            <span className="text-[#f15a25] font-semibold">{t.services.descriptionHighlight}</span>
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-8 justify-items-stretch px-4 sm:px-4 md:px-8">
        {t.services.items.map((service, index) => (
          <div
            key={index}
            className="bg-[#EDEDED] rounded-[18px] overflow-hidden flex flex-col w-full  shadow-sm"
          >
            {/* Text section */}
            <div className="pl-5 py-5 sm:pl-7 sm:pt-7 flex-shrink-0">
              <h2 className="text-sm sm:text-base md:text-lg mb-1.5 font-sans font-bold text-[#1e1e1e] leading-tight tracking-wide">
                {service.title}
              </h2>
              <p className="font-sans text-[#404040] text-xs sm:text-sm leading-relaxed">
                {service.description}
              </p>
            </div>

            {/* Image section: always sticks to the bottom and fills width/height */}
            <div className="w-full mt-auto">
              <div className={`relative w-full overflow-hidden ${service.isLight ? "bg-[#f5f5f5]" : "bg-black"}`}>
                <div className="w-full h-[180px] sm:h-[220px] lg:h-[260px]">
                  <img
                    src={service.image || "/placeholder.svg"}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
