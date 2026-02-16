import { Button } from "./ui/button";

interface PrivacyPolicyPageProps {
  onNavigate: (page: string) => void;
}

export function PrivacyPolicyPage({ onNavigate }: PrivacyPolicyPageProps) {
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
              DONNEES PERSONNELLES
            </div>
            <h1 className="text-3xl md:text-5xl text-[var(--gbh-black-soft)] mb-3">
              Politique de confidentialite
            </h1>
            <p className="text-[var(--gbh-gray-text)]">
              Cette page explique comment GBH collecte et traite vos donnees.
            </p>
          </div>

          <div className="space-y-8 text-[var(--gbh-gray-text)]">
            <section>
              <h2 className="text-xl text-[var(--gbh-black-soft)] mb-2">
                Donnees collectees
              </h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>Nom, email et telephone transmis via les formulaires.</li>
                <li>Informations de reservation de rendez-vous.</li>
                <li>Messages envoyes via la page de contact.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl text-[var(--gbh-black-soft)] mb-2">
                Finalites du traitement
              </h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>Organisation et suivi des rendez-vous.</li>
                <li>Reponse aux demandes envoyees par le formulaire contact.</li>
                <li>Communication operationnelle liee aux services.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl text-[var(--gbh-black-soft)] mb-2">
                Conservation
              </h2>
              <p>
                Les donnees sont conservees pendant la duree necessaire aux
                finalites pour lesquelles elles ont ete collectees, puis
                archivees ou supprimees selon les obligations legales.
              </p>
            </section>

            <section>
              <h2 className="text-xl text-[var(--gbh-black-soft)] mb-2">
                Destinataires
              </h2>
              <p>
                Les donnees sont accessibles uniquement aux equipes autorisees
                de GBH et a ses prestataires techniques strictement necessaires
                au fonctionnement du service.
              </p>
            </section>

            <section>
              <h2 className="text-xl text-[var(--gbh-black-soft)] mb-2">
                Vos droits
              </h2>
              <p>
                Vous pouvez demander acces, correction ou suppression de vos
                donnees, dans les limites prevues par la loi applicable.
              </p>
              <p>Email de contact: contact@gbh.sarl</p>
            </section>

            <section>
              <h2 className="text-xl text-[var(--gbh-black-soft)] mb-2">
                Cookies
              </h2>
              <p>
                Le site peut utiliser des cookies techniques pour garantir le
                bon fonctionnement des pages et des formulaires.
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
