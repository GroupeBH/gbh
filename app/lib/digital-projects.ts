export type DigitalProjectSlug = "uty" | "afya" | "bpac" | "zwanga";

export type DigitalProject = {
  slug: DigitalProjectSlug;
  name: string;
  category: string;
  status: string;
  tagline: string;
  description: string;
  audience: string;
  route: string;
  isExternal?: boolean;
  accent: string;
  surface: string;
  highlights: string[];
  capabilities: string[];
  roadmap: string[];
  proofPoints: {
    label: string;
    value: string;
  }[];
};

export const digitalProjects: DigitalProject[] = [
  {
    slug: "uty",
    name: "Uty",
    category: "Commerce numerique",
    status: "Plateforme en structuration",
    tagline:
      "Un marketplace congolais pour vendre, acheter, livrer et gerer les annonces avec une couche IA.",
    description:
      "Uty centralise annonces, commandes, paiements, livraison, stock temps reel et encheres dans une architecture monolithique evolutive, preparee pour une migration progressive vers des microservices.",
    audience:
      "Clients, vendeurs, livreurs, administrateurs et entrepots qui ont besoin d'un commerce mobile fluide et tracable.",
    route: "/projets/uty",
    accent: "#1570ef",
    surface: "from-sky-50 via-white to-cyan-50",
    highlights: [
      "Publication manuelle, texte ou audio assistee par IA",
      "Gestion du panier, du stock et des commandes en temps reel",
      "Livraison avancee avec assignation et tracking",
      "Architecture modulaire avec event bus interne",
    ],
    capabilities: [
      "Comptes utilisateurs, vendeurs et livreurs avec KYC",
      "Annonces enrichies, moderation automatique et categories dynamiques",
      "Paiements cash ou app avec validation vendeur/livreur",
      "Notifications push FCM et alertes systeme",
      "Dashboard web admin/vendeur et app mobile React Native",
    ],
    roadmap: [
      "Monolithe modulaire robuste",
      "Extraction progressive des modules autonomes",
      "Separation des bases par domaine",
      "Gateway API, scaling et microservices",
    ],
    proofPoints: [
      { label: "Domaines", value: "annonces, commandes, livraison" },
      { label: "Experience", value: "web + mobile temps reel" },
      { label: "Vision", value: "IA, logistique, paiements" },
    ],
  },
  {
    slug: "zwanga",
    name: "Zwanga",
    category: "Mobilite",
    status: "Application dediee",
    tagline:
      "Une solution de mobilite qui facilite les trajets partages entre villes et localites.",
    description:
      "Zwanga connecte conducteurs et passagers autour de trajets communs afin de reduire les couts, ameliorer l'accessibilite et fluidifier les deplacements.",
    audience:
      "Voyageurs, conducteurs et communautes cherchant une alternative organisee aux transports traditionnels.",
    route: "https://zwnga-app.com",
    isExternal: true,
    accent: "#0f9f6e",
    surface: "from-emerald-50 via-white to-lime-50",
    highlights: [
      "Mise en relation conducteurs-passagers",
      "Trajets entre grandes villes et localites",
      "Logique de confiance et de notation",
      "Acces direct a l'application Zwanga",
    ],
    capabilities: [
      "Recherche de trajet",
      "Gestion des places disponibles",
      "Suivi des demandes",
      "Paiements et communication autour du trajet",
    ],
    roadmap: ["Acces direct sur zwnga-app.com"],
    proofPoints: [
      { label: "Secteur", value: "mobilite" },
      { label: "Modele", value: "covoiturage" },
      { label: "Acces", value: "site dedie" },
    ],
  },
  {
    slug: "afya",
    name: "Afya",
    category: "HealthTech",
    status: "MVP fonctionnel a cadrer",
    tagline:
      "Un assistant de sante intelligent pour orienter les patients sans remplacer le diagnostic medical.",
    description:
      "Afya aide les patients a decrire leurs symptomes par texte ou voix, estime un niveau de gravite, recommande les prochaines actions et connecte les patients aux medecins quand la situation l'exige.",
    audience:
      "Patients, medecins et administrateurs de sante dans des environnements a faible connectivite et ressources limitees.",
    route: "/projets/afya",
    accent: "#dc2626",
    surface: "from-rose-50 via-white to-teal-50",
    highlights: [
      "Triage IA faible, moyen ou eleve sans diagnostic final",
      "Chat securise entre patients et medecins",
      "Historique medical, medicaments et contacts d'urgence",
      "Mode hors ligne avec synchronisation automatique",
    ],
    capabilities: [
      "Authentification mobile par OTP et gestion JWT",
      "Roles patient, medecin et administrateur avec permissions dediees",
      "OCR pour ordonnances et resultats de laboratoire",
      "Assistant medecin pour resumer l'historique patient",
      "Support francais, lingala et swahili",
    ],
    roadmap: [
      "MVP: authentification, patient, IA initiale et chat",
      "Triage avance, assistant medecin et notifications",
      "OCR, multilingue et integrations tierces",
    ],
    proofPoints: [
      { label: "Priorite", value: "orientation medicale" },
      { label: "Contraintes", value: "faible bande passante" },
      { label: "Regle", value: "pas de diagnostic IA" },
    ],
  },
  {
    slug: "bpac",
    name: "BPAC",
    category: "Fintech",
    status: "Phase de conception",
    tagline:
      "Une banque numerique par les Congolais, pour les Congolais.",
    description:
      "BPAC est un projet de banque numerique en phase de conception, pense pour rapprocher les services financiers des realites congolaises et favoriser une inclusion bancaire plus accessible.",
    audience:
      "Particuliers, entrepreneurs, commercants et diasporas qui attendent des services financiers simples, fiables et adaptes au contexte local.",
    route: "/projets/bpac",
    accent: "#7c3aed",
    surface: "from-violet-50 via-white to-fuchsia-50",
    highlights: [
      "Positionnement national: par les Congolais, pour les Congolais",
      "Projet en cadrage produit, technique et reglementaire",
      "Ambition d'inclusion financiere et de confiance numerique",
      "Experience mobile simple pour les usages quotidiens",
    ],
    capabilities: [
      "Parcours client et KYC a definir",
      "Services de compte, transfert et suivi financier a cadrer",
      "Gouvernance securite, conformite et risque",
      "Architecture evolutive pour futurs services financiers",
    ],
    roadmap: [
      "Cadrage fonctionnel et reglementaire",
      "Prototype d'experience mobile",
      "Validation partenaires, risques et conformite",
      "MVP pilote avant extension progressive",
    ],
    proofPoints: [
      { label: "Phase", value: "conception" },
      { label: "Marche", value: "RDC" },
      { label: "Ambition", value: "inclusion bancaire" },
    ],
  },
];

export const detailProjects = digitalProjects.filter((project) => !project.isExternal);

export function getDigitalProject(slug: string) {
  return digitalProjects.find((project) => project.slug === slug);
}
