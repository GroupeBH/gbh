import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface ParticuliersPageProps {
  onNavigate: (page: string) => void;
}

const domaines = [
  {
    id: 1,
    title: "Conseil stratégique",
    description:
      "Accompagnement personnalisé pour vos projets professionnels et personnels",
    icon: "💼",
    keywords: ["conseil", "stratégie", "accompagnement"],
  },
  {
    id: 2,
    title: "Intelligence opérationnelle",
    description: "Analyse et optimisation de vos processus",
    icon: "🧠",
    keywords: ["intelligence", "analyse", "optimisation"],
  },
  {
    id: 3,
    title: "Laboratoire numérique",
    description: "Solutions numériques et développement technologique",
    icon: "💻",
    keywords: ["numérique", "technologie", "digital", "développement"],
  },
  {
    id: 4,
    title: "Recrutement",
    description: "Aide au recrutement et placement professionnel",
    icon: "👥",
    keywords: ["recrutement", "emploi", "carrière"],
  },
  {
    id: 5,
    title: "Formation",
    description: "Formations professionnelles et développement de compétences",
    icon: "🎓",
    keywords: ["formation", "apprentissage", "compétences"],
  },
  {
    id: 6,
    title: "Fourniture de biens",
    description: "Fourniture de biens meubles et immeubles",
    icon: "📦",
    keywords: ["fourniture", "biens", "matériel"],
  },
  {
    id: 7,
    title: "Entrepreneuriat",
    description:
      "Accompagnement à la création et au développement d'entreprise",
    icon: "🚀",
    keywords: ["entrepreneuriat", "startup", "entreprise", "business"],
  },
  {
    id: 8,
    title: "Fiscalité",
    description:
      "Conseil fiscal et optimisation de votre situation fiscale",
    icon: "🧾",
    keywords: ["fiscalité", "impôts", "taxes", "fiscal"],
  },
  {
    id: 9,
    title: "Voyage",
    description:
      "Organisation et conseil pour vos voyages professionnels et personnels",
    icon: "✈️",
    keywords: ["voyage", "déplacement", "tourisme", "visa"],
  },
  {
    id: 10,
    title: "Commission acquisition ou vente",
    description:
      "Accompagnement dans l'achat ou la vente de biens meubles et immeubles",
    icon: "🤝",
    keywords: ["commission", "vente", "achat", "immobilier", "transaction"],
  },
];

export function ParticuliersPage({ onNavigate }: ParticuliersPageProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDomaines = domaines.filter((domaine) => {
    const query = searchQuery.toLowerCase();
    return (
      domaine.title.toLowerCase().includes(query) ||
      domaine.description.toLowerCase().includes(query) ||
      domaine.keywords.some((keyword) => keyword.includes(query))
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="text-center mb-12">
          <div
            className="inline-block px-4 py-2 rounded-full mb-4 text-sm"
            style={{
              backgroundColor: "var(--gbh-magenta-light)",
              color: "var(--gbh-magenta)",
            }}
          >
            FOR INDIVIDUALS
          </div>
          <h1 className="mb-4 text-[var(--gbh-black-soft)] text-4xl md:text-6xl">
            Services pour{" "}
            <span className="relative inline-block">
              <span className="relative z-10">Particuliers</span>
              <span
                className="absolute bottom-2 left-0 w-full h-3 -z-0"
                style={{ backgroundColor: "#D4FF00" }}
              ></span>
            </span>
          </h1>
          <p className="text-xl text-[var(--gbh-gray-text)]">
            Accédez à nos services professionnels sur rendez-vous
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-16">
          <div className="relative">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl">
              🔍
            </span>
            <Input
              type="text"
              placeholder="Rechercher un domaine (conseil, formation, numérique…)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-14 pr-6 py-7 text-lg rounded-2xl border-2 shadow-lg focus:shadow-xl transition-all"
              style={{
                borderColor: searchQuery ? "var(--gbh-magenta)" : undefined,
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDomaines.map((domaine) => (
            <div
              key={domaine.id}
              className="group bg-white rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-[var(--gbh-magenta)] hover:-translate-y-1"
            >
              <div className="flex items-start gap-4 mb-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: "var(--gbh-magenta-light)" }}
                >
                  {domaine.icon}
                </div>
                <div className="flex-1">
                  <Badge
                    className="mb-2 rounded-full"
                    style={{
                      backgroundColor: "var(--gbh-magenta-light)",
                      color: "var(--gbh-magenta)",
                    }}
                  >
                    Consultation particulière
                  </Badge>
                </div>
              </div>
              <h3 className="text-[var(--gbh-black-soft)] mb-3">
                {domaine.title}
              </h3>
              <p className="text-[var(--gbh-gray-text)] mb-6 leading-relaxed">
                {domaine.description}
              </p>
              <Button
                onClick={() => onNavigate("rdv")}
                className="w-full rounded-full shadow-md hover:shadow-lg transition-all"
                style={{ backgroundColor: "var(--gbh-magenta)" }}
              >
                Consulter →
              </Button>
            </div>
          ))}
        </div>

        {filteredDomaines.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-xl text-[var(--gbh-gray-text)]">
              Aucun domaine trouvé pour "{searchQuery}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
