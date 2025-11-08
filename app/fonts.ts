import localFont from "next/font/local"

export const bigger = localFont({
  variable: "--font-display",
  display: "swap",
  preload: true,
  src: [
    { path: "../public/fonts/bigger/BiggerDisplay.otf", weight: "900", style: "normal" },
    { path: "../public/fonts/bigger/Bigger-italic.ttf", weight: "900", style: "italic" },
    { path: "../public/fonts/bigger/BiggerBook.ttf", weight: "400", style: "normal" },
    { path: "../public/fonts/bigger/BiggerBook-italic.ttf", weight: "400", style: "italic" },
  ],
})