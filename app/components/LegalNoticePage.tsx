import { Button } from "./ui/button";

interface LegalNoticePageProps {
  onNavigate: (page: string) => void;
}

export function LegalNoticePage({ onNavigate }: LegalNoticePageProps) {
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
              INFORMATIONS LEGALES
            </div>
            <h1 className="text-3xl md:text-5xl text-[var(--gbh-black-soft)] mb-3">
              Mentions legales
            </h1>
            <p className="text-[var(--gbh-gray-text)]">
              Informations obligatoires sur le site de Groupe B-Holding Sarl.
            </p>
          </div>

          <div className="space-y-8 text-[var(--gbh-gray-text)]">
            <section>
              <h2 className="text-xl text-[var(--gbh-black-soft)] mb-2">
                Editeur du site
              </h2>
              <p>Groupe B-Holding Sarl (GBH)</p>
              <p>Kinshasa, Republique Democratique du Congo</p>
            </section>

            <section>
              <h2 className="text-xl text-[var(--gbh-black-soft)] mb-2">
                Bureaux
              </h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>Boulevard Sendwe, immeuble ADI Construct, Kinshasa</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl text-[var(--gbh-black-soft)] mb-2">
                Contact
              </h2>
              <p>Email: contact@gbh.sarl</p>
              <p>Telephone: +243 999 403 012</p>
            </section>

            <section>
              <h2 className="text-xl text-[var(--gbh-black-soft)] mb-2">
                Propriete intellectuelle
              </h2>
              <p>
                Les textes, logos, visuels et contenus du site sont proteges.
                Toute reproduction totale ou partielle sans autorisation est
                interdite.
              </p>
            </section>

            <section>
              <h2 className="text-xl text-[var(--gbh-black-soft)] mb-2">
                Responsabilite
              </h2>
              <p>
                GBH met tout en oeuvre pour assurer la fiabilite des
                informations publiees. Une erreur, indisponibilite ou omission
                ne peut engager la responsabilite de GBH sans preuve de faute.
              </p>
            </section>

            <section>
              <h2 className="text-xl text-[var(--gbh-black-soft)] mb-2">
                Droit applicable
              </h2>
              <p>
                Le present site est soumis au droit applicable en Republique
                Democratique du Congo.
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
            <Button type="button" variant="outline" onClick={() => onNavigate("contact")}>
              Nous contacter
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
