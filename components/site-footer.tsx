"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"

export default function SiteFooter() {
  const { t } = useLanguage()

  const socialLinks: Record<string, string> = {
    linkedin: "https://www.linkedin.com/company/new-vision-creatives/life?lipi=urn%3Ali%3Apage%3Acompanies_company_life_index%3B6e2d4f8f-c1d7-4d5a-9d0e-4b615e16fa41",
    instagram: "https://www.instagram.com/newvisioncreatives/",
    tiktok: "https://www.tiktok.com/@nvc.yde/",
    facebook:
      "https://www.bing.com/ck/a?!&&p=b2f36752b2a36ed059d753e9aec0a32c488d85183924f44f68420739c3473b8fJmltdHM9MTc2MzI1MTIwMA&ptn=3&ver=2&hsh=4&fclid=3233c4ab-3f92-65a3-2a13-d2893e8e6498&psq=new+vision+creatives++yaounde+facebook&u=a1aHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL3Byb2ZpbGUucGhwLz9pZD02MTU4MTI3Mjc1NDkyNA",
  }

  return (
    <footer
      className="w-full font-sans overflow-hidden -mt-8 md:-mt-10 lg:-mt-16 xl:-mt-20 2xl:-mt-24 pt-6 md:pt-8 lg:pt-10"
      style={{ backgroundColor: "#FCDBCF" }}
    >
      <div className="w-full px-4 md:px-8 lg:px-12 xl:px-16 py-12 md:py-16 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 lg:gap-20 place-items-center lg:place-items-start">
          <div className="flex flex-col gap-5 items-center lg:items-start">
            <FooterLogo />
            <p className="text-[#1e1e1e] text-sm md:text-base font-medium text-center lg:text-left">{t.footer.tagline}</p>
          </div>
          <div className="flex flex-col gap-3 items-center lg:items-start">
            <h4 className="text-[#1e1e1e] text-base md:text-lg font-semibold text-center lg:text-left">{t.footer.expertise.title}</h4>
            <nav className="flex flex-col gap-2 text-[#1e1e1e] text-sm md:text-base text-center lg:text-left">
              {t.footer.expertise.items.map((label, i) => (
                <Link
                  key={`expertise-${i}`}
                  href="/projets"
                  className="group inline-block relative transition-colors duration-200 hover:text-[#F15A25]"
                >
                  <span className="relative">{label}
                    <span className="absolute left-0 -bottom-0.5 h-[2px] w-full bg-[#F15A25] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  </span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex flex-col gap-3 items-center lg:items-start">
            <h4 className="text-[#1e1e1e] text-base md:text-lg font-semibold text-center lg:text-left">{t.footer.about.title}</h4>
            <nav className="flex flex-col gap-2 text-[#1e1e1e] text-sm md:text-base text-center lg:text-left">
              {t.footer.about.items.map((label, i) => {
                const normalized = label.toLowerCase()
                const href = normalized.includes("portfolio")
                  ? "/portfolio"
                  : normalized.includes("contact") || normalized.includes("agency") || normalized.includes("agence")
                  ? "/contact"
                  : "#"

                return (
                  <Link
                    key={`about-${i}`}
                    href={href}
                    className="group inline-block relative transition-colors duration-200 hover:text-[#F15A25]"
                  >
                    <span className="relative">{label}
                      <span className="absolute left-0 -bottom-0.5 h-[2px] w-full bg-[#F15A25] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                    </span>
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="flex flex-col gap-3 items-center lg:items-start">
            <h4 className="text-[#1e1e1e] text-base md:text-lg font-semibold text-center lg:text-left">{t.footer.social.title}</h4>
            <nav className="flex flex-col gap-2 text-[#1e1e1e] text-sm md:text-base text-center lg:text-left">
              {t.footer.social.items.map((label, i) => (
                <Link
                  key={`social-${i}`}
                  href={socialLinks[label.toLowerCase() as keyof typeof socialLinks] ?? "#"}
                  className="group inline-block relative transition-colors duration-200 hover:text-[#F15A25]"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                >
                  <span className="relative">{label}
                    <span className="absolute left-0 -bottom-0.5 h-[2px] w-full bg-[#F15A25] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  </span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
      <div className="w-full select-none">
        <div>
          <div className="relative group w-full flex justify-center overflow-hidden -mb-2 sm:-mb-6 lg:-mb-6 pt-10">
            <div className="relative block w-full select-none">
              <h2
                className="w-full text-center font-extrabold uppercase leading-[0.88] tracking-wide"
                style={{
                  fontFamily: 'Bigger, var(--font-montserrat), sans-serif',
                  fontSize: 'clamp(3.25rem, 8vw + 0.5rem, 9rem)',
                  color: '#0f0f0f',
                  marginBottom: '-0.5rem',
                }}
              >
                {t.footer.bottomTitle}
              </h2>

              <motion.div
                className="absolute inset-0 overflow-hidden"
                initial={{ width: 0 }}
                whileHover={{ width: '100%' }}
                transition={{ duration: 0.9, ease: 'easeInOut' }}
              >
                <h2
                  className="w-full text-center font-extrabold uppercase leading-[0.88] tracking-wide text-primary"
                  style={{
                    fontFamily: 'Bigger, var(--font-montserrat), sans-serif',
                    fontSize: 'clamp(3.25rem, 8vw + 0.5rem, 9rem)',
                    marginBottom: '-0.5rem',
                  }}
                >
                  {t.footer.bottomTitle}
                </h2>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterLogo() {
  return (
    <div className="relative w-[220px] md:w-[260px] overflow-hidden">
      <img src="/Wordmark.svg" alt="New Vision Creatives" className="relative w-full h-auto" />
    </div>
  )
}
