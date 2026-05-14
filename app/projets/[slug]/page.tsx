import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { detailProjects, getDigitalProject } from "../../lib/digital-projects";
import { RouteShell } from "../../components/RouteShell";

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return detailProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getDigitalProject(slug);

  if (!project) {
    return {
      title: "Projet numerique | Groupe B-Holding Sarl",
    };
  }

  return {
    title: `${project.name} | Projet numerique GBH`,
    description: project.description,
  };
}

export default async function DigitalProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getDigitalProject(slug);

  if (slug === "bapac") {
    redirect("/projets/bpac");
  }

  if (!project) {
    notFound();
  }

  if (project.isExternal) {
    redirect(project.route);
  }

  return (
    <RouteShell currentPage="domaines" whatsappContext={`projet-${project.slug}`}>
      <section className={`overflow-hidden border-b border-purple-200/60 bg-gradient-to-br ${project.surface}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-22">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <Link
                href="/#domaines"
                className="inline-flex rounded-full border border-purple-300 bg-white/75 px-4 py-2 text-xs uppercase tracking-[0.2em] text-purple-700 transition-colors hover:bg-white"
              >
                Retour aux projets
              </Link>
              <p className="mt-8 text-xs uppercase tracking-[0.2em] text-[var(--gbh-gray-text)]">
                {project.category}
              </p>
              <h1 className="mt-3 text-4xl md:text-6xl text-purple-950">
                {project.name}
              </h1>
              <p className="mt-5 max-w-3xl text-xl text-purple-900 md:text-2xl">
                {project.tagline}
              </p>
              <p className="mt-5 max-w-2xl text-purple-700">
                {project.description}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/#contact"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,#6d24d9,#a33fff,#d060ff)] px-6 text-base font-semibold text-white shadow-[0_12px_30px_rgba(128,39,206,0.42)] transition-all hover:-translate-y-0.5 hover:brightness-110"
                >
                  Echanger sur ce projet
                </Link>
                <Link
                  href="/organisations"
                  className="inline-flex h-12 items-center justify-center rounded-full border-2 border-purple-300 bg-white/80 px-6 text-base font-semibold text-[var(--gbh-violet-800)] transition-all hover:-translate-y-0.5 hover:border-[var(--gbh-violet-500)]"
                >
                  Lancer une consultation
                </Link>
              </div>
            </div>

            <div className="relative min-h-[340px]">
              <div
                className="absolute inset-0 rounded-[2rem] opacity-20 blur-3xl"
                style={{ backgroundColor: project.accent }}
              />
              <div className="relative rounded-[2rem] border border-white/70 bg-white/82 p-6 shadow-[0_24px_55px_rgba(74,32,173,0.16)]">
                <div
                  className="h-2 w-28 rounded-full"
                  style={{ backgroundColor: project.accent }}
                />
                <div className="mt-8 grid gap-4">
                  {project.proofPoints.map((item) => (
                    <div
                      key={item.label}
                      className="border-b border-purple-100 pb-4 last:border-b-0 last:pb-0"
                    >
                      <p className="text-xs uppercase tracking-[0.16em] text-[var(--gbh-gray-text)]">
                        {item.label}
                      </p>
                      <p className="mt-1 text-2xl font-semibold text-purple-950">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-8 rounded-2xl bg-[var(--gbh-mint-soft)] p-5">
                  <p className="text-xs uppercase tracking-[0.16em] text-teal-700">
                    Public cible
                  </p>
                  <p className="mt-2 text-purple-900">{project.audience}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-purple-600">
                Ce que le projet porte
              </p>
              <h2 className="mt-3 text-3xl text-purple-950 md:text-4xl">
                Un cadrage produit oriente usage, execution et confiance.
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {project.highlights.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-purple-200 bg-[linear-gradient(145deg,#ffffff,#f7f0ff)] p-5"
                >
                  <div
                    className="mb-4 h-2 w-14 rounded-full"
                    style={{ backgroundColor: project.accent }}
                  />
                  <p className="font-semibold text-purple-950">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[linear-gradient(180deg,#ffffff,#ecfffa,#f7f2ff)] py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <article className="rounded-3xl border border-purple-200 bg-white/88 p-7 md:p-8 shadow-[0_16px_32px_rgba(74,32,173,0.12)]">
              <p className="text-xs uppercase tracking-[0.2em] text-purple-600">
                Fonctionnalites
              </p>
              <h2 className="mt-3 text-3xl text-purple-950">Capacites prevues</h2>
              <ul className="mt-7 space-y-4">
                {project.capabilities.map((item) => (
                  <li key={item} className="flex gap-3 text-purple-800">
                    <span
                      className="mt-2 h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: project.accent }}
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-3xl border border-purple-200 bg-white/88 p-7 md:p-8 shadow-[0_16px_32px_rgba(74,32,173,0.12)]">
              <p className="text-xs uppercase tracking-[0.2em] text-purple-600">
                Trajectoire
              </p>
              <h2 className="mt-3 text-3xl text-purple-950">Feuille de route</h2>
              <ol className="mt-7 space-y-4">
                {project.roadmap.map((item, index) => (
                  <li key={item} className="grid grid-cols-[2.5rem_1fr] gap-4 text-purple-800">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-purple-100 text-sm font-semibold text-purple-950">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="pt-2">{item}</span>
                  </li>
                ))}
              </ol>
            </article>
          </div>
        </div>
      </section>
    </RouteShell>
  );
}
