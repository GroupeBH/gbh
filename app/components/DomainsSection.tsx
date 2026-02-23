"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getServiceDomains } from "../lib/api";
import type { ServiceDomain } from "../lib/types";
import { Button } from "./ui/button";

type DomainsSectionProps = {
  title?: string;
  subtitle?: string;
  onBookAppointment?: () => void;
};

type LoadState = "loading" | "success" | "empty" | "error";

const iconByCategory = (category?: string) => {
  const key = (category || "").toLowerCase();
  if (key.includes("formation")) return "F";
  if (key.includes("fourniture")) return "S";
  if (key.includes("mine")) return "M";
  if (key.includes("affaire")) return "B";
  return "D";
};

const DomainSkeletonCard = () => (
  <div className="rounded-2xl border border-purple-200 bg-white/80 p-6 shadow-sm animate-pulse">
    <div className="h-10 w-10 rounded-xl bg-[linear-gradient(135deg,#dcc6ff,#c9fff3)]" />
    <div className="mt-4 h-5 w-2/3 rounded bg-purple-200" />
    <div className="mt-3 h-4 w-full rounded bg-[var(--gbh-mint-soft)]" />
    <div className="mt-2 h-4 w-5/6 rounded bg-[var(--gbh-mint-soft)]" />
    <div className="mt-4 h-3 w-1/3 rounded bg-purple-100" />
  </div>
);

export function DomainsSection({
  title = "Domaines expertise",
  subtitle = "Des capacites multiservices pour executer vos projets B2B et B2C.",
  onBookAppointment,
}: DomainsSectionProps) {
  const [domains, setDomains] = useState<ServiceDomain[]>([]);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [isFallback, setIsFallback] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const applyResult = useCallback((result: Awaited<ReturnType<typeof getServiceDomains>>) => {
    setDomains(result.domains);

    if (result.fromFallback) {
      setLoadState("error");
      setIsFallback(true);
      setErrorMessage(
        result.apiError ||
          "Impossible de joindre API domaines. Affichage du mode secours.",
      );
      return;
    }

    if (result.domains.length === 0) {
      setLoadState("empty");
      return;
    }

    setLoadState("success");
  }, []);

  const loadDomains = useCallback(async () => {
    const result = await getServiceDomains();
    applyResult(result);
  }, [applyResult]);

  useEffect(() => {
    let isMounted = true;

    const loadInitialDomains = async () => {
      const result = await getServiceDomains();
      if (!isMounted) return;
      applyResult(result);
    };

    void loadInitialDomains();
    return () => {
      isMounted = false;
    };
  }, [applyResult]);

  const cards = useMemo(() => domains.slice(0, 8), [domains]);

  return (
    <section className="py-18 md:py-24 bg-[linear-gradient(180deg,#f8f2ff,#ecfffa,#f3eaff)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-3xl md:text-4xl text-purple-900">{title}</h2>
            <p className="mt-3 text-purple-700 max-w-2xl">{subtitle}</p>
          </div>
          {onBookAppointment && (
            <Button
              onClick={onBookAppointment}
              variant="secondary"
              className="rounded-full"
            >
              Prendre rendez-vous
            </Button>
          )}
        </div>

        {loadState === "loading" && (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <DomainSkeletonCard key={`domain-skeleton-${index}`} />
            ))}
          </div>
        )}

        {loadState === "error" && (
          <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-900">
            <p className="text-sm">
              {errorMessage || "Erreur de chargement des domaines."}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Button
                onClick={() => {
                  setLoadState("loading");
                  setErrorMessage(null);
                  setIsFallback(false);
                  void loadDomains();
                }}
                variant="outline"
                className="rounded-full border-amber-400 text-amber-900 hover:bg-amber-100"
              >
                Reessayer
              </Button>
              {isFallback && (
                <span className="text-xs uppercase tracking-[0.18em] text-amber-800">
                  Mode fallback actif
                </span>
              )}
            </div>
          </div>
        )}

        {loadState === "empty" && (
          <div className="mt-8 rounded-2xl border border-purple-200 bg-white/85 px-5 py-6 text-purple-700">
            Aucun domaine disponible pour le moment.
          </div>
        )}

        {cards.length > 0 && loadState !== "loading" && (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((domain) => (
              <article
                key={domain.id}
                className="group rounded-2xl border border-purple-200 bg-white/85 p-6 shadow-[0_14px_26px_rgba(80,33,182,0.12)] transition-all hover:-translate-y-1 hover:border-[var(--gbh-mint-deep)] hover:shadow-[0_24px_38px_rgba(80,33,182,0.25)]"
              >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[linear-gradient(145deg,#efe1ff,var(--gbh-mint-soft))] font-semibold text-purple-700">
                  {iconByCategory(domain.category)}
                </div>
                <h3 className="mt-4 text-lg text-purple-900">{domain.name}</h3>
                <p className="mt-3 text-sm text-purple-700 line-clamp-4">
                  {domain.shortDescription || domain.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {domain.category && (
                    <span className="rounded-full bg-purple-100 px-3 py-1 text-xs text-purple-700">
                      {domain.category}
                    </span>
                  )}
                  {domain.audience && (
                    <span className="rounded-full bg-[var(--gbh-mint-soft)] px-3 py-1 text-xs text-teal-700">
                      {domain.audience}
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

