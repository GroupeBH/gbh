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

const ServicesLoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse mb-8">
    {Array.from({ length: 6 }).map((_, index) => (
      <div
        key={`particuliers-skeleton-${index}`}
        className="rounded-2xl border border-[var(--gbh-magenta-light)] bg-white/80 p-6 shadow-sm"
      >
        <div className="h-10 w-10 rounded-xl bg-[var(--gbh-magenta-light)]" />
        <div className="mt-4 h-5 w-3/4 rounded bg-[var(--gbh-magenta-light)]" />
        <div className="mt-3 h-4 w-full rounded bg-[var(--gbh-gray-ui)]" />
        <div className="mt-2 h-4 w-5/6 rounded bg-[var(--gbh-gray-ui)]" />
        <div className="mt-5 h-9 w-full rounded-xl bg-[var(--gbh-magenta-light)]" />
      </div>
    ))}
  </div>
);

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
    <div className="min-h-screen bg-[linear-gradient(140deg,#f6effb,#f7fbff)]">
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
            Services pour Particuliers
          </h1>
          <p className="text-xl text-[var(--gbh-gray-text)]">
            Accedez a nos services professionnels sur rendez-vous
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-16">
          <div className="relative">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl">S</span>
            <Input
              type="text"
              placeholder="Rechercher un domaine (conseil, formation, numerique...)"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="pl-14 pr-6 py-7 text-lg rounded-2xl border-2 shadow-lg focus:shadow-xl transition-all"
              style={{
                borderColor: searchQuery ? "var(--gbh-magenta)" : undefined,
              }}
            />
          </div>
        </div>

        {isLoading && <ServicesLoadingSkeleton />}

        {!isLoading && isError && (
          <div className="text-center text-rose-600 mb-8">
            Impossible de charger les domaines. Verifiez que le backend est en ligne.
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
            <div className="text-6xl mb-4">S</div>
            <p className="text-xl text-[var(--gbh-gray-text)]">
              Aucun domaine trouve pour la recherche: {searchQuery}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
