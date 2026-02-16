import { Button } from "./ui/button";

interface TermsPageProps {
  onNavigate: (page: string) => void;
}

export function TermsPage({ onNavigate }: TermsPageProps) {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="rounded-3xl border border-gray-100 bg-white p-8 md:p-12 shadow-sm">
          <div className="mb-10">
            <div
              className="inline-block rounded-full px-4 py-2 text-sm mb-4"
              style={{
                backgroundColor: "var(--gbh-magenta-light)",
                color: "var(--gbh-magenta)",
              }}
            >
              REGLES DU SERVICE
            </div>
            <h1 className="text-3xl md:text-5xl text-[var(--gbh-black-soft)] mb-3">
              Conditions utilisation
            </h1>
            <p className="text-[var(--gbh-gray-text)]">
              Conditions generales applicables au site et a la plateforme de
              reservation.
            </p>
          </div>

          <div className="space-y-8 text-[var(--gbh-gray-text)]">
            <section>
              <h2 className="text-xl text-[var(--gbh-black-soft)] mb-2">Objet</h2>
              <p>
                Ces conditions definissent les regles de consultation du site
                et de reservation des services proposes par GBH.
              </p>
            </section>

            <section>
              <h2 className="text-xl text-[var(--gbh-black-soft)] mb-2">Acces au service</h2>
              <p>
                Le site est accessible selon disponibilite technique. GBH peut
                suspendre temporairement le service pour maintenance.
              </p>
            </section>

            <section>
              <h2 className="text-xl text-[var(--gbh-black-soft)] mb-2">
                Reservation de rendez-vous
              </h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>Les informations fournies doivent etre exactes et completes.</li>
                <li>La validation du formulaire confirme la demande de reservation.</li>
                <li>
                  Un identifiant de reservation est transmis pour consulter le
                  detail du rendez-vous.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl text-[var(--gbh-black-soft)] mb-2">Paiement</h2>
              <p>
                Selon le service, le paiement peut etre realise en ligne ou sur
                place, suivant les options disponibles au moment de la
                reservation.
              </p>
            </section>

            <section>
              <h2 className="text-xl text-[var(--gbh-black-soft)] mb-2">
                Obligations utilisateur
              </h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>Ne pas utiliser le site pour des usages illicites.</li>
                <li>Ne pas transmettre de donnees frauduleuses.</li>
                <li>
                  Respecter les horaires, conditions et consignes de
                  rendez-vous.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl text-[var(--gbh-black-soft)] mb-2">
                Limitation de responsabilite
              </h2>
              <p>
                GBH ne peut etre tenu responsable des dommages indirects lies a
                une interruption temporaire, une erreur externe ou un cas de
                force majeure.
              </p>
            </section>

            <section>
              <h2 className="text-xl text-[var(--gbh-black-soft)] mb-2">
                Evolution des conditions
              </h2>
              <p>
                GBH peut mettre a jour les presentes conditions a tout moment.
                Les nouvelles conditions prennent effet des leur publication.
              </p>
            </section>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button
              type="button"
              onClick={() => onNavigate("home")}
              style={{ backgroundColor: "var(--gbh-magenta)" }}
            >
              Retour accueil
            </Button>
            <Button type="button" variant="outline" onClick={() => onNavigate("rdv")}>
              Prendre rendez-vous
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
