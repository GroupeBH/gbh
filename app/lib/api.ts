import {
  fallbackCaseStudies,
  fallbackDomains,
  fallbackReferences,
} from "./fallback-data";
import { getCompanyLogo } from "./company-logos";
import type {
  CaseStudiesFetchResult,
  CaseStudy,
  DomainFetchResult,
  ReferenceItem,
  ReferencesFetchResult,
  RfpPayload,
  RfpResponse,
  ServiceDomain,
} from "./types";

const REQUEST_TIMEOUT_MS = 9000;

class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const toErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof ApiError && error.message.trim()) return error.message;
  if (error instanceof Error && error.message.trim()) return error.message;
  return fallback;
};

const toText = (value: unknown, fallback = "") => {
  if (typeof value === "string") return value.trim() || fallback;
  if (typeof value === "number") return String(value);
  return fallback;
};

const toStringList = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => toText(item))
    .filter(Boolean);
};

const parseJsonSafe = async (response: Response) => {
  const raw = await response.text();
  if (!raw) return null;

  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return raw;
  }
};

const requestJson = async <T>(path: string, init?: RequestInit) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const headers = new Headers(init?.headers);

  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  try {
    const response = await fetch(path, {
      ...init,
      headers,
      signal: controller.signal,
      cache: "no-store",
      credentials: "include",
    });

    const data = await parseJsonSafe(response);

    if (!response.ok) {
      if (data && typeof data === "object" && "error" in data) {
        const errorText = toText((data as { error?: unknown }).error);
        throw new ApiError(errorText || "Erreur API", response.status);
      }
      if (typeof data === "string" && data.trim()) {
        throw new ApiError(data, response.status);
      }
      throw new ApiError("Erreur API", response.status);
    }

    return data as T;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError(
        "Le serveur met trop de temps a repondre. Veuillez reessayer.",
      );
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
};

const normalizeDomain = (item: Record<string, unknown>, index: number): ServiceDomain => {
  const id =
    toText(item.id) ||
    toText(item._id) ||
    toText(item.slug) ||
    `domain-${index + 1}`;

  const name =
    toText(item.name) ||
    toText(item.title) ||
    toText(item.domain) ||
    `Domaine ${index + 1}`;

  const shortDescription =
    toText(item.shortDescription) ||
    toText(item.short_description) ||
    toText(item.summary);

  const description =
    toText(item.description) ||
    shortDescription ||
    "Description en cours de publication.";

  return {
    id,
    name,
    description,
    shortDescription,
    category: toText(item.category) || undefined,
    audience:
      toText(item.audience) ||
      toText(item.forAudience) ||
      toText(item.for_audience) ||
      undefined,
    slug: toText(item.slug) || undefined,
    benefits: toStringList(item.benefits),
  };
};

const normalizeDomainsPayload = (payload: unknown): ServiceDomain[] => {
  const source =
    Array.isArray(payload)
      ? payload
      : payload && typeof payload === "object"
      ? (payload as { domains?: unknown; services?: unknown; data?: unknown })
          .domains ||
        (payload as { domains?: unknown; services?: unknown; data?: unknown })
          .services ||
        (payload as { domains?: unknown; services?: unknown; data?: unknown }).data
      : null;

  if (!Array.isArray(source)) return [];

  return source
    .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === "object"))
    .map(normalizeDomain);
};

const normalizeReference = (item: Record<string, unknown>, index: number): ReferenceItem => {
  const id =
    toText(item.id) ||
    toText(item._id) ||
    toText(item.slug) ||
    `reference-${index + 1}`;
  const client =
    toText(item.client) ||
    toText(item.client_name) ||
    toText(item.organization) ||
    "Client";

  const categoryRaw = toText(item.category);
  const category = (
    ["Formations", "Fourniture & montage", "Apport d'affaires", "Mines"].includes(categoryRaw)
      ? categoryRaw
      : "Apport d'affaires"
  ) as ReferenceItem["category"];

  return {
    id,
    client,
    category,
    summary:
      toText(item.summary) ||
      toText(item.description) ||
      toText(item.need) ||
      "Reference publiee.",
    value: toText(item.value) || undefined,
    year: toText(item.year) || undefined,
    location: toText(item.location) || undefined,
    logoUrl:
      toText(item.logo_url) ||
      toText(item.logoUrl) ||
      toText(item.logo) ||
      getCompanyLogo(client) ||
      undefined,
  };
};

const normalizeReferencesPayload = (payload: unknown): ReferenceItem[] => {
  const source =
    Array.isArray(payload)
      ? payload
      : payload && typeof payload === "object"
      ? (payload as { items?: unknown; references?: unknown; data?: unknown }).items ||
        (payload as { items?: unknown; references?: unknown; data?: unknown }).references ||
        (payload as { items?: unknown; references?: unknown; data?: unknown }).data
      : null;

  if (!Array.isArray(source)) return [];

  return source
    .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === "object"))
    .map(normalizeReference);
};

const normalizeCaseStudy = (item: Record<string, unknown>, index: number): CaseStudy => {
  const id = toText(item.id) || toText(item._id) || `case-study-${index + 1}`;
  const slug =
    toText(item.slug) ||
    toText(item.id) ||
    toText(item._id) ||
    `case-study-${index + 1}`;
  const categoryRaw = toText(item.category);
  const category = (
    ["Formations", "Fourniture & montage", "Apport d'affaires", "Mines"].includes(categoryRaw)
      ? categoryRaw
      : "Apport d'affaires"
  ) as CaseStudy["category"];

  return {
    id,
    slug,
    title: toText(item.title) || "Etude de cas",
    client: toText(item.client) || toText(item.client_name) || "Client",
    need: toText(item.need) || toText(item.problem) || "Besoin en cours de publication.",
    solution:
      toText(item.solution) || "Solution en cours de publication.",
    result: toText(item.result) || "Resultat en cours de publication.",
    category,
  };
};

const normalizeCaseStudiesPayload = (payload: unknown): CaseStudy[] => {
  const source =
    Array.isArray(payload)
      ? payload
      : payload && typeof payload === "object"
      ? (payload as { items?: unknown; caseStudies?: unknown; studies?: unknown; data?: unknown })
          .items ||
        (payload as { items?: unknown; caseStudies?: unknown; studies?: unknown; data?: unknown })
          .caseStudies ||
        (payload as { items?: unknown; caseStudies?: unknown; studies?: unknown; data?: unknown })
          .studies ||
        (payload as { items?: unknown; caseStudies?: unknown; studies?: unknown; data?: unknown })
          .data
      : null;

  if (!Array.isArray(source)) return [];

  return source
    .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === "object"))
    .map(normalizeCaseStudy);
};

export const getServiceDomains = async (): Promise<DomainFetchResult> => {
  const endpoints = ["/api/v1/services", "/api/services", "/api/v1/service-domains"];
  let lastError: string | undefined;
  let hadSuccessfulEmptyResponse = false;

  for (const endpoint of endpoints) {
    try {
      const payload = await requestJson<unknown>(endpoint);
      const domains = normalizeDomainsPayload(payload);

      if (domains.length > 0) {
        return { domains, fromFallback: false };
      }

      hadSuccessfulEmptyResponse = true;
    } catch (error) {
      lastError = toErrorMessage(
        error,
        "Impossible de charger les domaines pour le moment.",
      );
    }
  }

  if (hadSuccessfulEmptyResponse) {
    return { domains: [], fromFallback: false };
  }

  return {
    domains: fallbackDomains,
    fromFallback: true,
    apiError: lastError || "API indisponible, affichage du mode secours.",
  };
};

export const submitRfp = async (payload: RfpPayload): Promise<RfpResponse> => {
  const body = {
    organization: payload.organization,
    sector: payload.sector || undefined,
    domain: payload.domain,
    deadline: payload.deadline || payload.timeline || undefined,
    budget_range: payload.budgetRange || payload.estimatedBudget || undefined,
    contact_name: payload.contactName || undefined,
    phone: payload.phone,
    email: payload.email || undefined,
    description: payload.description || payload.needDescription,
    source: payload.source || "website",
  };

  return requestJson<RfpResponse>("/api/v1/rfp", {
    method: "POST",
    body: JSON.stringify(body),
  });
};

export const getReferences = async (): Promise<ReferencesFetchResult> => {
  try {
    const payload = await requestJson<unknown>("/api/v1/references");
    const references = normalizeReferencesPayload(payload);

    if (references.length > 0) {
      return { references, fromFallback: false };
    }
  } catch (error) {
    return {
      references: fallbackReferences,
      fromFallback: true,
      apiError: toErrorMessage(error, "API references indisponible."),
    };
  }

  return {
    references: fallbackReferences,
    fromFallback: true,
    apiError: "Aucune reference API, affichage du mode secours.",
  };
};

export const getCaseStudies = async (): Promise<CaseStudiesFetchResult> => {
  try {
    const payload = await requestJson<unknown>("/api/v1/case-studies");
    const caseStudies = normalizeCaseStudiesPayload(payload);

    if (caseStudies.length > 0) {
      return { caseStudies, fromFallback: false };
    }
  } catch (error) {
    return {
      caseStudies: fallbackCaseStudies,
      fromFallback: true,
      apiError: toErrorMessage(error, "API etudes de cas indisponible."),
    };
  }

  return {
    caseStudies: fallbackCaseStudies,
    fromFallback: true,
    apiError: "Aucune etude de cas API, affichage du mode secours.",
  };
};

export const getCaseStudyBySlug = async (slug: string): Promise<CaseStudy> => {
  try {
    const payload = await requestJson<unknown>(
      `/api/v1/case-studies/${encodeURIComponent(slug)}`,
    );

    if (payload && typeof payload === "object" && !Array.isArray(payload)) {
      return normalizeCaseStudy(payload as Record<string, unknown>, 0);
    }
  } catch {
    // Fallback below
  }

  const fallback = fallbackCaseStudies.find((item) => item.slug === slug);
  if (fallback) return fallback;

  throw new ApiError("Etude de cas introuvable.", 404);
};

export const getApiErrorMessage = (error: unknown, fallback: string) =>
  toErrorMessage(error, fallback);
