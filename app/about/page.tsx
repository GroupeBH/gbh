"use client";

import Link from "next/link";
import { RouteShell } from "../components/RouteShell";
import { Button } from "../components/ui/button";
import { digitalProjects } from "../lib/digital-projects";
import {
  companyHistory,
  companyMission,
  strategicObjectives,
  teamProfiles,
} from "../lib/about-data";

const getRoleInitials = (role: string) =>
  role
    .split(/\s+/)
    .map((part) => part[0]?.toUpperCase() || "")
    .slice(0, 2)
    .join("");

export default function AboutPage() {
  return (
    <RouteShell currentPage="a-propos" whatsappContext="about">
      <section className="border-b border-purple-200/60 bg-[radial-gradient(circle_at_80%_18%,#d8fff6_0%,transparent_32%),radial-gradient(circle_at_top_left,#e2d4ff_0%,#f6eeff_45%,#ffffff_100%)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
          <p className="inline-flex rounded-full border border-purple-300 bg-white/80 px-4 py-2 text-xs uppercase tracking-[0.2em] text-purple-700">
            A propos de nous
          </p>
          <h1 className="mt-6 max-w-5xl text-4xl text-purple-900 md:text-5xl">
            Une entreprise orientee execution, confiance et impact durable.
          </h1>
          <p className="mt-5 max-w-3xl text-lg text-purple-700">
            GBH evolue avec une logique simple: transformer les besoins en actions mesurables,
            pour les particuliers, les grands comptes et les startups numeriques que le groupe
            promeut.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link href="/organisations">
              <Button size="lg" className="rounded-full">
                Lancer une consultation B2B
              </Button>
            </Link>
            <Link href="/references">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-purple-400 bg-white/70 text-purple-900 hover:border-[var(--gbh-mint-deep)] hover:bg-[var(--gbh-mint-soft)]"
              >
                Voir nos references
              </Button>
            </Link>
            <Link href="/#projets-numeriques">
              <Button
                size="lg"
                variant="secondary"
                className="rounded-full"
              >
                Voir les projets numeriques
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[linear-gradient(180deg,#f8f3ff,#ecfffa,#f2e9ff)] py-14 md:py-18">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.2em] text-purple-600">Historique</p>
            <h2 className="mt-3 text-3xl text-purple-900 md:text-4xl">
              Les etapes qui ont structure la croissance de GBH
            </h2>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {companyHistory.map((milestone) => (
              <article
                key={milestone.period}
                className="rounded-2xl border border-purple-200 bg-white/85 p-5 shadow-[0_12px_24px_rgba(74,32,173,0.1)]"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-purple-600">
                  {milestone.period}
                </p>
                <h3 className="mt-2 text-xl text-purple-900">{milestone.title}</h3>
                <p className="mt-3 text-sm text-purple-700">{milestone.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-14 md:py-18">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-start">
            <article className="rounded-3xl border border-purple-200 bg-[linear-gradient(145deg,rgba(255,255,255,0.9),rgba(243,233,249,0.78),rgba(227,255,249,0.72))] p-7 md:p-8">
              <p className="text-xs uppercase tracking-[0.2em] text-purple-600">Mission</p>
              <h2 className="mt-3 text-3xl text-purple-900">Ce qui nous guide au quotidien</h2>
              <p className="mt-4 text-purple-700">{companyMission}</p>
            </article>

            <article className="rounded-3xl border border-purple-200 bg-white/90 p-7 md:p-8 shadow-[0_14px_26px_rgba(74,32,173,0.1)]">
              <p className="text-xs uppercase tracking-[0.2em] text-purple-600">Objectifs</p>
              <h2 className="mt-3 text-3xl text-purple-900">Nos priorites strategiques</h2>
              <div className="mt-5 space-y-4">
                {strategicObjectives.map((objective) => (
                  <div
                    key={objective.title}
                    className="rounded-2xl border border-purple-100 bg-[linear-gradient(145deg,rgba(245,236,255,0.8),rgba(231,255,249,0.8))] p-4"
                  >
                    <h3 className="text-lg text-purple-900">{objective.title}</h3>
                    <p className="mt-2 text-sm text-purple-700">{objective.description}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-[linear-gradient(180deg,#ffffff,#ecfffa)] py-14 md:py-18">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-purple-600">
                Innovation
              </p>
              <h2 className="mt-3 text-3xl text-purple-900 md:text-4xl">
                GBH est aussi promoteur de projets numeriques.
              </h2>
              <p className="mt-4 text-purple-700">
                Le groupe accompagne des initiatives locales dans le commerce,
                la mobilite, la sante et la finance numerique.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {digitalProjects.map((project) => (
                <Link
                  key={project.slug}
                  href={project.route}
                  target={project.isExternal ? "_blank" : undefined}
                  rel={project.isExternal ? "noreferrer" : undefined}
                  className="rounded-2xl border border-purple-200 bg-white/85 p-5 shadow-[0_12px_24px_rgba(74,32,173,0.1)] transition-all hover:-translate-y-1 hover:border-[var(--gbh-mint-deep)]"
                >
                  <p className="text-xs uppercase tracking-[0.16em] text-[var(--gbh-gray-text)]">
                    {project.category}
                  </p>
                  <h3 className="mt-2 text-xl text-purple-900">{project.name}</h3>
                  <p className="mt-2 text-sm text-purple-700">{project.status}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[linear-gradient(180deg,#f8f3ff,#ecfffa,#f2e9ff)] py-14 md:py-18">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.2em] text-purple-600">Equipe</p>
            <h2 className="mt-3 text-3xl text-purple-900 md:text-4xl">
              Une equipe pluridisciplinaire orientee resultat
            </h2>
            <p className="mt-4 text-purple-700">
              Chaque pole est aligne sur la meme exigence: clarifier, executer, rendre compte.
            </p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {teamProfiles.map((profile) => (
              <article
                key={profile.role}
                className="rounded-2xl border border-purple-200 bg-white/85 p-6 shadow-[0_12px_24px_rgba(74,32,173,0.1)] transition-all hover:-translate-y-1 hover:border-[var(--gbh-mint-deep)]"
              >
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-purple-200 bg-[linear-gradient(135deg,#f3e5ff,#d7c0ff,#c8fff4)] text-sm font-semibold text-purple-900">
                  {getRoleInitials(profile.role)}
                </div>
                <h3 className="mt-4 text-xl text-purple-900">{profile.role}</h3>
                <p className="mt-1 text-sm font-medium text-teal-700">{profile.focus}</p>
                <p className="mt-3 text-sm text-purple-700">{profile.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </RouteShell>
  );
}
