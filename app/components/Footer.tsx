import Image from "next/image";

interface FooterProps {
  onNavigate: (page: string) => void;
}

const quickLinks = [
  { label: "Accueil", value: "home" },
  { label: "Particuliers", value: "particuliers" },
  { label: "Organisations", value: "organisations" },
  { label: "Domaines", value: "domaines" },
];

const infoLinks = [
  { label: "Mentions legales", value: "mentions-legales" },
  { label: "Politique de confidentialite", value: "politique-confidentialite" },
  { label: "Conditions utilisation", value: "conditions-utilisation" },
];

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer
      className="mt-20"
      style={{
        background:
          "linear-gradient(135deg, var(--gbh-magenta-dark) 0%, var(--gbh-magenta) 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-white">
          <div className="col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-lg">
                <Image
                  src="/gbh.png"
                  alt="Logo GBH"
                  width={44}
                  height={44}
                  className="h-11 w-11 object-contain"
                />
              </div>
              <div>
                <div className="font-semibold text-lg">Groupe B-Holding</div>
                <div className="text-sm opacity-90">Sarl</div>
              </div>
            </div>
            <p className="text-sm opacity-90 leading-relaxed">
              Une entreprise multiservices au service des particuliers et des
              organisations en RDC
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-lg">Coordonnees</h4>
            <div className="space-y-3 text-sm opacity-90">
              <p className="flex items-start gap-2">
                <span>📍</span>
                <span>
                  Avenue A Adama, vers Socimat
                  <br />
                  Boulevard Sendwe, immeuble ADI Construct
                  <br />
                  Kinshasa, RDC
                </span>
              </p>
              <p className="flex items-start gap-2">
                <span>📧</span>
                <span>contact@gbh.sarl</span>
              </p>
              <p className="flex items-start gap-2">
                <span>📞</span>
                <span>+243 999 403 012</span>
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-lg">Liens rapides</h4>
            <div className="space-y-3 text-sm opacity-90">
              {quickLinks.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => onNavigate(item.value)}
                  className="block hover:opacity-100 cursor-pointer transition-opacity text-left"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-lg">Informations</h4>
            <div className="space-y-3 text-sm opacity-90">
              {infoLinks.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => onNavigate(item.value)}
                  className="block hover:opacity-100 cursor-pointer transition-opacity text-left"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-8 text-center text-sm text-white/80">
          <p>
            © {new Date().getFullYear()} Groupe B-Holding Sarl. Tous droits
            reserves.
          </p>
        </div>
      </div>
    </footer>
  );
}
