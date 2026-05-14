import { Button } from "./ui/button";
import { DomainsSection } from "./DomainsSection";
import { DigitalProjectsShowcase } from "./DigitalProjectsShowcase";

interface DomainesPageProps {
  onNavigate: (page: string) => void;
}

export function DomainesPage({ onNavigate }: DomainesPageProps) {
  return (
    <div className="min-h-screen">
      <section className="border-b border-purple-200/60 bg-[radial-gradient(circle_at_26%_22%,#dcfff7_0%,transparent_30%),radial-gradient(circle_at_top_right,#e7d7ff_0%,#f4ecff_45%,#ffffff_100%)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-18 md:py-22">
          <h1 className="text-4xl md:text-5xl text-purple-900">Domaines expertise GBH</h1>
          <p className="mt-5 text-lg text-purple-700 max-w-3xl">
            En plus de nos services traditionnels, GBH promeut activement des
            startups numeriques comme Uty, Zwanga, Afya et BPAC, un projet de
            banque numerique par les Congolais pour les Congolais.
          </p>
        </div>
      </section>

      <DigitalProjectsShowcase onNavigate={onNavigate} />

      <DomainsSection
        title="Nos domaines de services traditionnels"
        subtitle="Explorez les capacites disponibles pour les missions B2B et les besoins B2C."
        onBookAppointment={() => onNavigate("rdv")}
      />

      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-purple-200 bg-white/85 p-8 text-center shadow-[0_16px_30px_rgba(70,28,172,0.14)]">
            <h2 className="text-3xl text-purple-900">Besoin de cadrage specifique ?</h2>
            <p className="mt-3 text-purple-700 max-w-2xl mx-auto">
              Lancez une consultation B2B ou planifiez un rendez-vous selon votre
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
                Lancer une consultation B2B
              </Button>
              <Button
                onClick={() => onNavigate("rdv")}
                variant="secondary"
                className="rounded-full"
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
