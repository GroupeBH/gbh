import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ServicesShowcase } from "./ServicesShowcase";
import { useMemo, useState } from "react";
import { useGetServicesQuery, useLookupAppointmentMutation, type Appointment } from "../store/api";

interface HomePageProps {
  onNavigate: (page: string) => void;
}

const formatDateDisplay = (date?: string) => {
  if (!date) return "—";
  const [year, month, day] = date.split("-");
  if (!year || !month || !day) return date;
  return `${day}/${month}/${year}`;
};

const appointmentStatusLabel = (status?: string) => {
  const value = (status || "").toLowerCase();
  if (value === "booked" || value === "reserved" || value === "created") return "Réservé";
  if (value === "confirmed" || value === "confirmé") return "Confirmé";
  if (value === "pending" || value === "en_attente" || value === "awaiting") return "En attente";
  if (value === "canceled" || value === "cancelled" || value === "annulé") return "Annulé";
  return status || "—";
};

const appointmentTypeLabel = (type?: string) =>
  type === "presentiel" ? "Présentiel" : type === "online" ? "En ligne" : "—";

const paymentMethodLabel = (paymentMethod?: string) =>
  paymentMethod === "place"
    ? "Sur place"
    : paymentMethod === "online"
    ? "En ligne"
    : "—";

const getApiErrorMessage = (error: unknown, fallback: string) => {
  if (!error || typeof error !== "object") return fallback;

  if ("data" in error) {
    const data = (error as { data?: unknown }).data;
    if (typeof data === "string" && data.trim()) return data;
    if (data && typeof data === "object" && "error" in data) {
      const apiError = (data as { error?: unknown }).error;
      if (typeof apiError === "string" && apiError.trim()) return apiError;
    }
  }

  return fallback;
};

export function HomePage({ onNavigate }: HomePageProps) {
  const { data, isLoading, isError } = useGetServicesQuery();
  const [lookupAppointment, { isLoading: isLookupLoading }] = useLookupAppointmentMutation();
  const [lookupId, setLookupId] = useState("");
  const [lookupMessage, setLookupMessage] = useState<string | null>(null);
  const [lookupResult, setLookupResult] = useState<Appointment | null>(null);

  const services = data?.services ?? [];

  const heroLine = useMemo(() => {
    const labels = services
      .map((service) => service.category || service.name)
      .filter(Boolean)
      .map((label) => String(label).trim())
      .filter(Boolean);
    const unique = Array.from(new Set(labels));
    return unique.slice(0, 4).join(" • ");
  }, [services]);

  const serviceNameMap = useMemo(() => {
    const map = new Map<string, string>();
    services.forEach((service, index) => {
      const id = service.id || service._id || service.slug || String(index);
      if (id) map.set(id, service.name);
    });
    return map;
  }, [services]);

  const handleLookupSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLookupMessage(null);
    setLookupResult(null);

    const appointmentId = lookupId.trim();
    if (!appointmentId) {
      setLookupMessage("Veuillez renseigner un identifiant.");
      return;
    }

    try {
      const result = await lookupAppointment({ id: appointmentId }).unwrap();
      setLookupResult(result);
      setLookupMessage("Rendez-vous retrouvé.");
    } catch (error) {
      setLookupMessage(
        getApiErrorMessage(error, "Aucun rendez-vous trouvé pour cet identifiant."),
      );
    }
  };

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

      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-gray-100 bg-[var(--gbh-gray-ui)]/50 p-6 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
              <div>
                <h2 className="text-2xl text-[var(--gbh-black-soft)]">
                  Voir le détail d'une réservation
                </h2>
                <p className="text-sm text-[var(--gbh-gray-text)]">
                  Entrez l'identifiant reçu par email après la réservation.
                </p>
              </div>
              <form
                className="w-full lg:w-auto flex flex-col sm:flex-row gap-3"
                onSubmit={handleLookupSubmit}
              >
                <Input
                  value={lookupId}
                  onChange={(event) => setLookupId(event.target.value)}
                  placeholder="Ex: 67c9a2f7d2f0f9b0c9..."
                  className="sm:min-w-[320px] bg-white"
                />
                <Button
                  type="submit"
                  className="rounded-full"
                  style={{ backgroundColor: "var(--gbh-magenta)" }}
                  disabled={isLookupLoading}
                >
                  {isLookupLoading ? "Recherche..." : "Rechercher"}
                </Button>
              </form>
            </div>

            {lookupMessage && (
              <div
                className={`mt-4 rounded-2xl px-4 py-3 text-sm ${
                  lookupResult ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                }`}
              >
                {lookupMessage}
              </div>
            )}

            {lookupResult && (
              <div className="mt-4 rounded-2xl bg-white p-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-xs uppercase text-[var(--gbh-gray-text)]">
                    Référence
                  </div>
                  <div className="font-semibold text-[var(--gbh-black-soft)]">
                    {lookupResult.id || lookupResult._id || "—"}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase text-[var(--gbh-gray-text)]">
                    Service
                  </div>
                  <div className="font-semibold text-[var(--gbh-black-soft)]">
                    {lookupResult.serviceId
                      ? serviceNameMap.get(lookupResult.serviceId) || lookupResult.serviceId
                      : "—"}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase text-[var(--gbh-gray-text)]">
                    Date et heure
                  </div>
                  <div className="font-semibold text-[var(--gbh-black-soft)]">
                    {formatDateDisplay(lookupResult.date)} · {lookupResult.time || "—"}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase text-[var(--gbh-gray-text)]">
                    Statut
                  </div>
                  <div className="font-semibold text-[var(--gbh-black-soft)]">
                    {appointmentStatusLabel(lookupResult.status)}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase text-[var(--gbh-gray-text)]">
                    Type
                  </div>
                  <div className="font-semibold text-[var(--gbh-black-soft)]">
                    {appointmentTypeLabel(lookupResult.type)}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase text-[var(--gbh-gray-text)]">
                    Paiement
                  </div>
                  <div className="font-semibold text-[var(--gbh-black-soft)]">
                    {paymentMethodLabel(lookupResult.paymentMethod)}
                  </div>
                </div>
              </div>
            )}
          </div>
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
          {!isLoading && !isError && services.length === 0 && (
            <div className="text-center text-[var(--gbh-gray-text)] mb-8">
              Aucun domaine disponible pour le moment.
            </div>
          )}

          {!isLoading && !isError && services.length > 0 && (
            <ServicesShowcase services={services} onNavigate={onNavigate} />
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
