import { useMemo, useState } from "react";
import { Input } from "./ui/input";
import { ServicesShowcase } from "./ServicesShowcase";
import { useGetServicesQuery, type Service } from "../store/api";

interface ParticuliersPageProps {
  onNavigate: (page: string) => void;
}

const isForIndividuals = (service: Service) => {
  const audience = (service.forAudience || "").toLowerCase();
  if (!audience) return true;
  return (
    audience.includes("particul") ||
    audience.includes("tous") ||
    audience.includes("all") ||
    audience.includes("both")
  );
};

const serviceMatchesQuery = (service: Service, query: string) => {
  const haystack = [
    service.name,
    service.shortDescription,
    service.description,
    service.category,
    service.forAudience,
    service.slug,
    ...(service.benefits ?? []),
  ]
    .filter(Boolean)
    .map((item) => String(item).toLowerCase());

  return haystack.some((item) => item.includes(query));
};

export function ParticuliersPage({ onNavigate }: ParticuliersPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isLoading, isError } = useGetServicesQuery();

  const individualServices = useMemo(
    () => (data?.services ?? []).filter(isForIndividuals),
    [data],
  );

  const filteredServices = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return individualServices;
    return individualServices.filter((service) => serviceMatchesQuery(service, query));
  }, [individualServices, searchQuery]);

  const hasServiceData = Boolean(individualServices.length);

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

        {isLoading && (
          <div className="text-center text-[var(--gbh-gray-text)] mb-8">
            Chargement des services...
          </div>
        )}
        {!isLoading && isError && (
          <div className="text-center text-rose-600 mb-8">
            Impossible de charger les domaines. Vérifiez que l'API est en ligne.
          </div>
        )}
        {!isLoading && !isError && !hasServiceData && (
          <div className="text-center text-[var(--gbh-gray-text)] mb-8">
            Aucun domaine disponible pour le moment.
          </div>
        )}

        {!isLoading && !isError && filteredServices.length > 0 && (
          <ServicesShowcase services={filteredServices} onNavigate={onNavigate} />
        )}

        {hasServiceData && filteredServices.length === 0 && (
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
