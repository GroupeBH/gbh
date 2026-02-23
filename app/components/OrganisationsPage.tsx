import { Button } from "./ui/button";
import { DomainsSection } from "./DomainsSection";
import { RFPForm } from "./RFPForm";
import { TrustComplianceBlock } from "./TrustComplianceBlock";

interface OrganisationsPageProps {
  onNavigate: (page: string) => void;
}

export function OrganisationsPage({ onNavigate }: OrganisationsPageProps) {
  return (
    <div className="min-h-screen">
      <section className="border-b border-purple-200/60 bg-[radial-gradient(circle_at_top_left,#e4d8ff_0%,#f8f9ff_40%,#ffffff_100%)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-18 md:py-22">
          <p className="inline-flex rounded-full border border-purple-300 bg-white/75 px-4 py-2 text-xs uppercase tracking-[0.2em] text-purple-700">
            For organizations
          </p>
          <h1 className="mt-6 text-4xl md:text-5xl text-purple-900 max-w-4xl">
            Flux B2B dedie pour transformer vos besoins en plan execution concret.
          </h1>
          <p className="mt-5 text-lg text-purple-700 max-w-3xl">
            Cette section est orientee grands comptes: demande de proposition, gouvernance
            intervention, et pilotage operationnel.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => {
                if (typeof document !== "undefined") {
                  document.getElementById("rfp-form")?.scrollIntoView({ behavior: "smooth" });
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
      </section>

      <RFPForm heading="Demande de proposition B2B" />

      <DomainsSection
        title="Domaines adaptes aux organisations"
        subtitle="Consultez les domaines disponibles et choisissez le plus pertinent dans votre demande."
        onBookAppointment={() => onNavigate("rdv")}
      />

      <TrustComplianceBlock />
    </div>
  );
}

