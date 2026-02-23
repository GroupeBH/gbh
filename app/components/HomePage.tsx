"use client";

import { Button } from "./ui/button";
import { BookingLookup } from "./BookingLookup";
import { CaseStudiesPreview } from "./CaseStudiesPreview";
import { DomainsSection } from "./DomainsSection";
import { Hero } from "./Hero";
import { LogosRibbon } from "./LogosRibbon";
import { ReferencesPreview } from "./ReferencesPreview";
import { RevealOnScroll } from "./RevealOnScroll";
import { RFPForm } from "./RFPForm";
import { TrustComplianceBlock } from "./TrustComplianceBlock";

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
  const scrollToRfp = () => {
    if (typeof document === "undefined") return;
    document.getElementById("rfp-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      <Hero onBookAppointment={() => onNavigate("rdv")} onRequestProposal={scrollToRfp} />
      <RevealOnScroll delayMs={20}>
        <LogosRibbon />
      </RevealOnScroll>

      <RevealOnScroll delayMs={50}>
        <BookingLookup />
      </RevealOnScroll>

      <RevealOnScroll delayMs={70}>
        <DomainsSection onBookAppointment={() => onNavigate("rdv")} />
      </RevealOnScroll>

      <RevealOnScroll delayMs={80}>
        <section className="py-18 md:py-24 bg-[linear-gradient(180deg,#f7f3ff,#f3f8ff)]">
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
                  className="rounded-2xl border border-purple-200 bg-white/80 p-6 shadow-[0_10px_20px_rgba(75,31,172,0.1)] transition-all hover:-translate-y-1 hover:border-purple-400 hover:shadow-[0_20px_30px_rgba(75,31,172,0.2)]"
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

      <RevealOnScroll delayMs={90}>
        <TrustComplianceBlock />
      </RevealOnScroll>

      <RevealOnScroll delayMs={100}>
        <ReferencesPreview />
      </RevealOnScroll>

      <RevealOnScroll delayMs={120}>
        <CaseStudiesPreview />
      </RevealOnScroll>

      <RevealOnScroll delayMs={130}>
        <RFPForm />
      </RevealOnScroll>

      <section className="py-20 bg-[radial-gradient(circle_at_top_right,rgba(102,220,255,0.18),transparent_30%),linear-gradient(135deg,#12092f,#2a1164)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-purple-300/25 bg-[linear-gradient(135deg,rgba(123,51,255,0.25),rgba(102,220,255,0.22))] p-8 md:p-12 shadow-xl backdrop-blur">
            <h2 className="text-3xl md:text-4xl text-white">
              Lancez votre prochain projet avec une execution maitrisee.
            </h2>
            <p className="mt-4 text-purple-100 max-w-2xl">
              Combinez un flux B2B formalise pour vos contrats et la plateforme de
              rendez-vous pour vos besoins immediats.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button
                onClick={scrollToRfp}
                size="lg"
                className="rounded-full bg-white text-purple-900 hover:bg-purple-50"
              >
                Demander une proposition
              </Button>
              <Button
                onClick={() => onNavigate("rdv")}
                size="lg"
                variant="outline"
                className="rounded-full border-purple-200 text-white bg-white/10 hover:bg-white/20"
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

