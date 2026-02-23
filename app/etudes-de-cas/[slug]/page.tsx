"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getCaseStudyBySlug } from "../../lib/api";
import type { CaseStudy } from "../../lib/types";
import { RouteShell } from "../../components/RouteShell";
import { Button } from "../../components/ui/button";

type LoadState = "loading" | "error" | "ready";

export default function CaseStudyDetailPage() {
  const params = useParams();
  const rawSlug = params?.slug;
  const slugValue = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;
  const slug = decodeURIComponent(slugValue || "");
  const hasSlug = Boolean(slug);

  const [loadState, setLoadState] = useState<LoadState>(hasSlug ? "loading" : "error");
  const [caseStudy, setCaseStudy] = useState<CaseStudy | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    hasSlug ? null : "Slug etude de cas manquant.",
  );

  useEffect(() => {
    if (!hasSlug) return;

    let mounted = true;

    const load = async () => {
      try {
        const data = await getCaseStudyBySlug(slug);
        if (!mounted) return;
        setCaseStudy(data);
        setLoadState("ready");
        setErrorMessage(null);
      } catch (error) {
        if (!mounted) return;
        setLoadState("error");
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Impossible de charger etude de cas.",
        );
      }
    };

    void load();
    return () => {
      mounted = false;
    };
  }, [hasSlug, slug]);

  return (
    <RouteShell currentPage="etudes-de-cas" whatsappContext="case-study">
      <section className="border-b border-purple-200/60 bg-[radial-gradient(circle_at_top_left,#e0d4ff_0%,#f6fbff_45%,#ffffff_100%)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-18 md:py-22">
          <p className="inline-flex rounded-full border border-purple-300 bg-white/80 px-4 py-2 text-xs uppercase tracking-[0.2em] text-purple-700">
            Etude de cas
          </p>
          <h1 className="mt-5 text-4xl md:text-5xl text-purple-900">
            {loadState === "ready" && caseStudy ? caseStudy.title : "Chargement etude de cas"}
          </h1>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-[linear-gradient(180deg,#f7f3ff,#f8fbff)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {loadState === "loading" && (
            <div className="space-y-5">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={`case-loading-${index}`}
                  className="rounded-2xl border border-purple-200 bg-white/80 p-6 animate-pulse"
                >
                  <div className="h-5 w-36 rounded bg-purple-200" />
                  <div className="mt-4 h-4 w-full rounded bg-purple-100" />
                  <div className="mt-2 h-4 w-5/6 rounded bg-purple-100" />
                </div>
              ))}
            </div>
          )}

          {loadState === "error" && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6">
              <p className="text-rose-700">
                {errorMessage || "Impossible de charger etude de cas."}
              </p>
              <div className="mt-4 flex gap-3">
                <Link href="/references">
                  <Button variant="outline" className="rounded-full border-rose-300 text-rose-700">
                    Retour aux references
                  </Button>
                </Link>
                <Link href="/organisations">
                  <Button className="rounded-full">
                    Demander une proposition
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {loadState === "ready" && caseStudy && (
            <div className="space-y-6">
              <article className="rounded-3xl border border-purple-200 bg-white/80 p-6 md:p-8">
                <p className="text-xs uppercase tracking-[0.2em] text-purple-500">Client</p>
                <p className="mt-2 text-xl text-purple-900">{caseStudy.client}</p>
              </article>

              <article className="rounded-3xl border border-purple-200 bg-white/85 p-6 md:p-8 shadow-[0_14px_24px_rgba(74,32,173,0.12)]">
                <h2 className="text-2xl text-purple-900">Besoin</h2>
                <p className="mt-3 text-purple-700">{caseStudy.need}</p>
              </article>

              <article className="rounded-3xl border border-purple-200 bg-white/85 p-6 md:p-8 shadow-[0_14px_24px_rgba(74,32,173,0.12)]">
                <h2 className="text-2xl text-purple-900">Solution</h2>
                <p className="mt-3 text-purple-700">{caseStudy.solution}</p>
              </article>

              <article className="rounded-3xl border border-purple-200 bg-white/85 p-6 md:p-8 shadow-[0_14px_24px_rgba(74,32,173,0.12)]">
                <h2 className="text-2xl text-purple-900">Resultat</h2>
                <p className="mt-3 text-purple-700">{caseStudy.result}</p>
              </article>

              <div className="rounded-3xl border border-purple-300/30 bg-[linear-gradient(135deg,rgba(123,51,255,0.2),rgba(102,220,255,0.2))] p-6 md:p-8">
                <h3 className="text-2xl text-purple-900">Vous avez un besoin similaire ?</h3>
                <p className="mt-3 text-purple-800">
                  Partagez votre contexte et recevez une proposition intervention B2B.
                </p>
                <div className="mt-6 flex gap-3">
                  <Link href="/organisations">
                    <Button className="rounded-full">
                      Demander une proposition
                    </Button>
                  </Link>
                  <Link href="/references">
                    <Button
                      variant="outline"
                      className="rounded-full border-purple-400 text-purple-900 bg-white/70 hover:bg-white"
                    >
                      Voir les references
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </RouteShell>
  );
}

