import type React from "react"
import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import "./globals.css"
import { ClientLayout } from "./client-layout"
import { AnimatedBackground } from "@/components/animated-background"
import { bigger } from "./fonts" // Importez votre police Bigger

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
})

// Supprimez ou renommez Bebas Neue si vous ne l'utilisez pas
// const bebasNeue = Bebas_Neue({
//   subsets: ["latin"],
//   weight: ["400"],
//   variable: "--font-bebas", // Changez le nom de la variable si vous la gardez
// })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className="dark scroll-smooth">
      <body
        className={`${montserrat.variable} ${bigger.variable} font-sans antialiased bg-background text-foreground`}
      >
        {/* Background image - fixed */}
        <AnimatedBackground />
        {/* Structured Data: Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'New Vision Creatives',
              url: 'https://newvcreatives.com',
              logo: 'https://newvcreatives.com/favicon.png',
              sameAs: [
                'https://www.linkedin.com',
                'https://www.instagram.com',
                'https://twitter.com',
                'https://facebook.com',
              ],
            }),
          }}
        />
        {/* Structured Data: WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'New Vision Creatives',
              url: 'https://newvcreatives.com',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://newvcreatives.com/search?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL('https://newvcreatives.com'),
  title: {
    default: 'New Vision Creatives',
    template: '%s | New Vision Creatives',
  },
  description:
    "Agence créative spécialisée en contenus visuels qui suscitent des émotions et qui marquent. Production photo/vidéo, social content, branding.",
  openGraph: {
    type: 'website',
    url: 'https://newvcreatives.com',
    siteName: 'New Vision Creatives',
    title: 'New Vision Creatives',
    description:
      "Agence créative spécialisée en contenus visuels qui suscitent des émotions et qui marquent.",
    images: [
      {
        url: '/favicon.png',
        width: 1200,
        height: 630,
        alt: 'New Vision Creatives',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'New Vision Creatives',
    description:
      "Agence créative spécialisée en contenus visuels qui suscitent des émotions et qui marquent.",
    images: ['/favicon.png'],
  },
  alternates: {
    canonical: '/',
    languages: {
      fr: '/fr',
      en: '/en',
    },
  },
  icons: {
    icon: [{ url: '/favicon.png', type: 'image/png', sizes: '32x32' }],
    apple: [{ url: '/favicon.png', type: 'image/png', sizes: '180x180' }],
    shortcut: [{ url: '/favicon.png', type: 'image/png' }],
  },
}