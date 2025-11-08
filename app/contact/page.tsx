import PendingSection from "@/components/pending-section"

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-32">
      <PendingSection
        title="Contact"
        subtitle="Cette page est en préparation. Revenez bientôt pour nous écrire."
        actionLabel="Retour à l’accueil"
        actionHref="/"
      />
    </div>
  )
}
