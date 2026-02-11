import { Button } from "./ui/button";
import { useMemo } from "react";
import { useGetServicesQuery, type Service } from "../store/api";

interface HomePageProps {
  onNavigate: (page: string) => void;
}

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

export function HomePage({ onNavigate }: HomePageProps) {
  const { data, isLoading, isError } = useGetServicesQuery();

  const domaines = useMemo(() => {
    return (data?.services ?? []).map((service, index) => ({
      id: service.id || service._id || service.slug || String(index),
      title: service.name,
      description: service.description || "Description à venir.",
      icon: iconForService(service),
    }));
  }, [data]);

  const heroLine = useMemo(() => {
    const labels = (data?.services ?? [])
      .map((service) => service.category || service.name)
      .filter(Boolean)
      .map((label) => String(label).trim())
      .filter(Boolean);
    const unique = Array.from(new Set(labels));
    return unique.slice(0, 4).join(" • ");
  }, [data]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div
              className="inline-block px-4 py-2 rounded-full mb-6 text-sm"
              style={{
                backgroundColor: "var(--gbh-magenta-light)",
                color: "var(--gbh-magenta)",
              }}
            >
              WE CAN HELP YOU
            </div>
            <h1 className="text-5xl md:text-7xl mb-6 text-[var(--gbh-black-soft)] leading-tight">
              Groupe{" "}
              <span className="relative inline-block">
                <span className="relative z-10">B-Holding</span>
                <span
                  className="absolute bottom-2 left-0 w-full h-3 -z-0"
                  style={{ backgroundColor: "#D4FF00" }}
                ></span>
              </span>{" "}
              Sarl
            </h1>
            <p
              className="text-2xl md:text-3xl mb-4"
              style={{ color: "var(--gbh-magenta)" }}
            >
              {heroLine || "Nos services professionnels"}
            </p>
            <p className="text-xl mb-12 text-[var(--gbh-gray-text)] leading-relaxed">
              Une entreprise multiservices au service des particuliers et des
              organisations en RDC
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => onNavigate("particuliers")}
                size="lg"
                className="text-lg px-8 py-7 rounded-full shadow-lg hover:shadow-xl transition-all"
                style={{ backgroundColor: "var(--gbh-magenta)" }}
              >
                Particuliers
              </Button>
              <Button
                onClick={() => onNavigate("organisations")}
                size="lg"
                variant="outline"
                className="text-lg px-8 py-7 rounded-full border-2 hover:shadow-lg transition-all"
                style={{
                  borderColor: "var(--gbh-magenta)",
                  color: "var(--gbh-magenta)",
                }}
              >
                Organisations
              </Button>
            </div>
          </div>

          <div className="relative h-[500px] hidden lg:block">
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 p-8 rounded-3xl shadow-2xl backdrop-blur-sm"
              style={{ backgroundColor: "rgba(196, 0, 255, 0.95)" }}
            >
              <div className="text-white">
                <div className="text-6xl font-bold mb-2">50K</div>
                <div className="text-xl opacity-90">Consultations réalisées</div>
              </div>
            </div>

            <div className="absolute top-10 right-10 bg-white p-6 rounded-2xl shadow-xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400"></div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400"></div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-400"></div>
                </div>
              </div>
              <div className="text-2xl font-bold text-[var(--gbh-black-soft)]">
                1000+
              </div>
              <div className="text-sm text-[var(--gbh-gray-text)]">
                Clients satisfaits
              </div>
            </div>

            <div className="absolute bottom-20 left-0 bg-white p-6 rounded-2xl shadow-xl">
              <div className="text-sm text-[var(--gbh-gray-text)] mb-1">
                Satisfaction client
              </div>
              <div
                className="text-4xl font-bold"
                style={{ color: "var(--gbh-magenta)" }}
              >
                98%
              </div>
            </div>

            <div
              className="absolute top-1/4 left-0 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ backgroundColor: "#D4FF00" }}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-[var(--gbh-gray-text)] mb-8">
            Trusted by leading organizations in DRC
          </p>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl mb-4 text-[var(--gbh-black-soft)]">
              Better <span style={{ color: "var(--gbh-magenta)" }}>Insights,</span> Outcomes.
            </h2>
            <p className="text-xl text-[var(--gbh-gray-text)] max-w-2xl mx-auto">
              Nos domaines d'expertise pour vous accompagner
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {domaines.map((service) => (
                <div
                  key={service.id}
                  className="group bg-gradient-to-br from-white to-gray-50 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-[var(--gbh-magenta)]"
                >
                  <div
                    className="w-16 h-16 rounded-2xl mb-6 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: "var(--gbh-magenta-light)" }}
                  >
                    {service.icon}
                  </div>
                  <h3 className="mb-3 text-[var(--gbh-black-soft)]">
                    {service.title}
                  </h3>
                  <p className="text-[var(--gbh-gray-text)] leading-relaxed">
                    {service.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 md:py-32 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-12 md:p-16 shadow-2xl text-center">
            <div
              className="inline-block px-6 py-2 rounded-full mb-6"
              style={{ backgroundColor: "#D4FF00" }}
            >
              <span className="font-semibold text-[var(--gbh-black-soft)]">
                START TODAY
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl mb-6 text-[var(--gbh-black-soft)]">
              Prêt à démarrer ?
            </h2>
            <p className="text-xl mb-10 text-[var(--gbh-gray-text)] max-w-2xl mx-auto">
              Prenez rendez-vous dès maintenant pour bénéficier de nos services
              professionnels
            </p>
            <Button
              onClick={() => onNavigate("rdv")}
              size="lg"
              className="text-lg px-10 py-7 rounded-full shadow-lg hover:shadow-xl transition-all"
              style={{ backgroundColor: "var(--gbh-magenta)" }}
            >
              Prendre rendez-vous →
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

