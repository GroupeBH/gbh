import { useMemo } from "react";
import { Button } from "./ui/button";
import { useGetServicesQuery, type Service } from "../store/api";

interface DomainesPageProps {
  onNavigate: (page: string) => void;
}

type Domaine = {
  id: string;
  icon: string;
  title: string;
  description: string;
  features: string[];
};

const iconForService = (service: Service) => {
  const key = `${service.slug || ""} ${service.name || ""}`.toLowerCase();
  if (key.includes("conseil")) return "💼";
  if (key.includes("intelligence")) return "🧠";
  if (key.includes("numérique") || key.includes("numerique") || key.includes("digital")) {
    return "💻";
  }
  if (key.includes("recrutement")) return "👥";
  if (key.includes("formation")) return "🎓";
  if (key.includes("fourniture")) return "📦";
  if (key.includes("entrepreneuriat") || key.includes("entreprise")) return "🚀";
  if (key.includes("fiscal")) return "🧾";
  if (key.includes("voyage")) return "✈️";
  if (key.includes("commission") || key.includes("vente")) return "🤝";
  return "✨";
};

const featureForService = (service: Service) => {
  const key = `${service.slug || ""} ${service.name || ""}`.toLowerCase();
  if (key.includes("conseil")) return ["Audit stratégique", "Plans d'action", "Suivi personnalisé"];
  if (key.includes("intelligence")) return [
    "Business Intelligence",
    "Analyse de données",
    "Optimisation processus",
  ];
  if (key.includes("numérique") || key.includes("numerique") || key.includes("digital")) {
    return ["Développement sur mesure", "Innovation tech", "Transformation digitale"];
  }
  if (key.includes("recrutement")) return ["Sourcing de talents", "Évaluation candidats", "Placement professionnel"];
  if (key.includes("formation")) return ["Formation sur mesure", "Certification", "Coaching professionnel"];
  if (key.includes("fourniture")) return ["Biens meubles", "Biens immeubles", "Équipements professionnels"];
  if (key.includes("entrepreneuriat") || key.includes("entreprise")) {
    return ["Création d'entreprise", "Développement business", "Stratégie de croissance"];
  }
  if (key.includes("fiscal")) return ["Conseil fiscal", "Optimisation fiscale", "Conformité réglementaire"];
  if (key.includes("voyage")) return ["Organisation de voyages", "Conseil visa", "Logistique déplacements"];
  if (key.includes("commission") || key.includes("vente")) return [
    "Transactions immobilières",
    "Évaluation de biens",
    "Négociation",
  ];
  return ["Accompagnement personnalisé", "Expertise dédiée", "Suivi continu"];
};

export function DomainesPage({ onNavigate }: DomainesPageProps) {
  const { data, isLoading, isError } = useGetServicesQuery();

  const domaines = useMemo(() => {
    return (data?.services ?? []).map((service, index) => ({
      id: service.id || service._id || service.slug || String(index),
      icon: iconForService(service),
      title: service.name,
      description: service.description,
      features: featureForService(service),
    }));
  }, [data]);

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

        {isLoading && (
          <div className="text-center text-[var(--gbh-gray-text)] mb-8">
            Chargement des domaines...
          </div>
        )}
        {!isLoading && isError && (
          <div className="text-center text-rose-600 mb-8">
            Impossible de charger les domaines. Vérifiez que l'API est en ligne.
          </div>
        )}
        {!isLoading && !isError && domaines.length === 0 && (
          <div className="text-center text-[var(--gbh-gray-text)] mb-8">
            Aucun domaine disponible pour le moment.
          </div>
        )}

        {domaines.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {domaines.map((domaine) => (
              <div
                key={domaine.id}
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
                  {domaine.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
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
        )}

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
