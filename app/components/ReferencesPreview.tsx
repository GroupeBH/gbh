"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getReferences } from "../lib/api";
import { getCompanyInitials, getCompanyLogo } from "../lib/company-logos";
import type { ReferenceItem } from "../lib/types";
import { Button } from "./ui/button";

type LoadState = "loading" | "ready";

export function ReferencesPreview() {
  const [references, setReferences] = useState<ReferenceItem[]>([]);
  const [loadState, setLoadState] = useState<LoadState>("loading");

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const result = await getReferences();
      if (!mounted) return;

      setReferences(result.references);
      setLoadState("ready");
    };

    void load();
    return () => {
      mounted = false;
    };
  }, []);

  const preview = useMemo(() => references.slice(0, 6), [references]);

  return (
    <section className="py-18 md:py-24 bg-[linear-gradient(180deg,#f8f4ff,#ecfffa,#f2e9ff)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-purple-600">References</p>
            <h2 className="mt-2 text-3xl md:text-4xl text-purple-900">Apercu de references B2B</h2>
          </div>
          <Link href="/references">
            <Button
              variant="outline"
              className="rounded-full border-purple-400 bg-white/65 text-purple-900 hover:border-[var(--gbh-mint-deep)] hover:bg-[var(--gbh-mint-soft)]"
            >
              Voir toutes les references
            </Button>
          </Link>
        </div>

        {loadState === "loading" && (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={`reference-skeleton-${index}`}
                className="rounded-2xl border border-purple-200 bg-white/70 p-6 animate-pulse"
              >
                <div className="h-10 w-10 rounded-full bg-purple-200" />
                <div className="h-4 w-24 rounded bg-purple-200" />
                <div className="mt-3 h-5 w-2/3 rounded bg-purple-200" />
                <div className="mt-4 h-4 w-full rounded bg-[var(--gbh-mint-soft)]" />
                <div className="mt-2 h-4 w-5/6 rounded bg-[var(--gbh-mint-soft)]" />
              </div>
            ))}
          </div>
        )}

        {loadState === "ready" && preview.length === 0 && (
          <div className="mt-8 rounded-2xl border border-purple-200 bg-white/80 px-5 py-6 text-purple-700">
            Aucune reference disponible pour le moment.
          </div>
        )}

        {preview.length > 0 && (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {preview.map((item) => {
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
                  <h3 className="mt-4 text-xl text-purple-900">{item.client}</h3>
                  <p className="mt-3 text-sm text-purple-700">{item.summary}</p>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

