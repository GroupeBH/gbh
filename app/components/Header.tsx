import { useState } from "react";
import { Button } from "./ui/button";

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuItems = [
    { label: "Accueil", value: "home" },
    { label: "Particuliers", value: "particuliers" },
    { label: "Organisations", value: "organisations" },
    { label: "Domaines", value: "domaines" },
    { label: "Plateforme RDV", value: "rdv" },
    { label: "Contact", value: "contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onNavigate("home")}
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all bg-white"
            >
              <img
                src="/gbh.png"
                alt="GBH"
                className="h-10 w-10 object-contain"
              />
            </div>
            <div className="hidden sm:block">
              <div className="font-semibold text-[var(--gbh-black-soft)]">
                Groupe B-Holding
              </div>
              <div className="text-sm text-[var(--gbh-gray-text)]">Sarl</div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {menuItems.map((item) => (
              <button
                key={item.value}
                onClick={() => onNavigate(item.value)}
                className={`px-4 py-2 rounded-xl transition-all ${
                  currentPage === item.value
                    ? "text-[var(--gbh-magenta)] bg-[var(--gbh-magenta-light)] shadow-sm"
                    : "text-[var(--gbh-gray-text)] hover:bg-[var(--gbh-gray-ui)]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <Button
            onClick={() => onNavigate("rdv")}
            className="hidden lg:flex rounded-full shadow-md hover:shadow-lg transition-all"
            style={{ backgroundColor: "var(--gbh-magenta)" }}
          >
            Prendre rendez-vous
          </Button>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-[var(--gbh-gray-ui)]"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Basculer la navigation"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden pb-5">
            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-lg">
              <div className="grid gap-2">
                {menuItems.map((item) => (
                  <button
                    key={item.value}
                    onClick={() => {
                      setMenuOpen(false);
                      onNavigate(item.value);
                    }}
                    className={`w-full rounded-xl px-4 py-2 text-left transition-all ${
                      currentPage === item.value
                        ? "text-[var(--gbh-magenta)] bg-[var(--gbh-magenta-light)]"
                        : "text-[var(--gbh-gray-text)] hover:bg-[var(--gbh-gray-ui)]"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <Button
                onClick={() => {
                  setMenuOpen(false);
                  onNavigate("rdv");
                }}
                className="mt-4 w-full rounded-full"
                style={{ backgroundColor: "var(--gbh-magenta)" }}
              >
                Prendre rendez-vous
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
