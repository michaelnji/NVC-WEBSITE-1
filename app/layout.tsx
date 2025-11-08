import type React from "react"
import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import "./globals.css"
import { ClientLayout } from "./client-layout"
import { AnimatedBackground } from "@/components/animated-background"
import { bigger } from "./fonts" 

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
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  title: "New Vision Creatives",
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [
      { url: "/favicon.png", type: "image/png", sizes: "180x180" },
    ],
    shortcut: [
      { url: "/favicon.png", type: "image/png" },
    ],
  },
}