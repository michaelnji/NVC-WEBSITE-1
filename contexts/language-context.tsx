"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type Language = "Fr" | "En"

interface Translations {
  nav: {
    home: string
    projects: string
    about: string
    contact: string
    cta: string
  }
  hero: {
    title: string
    line2: string
    line3Emotions: string
    line3ThatStick: string
    subtitle: string
    cta: string
    ctaSecondary: string
  }
  teamIntro: {
    badge: string
    titlePart1: string
    titleEmphasis: string
    titlePart2: string
    descriptionPart1: string
    descriptionEmphasis: string
    button: string
  }
  services: {
    subtitle: string
    titlePart1: string
    titlePart2: string
    description: string
    descriptionPrefix: string
    descriptionHighlight: string
    items: Array<{
      title: string
      description: string
      image: string
      isLight?: boolean
    }>
  }
  projectsIntro: {
    titlePart1: string
    titleHighlight: string
    titlePart2: string
    descriptionPart1: string
    descriptionHighlight: string
    all: string
    categories: string[]
  }
  cta: {
    sectionTitle: string
    title: string
    subtitle: string
    button: string
    projects: {
      branding: { title: string; description: string }
      webDesign: { title: string; description: string }
      photography: { title: string; description: string }
      uiux: { title: string; description: string }
    }
  }
  testimonials: {
    headingLine1: string
    headingLine2: string
    items: Array<{
      title: string
      text: string
      name: string
      role: string
      rating: number
    }>
  }
  footer: {
    tagline: string
    expertise: { title: string; items: string[] }
    about: { title: string; items: string[] }
    social: { title: string; items: string[] }
    bottomTitle: string
  }
  common: {
    buttons: {
      discoverTeams: string
      ourPortfolio: string
    }
    countdown: {
      days: string
      hours: string
      minutes: string
    }
  }
}

const translations: Record<Language, Translations> = {
  Fr: {
    nav: {
      home: "Accueil",
      projects: "Projets",
      about: "À propos",
      contact: "Contact",
      cta: "Démarrer un projet",
    },
    footer: {
      tagline: "Nous créons des émotions qui restent",
      expertise: {
        title: "Expertise",
        items: [
          "Brand & Design graphique",
          "Webdesign",
          "Product design",
          "Motion Design",
          "Communication & Strategic Marketing",
          "Photographie & Videographie",
        ],
      },
      about: {
        title: "À propos",
        items: [
          "Notre portfolio",
          "L’agence",
          "Contactez nous",
          "Rejoignez notre équipe",
        ],
      },
      social: {
        title: "Social",
        items: ["LinkedIn", "Instagram", "Tiktok", "Facebook"],
      },
      bottomTitle: "CONSTRUISONS QUELQUE CHOSE D’INCROYABLE",
    },
    common: {
      buttons: {
        discoverTeams: "Découvrir nos équipes",
        ourPortfolio: "Notre portfolio",
      },
      countdown: {
        days: "JOURS",
        hours: "HEURES",
        minutes: "MINUTES",
      },
    },
    hero: {
      title: "NOUS NE FAISONS PAS QUE DU DESIGN",
      line2: "NOUS CREONS",
      line3Emotions: "DES EMOTIONS",
      line3ThatStick: "QUI RESTENT",
      subtitle:
        "Chez New Vision Creatives, nous pensons que chaque pixel, chaque mot et chaque idée doivent avoir un sens. Nous sommes une équipe jeune, passionnée et un peu obsessionnelle quand il s'agit de bien faire les choses.",
      cta: "Appel d'intro",
      ctaSecondary: "Notre portfolio",
    },
    teamIntro: {
      badge: "# Pas une agence *sans visage*",
      titlePart1: "UNE EQUIPE JEUNE — MAIS",
      titleEmphasis: "LOIN D'ETRE",
      titlePart2: "DEBUTANTS.",
      descriptionPart1:
        "Nous venons d'horizons différents, mais partageons une obsession: créer des choses qui comptent. Pas de hiérarchie rigide ici — chacun a une voix, une vibe et un superpouvoir :",
      descriptionEmphasis: " transformer les idées en expériences mémorables.",
      button: "Découvrir nos équipes",
    },
    services: {
      subtitle: "Notre Expertise – Nos Terrains de Jeu",
      titlePart1: "CE QUE NOUS",
      titlePart2: "FAISONS BIEN",
      description: "Nos compétences se réunissent pour créer des expériences qui marquent.",
      descriptionPrefix: 'Nous ne faisons pas "un peu de tout" —',
      descriptionHighlight: "nous faisons tout avec style et intention",
      items: [
        {
          title: "Design de Marque",
          description:
            "Construire une marque ne consiste pas à choisir un logo — il s'agit de façonner une âme. Nous créons des identités qui durent, parce qu'elles signifient quelque chose.",
          image: "/animated-spotify-logo-green-on-black.jpg",
        },
        {
          title: "Design de Produit",
          description:
            "Nous transformons les idées en produits numériques qui semblent sans effort, humains et beaux.\n(Oui, Figma et nous sommes en termes familiers.)",
          image: "/animated-product-design-mockup-display.jpg",
          isLight: true,
        },
        {
          title: "Design Graphique",
          description:
            "L'art de dire beaucoup sans crier. Nous concevons des visuels qui attirent, intriguent et convertissent",
          image: "/animated-spotify-logo-green-on-black.jpg",
        },
        {
          title: "Communication",
          description:
            "De la stratégie à la narration, nous aidons les marques à parler clairement, audacieusement et authentiquement.",
          image: "/animated-spotify-logo-green-on-black.jpg",
        },
        {
          title: "Photographie & Videographie",
          description:
            "Une bonne image change tout. Nous capturons vos produits, vos personnes et votre essence — à travers l'objectif d'un designer.",
          image: "/animated-photography-mockup-display.jpg",
          isLight: true,
        },
        {
          title: "Motion Design",
          description:
            "Nous donnons vie à vos idées. Des animations propres, modernes et chargées d'émotion qui racontent votre histoire différemment.",
          image: "/animated-spotify-logo-green-on-black.jpg",
        },
      ],
    },
    projectsIntro: {
      titlePart1: "Nos Projets",
      titleHighlight: "Parlent Plus Fort",
      titlePart2: "Que Les Mots",
      descriptionPart1:
        "Chaque collaboration est une histoire à part entière. Nous ne montrons pas tout (où serait le plaisir ?), mais voici un aperçu de ",
      descriptionHighlight: "ce que nous aimons faire le mieux.",
      all: "Tous",
      categories: [
        "Design de Marque",
        "Design d'Interface",
        "Motion Graphics",
        "Packaging Produit",
        "Identité Visuelle",
        "Design Web",
      ],
    },
    cta: {
      sectionTitle: "Nos Realisations",
      title: "NOUS DONNONS VIE\nA L'IMAGINATION",
      subtitle: "Découvrez nos projets créatifs et laissez-vous inspirer par notre vision unique du design",
      button: "Voir nos projets",
      projects: {
        branding: {
          title: "Identité de Marque",
          description: "Création d'une identité visuelle complète pour une startup tech innovante",
        },
        webDesign: {
          title: "Design Web Moderne",
          description: "Refonte complète d'une plateforme e-commerce avec UX optimisée",
        },
        photography: {
          title: "Photographie Produit",
          description: "Shooting professionnel pour une collection de produits lifestyle",
        },
        uiux: {
          title: "Interface UI/UX",
          description: "Design d'application mobile avec focus sur l'expérience utilisateur",
        },
      },
    },
    testimonials: {
      headingLine1: "CE QUE DISENT NOS CLIENTS",
      headingLine2: "ET BIENTÔT VOUS AUSSI",
      items: [
        {
          title: "CE QUE DISENT NOS CLIENTS\nBientôt vous aussi",
          text:
            "Travailler avec New Vision Creatives, c’est collaborer avec des artistes qui savent exactement quand être professionnels.",
          name: "Bill DOORS",
          role: "CEO de MicroHard",
          rating: 4,
        },
        {
          title: "TRANSFORMER LES IDÉES\nEN RÉALITÉ",
          text:
            "L’équipe apporte non seulement une touche créative, mais aussi une approche stratégique orientée résultats.",
          name: "Sarah KARNES",
          role: "Fondatrice d’Innovatech",
          rating: 4,
        },
        {
          title: "UN PARTENARIAT\nDE CONFIANCE",
          text:
            "Partenaire précieux, toujours au-dessus des attentes avec des solutions innovantes.",
          name: "Mark JENSON",
          role: "COO de Green Solutions",
          rating: 4,
        },
        {
          title: "CRÉATIVITÉ ET\nEXCELLENCE",
          text:
            "Chaque projet est soigné et unique grâce à leur sens du détail et leur créativité.",
          name: "Linda CHO",
          role: "CMO de BrightFuture Inc.",
          rating: 5,
        },
      ],
    },
  },
  En: {
    nav: {
      home: "Home",
      projects: "Projects",
      about: "About",
      contact: "Contact",
      cta: "Start a project",
    },
    footer: {
      tagline: "We create emotions that stick",
      expertise: {
        title: "Expertise",
        items: [
          "Brand & Graphic Design",
          "Web Design",
          "Product Design",
          "Motion Design",
          "Communication & Strategic Marketing",
          "Photography & Videography",
        ],
      },
      about: {
        title: "About",
        items: ["Our Portfolio", "The Agency", "Contact Us", "Join Our Team"],
      },
      social: { title: "Social", items: ["LinkedIn", "Instagram", "Tiktok", "Facebook"] },
      bottomTitle: "LET’S BUILD SOMETHING AMAZING",
    },
    common: {
      buttons: { discoverTeams: "Discover our teams", ourPortfolio: "Our Portfolio" },
      countdown: {
        days: "DAYS",
        hours: "HOURS",
        minutes: "MINUTES",
      },
    },
    hero: {
      title: "WE DON'T JUST DESIGN",
      line2: "WE CREATE",
      line3Emotions: "EMOTIONS",
      line3ThatStick: "THAT STICK",
      subtitle:
        "At New Vision Creatives, we believe every pixel, every word, and every idea should have a purpose. We're a young, passionate, and slightly obsessive team when it comes to doing things right.",
      cta: "Intro Call",
      ctaSecondary: "Our Portfolio",
    },
    teamIntro: {
      badge: "# Not another *faceless* agency",
      titlePart1: "A YOUNG TEAM — BUT",
      titleEmphasis: "FAR FROM",
      titlePart2: "BEGINNERS.",
      descriptionPart1:
        "We come from different backgrounds, but share one obsession: creating things that matter. No stiff hierarchy here — everyone has a voice, a vibe, and a superpower:",
      descriptionEmphasis: " turning ideas into memorable experiences.",
      button: "Discover our Teams",
    },
    services: {
      subtitle: "Our Expertise – Our Playgrounds",
      titlePart1: "WHAT WE DO",
      titlePart2: "AND DO WELL",
      description: "Our skills come together to build experiences that make a mark.",
      descriptionPrefix: 'We don\'t "do a bit of everything" —',
      descriptionHighlight: "we do everything with style and purpose",
      items: [
        {
          title: "Brand Design",
          description:
            "Building a brand isn't about picking a logo — it's about shaping a soul. We craft identities that last, because they mean something.",
          image: "/animated-spotify-logo-green-on-black.jpg",
        },
        {
          title: "Product Design",
          description:
            "We turn ideas into digital products that feel effortless, human, and beautiful.\n(Yes, Figma and we are on first-name terms.)",
          image: "/animated-product-design-mockup-display.jpg",
          isLight: true,
        },
        {
          title: "Graphic Design",
          description:
            "The art of saying a lot without shouting. We design visuals that attract, intrigue, and convert",
          image: "/animated-spotify-logo-green-on-black.jpg",
        },
        {
          title: "Communication",
          description: "From strategy to storytelling, we help brands speak clearly, boldly, and genuinely.",
          image: "/animated-spotify-logo-green-on-black.jpg",
        },
        {
          title: "Photography & Videography",
          description:
            "A good image changes everything. We capture your products, people, and essence — through a designer's lens.",
          image: "/animated-photography-mockup-display.jpg",
          isLight: true,
        },
        {
          title: "Motion Design",
          description:
            "We bring your ideas to life. Clean, modern, and emotionally charged animations that tell your story differently.",
          image: "/animated-spotify-logo-green-on-black.jpg",
        },
      ],
    },
    projectsIntro: {
      titlePart1: "Our Projects",
      titleHighlight: "Speak Louder",
      titlePart2: "Than Words",
      descriptionPart1:
        "Every collaboration is a story of its own. We don't show everything (where's the fun in that?), but here's a glimpse of ",
      descriptionHighlight: "what we love doing best.",
      all: "All",
      categories: [
        "Brand Design",
        "User Interface Design",
        "Motion Graphics",
        "Product Packaging",
        "Visual Identity",
        "Web Design",
      ],
    },
    cta: {
      sectionTitle: "Our Work",
      title: "WE BRING\nIMAGINATION\nTO LIFE",
      subtitle: "Discover our creative projects and be inspired by our unique vision of design",
      button: "View our projects",
      projects: {
        branding: {
          title: "Brand Identity",
          description: "Complete visual identity creation for an innovative tech startup",
        },
        webDesign: {
          title: "Modern Web Design",
          description: "Complete redesign of an e-commerce platform with optimized UX",
        },
        photography: {
          title: "Product Photography",
          description: "Professional shooting for a lifestyle product collection",
        },
        uiux: {
          title: "UI/UX Interface",
          description: "Mobile app design with focus on user experience",
        },
      },
    },
    testimonials: {
      headingLine1: "WHAT OUR CLIENTS SAY",
      headingLine2: "AND SOON YOU TOO",
      items: [
        {
          title: "WHAT OUR CLIENTS SAY\nSOON YOU TOO",
          text:
            "Working with New Vision Creatives feels like collaborating with artists who know exactly when to be professionals.",
          name: "Bill DOORS",
          role: "CEO of MicroHard",
          rating: 4,
        },
        {
          title: "TRANSFORMING IDEAS\nINTO REALITY",
          text:
            "The team brings not only creative flair but also a strategic approach that ensures results.",
          name: "Sarah KARNES",
          role: "Founder of Innovatech",
          rating: 4,
        },
        {
          title: "A PARTNERSHIP\nBUILT ON TRUST",
          text:
            "An invaluable partner consistently exceeding expectations with innovative solutions.",
          name: "Mark JENSON",
          role: "COO of Green Solutions",
          rating: 4,
        },
        {
          title: "CREATIVITY MEETS\nEXCELLENCE",
          text:
            "Every project feels unique and tailored, thanks to thoughtful insights and creative prowess.",
          name: "Linda CHO",
          role: "CMO of BrightFuture Inc.",
          rating: 5,
        },
      ],
    },
  },
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("En")

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: translations[language],
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
