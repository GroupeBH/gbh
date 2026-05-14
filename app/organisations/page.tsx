"use client";

import Link from "next/link";
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
            perimetre, delais, budget indicatif, niveau de service attendu et
            cadrage de projets numeriques.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/#projets-numeriques"
              className="inline-flex h-12 items-center justify-center rounded-full border-2 border-purple-300 bg-white/80 px-6 text-base font-semibold text-[var(--gbh-violet-800)] transition-all hover:-translate-y-0.5 hover:border-[var(--gbh-violet-500)]"
            >
              Voir les projets numeriques
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-purple-200/60 bg-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-purple-200 bg-[linear-gradient(135deg,#f7f0ff,#eafffb)] p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.2em] text-purple-600">
              Projets numeriques GBH
            </p>
            <h2 className="mt-3 text-2xl text-purple-900 md:text-3xl">
              Uty, Zwanga, Afya et BPAC montrent notre capacite a cadrer des
              plateformes utiles au marche congolais.
            </h2>
          </div>
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

