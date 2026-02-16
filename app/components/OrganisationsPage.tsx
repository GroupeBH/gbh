import { Button } from "./ui/button";
import { useMemo } from "react";
import { ServicesShowcase } from "./ServicesShowcase";
import { useGetServicesQuery, type Service } from "../store/api";

interface OrganisationsPageProps {
  onNavigate: (page: string) => void;
}

const isForOrganizations = (service: Service) => {
  const audience = (service.forAudience || "").toLowerCase();
  if (!audience) return true;
  return (
    audience.includes("organis") ||
    audience.includes("entreprise") ||
    audience.includes("institution") ||
    audience.includes("business") ||
    audience.includes("pro") ||
    audience.includes("tous") ||
    audience.includes("all") ||
    audience.includes("both")
  );
};

export function OrganisationsPage({ onNavigate }: OrganisationsPageProps) {
  const { data, isLoading, isError } = useGetServicesQuery();

  const services = useMemo(
    () => (data?.services ?? []).filter(isForOrganizations),
    [data],
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="bg-gradient-to-br from-white/80 to-transparent backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div
              className="inline-block px-4 py-2 rounded-full mb-6 text-sm"
              style={{
                backgroundColor: "var(--gbh-magenta-light)",
                color: "var(--gbh-magenta)",
              }}
            >
              FOR ORGANIZATIONS
            </div>
            <h1 className="mb-6 text-[var(--gbh-black-soft)] text-4xl md:text-6xl">
              Solutions pour{" "}
              <span className="relative inline-block">
                <span className="relative z-10">Organisations</span>
                <span
                  className="absolute bottom-2 left-0 w-full h-3 -z-0"
                  style={{ backgroundColor: "#D4FF00" }}
                ></span>
              </span>
            </h1>
            <p className="text-2xl text-[var(--gbh-gray-text)]">
              Des solutions sur mesure pour les entreprises et institutions
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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
        {!isLoading && !isError && services.length === 0 && (
          <div className="text-center text-[var(--gbh-gray-text)] mb-8">
            Aucun domaine disponible pour le moment.
          </div>
        )}

        {!isLoading && !isError && services.length > 0 && (
          <div className="mb-16">
            <ServicesShowcase services={services} onNavigate={onNavigate} />
          </div>
        )}

        <div
          className="rounded-3xl p-10 md:p-12 mb-12 shadow-xl"
          style={{ backgroundColor: "var(--gbh-magenta-light)" }}
        >
          <h2
            className="mb-8 text-center text-3xl md:text-4xl"
            style={{ color: "var(--gbh-magenta-dark)" }}
          >
            Avantages pour les organisations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 hover:shadow-lg transition-all">
              <div className="text-3xl mb-4">✅</div>
              <h4 className="mb-2" style={{ color: "var(--gbh-magenta-dark)" }}>
                Rendez-vous gratuits
              </h4>
              <p className="text-[var(--gbh-gray-text)]">
                Première consultation sans frais pour évaluer vos besoins
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 hover:shadow-lg transition-all">
              <div className="text-3xl mb-4">✅</div>
              <h4 className="mb-2" style={{ color: "var(--gbh-magenta-dark)" }}>
                Abonnements mensuels
              </h4>
              <p className="text-[var(--gbh-gray-text)]">
                Consultations régulières par abonnement adapté
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 hover:shadow-lg transition-all">
              <div className="text-3xl mb-4">✅</div>
              <h4 className="mb-2" style={{ color: "var(--gbh-magenta-dark)" }}>
                Contrats sur mesure
              </h4>
              <p className="text-[var(--gbh-gray-text)]">
                Engagements personnalisés après discussion de vos besoins
              </p>
            </div>
          </div>
        </div>

        <div className="text-center bg-white rounded-3xl p-12 md:p-16 shadow-2xl">
          <div
            className="inline-block px-6 py-2 rounded-full mb-6"
            style={{ backgroundColor: "#D4FF00" }}
          >
            <span className="font-semibold text-[var(--gbh-black-soft)]">
              GET STARTED
            </span>
          </div>
          <h2 className="mb-6 text-[var(--gbh-black-soft)] text-3xl md:text-4xl">
            Prêt à collaborer ?
          </h2>
          <p className="text-xl mb-8 text-[var(--gbh-gray-text)] max-w-2xl mx-auto">
            Demandez un rendez-vous pour discuter de vos projets
          </p>
          <Button
            onClick={() => onNavigate("rdv")}
            size="lg"
            className="text-lg px-10 py-7 rounded-full shadow-lg hover:shadow-xl transition-all"
            style={{ backgroundColor: "var(--gbh-magenta)" }}
          >
            Demander un rendez-vous institutionnel →
          </Button>
        </div>
      </div>
    </div>
  );
}
