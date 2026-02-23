"use client";

import { DomainsSection } from "../components/DomainsSection";
import { RevealOnScroll } from "../components/RevealOnScroll";
import { RFPForm } from "../components/RFPForm";
import { RouteShell } from "../components/RouteShell";
import { TrustComplianceBlock } from "../components/TrustComplianceBlock";

const goToBookingPage = () => {
  if (typeof window === "undefined") return;
  window.location.href = "/#rdv";
};

export default function OrganisationsRoutePage() {
  return (
    <RouteShell
      currentPage="organisations"
      whatsappContext="organisations"
      hideStickyCta
    >
      <section className="border-b border-purple-200/60 bg-[radial-gradient(circle_at_72%_20%,#dbfff7_0%,transparent_30%),radial-gradient(circle_at_top_left,#e4d8ff_0%,#f8f9ff_40%,#ffffff_100%)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
          <p className="inline-flex rounded-full border border-purple-300 bg-white/75 px-4 py-2 text-xs uppercase tracking-[0.2em] text-purple-700">
            Organisations
          </p>
          <h1 className="mt-6 text-4xl md:text-5xl text-purple-900 max-w-4xl">
            Un flux de consultation B2B dedie pour cadrer vos besoins et accelerer la decision.
          </h1>
          <p className="mt-5 text-lg text-purple-700 max-w-3xl">
            Cette page est dediee aux consultations des grands comptes:
            perimetre, delais, budget indicatif et niveau de service attendu.
          </p>
        </div>
      </section>

      <RevealOnScroll delayMs={40}>
        <RFPForm heading="Lancer une consultation B2B" />
      </RevealOnScroll>

      <RevealOnScroll delayMs={80}>
        <DomainsSection
          title="Domaines mobilisables pour votre organisation"
          subtitle="Selectionnez le domaine le plus pertinent dans votre consultation B2B."
          onBookAppointment={goToBookingPage}
        />
      </RevealOnScroll>

      <RevealOnScroll delayMs={100}>
        <TrustComplianceBlock />
      </RevealOnScroll>
    </RouteShell>
  );
}

