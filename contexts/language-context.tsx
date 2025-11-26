"use client"

import { createContext, useContext, useState, type ReactNode } from "react";

type Language = "Fr" | "En";

interface Translations {
  nav: {
    home: string;
    projects: string;
    about: string;
    contact: string;
    cta: string;
  };
  hero: {
    title: string;
    line2: string;
    line3Emotions: string;
    line3ThatStick: string;
    subtitle: string;
    cta: string;
    ctaSecondary: string;
  };
  teamIntro: {
    badge: string;
    titlePart1: string;
    titleEmphasis: string;
    titlePart2: string;
    descriptionPart1: string;
    descriptionEmphasis: string;
    button: string;
  };
  services: {
    subtitle: string;
    titlePart1: string;
    titlePart2: string;
    description: string;
    descriptionPrefix: string;
    descriptionHighlight: string;
    items: Array<{
      title: string;
      description: string;
      image: string;
      isLight?: boolean;
    }>;
  };
  projectsIntro: {
    titlePart1: string;
    titleHighlight: string;
    titlePart2: string;
    descriptionPart1: string;
    descriptionHighlight: string;
    all: string;
    categories: string[];
  };
  cta: {
    sectionTitle: string;
    title: string;
    subtitle: string;
    button: string;
    projects: {
      branding: { title: string; description: string };
      webDesign: { title: string; description: string };
      photography: { title: string; description: string };
      uiux: { title: string; description: string };
    };
  };
  cta_visual: {
    title1: string;
    title2: string;
    subtitle: string;
    button: string;
  };
  testimonials: {
    headingLine1: string;
    headingLine2: string;
    items: Array<{
      title: string;
      text: string;
      name: string;
      role: string;
      rating: number;
    }>;
  };
  footer: {
    tagline: string;
    expertise: { title: string; items: string[] };
    about: { title: string; items: string[] };
    social: { title: string; items: string[] };
    bottomTitle: string;
  };
  common: {
    buttons: {
      discoverTeams: string;
      ourPortfolio: string;
      backHome: string;
    };
    countdown: {
      days: string;
      hours: string;
      minutes: string;
      seconds: string;
    };
    comingSoon: {
      title1: string;
      title2: string;
      subtitle1: string;
      subtitle2: string;
      subtitle3: string;
    };
    slotAvailable: {
      title: string;
      description: string;
    };
    upload: {
      uploadFailed: string;
      uploading: string;
      uploadInProgress: string;
      chooseImages: string;
      chooseImage: string;
    };
    confirm: {
      defaultMessage: string;
      confirm: string;
      cancel: string;
    };
  };
  admin: {
    panelTitle: string;
    nav: {
      home: string;
      projects: string;
      about: string;
      contact: string;
    };
    descriptions: {
      hero: string;
      services: string;
      projects: string;
      team: string;
      testimonials: string;
    };
    actions: {
      viewSite: string;
      logout: string;
    };
    loading: string;
    projects: {
      filterByService: string;
      allServices: string;
      allProjects: string;
      selectedServiceProjects: string;
      noProjects: string;
      noProjectsForService: string;
      createOrEditProject: string;
      projectCategory: string;
      selectCategory: string;
      image: string;
      projectTitle: string;
      projectTitlePlaceholder: string;
      description: string;
      projectDescriptionPlaceholder: string;
      updateProject: string;
      addProject: string;
      cancel: string;
      deleteProjectTitle: string;
      deleteProjectMessage: string;
      delete: string;
    };
    services: {
      existingServices: string;
      noServices: string;
      createOrEditService: string;
      maxServicesNote: string;
      imageGif: string;
      title: string;
      titlePlaceholder: string;
      descriptionPlaceholder: string;
      updateService: string;
      createService: string;
      limitReached: string;
      deleteServiceTitle: string;
      deleteServiceMessage: string;
    };
    team: {
      existingMembers: string;
      noMembers: string;
      createOrEditMember: string;
      name: string;
      namePlaceholder: string;
      position: string;
      positionPlaceholder: string;
      descriptionOptional: string;
      photo: string;
      updateMember: string;
      addMember: string;
      member: string;
      deleteMemberTitle: string;
      deleteMemberMessage: string;
    };
    testimonials: {
      existingTestimonials: string;
      noTestimonials: string;
      createOrEditTestimonial: string;
      authorName: string;
      authorNamePlaceholder: string;
      positionRole: string;
      positionRolePlaceholder: string;
      title: string;
      titlePlaceholder: string;
      testimonialDescription: string;
      testimonialDescriptionPlaceholder: string;
      rating: string;
      updateTestimonial: string;
      addTestimonial: string;
      testimonial: string;
      deleteTestimonialTitle: string;
      deleteTestimonialMessage: string;
    };
    hero: {
      heroImages: string;
      noHeroImages: string;
      maxImagesNote: string;
      titleOptional: string;
      titlePlaceholder: string;
      descriptionOptional: string;
      descriptionPlaceholder: string;
      update: string;
      add: string;
      deleteHeroImageTitle: string;
      deleteHeroImageMessage: string;
    };
    login: {
      title: string;
      emailLabel: string;
      passwordLabel: string;
      invalidCredentials: string;
      submit: string;
      submitting: string;
      retryIn: string;
      restricted: string;
      forgotPasswordLink: string;
      forgotPasswordEmailRequired: string;
      forgotPasswordError: string;
      forgotPasswordSuccess: string;
      noSignup: string;
    };
    pages: {
      about: {
        intro: {
          title: string;
          desc: string;
          manage: string;
          placeholder: string;
        };
        team: {
          title: string;
          desc: string;
          manage: string;
          placeholder: string;
        };
      };
      contact: {
        infos: {
          title: string;
          desc: string;
          manage: string;
          placeholder: string;
        };
        networks: {
          title: string;
          desc: string;
          manage: string;
          placeholder: string;
        };
      };
      projects: {
        list: {
          title: string;
          desc: string;
          manage: string;
          placeholder: string;
        };
        categories: {
          title: string;
          desc: string;
          manage: string;
          placeholder: string;
        };
      };
    };
  };
}
const translations: Record<Language, Translations> = {
  Fr: {
    nav: {
      home: "Accueil",
      projects: "Projets",
      about: "A propos",
      contact: "Contact",
      cta: "Demarrer un projet",
    },
    footer: {
      tagline: "Nous creons des emotions qui restent",
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
        title: "A propos",
        items: [
          "Notre portfolio",
          "L'agence",
          "Contactez nous",
          "Rejoignez notre equipe",
        ],
      },
      social: {
        title: "Social",
        items: ["LinkedIn", "Instagram", "Tiktok", "Facebook"],
      },
      bottomTitle: "LET’S BUILD SOMETHING AMAZING", //this should always be in english for aesthetics
    },
    common: {
      buttons: {
        discoverTeams: "Decouvrir nos equipes",
        ourPortfolio: "Notre portfolio",
        backHome: "Retour a l'accueil",
      },
      countdown: {
        days: "JOURS",
        hours: "HEURES",
        minutes: "MINUTES",
        seconds: "SECONDES",
      },
      comingSoon: {
        title1: "Nous preparons encore ",
        title2: "les bonnes choses.",
        subtitle1: "Nous apportons ",
        subtitle2: "les touches finales ",
        subtitle3:
          "a nos ... nous serons en ligne avant que la cafeine ne s'epuise.",
      },
      slotAvailable: {
        title: "Emplacement disponible",
        description:
          "Ajoutez plus d'elements dans l'admin pour remplir cet emplacement de la galerie.",
      },
      upload: {
        uploadFailed: "Telechargement echoue",
        uploading: "Telechargement",
        uploadInProgress: "Envoi en cours",
        chooseImages: "Choisir des images",
        chooseImage: "Choisir une image",
      },
      confirm: {
        defaultMessage: "Cette action ne peut pas etre annulee.",
        confirm: "Confirmer",
        cancel: "Annuler",
      },
    },
    cta_visual: {
      title1: "PRET A RACONTER TA PROCHAINE",
      title2: "HISTOIRE VISUELLE ?",
      subtitle:
        'Tu as une idee, un produit ou juste une etincelle d\'ambition ? Parlons-en. (Promis, on ne mord pas - sauf si tu dis : "Tu peux me faire un petit logo rapide ?")',
      button: "Reserver un call d'intro",
    },
    hero: {
      title: "NOUS NE FAISONS PAS QUE DU DESIGN ",
      line2: "NOUS CREONS",
      line3Emotions: "DES EMOTIONS ",
      line3ThatStick: "QUI RESTENT",
      subtitle:
        "Une equipe jeune, passionnee, et perfectionniste dans tout ce qu'elle entreprend.",
      cta: "Appel d'intro",
      ctaSecondary: "Notre portfolio",
    },
    teamIntro: {
      badge: "# Pas une agence *sans visage*",
      titlePart1: "UNE EQUIPE JEUNE - MAIS",
      titleEmphasis: "LOIN D'ETRE",
      titlePart2: "DEBUTANTS.",
      descriptionPart1:
        "Nous venons d'horizons differents, mais partageons une obsession: creer des choses qui comptent. Pas de hierarchie rigide ici - chacun a une voix, une vibe et un superpouvoir :",
      descriptionEmphasis: " transformer les idees en experiences memorables.",
      button: "Decouvrir nos equipes",
    },
    services: {
      subtitle: "Notre Expertise - Nos Terrains de Jeu",
      titlePart1: "CE QUE NOUS",
      titlePart2: "FAISONS BIEN",
      description:
        "Nos competences se reunissent pour creer des experiences qui marquent.",
      descriptionPrefix: 'Nous ne faisons pas "un peu de tout" -',
      descriptionHighlight: "nous faisons tout avec style et intention",
      items: [
        {
          title: "Design de Marque",
          description:
            "Construire une marque ne consiste pas a choisir un logo - il s'agit de faconner une ame. Nous creons des identites qui durent, parce qu'elles signifient quelque chose.",
          image: "/animated-spotify-logo-green-on-black.jpg",
        },
        {
          title: "Design de Produit",
          description:
            "Nous transformons les idees en produits numeriques qui semblent sans effort, humains et beaux.\n(Oui, Figma et nous sommes en termes familiers.)",
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
            "De la strategie a la narration, nous aidons les marques a parler clairement, audacieusement et authentiquement.",
          image: "/animated-spotify-logo-green-on-black.jpg",
        },
        {
          title: "Photographie & Videographie",
          description:
            "Une bonne image change tout. Nous capturons vos produits, vos personnes et votre essence - a travers l'objectif d'un designer.",
          image: "/animated-photography-mockup-display.jpg",
          isLight: true,
        },
        {
          title: "Motion Design",
          description:
            "Nous donnons vie a vos idees. Des animations propres, modernes et chargees d'emotion qui racontent votre histoire differemment.",
          image: "/animated-spotify-logo-green-on-black.jpg",
        },
      ],
    },
    projectsIntro: {
      titlePart1: "Nos Projets",
      titleHighlight: "Parlent Plus Fort",
      titlePart2: "Que Les Mots",
      descriptionPart1:
        "Chaque collaboration est une histoire a part entiere. Nous ne montrons pas tout (ou serait le plaisir ?), mais voici un apercu de ",
      descriptionHighlight: "ce que nous aimons faire le mieux.",
      all: "Tous",
      categories: [
        "Design de Marque",
        "Design d'Interface",
        "Motion Graphics",
        "Packaging Produit",
        "Identite Visuelle",
        "Design Web",
      ],
    },
    cta: {
      sectionTitle: "Nos Realisations",
      title: "NOUS DONNONS VIE\nA L'IMAGINATION",
      subtitle:
        "Decouvrez nos projets creatifs et laissez-vous inspirer par notre vision unique du design",
      button: "Voir nos projets",
      projects: {
        branding: {
          title: "Identite de Marque",
          description:
            "Creation d'une identite visuelle complete pour une startup tech innovante",
        },
        webDesign: {
          title: "Design Web Moderne",
          description:
            "Refonte complete d'une plateforme e-commerce avec UX optimisee",
        },
        photography: {
          title: "Photographie Produit",
          description:
            "Shooting professionnel pour une collection de produits lifestyle",
        },
        uiux: {
          title: "Interface UI/UX",
          description:
            "Design d'application mobile avec focus sur l'experience utilisateur",
        },
      },
    },
    testimonials: {
      headingLine1: "CE QUE DISENT NOS CLIENTS",
      headingLine2: "ET BIENTOT VOUS AUSSI",
      items: [
        {
          title: "CE QUE DISENT NOS CLIENTS\nBientot vous aussi",
          text: "Travailler avec New Vision Creatives, c'est collaborer avec des artistes qui savent exactement quand etre professionnels.",
          name: "Bill DOORS",
          role: "CEO de MicroHard",
          rating: 4,
        },
        {
          title: "TRANSFORMER LES IDEES\nEN REALITE",
          text: "L'equipe apporte non seulement une touche creative, mais aussi une approche strategique orientee resultats.",
          name: "Sarah KARNES",
          role: "Fondatrice d’Innovatech",
          rating: 4,
        },
        {
          title: "UN PARTENARIAT\nDE CONFIANCE",
          text: "Partenaire précieux, toujours au-dessus des attentes avec des solutions innovantes.",
          name: "Mark JENSON",
          role: "COO de Green Solutions",
          rating: 4,
        },
        {
          title: "CREATIVITE ET\nEXCELLENCE",
          text: "Chaque projet est soigne et unique grace a leur sens du detail et leur creativite.",
          name: "Linda CHO",
          role: "CMO de BrightFuture Inc.",
          rating: 5,
        },
      ],
    },
    admin: {
      panelTitle: "Panel Admin",
      nav: {
        home: "Accueil",
        projects: "Projets",
        about: "A propos",
        contact: "Contact",
      },
      descriptions: {
        hero: "Gerez les images et textes de la section Hero.",
        services: "Gerez les services proposes sur le site.",
        projects: "Gerez les projets associes a chaque service.",
        team: "Gerez les membres de l'equipe et leurs roles.",
        testimonials: "Gerez les avis et temoignages clients.",
      },
      actions: {
        viewSite: "Voir le site",
        logout: "Deconnexion",
      },
      loading: "Chargement...",
      projects: {
        filterByService: "Filtrer par service",
        allServices: "Tous les services",
        allProjects: "Tous les projets",
        selectedServiceProjects: "Projets du service selectionne",
        noProjects: "Aucun projet pour l'instant.",
        noProjectsForService: "Aucun projet pour ce service pour l'instant.",
        createOrEditProject:
          "Creez ou modifiez un projet pour le service selectionne. Les projets apparaissent dans la section portfolio.",
        projectCategory: "Categorie du Projet",
        selectCategory: "Selectionnez une categorie",
        image: "Image",
        projectTitle: "Titre du Projet",
        projectTitlePlaceholder: "Titre du projet",
        description: "Description",
        projectDescriptionPlaceholder: "Description du projet",
        updateProject: "Mettre a jour Projet",
        addProject: "Ajouter Projet",
        cancel: "Annuler",
        deleteProjectTitle: "Supprimer ce projet ?",
        deleteProjectMessage:
          "Cette action est irreversible. Le projet sera definitivement supprime.",
        delete: "Supprimer",
      },
      services: {
        existingServices: "Services existants",
        noServices:
          "Aucun service pour l'instant. Creez votre premier service avec le formulaire a droite.",
        createOrEditService:
          "Creez ou modifiez un service. Les services sont utilises pour lier les projets dans la section portfolio. Vous pouvez creer jusqu'a 6 services. Si la limite est atteinte, supprimez ou modifiez un service existant.",
        maxServicesNote: "Vous pouvez creer jusqu'a 6 services.",
        imageGif: "Image/GIF",
        title: "Titre",
        titlePlaceholder: "Titre du service",
        descriptionPlaceholder: "Description du service",
        updateService: "Mettre a jour Service",
        createService: "Creer Service",
        limitReached: "Limite atteinte",
        deleteServiceTitle: "Supprimer ce service ?",
        deleteServiceMessage:
          "Cette action est irreversible. Le service sera definitivement supprime.",
      },
      team: {
        existingMembers: "Membres existants",
        noMembers: "Aucun membre pour l'instant.",
        createOrEditMember:
          'Creez ou modifiez un membre de l\'equipe. Ces membres alimentent la section "Team" du site.',
        name: "Nom",
        namePlaceholder: "Nom du membre",
        position: "Poste",
        positionPlaceholder: "Poste/Titre",
        descriptionOptional: "Description optionnelle",
        photo: "Photo",
        updateMember: "Mettre a jour",
        addMember: "Ajouter",
        member: "Membre",
        deleteMemberTitle: "Supprimer ce membre ?",
        deleteMemberMessage:
          "Cette action est irreversible. Le membre sera definitivement supprime.",
      },
      testimonials: {
        existingTestimonials: "Temoignages existants",
        noTestimonials: "Aucun temoignage pour l'instant.",
        createOrEditTestimonial:
          'Creez ou modifiez un temoignage. Ces temoignages alimentent la section "Temoignages" du site.',
        authorName: "Nom de l'auteur",
        authorNamePlaceholder: "Nom",
        positionRole: "Poste / Role",
        positionRolePlaceholder: "Ex: CEO, Directrice Marketing...",
        title: "Titre",
        titlePlaceholder: "Titre du temoignage",
        testimonialDescription: "Description",
        testimonialDescriptionPlaceholder: "Contenu du temoignage",
        rating: "Note (1-5)",
        updateTestimonial: "Mettre a jour",
        addTestimonial: "Ajouter",
        testimonial: "Temoignage",
        deleteTestimonialTitle: "Supprimer ce temoignage ?",
        deleteTestimonialMessage:
          "Cette action est irreversible. Le temoignage sera definitivement supprime.",
      },
      hero: {
        heroImages: "Images Hero",
        noHeroImages: "Aucune image dans la Hero.",
        maxImagesNote:
          "Maximum 8 images. Les emplacements vides sont remplis par placeholder.svg et remplaces par vos images.",
        titleOptional: "Titre",
        titlePlaceholder: "Titre optionnel",
        descriptionOptional: "Description",
        descriptionPlaceholder: "Description optionnelle",
        update: "Mettre a jour",
        add: "Ajouter",
        deleteHeroImageTitle: "Supprimer cette image Hero ?",
        deleteHeroImageMessage:
          "Cette action est irreversible. L'image sera definitivement supprimee.",
      },
      login: {
        title: "Connexion",
        emailLabel: "Email",
        passwordLabel: "Mot de passe",
        invalidCredentials: "Identifiants invalides. Veuillez reessayer.",
        submit: "Se connecter",
        submitting: "Connexion...",
        retryIn: "Reessayer dans",
        restricted: "Acces restreint",
        forgotPasswordLink: "Mot de passe oublie ?",
        forgotPasswordEmailRequired:
          "Saisissez votre email pour recevoir un lien de reinitialisation.",
        forgotPasswordError:
          "Impossible d'envoyer l'email pour le moment. Reessayez plus tard.",
        forgotPasswordSuccess:
          "Email de reinitialisation envoye. Consultez votre boite de reception.",
        noSignup: "Aucune inscription disponible.",
      },
      pages: {
        about: {
          intro: {
            title: "Introduction",
            desc: "Texte et visuels d'introduction",
            manage: "Gerer Hero, titres, description de la page A propos",
            placeholder: "En construction... Bientot pret !",
          },
          team: {
            title: "Equipe",
            desc: "Presentation elargie de l'equipe",
            manage: "Gerer les membres de l'equipe de la page A propos",
            placeholder: "En construction... Bientot pret !",
          },
        },
        contact: {
          infos: {
            title: "Infos",
            desc: "Coordonnees, email, telephone",
            manage: "Gerer les informations de contact",
            placeholder: "En construction... Bientot pret !",
          },
          networks: {
            title: "Reseaux",
            desc: "Liens reseaux sociaux et CTA",
            manage: "Gerer les reseaux sociaux et boutons",
            placeholder: "En construction... Bientot pret !",
          },
        },
        projects: {
          list: {
            title: "Liste des projets",
            desc: "Gerez les projets du site",
            manage: "Ajouter, modifier ou supprimer des projets",
            placeholder: "Utilisez le panneau lateral pour gerer les projets",
          },
          categories: {
            title: "Categories",
            desc: "Organisez les projets par categorie",
            manage: "Gerer les categories de projets",
            placeholder: "En construction... Bientot pret !",
          },
        },
      },
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
      social: {
        title: "Social",
        items: ["LinkedIn", "Instagram", "Tiktok", "Facebook"],
      },
      bottomTitle: "LET’S BUILD SOMETHING AMAZING",
    },
    common: {
      buttons: {
        discoverTeams: "Discover our teams",
        ourPortfolio: "Our Portfolio",
        backHome: "Back to home",
      },
      countdown: {
        days: "DAYS",
        hours: "HOURS",
        minutes: "MINUTES",
        seconds: "SECONDS",
      },
      comingSoon: {
        title1: "We're still cooking ",
        title2: "the good stuff.",
        subtitle1: "We're putting ",
        subtitle2: "the final touches ",
        subtitle3: "on ours ... we'll be live before the caffeine wears off.",
      },
      slotAvailable: {
        title: "Slot available",
        description: "Add more items in the admin to fill this gallery slot.",
      },
      upload: {
        uploadFailed: "Upload failed",
        uploading: "Uploading",
        uploadInProgress: "Upload in progress",
        chooseImages: "Choose images",
        chooseImage: "Choose an image",
      },
      confirm: {
        defaultMessage: "This action cannot be undone.",
        confirm: "Confirm",
        cancel: "Cancel",
      },
    },
    cta_visual: {
      title1: "READY TO TELL YOUR NEXT",
      title2: "VISUAL STORY?",
      subtitle:
        "Have an idea, a product, or just a spark of ambition? Let's talk. (We promise we won't bite — unless you say, \"Can you make me a quick logo?\")",
      button: "Book your intro call",
    },
    hero: {
      title: "WE DON'T JUST DESIGN ",
      line2: "WE CREATE",
      line3Emotions: "EMOTIONS ",
      line3ThatStick: "THAT STICK",
      subtitle:
        "We're a young, passionate, and slightly obsessive team when it comes to doing things right.",
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
      description:
        "Our skills come together to build experiences that make a mark.",
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
          description:
            "From strategy to storytelling, we help brands speak clearly, boldly, and genuinely.",
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
      subtitle:
        "Discover our creative projects and be inspired by our unique vision of design",
      button: "View our projects",
      projects: {
        branding: {
          title: "Brand Identity",
          description:
            "Complete visual identity creation for an innovative tech startup",
        },
        webDesign: {
          title: "Modern Web Design",
          description:
            "Complete redesign of an e-commerce platform with optimized UX",
        },
        photography: {
          title: "Product Photography",
          description:
            "Professional shooting for a lifestyle product collection",
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
          text: "Working with New Vision Creatives feels like collaborating with artists who know exactly when to be professionals.",
          name: "Bill DOORS",
          role: "CEO of MicroHard",
          rating: 4,
        },
        {
          title: "TRANSFORMING IDEAS\nINTO REALITY",
          text: "The team brings not only creative flair but also a strategic approach that ensures results.",
          name: "Sarah KARNES",
          role: "Founder of Innovatech",
          rating: 4,
        },
        {
          title: "A PARTNERSHIP\nBUILT ON TRUST",
          text: "An invaluable partner consistently exceeding expectations with innovative solutions.",
          name: "Mark JENSON",
          role: "COO of Green Solutions",
          rating: 4,
        },
        {
          title: "CREATIVITY MEETS\nEXCELLENCE",
          text: "Every project feels unique and tailored, thanks to thoughtful insights and creative prowess.",
          name: "Linda CHO",
          role: "CMO of BrightFuture Inc.",
          rating: 5,
        },
      ],
    },
    admin: {
      panelTitle: "Admin Panel",
      nav: {
        home: "Home",
        projects: "Projects",
        about: "About",
        contact: "Contact",
      },
      descriptions: {
        hero: "Manage the images and text for the Hero section.",
        services: "Manage the services offered on the site.",
        projects: "Manage the projects associated with each service.",
        team: "Manage team members and their roles.",
        testimonials: "Manage client reviews and testimonials.",
      },
      actions: {
        viewSite: "View site",
        logout: "Logout",
      },
      loading: "Loading…",
      projects: {
        filterByService: "Filter by service",
        allServices: "All services",
        allProjects: "All projects",
        selectedServiceProjects: "Projects for selected service",
        noProjects: "No projects yet.",
        noProjectsForService: "No projects for this service yet.",
        createOrEditProject:
          "Create or edit a project for the selected service. Projects appear in the portfolio section.",
        projectCategory: "Project Category",
        selectCategory: "Select a category",
        image: "Image",
        projectTitle: "Project Title",
        projectTitlePlaceholder: "Project title",
        description: "Description",
        projectDescriptionPlaceholder: "Project description",
        updateProject: "Update Project",
        addProject: "Add Project",
        cancel: "Cancel",
        deleteProjectTitle: "Delete this project?",
        deleteProjectMessage:
          "This action is irreversible. The project will be permanently deleted.",
        delete: "Delete",
      },
      services: {
        existingServices: "Existing Services",
        noServices:
          "No services yet. Create your first service with the form on the right.",
        createOrEditService:
          "Create or edit a service. Services are used to link projects in the portfolio section. You can create up to 6 services. If the limit is reached, delete or edit an existing service.",
        maxServicesNote: "You can create up to 6 services.",
        imageGif: "Image/GIF",
        title: "Title",
        titlePlaceholder: "Service title",
        descriptionPlaceholder: "Service description",
        updateService: "Update Service",
        createService: "Create Service",
        limitReached: "Limit reached",
        deleteServiceTitle: "Delete this service?",
        deleteServiceMessage:
          "This action is irreversible. The service will be permanently deleted.",
      },
      team: {
        existingMembers: "Existing Members",
        noMembers: "No members yet.",
        createOrEditMember:
          'Create or edit a team member. These members populate the "Team" section of the site.',
        name: "Name",
        namePlaceholder: "Member name",
        position: "Position",
        positionPlaceholder: "Position/Title",
        descriptionOptional: "Optional description",
        photo: "Photo",
        updateMember: "Update",
        addMember: "Add",
        member: "Member",
        deleteMemberTitle: "Delete this member?",
        deleteMemberMessage:
          "This action is irreversible. The member will be permanently deleted.",
      },
      testimonials: {
        existingTestimonials: "Existing Testimonials",
        noTestimonials: "No testimonials yet.",
        createOrEditTestimonial:
          'Create or edit a testimonial. These testimonials populate the "Testimonials" section of the site.',
        authorName: "Author Name",
        authorNamePlaceholder: "Name",
        positionRole: "Position / Role",
        positionRolePlaceholder: "Ex: CEO, Marketing Director…",
        title: "Title",
        titlePlaceholder: "Testimonial title",
        testimonialDescription: "Description",
        testimonialDescriptionPlaceholder: "Testimonial content",
        rating: "Rating (1-5)",
        updateTestimonial: "Update",
        addTestimonial: "Add",
        testimonial: "Testimonial",
        deleteTestimonialTitle: "Delete this testimonial?",
        deleteTestimonialMessage:
          "This action is irreversible. The testimonial will be permanently deleted.",
      },
      hero: {
        heroImages: "Hero Images",
        noHeroImages: "No images in Hero.",
        maxImagesNote:
          "Maximum 8 images. Empty slots are filled with placeholder.svg and replaced with your images.",
        titleOptional: "Title",
        titlePlaceholder: "Optional title",
        descriptionOptional: "Description",
        descriptionPlaceholder: "Optional description",
        update: "Update",
        add: "Add",
        deleteHeroImageTitle: "Delete this Hero image?",
        deleteHeroImageMessage:
          "This action is irreversible. The image will be permanently deleted.",
      },
      login: {
        title: "Sign in",
        emailLabel: "Email",
        passwordLabel: "Password",
        invalidCredentials: "Invalid credentials. Please try again.",
        submit: "Sign in",
        submitting: "Signing in...",
        retryIn: "Retry in",
        restricted: "Restricted access",
        forgotPasswordLink: "Forgot password?",
        forgotPasswordEmailRequired:
          "Enter your email to receive a reset link.",
        forgotPasswordError:
          "Could not send the email right now. Please try again later.",
        forgotPasswordSuccess: "Reset email sent. Check your inbox.",
        noSignup: "Sign up is not available.",
      },
      pages: {
        about: {
          intro: {
            title: "Introduction",
            desc: "Introduction text and visuals",
            manage: "Manage Hero, titles, description of About page",
            placeholder: "Under construction... Coming soon!",
          },
          team: {
            title: "Team",
            desc: "Extended team presentation",
            manage: "Manage team members on About page",
            placeholder: "Under construction... Coming soon!",
          },
        },
        contact: {
          infos: {
            title: "Infos",
            desc: "Contact details, email, phone",
            manage: "Manage contact information",
            placeholder: "Under construction... Coming soon!",
          },
          networks: {
            title: "Networks",
            desc: "Social media links and CTA",
            manage: "Manage social networks and buttons",
            placeholder: "Under construction... Coming soon!",
          },
        },
        projects: {
          list: {
            title: "Projects List",
            desc: "Manage website projects",
            manage: "Add, edit or delete projects",
            placeholder: "Use the side panel to manage projects",
          },
          categories: {
            title: "Categories",
            desc: "Organize projects by category",
            manage: "Manage project categories",
            placeholder: "Under construction... Coming soon!",
          },
        },
      },
    },
  },
};

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
