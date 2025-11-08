import localFont from "next/font/local"

export const bigger = localFont({
  variable: "--font-display",
  display: "swap",
  preload: true,
  src: [
    { path: "../public/fonts/bigger/BiggerDisplay.otf", weight: "900", style: "normal" },
  ],
})