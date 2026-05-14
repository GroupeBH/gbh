"use client";

import Image from "next/image";

interface FooterProps {
  onNavigate: (page: string) => void;
}

type FooterLink =
  | { label: string; kind: "hash"; value: string }
  | { label: string; kind: "path"; value: string };

const quickLinks: FooterLink[] = [
  { label: "Accueil", kind: "hash", value: "home" },
  { label: "A propos", kind: "path", value: "/a-propos" },
  { label: "Projets numeriques", kind: "path", value: "/#projets-numeriques" },
  { label: "Plateforme RDV", kind: "hash", value: "rdv" },
  { label: "Domaines", kind: "hash", value: "domaines" },
  { label: "References", kind: "path", value: "/references" },
  { label: "Consultation B2B", kind: "path", value: "/organisations" },
];

const projectLinks: FooterLink[] = [
  { label: "Uty", kind: "path", value: "/projets/uty" },
  { label: "Afya", kind: "path", value: "/projets/afya" },
  { label: "BPAC", kind: "path", value: "/projets/bpac" },
  { label: "Zwanga", kind: "path", value: "https://zwnga-app.com" },
];

const infoLinks: FooterLink[] = [
  { label: "Mentions legales", kind: "hash", value: "mentions-legales" },
  {
    label: "Politique de confidentialite",
    kind: "hash",
    value: "politique-confidentialite",
  },
  {
    label: "Conditions d'utilisation",
    kind: "hash",
    value: "conditions-utilisation",
  },
];

const handlePathNavigation = (path: string) => {
  if (typeof window === "undefined") return;
  window.location.href = path;
};

export function Footer({ onNavigate }: FooterProps) {
  const navigate = (item: FooterLink) => {
    if (item.kind === "hash") {
      onNavigate(item.value);
      return;
    }
    handlePathNavigation(item.value);
  };

  return (
    <footer className="mt-20 border-t border-purple-300/20 bg-[radial-gradient(circle_at_top_right,rgba(235,115,255,0.24),transparent_30%),radial-gradient(circle_at_15%_88%,rgba(114,246,223,0.34),transparent_34%),radial-gradient(circle_at_78%_22%,rgba(114,246,223,0.26),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(186,58,255,0.22),transparent_35%),linear-gradient(145deg,#35235f,#6d47a1,#36d2be)] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-14 h-14 rounded-2xl border border-purple-300/25 bg-white/90 flex items-center justify-center shadow-lg">
                <Image
                  src="/gbh.png"
                  alt="Logo GBH"
                  width={44}
                  height={44}
                  className="h-11 w-11 object-contain"
                />
              </div>
              <div>
                <p className="font-semibold text-lg">Groupe B-Holding</p>
                <p className="text-sm text-purple-200">Sarl</p>
              </div>
            </div>
            <p className="text-sm text-purple-100/90 leading-relaxed">
              Partenaire multiservices en RDC et promoteur de projets numeriques
              comme Uty, Zwanga, Afya et BPAC.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Coordonnees</h4>
            <div className="space-y-3 text-sm text-purple-100/90">
              <p>
                Boulevard Sendwe, immeuble ADI Construct
                <br />
                Kinshasa, RDC
              </p>
              <p>contact@gbh.sarl</p>
              <p>+243 999 403 012</p>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Navigation</h4>
            <div className="space-y-2 text-sm text-purple-100/90">
              {quickLinks.map((item) => (
                <button
                  key={`${item.kind}-${item.value}`}
                  type="button"
                  onClick={() => navigate(item)}
                  className="block text-left transition-colors hover:text-cyan-200"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Projets numeriques</h4>
            <div className="space-y-2 text-sm text-purple-100/90">
              {projectLinks.map((item) => (
                <button
                  key={`${item.kind}-${item.value}`}
                  type="button"
                  onClick={() => navigate(item)}
                  className="block text-left transition-colors hover:text-cyan-200"
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="mt-5 border-t border-purple-300/25 pt-5">
              {infoLinks.map((item) => (
                <button
                  key={`${item.kind}-${item.value}`}
                  type="button"
                  onClick={() => navigate(item)}
                  className="mb-2 block text-left text-sm text-purple-100/90 transition-colors hover:text-cyan-200"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-purple-300/25 mt-10 pt-6 text-sm text-purple-200/75 text-center">
          (c) {new Date().getFullYear()} Groupe B-Holding Sarl. Tous droits reserves.
        </div>
      </div>
    </footer>
  );
}


