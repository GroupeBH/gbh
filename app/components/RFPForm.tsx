"use client";

import { useEffect, useMemo, useState } from "react";
import { getApiErrorMessage, getServiceDomains, submitRfp } from "../lib/api";
import type { ServiceDomain } from "../lib/types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

type RfpFormValues = {
  organization: string;
  sector: string;
  domain: string;
  timeline: string;
  estimatedBudget: string;
  contactName: string;
  phone: string;
  email: string;
  needDescription: string;
};

type RfpFormErrors = Partial<Record<keyof RfpFormValues, string>>;

const initialValues: RfpFormValues = {
  organization: "",
  sector: "",
  domain: "",
  timeline: "",
  estimatedBudget: "",
  contactName: "",
  phone: "",
  email: "",
  needDescription: "",
};

const wizardSteps = [
  {
    id: "01",
    title: "Organisation & domaine",
    subtitle: "Posez le cadre general de votre besoin.",
  },
  {
    id: "02",
    title: "Contact & enveloppe",
    subtitle: "Ajoutez les informations de coordination du projet.",
  },
  {
    id: "03",
    title: "Besoin & validation",
    subtitle: "Confirmez les details puis envoyez votre demande.",
  },
] as const;

const stepFields: Array<Array<keyof RfpFormValues>> = [
  ["organization", "domain"],
  ["phone", "email"],
  ["needDescription"],
];

const finalValidationFields: Array<keyof RfpFormValues> = [
  "organization",
  "domain",
  "phone",
  "email",
  "needDescription",
];

type RFPFormProps = {
  heading?: string;
  compact?: boolean;
};

export function RFPForm({
  heading = "Demander une proposition",
  compact = false,
}: RFPFormProps) {
  const [values, setValues] = useState<RfpFormValues>(initialValues);
  const [errors, setErrors] = useState<RfpFormErrors>({});
  const [domains, setDomains] = useState<ServiceDomain[]>([]);
  const [isDomainsLoading, setIsDomainsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(
    null,
  );

  useEffect(() => {
    let mounted = true;
    const loadDomains = async () => {
      setIsDomainsLoading(true);
      const result = await getServiceDomains();
      if (!mounted) return;
      setDomains(result.domains);
      if (!result.fromFallback && result.domains.length === 1) {
        setValues((prev) => ({ ...prev, domain: result.domains[0].name }));
      }
      setIsDomainsLoading(false);
    };

    void loadDomains();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timeout = setTimeout(() => setToast(null), 4500);
    return () => clearTimeout(timeout);
  }, [toast]);

  const domainOptions = useMemo(() => domains.map((item) => item.name), [domains]);
  const progressPercent = ((currentStep + 1) / wizardSteps.length) * 100;

  const validateField = (
    field: keyof RfpFormValues,
    snapshot: RfpFormValues,
  ): string | undefined => {
    if (field === "organization" && !snapshot.organization.trim()) {
      return "Organisation requise.";
    }
    if (field === "domain" && !snapshot.domain.trim()) {
      return "Domaine requis.";
    }
    if (field === "phone") {
      if (!snapshot.phone.trim()) {
        return "Telephone requis.";
      }
      if (snapshot.phone.replace(/\D/g, "").length < 6) {
        return "Telephone invalide.";
      }
    }
    if (field === "email" && snapshot.email.trim()) {
      const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(snapshot.email.trim());
      if (!isEmailValid) {
        return "Email invalide.";
      }
    }
    if (field === "needDescription" && !snapshot.needDescription.trim()) {
      return "Description du besoin requise.";
    }
    return undefined;
  };

  const validateFields = (fields: Array<keyof RfpFormValues>): RfpFormErrors => {
    const nextErrors: RfpFormErrors = {};
    for (const field of fields) {
      const fieldError = validateField(field, values);
      if (fieldError) {
        nextErrors[field] = fieldError;
      }
    }
    return nextErrors;
  };

  const applyFieldErrors = (
    fields: Array<keyof RfpFormValues>,
    fieldErrors: RfpFormErrors,
  ) => {
    setErrors((prev) => {
      const next = { ...prev };
      for (const field of fields) {
        next[field] = fieldErrors[field];
      }
      return next;
    });
  };

  const validateCurrentStep = () => {
    const fields = stepFields[currentStep] ?? [];
    const fieldErrors = validateFields(fields);
    applyFieldErrors(fields, fieldErrors);
    return fields.every((field) => !fieldErrors[field]);
  };

  const goToNextStep = () => {
    const isStepValid = validateCurrentStep();
    if (!isStepValid) {
      setToast({
        type: "error",
        message: "Merci de corriger les champs requis avant de continuer.",
      });
      return;
    }

    setCurrentStep((prev) => Math.min(prev + 1, wizardSteps.length - 1));
  };

  const goToPreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const setField = <K extends keyof RfpFormValues>(field: K, value: RfpFormValues[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateBeforeSubmit = () => {
    const nextErrors = validateFields(finalValidationFields);
    applyFieldErrors(finalValidationFields, nextErrors);

    if (finalValidationFields.some((field) => Boolean(nextErrors[field]))) {
      setToast({
        type: "error",
        message: "Merci de corriger les champs obligatoires.",
      });
      return false;
    }
    return true;
  };

  const openConfirmationModal = () => {
    const isValid = validateBeforeSubmit();
    if (!isValid) return;
    setIsConfirmModalOpen(true);
  };

  const handleSubmitConfirmed = async () => {
    setIsSubmitting(true);
    try {
      await submitRfp({
        organization: values.organization.trim(),
        sector: values.sector.trim() || undefined,
        domain: values.domain.trim(),
        timeline: values.timeline.trim() || undefined,
        estimatedBudget: values.estimatedBudget.trim() || undefined,
        contactName: values.contactName.trim() || undefined,
        phone: values.phone.trim(),
        email: values.email.trim() || undefined,
        needDescription: values.needDescription.trim(),
      });

      setValues(initialValues);
      setErrors({});
      setCurrentStep(0);
      setIsConfirmModalOpen(false);
      setToast({
        type: "success",
        message:
          "Demande envoyee. Un conseiller GBH vous recontactera rapidement.",
      });
    } catch (error) {
      setIsConfirmModalOpen(false);
      setToast({
        type: "error",
        message: getApiErrorMessage(
          error,
          "Echec de l'envoi de la demande. Veuillez reessayer.",
        ),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={compact ? "" : "py-16 md:py-20"} id="rfp-form">
      <div className={compact ? "" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"}>
        <div className="rounded-3xl border border-purple-200 bg-white/85 p-6 md:p-8 shadow-[0_20px_34px_rgba(70,28,172,0.16)] backdrop-blur">
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.2em] text-purple-600">Flux B2B</p>
            <h2 className="mt-2 text-3xl text-purple-900">{heading}</h2>
          </div>

          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              openConfirmationModal();
            }}
            noValidate
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-purple-600">
                <span>Etape {currentStep + 1}/3</span>
                <span>{wizardSteps[currentStep].title}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-purple-100">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,var(--gbh-violet-700),var(--gbh-magenta))] transition-all duration-400"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {wizardSteps.map((step, index) => {
                  const isDone = index < currentStep;
                  const isActive = index === currentStep;
                  return (
                    <div
                      key={step.id}
                      className={`rounded-2xl border px-4 py-3 transition-all ${
                        isActive
                          ? "border-purple-400 bg-purple-100/70 shadow-[0_8px_18px_rgba(75,31,172,0.15)]"
                          : isDone
                          ? "border-purple-300 bg-white/90"
                          : "border-purple-200 bg-white/70"
                      }`}
                    >
                      <p className="text-[11px] uppercase tracking-[0.18em] text-purple-500">
                        {step.id}
                      </p>
                      <p className="mt-1 text-sm text-purple-900">{step.title}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl border border-purple-200 bg-[linear-gradient(155deg,rgba(255,255,255,0.95),rgba(243,233,249,0.75))] p-5 md:p-6">
              <p className="text-xs uppercase tracking-[0.18em] text-purple-600">
                {wizardSteps[currentStep].subtitle}
              </p>

              {currentStep === 0 && (
                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm text-purple-800">Organisation *</label>
                    <Input
                      value={values.organization}
                      onChange={(event) => setField("organization", event.target.value)}
                      placeholder="Nom de votre organisation"
                    />
                    {errors.organization && (
                      <p className="mt-1 text-xs text-rose-600">{errors.organization}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm text-purple-800">Secteur</label>
                    <Input
                      value={values.sector}
                      onChange={(event) => setField("sector", event.target.value)}
                      placeholder="Ex: Energie, Mines, Services"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-purple-800">Domaine *</label>
                    {isDomainsLoading ? (
                      <div className="mt-1 space-y-2">
                        <div className="h-[52px] w-full animate-pulse rounded-2xl border-2 border-purple-200 bg-white/70" />
                        <div className="grid grid-cols-2 gap-2">
                          <div className="h-2 animate-pulse rounded bg-purple-200/70" />
                          <div className="h-2 animate-pulse rounded bg-purple-200/50" />
                        </div>
                      </div>
                    ) : domainOptions.length > 0 ? (
                      <select
                        value={values.domain}
                        onChange={(event) => setField("domain", event.target.value)}
                        className="w-full rounded-2xl border-2 border-purple-200 bg-white px-4 py-3 text-base text-purple-900 shadow-sm transition-all focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                      >
                        <option value="">Selectionner un domaine</option>
                        {domainOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <Input
                        value={values.domain}
                        onChange={(event) => setField("domain", event.target.value)}
                        placeholder="Saisissez le domaine concerne"
                      />
                    )}
                    {errors.domain && <p className="mt-1 text-xs text-rose-600">{errors.domain}</p>}
                  </div>
                  <div className="rounded-2xl border border-purple-200 bg-white/80 px-4 py-4 text-sm text-purple-700">
                    Selectionnez le domaine qui correspond a la mission. Vous pourrez
                    detailler le besoin a la prochaine etape.
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm text-purple-800">Delai souhaite</label>
                    <Input
                      value={values.timeline}
                      onChange={(event) => setField("timeline", event.target.value)}
                      placeholder="Ex: 2 semaines, 1 mois"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-purple-800">Budget estimatif</label>
                    <Input
                      value={values.estimatedBudget}
                      onChange={(event) => setField("estimatedBudget", event.target.value)}
                      placeholder="Optionnel"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-purple-800">Contact</label>
                    <Input
                      value={values.contactName}
                      onChange={(event) => setField("contactName", event.target.value)}
                      placeholder="Nom du point focal"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-purple-800">Telephone *</label>
                    <Input
                      value={values.phone}
                      onChange={(event) => setField("phone", event.target.value)}
                      placeholder="+243 ..."
                    />
                    {errors.phone && <p className="mt-1 text-xs text-rose-600">{errors.phone}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm text-purple-800">Email</label>
                    <Input
                      type="email"
                      value={values.email}
                      onChange={(event) => setField("email", event.target.value)}
                      placeholder="contact@organisation.com"
                    />
                    {errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email}</p>}
                  </div>
                  <div className="md:col-span-2 rounded-2xl border border-purple-200 bg-purple-50/70 px-4 py-3 text-sm text-purple-700">
                    Le formulaire B2B est distinct du flux de prise de rendez-vous.
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="text-sm text-purple-800">Description du besoin *</label>
                    <Textarea
                      value={values.needDescription}
                      onChange={(event) => setField("needDescription", event.target.value)}
                      rows={6}
                      placeholder="Contexte, objectifs, contraintes, livrables attendus..."
                    />
                    {errors.needDescription && (
                      <p className="mt-1 text-xs text-rose-600">{errors.needDescription}</p>
                    )}
                  </div>

                  <div className="rounded-2xl border border-purple-200 bg-white/80 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-purple-600">
                      Recapitulatif
                    </p>
                    <div className="mt-3 grid grid-cols-1 gap-3 text-sm text-purple-800 md:grid-cols-2">
                      <p>
                        <span className="text-purple-600">Organisation:</span>{" "}
                        {values.organization || "-"}
                      </p>
                      <p>
                        <span className="text-purple-600">Domaine:</span> {values.domain || "-"}
                      </p>
                      <p>
                        <span className="text-purple-600">Telephone:</span> {values.phone || "-"}
                      </p>
                      <p>
                        <span className="text-purple-600">Delai:</span> {values.timeline || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 border-t border-purple-200/70 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs uppercase tracking-[0.15em] text-purple-600">
                * Champs obligatoires
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                {currentStep > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full"
                    onClick={goToPreviousStep}
                    disabled={isSubmitting}
                  >
                    Retour
                  </Button>
                )}
                {currentStep < wizardSteps.length - 1 ? (
                  <Button
                    type="button"
                    className="rounded-full"
                    onClick={goToNextStep}
                    disabled={isSubmitting}
                  >
                    Continuer
                  </Button>
                ) : (
                  <Button
                    type="button"
                    className="rounded-full"
                    onClick={openConfirmationModal}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Envoi en cours..." : "Envoyer la demande"}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      {isConfirmModalOpen && (
        <div
          className="fixed inset-0 z-[75] flex items-center justify-center bg-[radial-gradient(circle_at_top,rgba(161,114,202,0.25),transparent_35%),rgba(22,10,45,0.68)] px-4 py-8"
          role="dialog"
          aria-modal="true"
          aria-label="Confirmation demande de proposition"
          onClick={() => {
            if (isSubmitting) return;
            setIsConfirmModalOpen(false);
          }}
        >
          <div
            className="w-full max-w-xl rounded-3xl border border-purple-200 bg-[linear-gradient(145deg,#ffffff,#f4ebff)] p-6 shadow-[0_24px_60px_rgba(28,10,65,0.45)]"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="text-xs uppercase tracking-[0.2em] text-purple-600">Confirmation</p>
            <h3 className="mt-2 text-2xl text-purple-900">
              Valider l&apos;envoi de votre demande de proposition ?
            </h3>
            <p className="mt-3 text-sm text-purple-700">
              Vous allez transmettre cette demande a l&apos;equipe GBH. Un conseiller vous
              recontactera rapidement.
            </p>

            <div className="mt-4 rounded-2xl border border-purple-200 bg-white/80 p-4 text-sm text-purple-800">
              <p>
                <span className="text-purple-600">Organisation:</span> {values.organization || "-"}
              </p>
              <p className="mt-1">
                <span className="text-purple-600">Domaine:</span> {values.domain || "-"}
              </p>
              <p className="mt-1">
                <span className="text-purple-600">Telephone:</span> {values.phone || "-"}
              </p>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                onClick={() => setIsConfirmModalOpen(false)}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button
                type="button"
                className="rounded-full"
                onClick={handleSubmitConfirmed}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Envoi en cours..." : "Oui, envoyer"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed right-4 top-24 z-[70]">
          <div
            className={`max-w-sm rounded-2xl px-4 py-3 text-sm shadow-xl ${
              toast.type === "success"
                ? "bg-purple-700 text-white"
                : "bg-rose-600 text-white"
            }`}
            role="status"
            aria-live="polite"
          >
            {toast.message}
          </div>
        </div>
      )}
    </section>
  );
}

