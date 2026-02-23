"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getCaseStudies } from "../lib/api";
import type { CaseStudy } from "../lib/types";
import { Button } from "./ui/button";

type LoadState = "loading" | "ready";

export function CaseStudiesPreview() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loadState, setLoadState] = useState<LoadState>("loading");

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const result = await getCaseStudies();
      if (!mounted) return;
      setCaseStudies(result.caseStudies);
      setLoadState("ready");
    };

    void load();
    return () => {
      mounted = false;
    };
  }, []);

  const preview = useMemo(() => caseStudies.slice(0, 3), [caseStudies]);

  return (
    <section className="py-18 md:py-24 bg-[linear-gradient(180deg,#f4efff,#ecfffa,#f2e9ff)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-purple-600">Etudes de cas</p>
            <h2 className="mt-2 text-3xl md:text-4xl text-purple-900">
              Apercu des missions executees
            </h2>
          </div>
          {preview[0] && (
            <Link href={`/etudes-de-cas/${preview[0].slug}`}>
              <Button
                variant="outline"
                className="rounded-full border-purple-400 bg-white/65 text-purple-900 hover:border-[var(--gbh-mint-deep)] hover:bg-[var(--gbh-mint-soft)]"
              >
                Ouvrir une etude de cas
              </Button>
            </Link>
          )}
        </div>

        {loadState === "loading" && (
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={`case-skeleton-${index}`}
                className="rounded-2xl border border-purple-200 bg-white/80 p-6 animate-pulse"
              >
                <div className="h-4 w-28 rounded bg-purple-200" />
                <div className="mt-3 h-5 w-3/4 rounded bg-purple-200" />
                <div className="mt-4 h-4 w-full rounded bg-[var(--gbh-mint-soft)]" />
                <div className="mt-2 h-4 w-5/6 rounded bg-[var(--gbh-mint-soft)]" />
              </div>
            ))}
          </div>
        )}

        {loadState === "ready" && preview.length === 0 && (
          <div className="mt-8 rounded-2xl border border-purple-200 bg-white/80 px-5 py-6 text-purple-700">
            Aucune etude de cas disponible pour le moment.
          </div>
        )}

        {preview.length > 0 && (
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {preview.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-purple-200 bg-white/85 p-6 shadow-[0_14px_24px_rgba(74,32,173,0.12)] transition-all hover:-translate-y-1 hover:border-[var(--gbh-mint-deep)] hover:shadow-[0_24px_36px_rgba(74,32,173,0.24)]"
              >
                <span className="inline-flex rounded-full bg-purple-100 px-3 py-1 text-xs text-purple-700">
                  {item.category}
                </span>
                <h3 className="mt-4 text-xl text-purple-900">{item.title}</h3>
                <p className="mt-3 text-sm text-purple-700">{item.client}</p>
                <p className="mt-3 text-sm text-purple-700">{item.need}</p>
                <Link
                  href={`/etudes-de-cas/${item.slug}`}
                  className="mt-5 inline-flex text-sm font-semibold text-purple-800 underline underline-offset-4"
                >
                  Lire cette etude de cas
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

