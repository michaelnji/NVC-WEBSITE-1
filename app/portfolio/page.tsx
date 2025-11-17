import type { Metadata } from "next"
import { FlipCountdownSection } from "@/components/flipcountdown-section"

export const metadata: Metadata = {
  title: "Portfolio – New Vision Creatives",
  description:
    "Découvrez une sélection de projets photo, vidéo, design et campagnes créatives signés New Vision Creatives. Notre portfolio arrive très bientôt.",
}

export default function PortfolioPage() {
  return (
    <main
      className="min-h-screen flex items-center justify-center px-4 py-8"
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
