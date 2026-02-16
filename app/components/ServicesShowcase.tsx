import { useEffect, useMemo, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import {
  useCreateServiceTestimonialMutation,
  useGetServiceTestimonialsQuery,
  type Service,
} from "../store/api";

interface ServicesShowcaseProps {
  services: Service[];
  onNavigate: (page: string) => void;
}

type Domaine = {
  id: string;
  serviceId: string;
  icon: string;
  title: string;
  shortDescription: string;
  description: string;
  features: string[];
  category?: string;
  forAudience?: string;
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
  if (service.benefits?.length) return service.benefits;

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
  if (key.includes("recrutement")) {
    return ["Sourcing de talents", "Évaluation candidats", "Placement professionnel"];
  }
  if (key.includes("formation")) {
    return ["Formation sur mesure", "Certification", "Coaching professionnel"];
  }
  if (key.includes("fourniture")) {
    return ["Biens meubles", "Biens immeubles", "Équipements professionnels"];
  }
  if (key.includes("entrepreneuriat") || key.includes("entreprise")) {
    return ["Création d'entreprise", "Développement business", "Stratégie de croissance"];
  }
  if (key.includes("fiscal")) {
    return ["Conseil fiscal", "Optimisation fiscale", "Conformité réglementaire"];
  }
  if (key.includes("voyage")) return ["Organisation de voyages", "Conseil visa", "Logistique déplacements"];
  if (key.includes("commission") || key.includes("vente")) {
    return ["Transactions immobilières", "Évaluation de biens", "Négociation"];
  }
  return ["Accompagnement personnalisé", "Expertise dédiée", "Suivi continu"];
};

const getErrorMessage = (error: unknown) => {
  if (!error || typeof error !== "object") {
    return "Impossible d'enregistrer votre témoignage.";
  }

  if ("data" in error) {
    const data = (error as { data?: unknown }).data;
    if (typeof data === "string" && data.trim()) {
      return data;
    }
    if (data && typeof data === "object" && "error" in data) {
      const apiError = (data as { error?: unknown }).error;
      if (typeof apiError === "string" && apiError.trim()) {
        return apiError;
      }
    }
  }

  return "Impossible d'enregistrer votre témoignage.";
};

const stars = (rating: number) => `${rating}/5`;

const getHttpStatus = (error: unknown) => {
  if (!error || typeof error !== "object") return null;
  if ("status" in error && typeof (error as { status?: unknown }).status === "number") {
    return (error as { status: number }).status;
  }
  return null;
};

export function ServicesShowcase({ services, onNavigate }: ServicesShowcaseProps) {
  const [selectedDomaine, setSelectedDomaine] = useState<Domaine | null>(null);
  const [isTestimonialsEndpointDisabled, setIsTestimonialsEndpointDisabled] = useState(false);
  const [createTestimonial, createTestimonialState] = useCreateServiceTestimonialMutation();
  const [testimonialForm, setTestimonialForm] = useState({
    name: "",
    rating: 5,
    message: "",
  });
  const [testimonialMessage, setTestimonialMessage] = useState<string | null>(null);
  const [testimonialSuccess, setTestimonialSuccess] = useState(false);

  const domaines = useMemo(() => {
    return services.map((service, index) => {
      const serviceId = service.id || service._id || "";
      return {
        id: serviceId || service.slug || String(index),
        serviceId,
        icon: iconForService(service),
        title: service.name,
        shortDescription: service.shortDescription || service.description || "Description à venir.",
        description: service.description || service.shortDescription || "Description à venir.",
        features: featureForService(service),
        category: service.category,
        forAudience: service.forAudience,
      };
    });
  }, [services]);

  const selectedServiceId = selectedDomaine?.serviceId || "";
  const {
    data: testimonialsData,
    isFetching: isTestimonialsLoading,
    isError: isTestimonialsError,
    error: testimonialsError,
  } = useGetServiceTestimonialsQuery(selectedServiceId, {
    skip: !selectedServiceId || isTestimonialsEndpointDisabled,
  });

  const testimonials = testimonialsData?.testimonials ?? [];
  const averageRating = testimonials.length
    ? testimonials.reduce((acc, item) => acc + (item.rating || 0), 0) / testimonials.length
    : 0;

  useEffect(() => {
    const status = getHttpStatus(testimonialsError);
    if (status === 404 || status === 405) {
      setIsTestimonialsEndpointDisabled(true);
    }
  }, [testimonialsError]);

  const handleOpenDomaine = (domaine: Domaine) => {
    setSelectedDomaine(domaine);
    setTestimonialMessage(null);
    setTestimonialSuccess(false);
    setTestimonialForm({ name: "", rating: 5, message: "" });
  };

  const handleSubmitTestimonial = async (event: React.FormEvent) => {
    event.preventDefault();
    setTestimonialMessage(null);
    setTestimonialSuccess(false);

    if (isTestimonialsEndpointDisabled) {
      setTestimonialMessage("Les témoignages ne sont pas encore disponibles.");
      return;
    }

    if (!selectedDomaine?.serviceId) {
      setTestimonialMessage("Service invalide.");
      return;
    }

    try {
      await createTestimonial({
        serviceId: selectedDomaine.serviceId,
        name: testimonialForm.name.trim(),
        rating: testimonialForm.rating,
        message: testimonialForm.message.trim(),
      }).unwrap();

      setTestimonialSuccess(true);
      setTestimonialMessage("Merci, votre témoignage a bien été enregistré.");
      setTestimonialForm({ name: "", rating: 5, message: "" });
    } catch (error) {
      const status = getHttpStatus(error);
      if (status === 404 || status === 405) {
        setIsTestimonialsEndpointDisabled(true);
      }
      setTestimonialMessage(getErrorMessage(error));
    }
  };

  if (!domaines.length) return null;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

            <p className="text-[var(--gbh-gray-text)] mb-6 line-clamp-3">
              {domaine.shortDescription}
            </p>

            <div className="space-y-2 mb-6">
              {domaine.features.slice(0, 3).map((feature) => (
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

            <div className="flex gap-3">
              <Button
                onClick={() => handleOpenDomaine(domaine)}
                variant="outline"
                className="flex-1"
                style={{
                  borderColor: "var(--gbh-magenta)",
                  color: "var(--gbh-magenta)",
                }}
              >
                Voir détail
              </Button>
              <Button
                onClick={() => onNavigate("rdv")}
                className="flex-1"
                style={{ backgroundColor: "var(--gbh-magenta)" }}
              >
                RDV
              </Button>
            </div>
          </div>
        ))}
      </div>

      {selectedDomaine && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8"
          role="dialog"
          aria-modal="true"
          aria-label={`Détail du service ${selectedDomaine.title}`}
          onClick={() => setSelectedDomaine(null)}
        >
          <div
            className="w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--gbh-gray-text)]">
                  Détail domaine
                </p>
                <h3 className="mt-2 text-2xl text-[var(--gbh-black-soft)]">
                  {selectedDomaine.title}
                </h3>
              </div>
              <button
                type="button"
                className="rounded-full border border-gray-200 px-3 py-1 text-sm text-[var(--gbh-gray-text)] hover:border-[var(--gbh-magenta)] hover:text-[var(--gbh-magenta)] transition-colors"
                onClick={() => setSelectedDomaine(null)}
              >
                Fermer
              </button>
            </div>

            <div className="px-8 py-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-[var(--gbh-gray-text)]">
                    {selectedDomaine.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedDomaine.category && (
                    <Badge className="rounded-full bg-[var(--gbh-magenta-light)] text-[var(--gbh-magenta)]">
                      {selectedDomaine.category}
                    </Badge>
                  )}
                  {selectedDomaine.forAudience && (
                    <Badge className="rounded-full bg-[var(--gbh-gray-ui)] text-[var(--gbh-gray-text)]">
                      {selectedDomaine.forAudience}
                    </Badge>
                  )}
                </div>

                <div>
                  <h4 className="text-lg text-[var(--gbh-black-soft)] mb-3">
                    Ce que nous couvrons
                  </h4>
                  <div className="space-y-2">
                    {selectedDomaine.features.map((feature) => (
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
                </div>

                <Button
                  onClick={() => {
                    setSelectedDomaine(null);
                    onNavigate("rdv");
                  }}
                  className="rounded-full"
                  style={{ backgroundColor: "var(--gbh-magenta)" }}
                >
                  Prendre rendez-vous pour ce service
                </Button>
              </div>

              <div className="space-y-6">
                <div className="rounded-2xl border border-gray-100 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg text-[var(--gbh-black-soft)]">
                      Témoignages
                    </h4>
                    <Badge className="rounded-full bg-[var(--gbh-gray-ui)] text-[var(--gbh-gray-text)]">
                      {testimonials.length} avis
                    </Badge>
                  </div>
                  {testimonials.length > 0 && (
                    <p className="text-sm text-[var(--gbh-gray-text)] mb-4">
                      Note moyenne: {averageRating.toFixed(1)} / 5
                    </p>
                  )}
                  {isTestimonialsEndpointDisabled && (
                    <p className="text-sm text-[var(--gbh-gray-text)]">
                      Les témoignages ne sont pas encore disponibles sur ce serveur.
                    </p>
                  )}
                  {isTestimonialsLoading && (
                    <p className="text-sm text-[var(--gbh-gray-text)]">
                      Chargement des témoignages...
                    </p>
                  )}
                  {!isTestimonialsEndpointDisabled &&
                    !isTestimonialsLoading &&
                    isTestimonialsError && (
                      <p className="text-sm text-rose-600">
                        Impossible de charger les témoignages.
                      </p>
                    )}
                  {!isTestimonialsEndpointDisabled &&
                    !isTestimonialsLoading &&
                    !isTestimonialsError &&
                    testimonials.length === 0 && (
                      <p className="text-sm text-[var(--gbh-gray-text)]">
                        Aucun témoignage pour ce service.
                      </p>
                    )}
                  {!isTestimonialsEndpointDisabled && (
                    <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                      {testimonials.map((item, index) => {
                        const key = item.id || item._id || `${item.name}-${index}`;
                        return (
                          <div key={key} className="rounded-xl bg-[var(--gbh-gray-ui)]/70 p-3">
                            <div className="flex items-center justify-between gap-3">
                              <p className="font-semibold text-[var(--gbh-black-soft)]">
                                {item.name}
                              </p>
                              <p className="text-xs text-[var(--gbh-magenta)]">
                                {stars(item.rating)}
                              </p>
                            </div>
                            <p className="text-sm text-[var(--gbh-gray-text)] mt-2">
                              {item.message}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {!isTestimonialsEndpointDisabled && (
                  <form
                    className="rounded-2xl border border-gray-100 p-5 space-y-4"
                    onSubmit={handleSubmitTestimonial}
                  >
                    <h4 className="text-lg text-[var(--gbh-black-soft)]">
                      Laisser un témoignage
                    </h4>
                    <Input
                      placeholder="Votre nom"
                      value={testimonialForm.name}
                      onChange={(event) =>
                        setTestimonialForm((prev) => ({ ...prev, name: event.target.value }))
                      }
                      required
                    />
                    <div>
                      <div className="text-sm text-[var(--gbh-gray-text)] mb-2">Votre note</div>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <button
                            key={value}
                            type="button"
                            className={`h-9 w-9 rounded-full border text-sm ${
                              testimonialForm.rating === value
                                ? "border-[var(--gbh-magenta)] bg-[var(--gbh-magenta-light)] text-[var(--gbh-magenta)]"
                                : "border-gray-200 text-[var(--gbh-gray-text)]"
                            }`}
                            onClick={() =>
                              setTestimonialForm((prev) => ({ ...prev, rating: value }))
                            }
                          >
                            {value}
                          </button>
                        ))}
                      </div>
                    </div>
                    <Textarea
                      placeholder="Votre retour d'expérience"
                      value={testimonialForm.message}
                      onChange={(event) =>
                        setTestimonialForm((prev) => ({ ...prev, message: event.target.value }))
                      }
                      required
                    />
                    {testimonialMessage && (
                      <div
                        className={`rounded-2xl px-4 py-3 text-sm ${
                          testimonialSuccess
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-rose-50 text-rose-700"
                        }`}
                      >
                        {testimonialMessage}
                      </div>
                    )}
                    <Button
                      type="submit"
                      className="rounded-full"
                      style={{ backgroundColor: "var(--gbh-magenta)" }}
                      disabled={createTestimonialState.isLoading || !selectedDomaine.serviceId}
                    >
                      {createTestimonialState.isLoading ? "Envoi..." : "Publier le témoignage"}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
