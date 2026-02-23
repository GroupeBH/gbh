import { Button } from "./ui/button";
import { DomainsSection } from "./DomainsSection";

interface DomainesPageProps {
  onNavigate: (page: string) => void;
}

export function DomainesPage({ onNavigate }: DomainesPageProps) {
  return (
    <div className="min-h-screen">
      <section className="border-b border-purple-200/60 bg-[radial-gradient(circle_at_top_right,#dfd2ff_0%,#f3f8ff_45%,#ffffff_100%)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-18 md:py-22">
          <h1 className="text-4xl md:text-5xl text-purple-900">Domaines expertise GBH</h1>
          <p className="mt-5 text-lg text-purple-700 max-w-3xl">
            Une section robuste qui reste utilisable meme en cas indisponibilite API
            grace au mode fallback.
          </p>
        </div>
      </section>

      <DomainsSection
        title="Nos domaines"
        subtitle="Explorez les capacites disponibles pour les missions B2B et les besoins B2C."
        onBookAppointment={() => onNavigate("rdv")}
      />

      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-purple-200 bg-white/85 p-8 text-center shadow-[0_16px_30px_rgba(70,28,172,0.14)]">
            <h2 className="text-3xl text-purple-900">Besoin de cadrage specifique ?</h2>
            <p className="mt-3 text-purple-700 max-w-2xl mx-auto">
              Lancez une demande de proposition B2B ou planifiez un rendez-vous selon votre
              niveau de maturite projet.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
              <Button
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.location.href = "/organisations";
                  }
                }}
                className="rounded-full"
              >
                Demander une proposition
              </Button>
              <Button
                onClick={() => onNavigate("rdv")}
                variant="outline"
                className="rounded-full border-purple-400 text-purple-900 bg-white/60 hover:bg-white"
              >
                Prendre rendez-vous
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

