import Link from "next/link";
import { digitalProjects } from "../lib/digital-projects";
import { RevealOnScroll } from "./RevealOnScroll";
import { Button } from "./ui/button";

export function DigitalProjectsShowcase({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <RevealOnScroll delayMs={85}>
      <section
        id="projets-numeriques"
        className="scroll-mt-24 py-18 md:py-24 bg-[linear-gradient(180deg,#e9fffa,#f8f2ff,#ecfffa)]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <p className="text-xs uppercase tracking-[0.2em] text-purple-600">
              Projets numeriques
            </p>
            <h2 className="mt-3 text-3xl md:text-4xl text-purple-900">
              Les startups numeriques portees par GBH.
            </h2>
            <p className="mt-4 text-purple-700">
              Uty, Zwanga, Afya et BPAC traduisent notre ambition: concevoir des
              plateformes utiles, locales et capables de passer du cadrage au terrain.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {digitalProjects.map((project) => {
              const content = (
                <article className="group h-full rounded-3xl border border-purple-200 bg-white/88 p-6 shadow-[0_14px_26px_rgba(74,32,173,0.1)] transition-all hover:-translate-y-1 hover:border-[var(--gbh-mint-deep)] hover:shadow-[0_24px_38px_rgba(74,32,173,0.2)]">
                  <div
                    className="h-2 w-24 rounded-full"
                    style={{ backgroundColor: project.accent }}
                  />
                  <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.16em] text-[var(--gbh-gray-text)]">
                        {project.category}
                      </p>
                      <h3 className="mt-2 text-2xl font-bold text-gray-950">
                        {project.name}
                      </h3>
                    </div>
                    <span className="inline-flex w-fit rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-medium text-purple-800">
                      {project.status}
                    </span>
                  </div>
                  <p className="mt-5 text-gray-600 text-[15px] leading-7">
                    {project.description}
                  </p>
                  <div className="mt-6 flex items-center justify-between gap-4 border-t border-purple-100 pt-5">
                    <span className="text-sm font-semibold text-purple-900">
                      {project.isExternal ? "Ouvrir Zwanga" : "Voir le detail"}
                    </span>
                    <span
                      aria-hidden="true"
                      className="grid h-10 w-10 place-items-center rounded-full bg-[var(--gbh-mint-soft)] text-lg text-purple-900 transition-transform group-hover:translate-x-1"
                    >
                      {project.isExternal ? "ext" : "->"}
                    </span>
                  </div>
                </article>
              );

              if (project.isExternal) {
                return (
                  <a
                    key={project.slug}
                    href={project.route}
                    target="_blank"
                    rel="noreferrer"
                    className="block h-full"
                  >
                    {content}
                  </a>
                );
              }

              return (
                <Link key={project.slug} href={project.route} className="block h-full">
                  {content}
                </Link>
              );
            })}
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
            <p className="max-w-3xl text-lg text-purple-900">
              <span className="font-bold">GBH</span> agit comme promoteur de projets
              numeriques innovants au service du developpement economique et social.
            </p>
            <Button
              onClick={() => onNavigate("contact")}
              className="w-fit rounded-full"
              style={{ backgroundColor: "var(--gbh-magenta)" }}
            >
              Nous contacter a propos d&apos;un projet numerique
            </Button>
          </div>
        </div>
      </section>
    </RevealOnScroll>
  );
}
