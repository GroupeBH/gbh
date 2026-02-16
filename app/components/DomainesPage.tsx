import { Button } from "./ui/button";
import { ServicesShowcase } from "./ServicesShowcase";
import { useGetServicesQuery } from "../store/api";

interface DomainesPageProps {
  onNavigate: (page: string) => void;
}

export function DomainesPage({ onNavigate }: DomainesPageProps) {
  const { data, isLoading, isError } = useGetServicesQuery();
  const services = data?.services ?? [];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="mb-6 text-[var(--gbh-black-soft)]">
            Domaines d'expertise GBH
          </h1>
          <p className="text-xl text-[var(--gbh-gray-text)] max-w-3xl mx-auto">
            Découvrez l'ensemble de nos domaines d'intervention et trouvez la
            solution adaptée à vos besoins
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
          <div className="mb-16">
            <ServicesShowcase services={services} onNavigate={onNavigate} />
          </div>
        )}

        <div
          className="rounded-2xl p-12 text-center"
          style={{ backgroundColor: "var(--gbh-magenta)" }}
        >
          <h2 className="mb-4 text-white">
            Besoin d'une solution personnalisée ?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Contactez-nous pour discuter de vos besoins spécifiques et obtenir
            une solution sur mesure
          </p>
          <Button
            onClick={() => onNavigate("contact")}
            size="lg"
            className="bg-white hover:bg-gray-100"
            style={{ color: "var(--gbh-magenta)" }}
          >
            Nous contacter
          </Button>
        </div>
      </div>
    </div>
  );
}
