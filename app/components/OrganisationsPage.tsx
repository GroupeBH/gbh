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
      <section className="border-b border-purple-200/60 bg-[radial-gradient(circle_at_72%_20%,#dbfff7_0%,transparent_30%),radial-gradient(circle_at_top_left,#e4d8ff_0%,#f8f9ff_40%,#ffffff_100%)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-18 md:py-22">
          <p className="inline-flex rounded-full border border-purple-300 bg-white/75 px-4 py-2 text-xs uppercase tracking-[0.2em] text-purple-700">
            For organizations
          </p>
          <h1 className="mt-6 text-4xl md:text-5xl text-purple-900 max-w-4xl">
            Flux de consultation B2B pour transformer vos besoins en plan execution concret.
          </h1>
          <p className="mt-5 text-lg text-purple-700 max-w-3xl">
            Cette section est orientee grands comptes: consultation B2B, gouvernance
            intervention, pilotage operationnel et cadrage de projets numeriques.
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
              Lancer une consultation B2B
            </Button>
            <Button
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.location.href = "/#projets-numeriques";
                }
              }}
              variant="outline"
              className="rounded-full border-purple-400 bg-white/70 text-purple-900"
            >
              Voir les projets numeriques
            </Button>
          </div>
        </div>
      </section>

      <section className="border-b border-purple-200/60 bg-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-purple-200 bg-[linear-gradient(135deg,#f7f0ff,#eafffb)] p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.2em] text-purple-600">
              Projets numeriques GBH
            </p>
            <h2 className="mt-3 text-2xl text-purple-900 md:text-3xl">
              Uty, Zwanga, Afya et BPAC montrent notre capacite a cadrer des
              plateformes utiles au marche congolais.
            </h2>
            <Button
              onClick={() => onNavigate("rdv")}
              variant="secondary"
              className="mt-6 rounded-full"
            >
              Discuter d&apos;un projet numerique
            </Button>
          </div>
        </div>
      </section>

      <RFPForm heading="Lancer une consultation B2B" />

      <DomainsSection
        title="Domaines adaptes aux organisations"
        subtitle="Consultez les domaines disponibles et choisissez le plus pertinent dans votre demande."
        onBookAppointment={() => onNavigate("rdv")}
      />

      <TrustComplianceBlock />
    </div>
  );
}

