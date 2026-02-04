import { Button } from "./ui/button";

interface DomainesPageProps {
  onNavigate: (page: string) => void;
}

export function DomainesPage({ onNavigate }: DomainesPageProps) {
  const domaines = [
    {
      icon: "💼",
      title: "Conseil stratégique",
      description:
        "Accompagnement dans la définition et la mise en œuvre de stratégies efficaces pour particuliers et organisations.",
      features: ["Audit stratégique", "Plans d'action", "Suivi personnalisé"],
    },
    {
      icon: "🧠",
      title: "Intelligence opérationnelle",
      description:
        "Solutions d'analyse avancée et d'optimisation des processus pour maximiser votre performance.",
      features: [
        "Business Intelligence",
        "Analyse de données",
        "Optimisation processus",
      ],
    },
    {
      icon: "💻",
      title: "Laboratoire numérique",
      description:
        "Innovation technologique et transformation digitale adaptées à vos besoins spécifiques.",
      features: ["Développement sur mesure", "Innovation tech", "Transformation digitale"],
    },
    {
      icon: "👥",
      title: "Recrutement",
      description:
        "Sélection et placement de talents qualifiés pour renforcer vos équipes.",
      features: ["Sourcing de talents", "Évaluation candidats", "Placement professionnel"],
    },
    {
      icon: "🎓",
      title: "Formation",
      description:
        "Programmes de formation professionnelle pour développer les compétences de vos équipes.",
      features: ["Formation sur mesure", "Certification", "Coaching professionnel"],
    },
    {
      icon: "📦",
      title: "Fourniture de biens et services",
      description:
        "Approvisionnement en biens meubles et immeubles de qualité pour vos projets.",
      features: [
        "Biens meubles",
        "Biens immeubles",
        "Équipements professionnels",
      ],
    },
    {
      icon: "🚀",
      title: "Entrepreneuriat",
      description:
        "Accompagnement complet pour créer, développer et pérenniser votre entreprise.",
      features: [
        "Création d'entreprise",
        "Développement business",
        "Stratégie de croissance",
      ],
    },
    {
      icon: "🧾",
      title: "Fiscalité",
      description:
        "Conseil fiscal et optimisation de votre situation fiscale pour particuliers et organisations.",
      features: ["Conseil fiscal", "Optimisation fiscale", "Conformité réglementaire"],
    },
    {
      icon: "✈️",
      title: "Voyage",
      description:
        "Organisation et conseil pour vos déplacements professionnels et personnels.",
      features: [
        "Organisation de voyages",
        "Conseil visa",
        "Logistique déplacements",
      ],
    },
    {
      icon: "🤝",
      title: "Commission acquisition ou vente",
      description:
        "Accompagnement dans toutes vos transactions de biens meubles et immeubles.",
      features: [
        "Transactions immobilières",
        "Évaluation de biens",
        "Négociation",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="mb-6 text-[var(--gbh-black-soft)]">
            Domaines d'expertise GBH
          </h1>
          <p className="text-xl text-[var(--gbh-gray-text)] max-w-3xl mx-auto">
            Découvrez l'ensemble de nos domaines d'intervention et trouvez la
            solution adaptée à vos besoins
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {domaines.map((domaine, index) => (
            <div
              key={index}
              className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:shadow-2xl transition-all hover:border-[var(--gbh-magenta)] group"
            >
              <div
                className="w-16 h-16 rounded-xl mb-6 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform"
                style={{ backgroundColor: "var(--gbh-magenta-light)" }}
              >
                {domaine.icon}
              </div>

              <h3 className="mb-4 text-[var(--gbh-black-soft)]">
                {domaine.title}
              </h3>

              <p className="text-[var(--gbh-gray-text)] mb-6">
                {domaine.description}
              </p>

              <div className="space-y-2 mb-6">
                {domaine.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: "var(--gbh-magenta)" }}
                    ></div>
                    <span className="text-sm text-[var(--gbh-gray-text)]">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => onNavigate("rdv")}
                variant="outline"
                className="w-full"
                style={{
                  borderColor: "var(--gbh-magenta)",
                  color: "var(--gbh-magenta)",
                }}
              >
                Prendre rendez-vous
              </Button>
            </div>
          ))}
        </div>

        <div
          className="rounded-2xl p-12 text-center"
          style={{ backgroundColor: "var(--gbh-magenta)" }}
        >
          <h2 className="mb-4 text-white">
            Besoin d'une solution personnalisée ?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Contactez-nous pour discuter de vos besoins spécifiques et obtenir
            une solution sur mesure
          </p>
          <Button
            onClick={() => onNavigate("contact")}
            size="lg"
            className="bg-white hover:bg-gray-100"
            style={{ color: "var(--gbh-magenta)" }}
          >
            Nous contacter
          </Button>
        </div>
      </div>
    </div>
  );
}
