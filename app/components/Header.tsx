"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "./ui/button";

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

type MenuItem =
  | {
      label: string;
      kind: "hash";
      value: string;
    }
  | {
      label: string;
      kind: "path";
      value: string;
      activeOn: string;
    };

const menuItems: MenuItem[] = [
  { label: "Accueil", kind: "hash", value: "home" },
  // { label: "Particuliers", kind: "hash", value: "particuliers" },
  // { label: "Organisations", kind: "hash", value: "organisations" },
  { label: "Domaines", kind: "hash", value: "domaines" },
  { label: "References", kind: "path", value: "/references", activeOn: "references" },
  // { label: "Plateforme RDV", kind: "hash", value: "rdv" },
  {
    label: "Etudes de cas",
    kind: "path",
    value: "/etudes-de-cas/anapi-training-wave",
    activeOn: "etudes-de-cas",
  },
];

const navigateToPath = (path: string) => {
  if (typeof window === "undefined") return;
  window.location.href = path;
};

export function Header({ currentPage, onNavigate }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSelect = (item: MenuItem) => {
    if (item.kind === "hash") {
      onNavigate(item.value);
      return;
    }
    navigateToPath(item.value);
  };

  const isActive = (item: MenuItem) =>
    item.kind === "hash" ? currentPage === item.value : currentPage === item.activeOn;

  return (
    <header className="sticky top-0 z-50 border-b border-purple-200/50 bg-[linear-gradient(140deg,#f7f1ff_0%,#f6f9ff_45%,#ece4ff_100%)] backdrop-blur-xl shadow-[0_10px_30px_rgba(73,37,128,0.18)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <button
            type="button"
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onNavigate("home")}
          >
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center border border-purple-300/30 bg-white/85 shadow-[0_8px_20px_rgba(97,46,209,0.35)]">
              <Image
                src="/gbh.png"
                alt="GBH"
                width={40}
                height={40}
                className="h-10 w-10 object-contain"
              />
            </div>
            <div className="hidden sm:block text-left">
              <div className="font-semibold text-purple-900">Groupe B-Holding</div>
              <div className="text-sm text-purple-700">Sarl</div>
            </div>
          </button>

          <nav className="hidden xl:flex items-center gap-1 rounded-full border border-purple-300/50 bg-white/60 p-1 backdrop-blur">
            {menuItems.map((item) => (
              <button
                key={`${item.kind}-${item.value}`}
                onClick={() => handleSelect(item)}
                className={`px-4 py-2 rounded-xl transition-all ${
                  isActive(item)
                    ? "text-white bg-[linear-gradient(135deg,#5f27d8,#8b47ff)] shadow-[0_6px_14px_rgba(99,41,212,0.45)]"
                    : "text-purple-800 hover:bg-white/70"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Button
              onClick={() => navigateToPath("/organisations")}
              variant="outline"
              className="rounded-full border-purple-400 bg-white/60 text-purple-900 hover:bg-white"
            >
              Demander une proposition
            </Button>
            <Button
              onClick={() => onNavigate("rdv")}
              className="rounded-full bg-[linear-gradient(135deg,#6f31ef,#8f56ff)] hover:brightness-110"
            >
              Prendre rendez-vous
            </Button>
          </div>

          <button
            className="xl:hidden p-2 rounded-lg text-purple-800 hover:bg-white/70"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Basculer la navigation"
            type="button"
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
          <div className="xl:hidden pb-5">
            <div className="rounded-2xl border border-purple-300/50 bg-[linear-gradient(140deg,#f7f1ff_0%,#f6f9ff_45%,#ece4ff_100%)] p-4 shadow-2xl">
              <div className="grid gap-2">
                {menuItems.map((item) => (
                  <button
                    key={`${item.kind}-${item.value}-mobile`}
                    onClick={() => {
                      setMenuOpen(false);
                      handleSelect(item);
                    }}
                    className={`w-full rounded-xl px-4 py-2 text-left transition-all ${
                      isActive(item)
                        ? "text-white bg-[linear-gradient(135deg,#5f27d8,#8b47ff)] shadow-[0_6px_14px_rgba(99,41,212,0.35)]"
                        : "text-purple-900 hover:bg-white/70"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <Button
                onClick={() => {
                  setMenuOpen(false);
                  navigateToPath("/organisations");
                }}
                variant="outline"
                className="mt-4 w-full rounded-full border-purple-400 bg-white/60 text-purple-900 hover:bg-white"
              >
                Demander une proposition
              </Button>
              <Button
                onClick={() => {
                  setMenuOpen(false);
                  onNavigate("rdv");
                }}
                className="mt-3 w-full rounded-full bg-[linear-gradient(135deg,#6f31ef,#8f56ff)] hover:brightness-110"
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

