import { useMemo, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useGetServicesQuery, type Service } from "../store/api";

interface ParticuliersPageProps {
  onNavigate: (page: string) => void;
}

type Domaine = {
  id: string;
  title: string;
  description: string;
  icon: string;
  keywords: string[];
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

export function ParticuliersPage({ onNavigate }: ParticuliersPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isLoading, isError } = useGetServicesQuery();

  const domaines = useMemo(() => {
    return (data?.services ?? [])
      .filter(isForIndividuals)
      .map((service, index) => ({
        id: service.id || service._id || service.slug || String(index),
        title: service.name,
        description: service.description,
        icon: iconForService(service),
        keywords: [service.name, service.category, service.forAudience, service.description]
          .filter(Boolean)
          .map((item) => String(item).toLowerCase()),
      }));
  }, [data]);

  const filteredDomaines = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return domaines.filter((domaine) => {
      return (
        domaine.title.toLowerCase().includes(query) ||
        domaine.description.toLowerCase().includes(query) ||
        domaine.keywords.some((keyword) => keyword.includes(query))
      );
    });
  }, [domaines, searchQuery]);

  const hasServiceData = Boolean(data?.services?.length);

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

        {filteredDomaines.length > 0 && (
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
        )}

        {hasServiceData && filteredDomaines.length === 0 && (
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
