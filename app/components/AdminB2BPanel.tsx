import { useEffect, useMemo, useState } from "react";

import {
  type B2BCaseStudy,
  type B2BRfpLead,
  type B2BRfpStatus,
  useAdminCreateB2bCaseStudyMutation,
  useAdminCreateB2bReferenceMutation,
  useAdminDeleteB2bCaseStudyMutation,
  useAdminDeleteB2bReferenceMutation,
  useAdminListB2bCaseStudiesQuery,
  useAdminListB2bReferencesQuery,
  useAdminListRfpQuery,
  useAdminUpdateB2bCaseStudyMutation,
  useAdminUpdateB2bReferenceMutation,
  useAdminUpdateRfpStatusMutation,
} from "../store/api";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

type B2BTab = "rfp" | "references" | "caseStudies";

type FlashMessage = {
  type: "success" | "error";
  message: string;
};

type ReferenceFormState = {
  id: string;
  client_name: string;
  category: string;
  summary: string;
  location: string;
  logo_url: string;
  is_public: boolean;
  sort_order: string;
};

type CaseStudyFormState = {
  id: string;
  slug: string;
  title: string;
  category: string;
  client_name: string;
  problem: string;
  solution: string;
  result: string;
  is_published: boolean;
  sort_order: string;
};

type RfpDecisionModalState = {
  lead: B2BRfpLead;
  nextStatus: B2BRfpStatus;
};

const tabItems: Array<{ key: B2BTab; label: string }> = [
  { key: "rfp", label: "Demandes RFP" },
  { key: "references", label: "References B2B" },
  { key: "caseStudies", label: "Etudes de cas" },
];

const referenceCategories = [
  "Formations",
  "Fourniture & montage",
  "Apport d'affaires",
  "Mines",
];

const rfpStatusLabels: Record<B2BRfpStatus, string> = {
  new: "Nouveau",
  reviewing: "En revue",
  qualified: "Valide",
  won: "Gagne",
  lost: "Refuse",
};

const rfpStatusClasses: Record<B2BRfpStatus, string> = {
  new: "bg-[var(--gbh-mint-soft)] text-teal-700",
  reviewing: "bg-amber-100 text-amber-700",
  qualified: "bg-emerald-100 text-emerald-700",
  won: "bg-violet-100 text-violet-700",
  lost: "bg-rose-100 text-rose-700",
};

const emptyReferenceForm: ReferenceFormState = {
  id: "",
  client_name: "",
  category: referenceCategories[0],
  summary: "",
  location: "",
  logo_url: "",
  is_public: true,
  sort_order: "0",
};

const emptyCaseStudyForm: CaseStudyFormState = {
  id: "",
  slug: "",
  title: "",
  category: referenceCategories[0],
  client_name: "",
  problem: "",
  solution: "",
  result: "",
  is_published: true,
  sort_order: "0",
};

const toDisplayDate = (value?: string) => {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleDateString("fr-FR");
};

const toRfpFilterLabel = (status: B2BRfpStatus | "all") => {
  if (status === "all") return "Tous";
  return rfpStatusLabels[status];
};

const getErrorText = (error: unknown, fallback: string) => {
  if (!error || typeof error !== "object") return fallback;
  if ("data" in error && error.data && typeof error.data === "object") {
    const maybeData = error.data as { error?: unknown };
    if (typeof maybeData.error === "string" && maybeData.error.trim()) {
      return maybeData.error;
    }
  }
  return fallback;
};

export function AdminB2BPanel() {
  const [activeTab, setActiveTab] = useState<B2BTab>("rfp");
  const [rfpFilter, setRfpFilter] = useState<B2BRfpStatus | "all">("all");
  const [flash, setFlash] = useState<FlashMessage | null>(null);

  const [isReferenceModalOpen, setIsReferenceModalOpen] = useState(false);
  const [referenceForm, setReferenceForm] = useState<ReferenceFormState>({
    ...emptyReferenceForm,
  });

  const [isCaseStudyModalOpen, setIsCaseStudyModalOpen] = useState(false);
  const [caseStudyForm, setCaseStudyForm] = useState<CaseStudyFormState>({
    ...emptyCaseStudyForm,
  });

  const [rfpDecisionModal, setRfpDecisionModal] = useState<RfpDecisionModalState | null>(
    null,
  );

  const rfpQuery = useMemo(
    () =>
      rfpFilter === "all"
        ? { limit: 50, offset: 0 }
        : { status: rfpFilter, limit: 50, offset: 0 },
    [rfpFilter],
  );

  const { data: rfpData, isFetching: isLoadingRfp } = useAdminListRfpQuery(rfpQuery);
  const { data: referencesData, isFetching: isLoadingReferences } =
    useAdminListB2bReferencesQuery({ limit: 50, offset: 0 });
  const { data: caseStudiesData, isFetching: isLoadingCaseStudies } =
    useAdminListB2bCaseStudiesQuery({ limit: 50, offset: 0 });

  const [updateRfpStatus, updateRfpStatusState] = useAdminUpdateRfpStatusMutation();

  const [createReference, createReferenceState] = useAdminCreateB2bReferenceMutation();
  const [updateReference, updateReferenceState] = useAdminUpdateB2bReferenceMutation();
  const [deleteReference, deleteReferenceState] = useAdminDeleteB2bReferenceMutation();

  const [createCaseStudy, createCaseStudyState] = useAdminCreateB2bCaseStudyMutation();
  const [updateCaseStudy, updateCaseStudyState] = useAdminUpdateB2bCaseStudyMutation();
  const [deleteCaseStudy, deleteCaseStudyState] = useAdminDeleteB2bCaseStudyMutation();

  const isReferenceSubmitting = createReferenceState.isLoading || updateReferenceState.isLoading;
  const isCaseStudySubmitting = createCaseStudyState.isLoading || updateCaseStudyState.isLoading;

  useEffect(() => {
    if (!flash) return;
    const timeout = setTimeout(() => setFlash(null), 4500);
    return () => clearTimeout(timeout);
  }, [flash]);

  const rfpItems = rfpData?.items || [];
  const referenceItems = referencesData?.items || [];
  const caseStudyItems = caseStudiesData?.items || [];

  const metrics = useMemo(() => {
    const totalRfp = rfpData?.total ?? rfpItems.length;
    const totalReferences = referencesData?.total ?? referenceItems.length;
    const totalCaseStudies = caseStudiesData?.total ?? caseStudyItems.length;

    return [
      { label: "Demandes RFP", value: String(totalRfp) },
      { label: "References B2B", value: String(totalReferences) },
      { label: "Etudes de cas", value: String(totalCaseStudies) },
    ];
  }, [
    rfpData?.total,
    rfpItems.length,
    referencesData?.total,
    referenceItems.length,
    caseStudiesData?.total,
    caseStudyItems.length,
  ]);

  const openReferenceModal = (reference?: (typeof referenceItems)[number]) => {
    if (reference) {
      setReferenceForm({
        id: reference.id || "",
        client_name: reference.client_name || "",
        category: reference.category || referenceCategories[0],
        summary: reference.summary || "",
        location: reference.location || "",
        logo_url: reference.logo_url || "",
        is_public: Boolean(reference.is_public),
        sort_order: String(reference.sort_order ?? 0),
      });
    } else {
      setReferenceForm({ ...emptyReferenceForm });
    }
    setIsReferenceModalOpen(true);
  };

  const closeReferenceModal = () => {
    setIsReferenceModalOpen(false);
    setReferenceForm({ ...emptyReferenceForm });
  };

  const openCaseStudyModal = (caseStudy?: B2BCaseStudy) => {
    if (caseStudy) {
      setCaseStudyForm({
        id: caseStudy.id || "",
        slug: caseStudy.slug || "",
        title: caseStudy.title || "",
        category: caseStudy.category || referenceCategories[0],
        client_name: caseStudy.client_name || "",
        problem: caseStudy.problem || "",
        solution: caseStudy.solution || "",
        result: caseStudy.result || "",
        is_published: Boolean(caseStudy.is_published),
        sort_order: String(caseStudy.sort_order ?? 0),
      });
    } else {
      setCaseStudyForm({ ...emptyCaseStudyForm });
    }
    setIsCaseStudyModalOpen(true);
  };

  const closeCaseStudyModal = () => {
    setIsCaseStudyModalOpen(false);
    setCaseStudyForm({ ...emptyCaseStudyForm });
  };

  const handleConfirmRfpDecision = async () => {
    if (!rfpDecisionModal) return;

    try {
      await updateRfpStatus({
        id: rfpDecisionModal.lead.id,
        status: rfpDecisionModal.nextStatus,
      }).unwrap();
      setFlash({
        type: "success",
        message:
          rfpDecisionModal.nextStatus === "qualified"
            ? "Demande de proposition validee."
            : "Demande de proposition marquee comme refusee.",
      });
      setRfpDecisionModal(null);
    } catch (error) {
      setFlash({
        type: "error",
        message: getErrorText(error, "Impossible de mettre a jour le statut de la demande."),
      });
    }
  };

  const handleReferenceSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const clientName = referenceForm.client_name.trim();
    const category = referenceForm.category.trim();
    const summary = referenceForm.summary.trim();
    const location = referenceForm.location.trim();
    const logoUrl = referenceForm.logo_url.trim();
    const sortOrder = Number(referenceForm.sort_order);

    if (!clientName || !category || !summary || !location) {
      setFlash({
        type: "error",
        message: "Client, categorie, resume et localisation sont obligatoires.",
      });
      return;
    }

    const payload = {
      client_name: clientName,
      category,
      summary,
      location,
      logo_url: logoUrl || undefined,
      is_public: referenceForm.is_public,
      sort_order: Number.isFinite(sortOrder) && sortOrder >= 0 ? sortOrder : 0,
    };

    try {
      if (referenceForm.id) {
        await updateReference({ id: referenceForm.id, ...payload }).unwrap();
        setFlash({ type: "success", message: "Reference mise a jour." });
      } else {
        await createReference(payload).unwrap();
        setFlash({ type: "success", message: "Reference ajoutee." });
      }
      closeReferenceModal();
    } catch (error) {
      setFlash({
        type: "error",
        message: getErrorText(error, "Impossible d'enregistrer la reference."),
      });
    }
  };

  const handleDeleteReference = async (id: string) => {
    if (typeof window !== "undefined") {
      const allowed = window.confirm("Supprimer cette reference ?");
      if (!allowed) return;
    }

    try {
      await deleteReference({ id }).unwrap();
      setFlash({ type: "success", message: "Reference supprimee." });
    } catch (error) {
      setFlash({
        type: "error",
        message: getErrorText(error, "Impossible de supprimer la reference."),
      });
    }
  };

  const handleCaseStudySubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const title = caseStudyForm.title.trim();
    const category = caseStudyForm.category.trim();
    const clientName = caseStudyForm.client_name.trim();
    const problem = caseStudyForm.problem.trim();
    const solution = caseStudyForm.solution.trim();
    const result = caseStudyForm.result.trim();
    const slug = caseStudyForm.slug.trim();
    const sortOrder = Number(caseStudyForm.sort_order);

    if (!title || !category || !clientName || !problem || !solution || !result) {
      setFlash({
        type: "error",
        message: "Titre, categorie, client, besoin, solution et resultat sont obligatoires.",
      });
      return;
    }

    const payload = {
      slug: slug || undefined,
      title,
      category,
      client_name: clientName,
      problem,
      solution,
      result,
      is_published: caseStudyForm.is_published,
      sort_order: Number.isFinite(sortOrder) && sortOrder >= 0 ? sortOrder : 0,
    };

    try {
      if (caseStudyForm.id) {
        await updateCaseStudy({ id: caseStudyForm.id, ...payload }).unwrap();
        setFlash({ type: "success", message: "Etude de cas mise a jour." });
      } else {
        await createCaseStudy(payload).unwrap();
        setFlash({ type: "success", message: "Etude de cas ajoutee." });
      }
      closeCaseStudyModal();
    } catch (error) {
      setFlash({
        type: "error",
        message: getErrorText(error, "Impossible d'enregistrer l'etude de cas."),
      });
    }
  };

  const handleDeleteCaseStudy = async (id: string) => {
    if (typeof window !== "undefined") {
      const allowed = window.confirm("Supprimer cette etude de cas ?");
      if (!allowed) return;
    }

    try {
      await deleteCaseStudy({ id }).unwrap();
      setFlash({ type: "success", message: "Etude de cas supprimee." });
    } catch (error) {
      setFlash({
        type: "error",
        message: getErrorText(error, "Impossible de supprimer l'etude de cas."),
      });
    }
  };

  return (
    <>
      <div className="rounded-3xl bg-white p-8 shadow-2xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-[var(--gbh-gray-text)]">
              Modules B2B
            </p>
            <h2 className="mt-2 text-2xl text-[var(--gbh-black-soft)]">
              Demandes de proposition, references et etudes de cas
            </h2>
            <p className="mt-2 text-sm text-[var(--gbh-gray-text)]">
              Gelez le pipeline B2B avec des actions rapides depuis le panel admin.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-2xl border border-purple-100 bg-[linear-gradient(155deg,#ffffff,#f7f0ff)] px-4 py-3"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-purple-500">
                  {metric.label}
                </p>
                <p className="mt-2 text-2xl font-semibold text-[var(--gbh-black-soft)]">
                  {metric.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-2 sm:grid-cols-3">
          {tabItems.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition-all ${
                  isActive
                    ? "border-[var(--gbh-magenta)] bg-[var(--gbh-magenta-light)] text-[var(--gbh-magenta-dark)] shadow-[0_8px_18px_rgba(88,39,165,0.2)]"
                    : "border-purple-200 bg-[linear-gradient(140deg,#ffffff,#f8edff,#e8fffa)] text-[var(--gbh-gray-text)] hover:border-[var(--gbh-mint-deep)]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {flash && (
          <div
            className={`mt-6 rounded-2xl px-4 py-3 text-sm ${
              flash.type === "success"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-rose-50 text-rose-700"
            }`}
          >
            {flash.message}
          </div>
        )}

        {activeTab === "rfp" && (
          <section className="mt-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-xl text-[var(--gbh-black-soft)]">Demandes de proposition</h3>
                <p className="text-sm text-[var(--gbh-gray-text)]">
                  Validez ou refusez les demandes entrantes depuis un modal de confirmation.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {(["all", "new", "reviewing", "qualified", "won", "lost"] as const).map(
                  (status) => {
                    const isActive = rfpFilter === status;
                    return (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setRfpFilter(status)}
                        className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
                          isActive
                            ? "border-purple-400 bg-[linear-gradient(135deg,#f3e5ff,#dcc6ff,#cafff4)] text-[var(--gbh-violet-900)]"
                            : "border-purple-200 bg-[linear-gradient(140deg,#ffffff,#f8edff,#e8fffa)] text-[var(--gbh-gray-text)] hover:border-[var(--gbh-mint-deep)]"
                        }`}
                      >
                        {toRfpFilterLabel(status)}
                      </button>
                    );
                  },
                )}
              </div>
            </div>

            {isLoadingRfp && (
              <div className="mt-6 space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={`rfp-skeleton-${index}`}
                    className="rounded-2xl border border-purple-100 bg-white p-4"
                  >
                    <div className="h-4 w-1/3 animate-pulse rounded bg-purple-100" />
                    <div className="mt-3 h-3 w-2/3 animate-pulse rounded bg-purple-100/80" />
                    <div className="mt-4 h-9 w-full animate-pulse rounded-xl bg-purple-100/70" />
                  </div>
                ))}
              </div>
            )}

            {!isLoadingRfp && rfpItems.length === 0 && (
              <div className="mt-6 rounded-2xl border border-dashed border-purple-200 bg-purple-50/40 px-5 py-8 text-sm text-[var(--gbh-gray-text)]">
                Aucune demande RFP disponible pour ce filtre.
              </div>
            )}

            <div className="mt-6 space-y-4">
              {rfpItems.map((lead) => {
                const canApprove = lead.status !== "qualified" && lead.status !== "won";
                const canReject = lead.status !== "lost";
                return (
                  <article
                    key={lead.id}
                    className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm transition-all hover:shadow-md"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-lg font-semibold text-[var(--gbh-black-soft)]">
                            {lead.organization}
                          </p>
                          <Badge className={rfpStatusClasses[lead.status]}>
                            {rfpStatusLabels[lead.status]}
                          </Badge>
                          <span className="rounded-full bg-purple-50 px-3 py-1 text-xs text-purple-700">
                            {lead.source}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-[var(--gbh-gray-text)]">
                          Domaine: {lead.domain} | Recu le {toDisplayDate(lead.created_at)}
                        </p>
                        <p className="mt-3 text-sm text-[var(--gbh-gray-text)]">
                          {lead.description}
                        </p>
                        <div className="mt-3 grid gap-2 text-xs text-[var(--gbh-gray-text)] sm:grid-cols-2">
                          <p>Telephone: {lead.phone || "-"}</p>
                          <p>Email: {lead.email || "-"}</p>
                          <p>Contact: {lead.contact_name || "-"}</p>
                          <p>Budget: {lead.budget_range || "-"}</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
                        <Button
                          type="button"
                          variant="outline"
                          className="rounded-full border-emerald-500 text-emerald-700 hover:bg-emerald-50"
                          onClick={() =>
                            setRfpDecisionModal({ lead, nextStatus: "qualified" })
                          }
                          disabled={!canApprove}
                        >
                          Valider
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="rounded-full border-rose-500 text-rose-700 hover:bg-rose-50"
                          onClick={() => setRfpDecisionModal({ lead, nextStatus: "lost" })}
                          disabled={!canReject}
                        >
                          Refuser
                        </Button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {activeTab === "references" && (
          <section className="mt-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-xl text-[var(--gbh-black-soft)]">References B2B</h3>
                <p className="text-sm text-[var(--gbh-gray-text)]">
                  Gelez les references affichees sur la page publique.
                </p>
              </div>
              <Button
                type="button"
                className="rounded-full"
                style={{ backgroundColor: "var(--gbh-magenta)" }}
                onClick={() => openReferenceModal()}
              >
                Nouvelle reference
              </Button>
            </div>

            {isLoadingReferences && (
              <div className="mt-6 space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={`reference-skeleton-${index}`}
                    className="rounded-2xl border border-purple-100 bg-white p-4"
                  >
                    <div className="h-4 w-1/4 animate-pulse rounded bg-purple-100" />
                    <div className="mt-3 h-3 w-3/4 animate-pulse rounded bg-purple-100/80" />
                  </div>
                ))}
              </div>
            )}

            {!isLoadingReferences && referenceItems.length === 0 && (
              <div className="mt-6 rounded-2xl border border-dashed border-purple-200 bg-purple-50/40 px-5 py-8 text-sm text-[var(--gbh-gray-text)]">
                Aucune reference B2B pour le moment.
              </div>
            )}

            <div className="mt-6 space-y-3">
              {referenceItems.map((reference) => (
                <article
                  key={reference.id}
                  className="rounded-2xl border border-purple-100 bg-white p-4 transition-all hover:shadow-md"
                >
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-lg font-semibold text-[var(--gbh-black-soft)]">
                          {reference.client_name}
                        </p>
                        <span className="rounded-full bg-purple-50 px-3 py-1 text-xs text-purple-700">
                          {reference.category}
                        </span>
                        <Badge
                          className={
                            reference.is_public
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-[var(--gbh-mint-soft)] text-teal-700"
                          }
                        >
                          {reference.is_public ? "Public" : "Prive"}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-[var(--gbh-gray-text)]">
                        {reference.location} | Ordre: {reference.sort_order ?? 0}
                      </p>
                      <p className="mt-2 text-sm text-[var(--gbh-gray-text)]">
                        {reference.summary}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-full"
                        onClick={() => openReferenceModal(reference)}
                      >
                        Modifier
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-full border-rose-300 text-rose-700 hover:bg-rose-50"
                        onClick={() => handleDeleteReference(reference.id)}
                        disabled={deleteReferenceState.isLoading}
                      >
                        Supprimer
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {activeTab === "caseStudies" && (
          <section className="mt-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-xl text-[var(--gbh-black-soft)]">Etudes de cas</h3>
                <p className="text-sm text-[var(--gbh-gray-text)]">
                  Gelez les contenus detailes affiches dans /etudes-de-cas.
                </p>
              </div>
              <Button
                type="button"
                className="rounded-full"
                style={{ backgroundColor: "var(--gbh-magenta)" }}
                onClick={() => openCaseStudyModal()}
              >
                Nouvelle etude de cas
              </Button>
            </div>

            {isLoadingCaseStudies && (
              <div className="mt-6 space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={`case-skeleton-${index}`}
                    className="rounded-2xl border border-purple-100 bg-white p-4"
                  >
                    <div className="h-4 w-1/4 animate-pulse rounded bg-purple-100" />
                    <div className="mt-3 h-3 w-3/4 animate-pulse rounded bg-purple-100/80" />
                    <div className="mt-2 h-3 w-full animate-pulse rounded bg-purple-100/60" />
                  </div>
                ))}
              </div>
            )}

            {!isLoadingCaseStudies && caseStudyItems.length === 0 && (
              <div className="mt-6 rounded-2xl border border-dashed border-purple-200 bg-purple-50/40 px-5 py-8 text-sm text-[var(--gbh-gray-text)]">
                Aucune etude de cas disponible.
              </div>
            )}

            <div className="mt-6 space-y-3">
              {caseStudyItems.map((caseStudy) => (
                <article
                  key={caseStudy.id}
                  className="rounded-2xl border border-purple-100 bg-white p-4 transition-all hover:shadow-md"
                >
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-lg font-semibold text-[var(--gbh-black-soft)]">
                          {caseStudy.title}
                        </p>
                        <span className="rounded-full bg-purple-50 px-3 py-1 text-xs text-purple-700">
                          {caseStudy.category}
                        </span>
                        <Badge
                          className={
                            caseStudy.is_published
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-[var(--gbh-mint-soft)] text-teal-700"
                          }
                        >
                          {caseStudy.is_published ? "Publiee" : "Brouillon"}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-[var(--gbh-gray-text)]">
                        Client: {caseStudy.client_name} | Slug: {caseStudy.slug}
                      </p>
                      <p className="mt-2 text-sm text-[var(--gbh-gray-text)]">
                        {caseStudy.problem}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-full"
                        onClick={() => openCaseStudyModal(caseStudy)}
                      >
                        Modifier
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-full border-rose-300 text-rose-700 hover:bg-rose-50"
                        onClick={() => handleDeleteCaseStudy(caseStudy.id)}
                        disabled={deleteCaseStudyState.isLoading}
                      >
                        Supprimer
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>

      {rfpDecisionModal && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-[radial-gradient(circle_at_top,rgba(143,86,255,0.2),transparent_35%),rgba(9,5,25,0.72)] px-4 py-8"
          role="dialog"
          aria-modal="true"
          aria-label="Validation demande de proposition"
          onClick={() => setRfpDecisionModal(null)}
        >
          <div
            className="w-full max-w-xl rounded-3xl border border-purple-200 bg-[linear-gradient(145deg,#ffffff,#f5ecff)] p-6 shadow-[0_24px_60px_rgba(28,10,65,0.45)]"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="text-xs uppercase tracking-[0.2em] text-purple-600">
              Decision RFP
            </p>
            <h3 className="mt-2 text-2xl text-[var(--gbh-black-soft)]">
              {rfpDecisionModal.nextStatus === "qualified"
                ? "Valider cette demande de proposition ?"
                : "Refuser cette demande de proposition ?"}
            </h3>
            <p className="mt-3 text-sm text-[var(--gbh-gray-text)]">
              Organisation:{" "}
              <span className="font-semibold text-[var(--gbh-black-soft)]">
                {rfpDecisionModal.lead.organization}
              </span>{" "}
              | Domaine:{" "}
              <span className="font-semibold text-[var(--gbh-black-soft)]">
                {rfpDecisionModal.lead.domain}
              </span>
            </p>
            <div className="mt-4 rounded-2xl border border-purple-200 bg-white/80 p-4 text-sm text-[var(--gbh-gray-text)]">
              {rfpDecisionModal.nextStatus === "qualified"
                ? "Cette action marque la demande comme validee et prioritaire pour votre pipeline B2B."
                : "Cette action marque la demande comme refusee. Elle restera historisee dans l'admin."}
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                onClick={() => setRfpDecisionModal(null)}
                disabled={updateRfpStatusState.isLoading}
              >
                Annuler
              </Button>
              <Button
                type="button"
                className="rounded-full"
                onClick={handleConfirmRfpDecision}
                disabled={updateRfpStatusState.isLoading}
                style={{
                  backgroundColor:
                    rfpDecisionModal.nextStatus === "qualified"
                      ? "#15803d"
                      : "var(--destructive)",
                }}
              >
                {updateRfpStatusState.isLoading
                  ? "Validation..."
                  : rfpDecisionModal.nextStatus === "qualified"
                  ? "Oui, valider"
                  : "Oui, refuser"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {isReferenceModalOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/45 px-4 py-8"
          role="dialog"
          aria-modal="true"
          aria-label={referenceForm.id ? "Modifier une reference" : "Ajouter une reference"}
          onClick={closeReferenceModal}
        >
          <div
            className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="border-b border-purple-100/80 px-6 py-5">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--gbh-gray-text)]">
                References B2B
              </p>
              <h3 className="mt-2 text-2xl text-[var(--gbh-black-soft)]">
                {referenceForm.id ? "Modifier la reference" : "Ajouter une reference"}
              </h3>
            </div>

            <form className="space-y-4 px-6 py-5" onSubmit={handleReferenceSubmit}>
              <Input
                placeholder="Client *"
                value={referenceForm.client_name}
                onChange={(event) =>
                  setReferenceForm((prev) => ({ ...prev, client_name: event.target.value }))
                }
                required
              />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <select
                  className="w-full rounded-2xl border-2 border-purple-200 bg-white px-4 py-3 text-base text-[var(--gbh-black-soft)] shadow-sm transition-all focus:border-[var(--gbh-magenta)] focus:outline-none focus:ring-4 focus:ring-[var(--gbh-magenta-light)]"
                  value={referenceForm.category}
                  onChange={(event) =>
                    setReferenceForm((prev) => ({ ...prev, category: event.target.value }))
                  }
                >
                  {referenceCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <Input
                  placeholder="Localisation *"
                  value={referenceForm.location}
                  onChange={(event) =>
                    setReferenceForm((prev) => ({ ...prev, location: event.target.value }))
                  }
                  required
                />
              </div>
              <Textarea
                placeholder="Resume *"
                value={referenceForm.summary}
                onChange={(event) =>
                  setReferenceForm((prev) => ({ ...prev, summary: event.target.value }))
                }
                rows={4}
                required
              />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Input
                  placeholder="URL logo (optionnel)"
                  value={referenceForm.logo_url}
                  onChange={(event) =>
                    setReferenceForm((prev) => ({ ...prev, logo_url: event.target.value }))
                  }
                />
                <Input
                  type="number"
                  min={0}
                  placeholder="Ordre d'affichage"
                  value={referenceForm.sort_order}
                  onChange={(event) =>
                    setReferenceForm((prev) => ({ ...prev, sort_order: event.target.value }))
                  }
                />
              </div>
              <label className="inline-flex items-center gap-2 text-sm text-[var(--gbh-gray-text)]">
                <input
                  type="checkbox"
                  checked={referenceForm.is_public}
                  onChange={(event) =>
                    setReferenceForm((prev) => ({ ...prev, is_public: event.target.checked }))
                  }
                />
                Reference visible publiquement
              </label>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full"
                  onClick={closeReferenceModal}
                  disabled={isReferenceSubmitting}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  className="rounded-full"
                  style={{ backgroundColor: "var(--gbh-magenta)" }}
                  disabled={isReferenceSubmitting}
                >
                  {isReferenceSubmitting
                    ? "Enregistrement..."
                    : referenceForm.id
                    ? "Mettre a jour"
                    : "Ajouter la reference"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isCaseStudyModalOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/45 px-4 py-8"
          role="dialog"
          aria-modal="true"
          aria-label={caseStudyForm.id ? "Modifier une etude de cas" : "Ajouter une etude de cas"}
          onClick={closeCaseStudyModal}
        >
          <div
            className="w-full max-w-3xl rounded-3xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="border-b border-purple-100/80 px-6 py-5">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--gbh-gray-text)]">
                Etudes de cas
              </p>
              <h3 className="mt-2 text-2xl text-[var(--gbh-black-soft)]">
                {caseStudyForm.id ? "Modifier l'etude de cas" : "Ajouter une etude de cas"}
              </h3>
            </div>

            <form className="space-y-4 px-6 py-5" onSubmit={handleCaseStudySubmit}>
              <Input
                placeholder="Titre *"
                value={caseStudyForm.title}
                onChange={(event) =>
                  setCaseStudyForm((prev) => ({ ...prev, title: event.target.value }))
                }
                required
              />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <select
                  className="w-full rounded-2xl border-2 border-purple-200 bg-white px-4 py-3 text-base text-[var(--gbh-black-soft)] shadow-sm transition-all focus:border-[var(--gbh-magenta)] focus:outline-none focus:ring-4 focus:ring-[var(--gbh-magenta-light)]"
                  value={caseStudyForm.category}
                  onChange={(event) =>
                    setCaseStudyForm((prev) => ({ ...prev, category: event.target.value }))
                  }
                >
                  {referenceCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <Input
                  placeholder="Client *"
                  value={caseStudyForm.client_name}
                  onChange={(event) =>
                    setCaseStudyForm((prev) => ({ ...prev, client_name: event.target.value }))
                  }
                  required
                />
                <Input
                  placeholder="Slug (optionnel)"
                  value={caseStudyForm.slug}
                  onChange={(event) =>
                    setCaseStudyForm((prev) => ({ ...prev, slug: event.target.value }))
                  }
                />
              </div>
              <Textarea
                placeholder="Besoin / probleme *"
                value={caseStudyForm.problem}
                onChange={(event) =>
                  setCaseStudyForm((prev) => ({ ...prev, problem: event.target.value }))
                }
                rows={3}
                required
              />
              <Textarea
                placeholder="Solution *"
                value={caseStudyForm.solution}
                onChange={(event) =>
                  setCaseStudyForm((prev) => ({ ...prev, solution: event.target.value }))
                }
                rows={3}
                required
              />
              <Textarea
                placeholder="Resultat *"
                value={caseStudyForm.result}
                onChange={(event) =>
                  setCaseStudyForm((prev) => ({ ...prev, result: event.target.value }))
                }
                rows={3}
                required
              />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Input
                  type="number"
                  min={0}
                  placeholder="Ordre d'affichage"
                  value={caseStudyForm.sort_order}
                  onChange={(event) =>
                    setCaseStudyForm((prev) => ({ ...prev, sort_order: event.target.value }))
                  }
                />
                <label className="inline-flex items-center gap-2 rounded-2xl border border-purple-200 px-4 py-3 text-sm text-[var(--gbh-gray-text)]">
                  <input
                    type="checkbox"
                    checked={caseStudyForm.is_published}
                    onChange={(event) =>
                      setCaseStudyForm((prev) => ({
                        ...prev,
                        is_published: event.target.checked,
                      }))
                    }
                  />
                  Publier cette etude de cas
                </label>
              </div>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full"
                  onClick={closeCaseStudyModal}
                  disabled={isCaseStudySubmitting}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  className="rounded-full"
                  style={{ backgroundColor: "var(--gbh-magenta)" }}
                  disabled={isCaseStudySubmitting}
                >
                  {isCaseStudySubmitting
                    ? "Enregistrement..."
                    : caseStudyForm.id
                    ? "Mettre a jour"
                    : "Ajouter l'etude de cas"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
