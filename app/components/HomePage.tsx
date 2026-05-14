"use client";

import { Button } from "./ui/button";
import { BookingLookup } from "./BookingLookup";
import { CaseStudiesPreview } from "./CaseStudiesPreview";
import { DomainsSection } from "./DomainsSection";
import { Hero } from "./Hero";
import {
  companyHistory,
  companyMission,
  teamProfiles,
} from "../lib/about-data";
import { LogosRibbon } from "./LogosRibbon";
import { ReferencesPreview } from "./ReferencesPreview";
import { RevealOnScroll } from "./RevealOnScroll";
import { TrustComplianceBlock } from "./TrustComplianceBlock";
import { DigitalProjectsShowcase } from "./DigitalProjectsShowcase";

interface HomePageProps {
  onNavigate: (page: string) => void;
}

const processSteps = [
  {
    id: "01",
    title: "Cadrage",
    description:
      "Qualification du besoin, contraintes et priorites avec vos equipes metier.",
  },
  {
    id: "02",
    title: "Proposition",
    description:
      "Plan d'intervention clair avec perimetre, delai, gouvernance et livrables.",
  },
  {
    id: "03",
    title: "Execution",
    description:
      "Mobilisation operationnelle, suivi terrain et coordination des parties prenantes.",
  },
  {
    id: "04",
    title: "Reporting",
    description:
      "Points d'avancement structures, arbitrages et recommandations actionnables.",
  },
];

export function HomePage({ onNavigate }: HomePageProps) {
  const goToConsultationPage = () => {
    if (typeof window === "undefined") return;
    window.location.href = "/organisations";
  };

  const goToAboutPage = () => {
    if (typeof window === "undefined") return;
    window.location.href = "/a-propos";
  };

  return (
    <div className="min-h-screen">
      <Hero onBookAppointment={() => onNavigate("rdv")} onRequestProposal={goToConsultationPage} />
      <RevealOnScroll delayMs={20}>
        <LogosRibbon />
      </RevealOnScroll>

      <RevealOnScroll delayMs={50}>
        <BookingLookup />
      </RevealOnScroll>

      <DigitalProjectsShowcase onNavigate={onNavigate} />

      <RevealOnScroll delayMs={70}>
        <DomainsSection onBookAppointment={() => onNavigate("rdv")} />
      </RevealOnScroll>

      <RevealOnScroll delayMs={80}>
        <section className="py-18 md:py-24 bg-[linear-gradient(180deg,#f8f2ff,#ecfffa,#f3e9ff)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <p className="text-xs uppercase tracking-[0.2em] text-purple-600">Process</p>
              <h2 className="mt-3 text-3xl md:text-4xl text-purple-900">
                Une methode simple, lisible et orientee resultat
              </h2>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {processSteps.map((step) => (
                <article
                  key={step.id}
                  className="rounded-2xl border border-purple-200 bg-white/80 p-6 shadow-[0_10px_20px_rgba(75,31,172,0.1)] transition-all hover:-translate-y-1 hover:border-[var(--gbh-mint-deep)] hover:shadow-[0_20px_30px_rgba(75,31,172,0.2)]"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-purple-500">{step.id}</p>
                  <h3 className="mt-3 text-xl text-purple-900">{step.title}</h3>
                  <p className="mt-3 text-sm text-purple-700">{step.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </RevealOnScroll>

      <RevealOnScroll delayMs={85}>
        <section className="py-18 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-start">
              <article className="rounded-3xl border border-purple-200 bg-[linear-gradient(145deg,rgba(255,255,255,0.92),rgba(243,233,249,0.78),rgba(227,255,249,0.68))] p-7 md:p-8">
                <p className="text-xs uppercase tracking-[0.2em] text-purple-600">
                  A propos de nous
                </p>
                <h2 className="mt-3 text-3xl text-purple-900 md:text-4xl">
                  Une equipe orientee execution et confiance long terme.
                </h2>
                <p className="mt-4 text-purple-700">{companyMission}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {companyHistory.slice(0, 3).map((item) => (
                    <span
                      key={item.period}
                      className="inline-flex rounded-full border border-purple-200 bg-white/80 px-3 py-1 text-xs text-purple-700"
                    >
                      {item.period} - {item.title}
                    </span>
                  ))}
                </div>
                <Button onClick={goToAboutPage} className="mt-8 rounded-full">
                  Decouvrir GBH
                </Button>
              </article>

              <article className="rounded-3xl border border-purple-200 bg-white/90 p-6 md:p-7 shadow-[0_14px_26px_rgba(74,32,173,0.1)]">
                <p className="text-xs uppercase tracking-[0.2em] text-purple-600">
                  Equipe
                </p>
                <h3 className="mt-3 text-2xl text-purple-900">Presentation des poles</h3>
                <div className="mt-5 space-y-3">
                  {teamProfiles.slice(0, 3).map((profile) => (
                    <div
                      key={profile.role}
                      className="rounded-2xl border border-purple-100 bg-[linear-gradient(145deg,rgba(245,236,255,0.78),rgba(231,255,249,0.78))] p-4"
                    >
                      <p className="text-sm font-semibold text-purple-900">{profile.role}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.16em] text-teal-700">
                        {profile.focus}
                      </p>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          </div>
        </section>
      </RevealOnScroll>

      <RevealOnScroll delayMs={90}>
        <TrustComplianceBlock />
      </RevealOnScroll>

      <RevealOnScroll delayMs={100}>
        <ReferencesPreview />
      </RevealOnScroll>

      <RevealOnScroll delayMs={120}>
        <CaseStudiesPreview />
      </RevealOnScroll>

      <section className="py-20 bg-[radial-gradient(circle_at_top_right,rgba(232,111,255,0.22),transparent_30%),radial-gradient(circle_at_18%_75%,rgba(114,246,223,0.34),transparent_34%),radial-gradient(circle_at_85%_82%,rgba(114,246,223,0.24),transparent_30%),linear-gradient(135deg,#35235f,#6d47a1,#3ad3bf)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-purple-300/25 bg-[linear-gradient(135deg,rgba(176,128,220,0.28),rgba(223,255,249,0.26),rgba(194,155,235,0.2))] p-8 md:p-12 shadow-xl backdrop-blur">
            <h2 className="text-3xl md:text-4xl text-white">
              Lancez votre prochain projet avec une execution maitrisee.
            </h2>
            <p className="mt-4 text-purple-100 max-w-2xl">
              Combinez un flux B2B formalise pour vos contrats et la plateforme de
              rendez-vous pour vos besoins immediats.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button
                onClick={goToConsultationPage}
                size="lg"
                className="rounded-full"
              >
                Lancer une consultation B2B
              </Button>
              <Button
                onClick={() => onNavigate("rdv")}
                size="lg"
                variant="secondary"
                className="rounded-full"
              >
                Prendre rendez-vous
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
