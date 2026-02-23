"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { getReferences } from "../lib/api";
import { getCompanyInitials, getCompanyLogo } from "../lib/company-logos";
import type { ReferenceCategory, ReferenceItem } from "../lib/types";
import { RouteShell } from "../components/RouteShell";

const categories: Array<"Tous" | ReferenceCategory> = [
  "Tous",
  "Formations",
  "Fourniture & montage",
  "Apport d'affaires",
  "Mines",
];

export default function ReferencesPage() {
  const [references, setReferences] = useState<ReferenceItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>("Tous");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setIsLoading(true);
      const result = await getReferences();
      if (!mounted) return;

      setReferences(result.references);
      setIsLoading(false);
    };

    void load();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredReferences = useMemo(() => {
    if (activeCategory === "Tous") return references;
    return references.filter((item) => item.category === activeCategory);
  }, [activeCategory, references]);

  return (
    <RouteShell currentPage="references" whatsappContext="references">
      <section className="border-b border-purple-200/60 bg-[radial-gradient(circle_at_78%_20%,#d9fff6_0%,transparent_26%),radial-gradient(circle_at_top_right,#e5dcff_0%,#f3ebff_42%,#ffffff_100%)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
          <p className="inline-flex rounded-full border border-purple-300 bg-white/80 px-4 py-2 text-xs uppercase tracking-[0.2em] text-purple-700">
            References B2B
          </p>
          <h1 className="mt-6 text-4xl md:text-5xl text-purple-900 max-w-4xl">
            Des references concretes sur des environnements institutionnels et industriels.
          </h1>
          <p className="mt-5 text-lg text-purple-700 max-w-3xl">
            Retrouvez nos interventions classees par categorie pour orienter votre cadrage
            initial.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-[linear-gradient(180deg,#f7f3ff,#ecfffa,#f2e9ff)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                  activeCategory === category
                    ? "border-purple-400 bg-[linear-gradient(135deg,#f3e5ff,#dcc6ff,#cafff4)] text-[var(--gbh-violet-900)] shadow-[0_10px_20px_rgba(124,48,213,0.2)]"
                    : "border-purple-300 bg-white/80 text-purple-800 hover:border-purple-500"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {isLoading && (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={`reference-page-skeleton-${index}`}
                  className="rounded-2xl border border-purple-200 bg-white/80 p-6 animate-pulse"
                >
                  <div className="h-10 w-10 rounded-full bg-purple-200" />
                  <div className="h-4 w-24 rounded bg-purple-200" />
                  <div className="mt-3 h-6 w-2/3 rounded bg-purple-200" />
                  <div className="mt-4 h-4 w-full rounded bg-[var(--gbh-mint-soft)]" />
                  <div className="mt-2 h-4 w-5/6 rounded bg-[var(--gbh-mint-soft)]" />
                </div>
              ))}
            </div>
          )}

          {!isLoading && filteredReferences.length === 0 && (
            <div className="mt-8 rounded-2xl border border-purple-200 bg-white/80 px-5 py-6 text-purple-700">
              Aucune reference pour cette categorie.
            </div>
          )}

          {!isLoading && filteredReferences.length > 0 && (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredReferences.map((item) => {
                const localLogoSrc =
                  (item.logoUrl?.startsWith("/") ? item.logoUrl : undefined) ||
                  getCompanyLogo(item.client);
                return (
                  <article
                    key={item.id}
                    className="rounded-2xl border border-purple-200 bg-white/85 p-6 shadow-[0_14px_24px_rgba(74,32,173,0.12)] transition-all hover:-translate-y-1 hover:border-[var(--gbh-mint-deep)] hover:shadow-[0_24px_36px_rgba(74,32,173,0.24)]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-purple-100 bg-white">
                        {localLogoSrc ? (
                          <Image
                            src={localLogoSrc}
                            alt={`Logo ${item.client}`}
                            width={30}
                            height={30}
                            className="h-7 w-7 object-contain"
                          />
                        ) : (
                          <span className="text-xs font-semibold text-purple-800">
                            {getCompanyInitials(item.client)}
                          </span>
                        )}
                      </div>
                      <span className="inline-flex rounded-full bg-purple-100 px-3 py-1 text-xs text-purple-700">
                        {item.category}
                      </span>
                    </div>
                    <h2 className="mt-4 text-2xl text-purple-900">{item.client}</h2>
                    <p className="mt-3 text-sm text-purple-700">{item.summary}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {item.location && (
                        <span className="rounded-full bg-[var(--gbh-mint-soft)] px-3 py-1 text-xs text-teal-700">
                          {item.location}
                        </span>
                      )}
                      {item.year && (
                        <span className="rounded-full bg-purple-100 px-3 py-1 text-xs text-purple-700">
                          {item.year}
                        </span>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </RouteShell>
  );
}

