"use client"

import { FlipCountdownSection } from "@/components/flipcountdown-section"

export default function ProjetsPage() {
  return (
  <main className="min-h-screen flex items-center justify-center  px-4 py-8"
     style={{
        backgroundColor: "#0f0f0f",
        backgroundImage: "url('/background%20temoignages.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <FlipCountdownSection />
    </main>
  )
}
