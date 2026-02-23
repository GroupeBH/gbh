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

const ORGANIZATION_MAX_LEN = 120;
const SECTOR_MAX_LEN = 80;
const DOMAIN_MAX_LEN = 80;
const TIMELINE_MAX_LEN = 80;
const BUDGET_MAX_LEN = 80;
const CONTACT_MAX_LEN = 80;
const PHONE_MAX_LEN = 24;
const EMAIL_MAX_LEN = 120;
const NEED_DESCRIPTION_MAX_LEN = 2000;
const NEED_DESCRIPTION_MIN_LEN = 20;
const TIMELINE_MAX_DAYS = 3650;
const USD_BUDGET_MAX = 999_999_999_999;

const fieldIds: Record<keyof RfpFormValues, string> = {
  organization: "rfp-organization",
  sector: "rfp-sector",
  domain: "rfp-domain",
  timeline: "rfp-timeline",
  estimatedBudget: "rfp-estimated-budget",
  contactName: "rfp-contact-name",
  phone: "rfp-phone",
  email: "rfp-email",
  needDescription: "rfp-need-description",
};

const toBudgetUsdAmount = (value: string): number | null => {
  const digitsOnly = value.replace(/[^\d]/g, "");
  if (!digitsOnly) return null;
  const amount = Number(digitsOnly);
  if (!Number.isFinite(amount)) return null;
  return amount;
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
    subtitle: "Confirmez les details puis envoyez votre consultation.",
  },
] as const;

const stepFields: Array<Array<keyof RfpFormValues>> = [
  ["organization", "domain"],
  ["phone", "email"],
  ["needDescription"],
];

const finalValidationFields: Array<keyof RfpFormValues> = [
  "organization",
  "sector",
  "domain",
  "timeline",
  "estimatedBudget",
  "contactName",
  "phone",
  "email",
  "needDescription",
];

type RFPFormProps = {
  heading?: string;
  compact?: boolean;
};

type SuccessModalPayload = {
  organization: string;
  domain: string;
};

export function RFPForm({
  heading = "Lancer une consultation B2B",
  compact = false,
}: RFPFormProps) {
  const [values, setValues] = useState<RfpFormValues>(initialValues);
  const [errors, setErrors] = useState<RfpFormErrors>({});
  const [domains, setDomains] = useState<ServiceDomain[]>([]);
  const [isDomainsLoading, setIsDomainsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [successModalData, setSuccessModalData] = useState<SuccessModalPayload | null>(null);
  const [touchedFields, setTouchedFields] = useState<
    Partial<Record<keyof RfpFormValues, boolean>>
  >({});
  const [toast, setToast] = useState<{ type: "error"; message: string } | null>(null);

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

  const focusField = (field: keyof RfpFormValues) => {
    if (typeof window === "undefined") return;
    const node = window.document.getElementById(fieldIds[field]) as
      | HTMLInputElement
      | HTMLSelectElement
      | HTMLTextAreaElement
      | null;
    node?.focus();
  };

  const focusFirstErrorField = (
    fields: Array<keyof RfpFormValues>,
    fieldErrors: RfpFormErrors,
  ) => {
    const firstInvalidField = fields.find((field) => Boolean(fieldErrors[field]));
    if (!firstInvalidField) return;

    if (typeof window !== "undefined") {
      window.requestAnimationFrame(() => focusField(firstInvalidField));
    }
  };

  const validateField = (
    field: keyof RfpFormValues,
    snapshot: RfpFormValues,
  ): string | undefined => {
    const organization = snapshot.organization.trim();
    const sector = snapshot.sector.trim();
    const domain = snapshot.domain.trim();
    const timeline = snapshot.timeline.trim();
    const estimatedBudget = snapshot.estimatedBudget.trim();
    const contactName = snapshot.contactName.trim();
    const phone = snapshot.phone.trim();
    const email = snapshot.email.trim();
    const needDescription = snapshot.needDescription.trim();

    if (field === "organization") {
      if (!organization) {
        return "Organisation requise.";
      }
      if (organization.length < 2) {
        return "Organisation trop courte (2 caracteres min).";
      }
      if (organization.length > ORGANIZATION_MAX_LEN) {
        return `Organisation trop longue (${ORGANIZATION_MAX_LEN} max).`;
      }
    }
    if (field === "sector" && sector) {
      if (sector.length < 2) {
        return "Secteur trop court (2 caracteres min).";
      }
      if (sector.length > SECTOR_MAX_LEN) {
        return `Secteur trop long (${SECTOR_MAX_LEN} max).`;
      }
    }
    if (field === "domain") {
      if (!domain) {
        return "Domaine requis.";
      }
      if (domain.length > DOMAIN_MAX_LEN) {
        return `Domaine trop long (${DOMAIN_MAX_LEN} max).`;
      }
      if (domainOptions.length > 0 && !domainOptions.includes(domain)) {
        return "Domaine invalide. Merci de selectionner une option proposee.";
      }
    }
    if (field === "timeline" && timeline) {
      if (!/^\d+$/.test(timeline)) {
        return "Duree invalide. Saisissez un nombre de jours.";
      }
      const days = Number(timeline);
      if (!Number.isInteger(days) || days < 1 || days > TIMELINE_MAX_DAYS) {
        return `Duree invalide (${TIMELINE_MAX_DAYS} jours max).`;
      }
    }
    if (field === "estimatedBudget" && estimatedBudget) {
      if (!/^[\d\s.,]+$/.test(estimatedBudget)) {
        return "Budget invalide. Saisissez un montant en USD.";
      }
      if (estimatedBudget.length > BUDGET_MAX_LEN) {
        return `Budget trop long (${BUDGET_MAX_LEN} max).`;
      }
      const usdAmount = toBudgetUsdAmount(estimatedBudget);
      if (!usdAmount) {
        return "Budget invalide. Saisissez un montant en USD.";
      }
      if (usdAmount > USD_BUDGET_MAX) {
        return "Budget invalide. Montant trop eleve.";
      }
    }
    if (field === "contactName" && contactName) {
      if (contactName.length < 2) {
        return "Nom de contact trop court (2 caracteres min).";
      }
      if (contactName.length > CONTACT_MAX_LEN) {
        return `Nom de contact trop long (${CONTACT_MAX_LEN} max).`;
      }
    }
    if (field === "phone") {
      if (!phone) {
        return "Telephone requis.";
      }
      if (!/^[\d+\s().-]+$/.test(phone)) {
        return "Telephone invalide. Utilisez chiffres, espaces et +().-";
      }
      const digits = phone.replace(/\D/g, "");
      if (digits.length < 8 || digits.length > 15) {
        return "Telephone invalide (8 a 15 chiffres).";
      }
    }
    if (field === "email" && email) {
      if (email.length > EMAIL_MAX_LEN) {
        return `Email trop long (${EMAIL_MAX_LEN} max).`;
      }
      const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!isEmailValid) {
        return "Email invalide.";
      }
    }
    if (field === "needDescription") {
      if (!needDescription) {
        return "Description du besoin requise.";
      }
      if (needDescription.length < NEED_DESCRIPTION_MIN_LEN) {
        return `Description trop courte (${NEED_DESCRIPTION_MIN_LEN} caracteres min).`;
      }
      if (needDescription.length > NEED_DESCRIPTION_MAX_LEN) {
        return `Description trop longue (${NEED_DESCRIPTION_MAX_LEN} max).`;
      }
    }
    return undefined;
  };

  const validateFields = (
    fields: Array<keyof RfpFormValues>,
    snapshot: RfpFormValues = values,
  ): RfpFormErrors => {
    const nextErrors: RfpFormErrors = {};
    for (const field of fields) {
      const fieldError = validateField(field, snapshot);
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
    setTouchedFields((prev) => {
      const next = { ...prev };
      for (const field of fields) {
        next[field] = true;
      }
      return next;
    });

    const fieldErrors = validateFields(fields);
    applyFieldErrors(fields, fieldErrors);
    const isValid = fields.every((field) => !fieldErrors[field]);
    if (!isValid) {
      focusFirstErrorField(fields, fieldErrors);
    }
    return isValid;
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

  const setField = (field: keyof RfpFormValues, value: string) => {
    let sanitizedValue = value;
    if (field === "phone") {
      sanitizedValue = value.replace(/[^\d+\s().-]/g, "").slice(0, PHONE_MAX_LEN);
    } else if (field === "timeline") {
      sanitizedValue = value.replace(/[^\d]/g, "").slice(0, TIMELINE_MAX_LEN);
    } else if (field === "estimatedBudget") {
      sanitizedValue = value.replace(/[^\d\s.,]/g, "").slice(0, BUDGET_MAX_LEN);
    }

    setValues((prev) => {
      const nextValues = { ...prev, [field]: sanitizedValue };
      if (touchedFields[field]) {
        const nextError = validateField(field, nextValues);
        setErrors((prevErrors) => ({ ...prevErrors, [field]: nextError }));
      }
      return nextValues;
    });
  };

  const touchAndValidateField = (
    field: keyof RfpFormValues,
    latestValue?: string,
  ) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
    const snapshot =
      typeof latestValue === "string" ? { ...values, [field]: latestValue } : values;
    setErrors((prev) => ({ ...prev, [field]: validateField(field, snapshot) }));
  };

  const validateBeforeSubmit = () => {
    setTouchedFields((prev) => {
      const next = { ...prev };
      for (const field of finalValidationFields) {
        next[field] = true;
      }
      return next;
    });

    const nextErrors = validateFields(finalValidationFields);
    applyFieldErrors(finalValidationFields, nextErrors);

    if (finalValidationFields.some((field) => Boolean(nextErrors[field]))) {
      focusFirstErrorField(finalValidationFields, nextErrors);
      setToast({
        type: "error",
        message: "Merci de corriger les champs invalides.",
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
      const submissionValues = {
        organization: values.organization.trim(),
        sector: values.sector.trim() || undefined,
        domain: values.domain.trim(),
        timeline: values.timeline.trim() || undefined,
        estimatedBudget: values.estimatedBudget.trim() || undefined,
        contactName: values.contactName.trim() || undefined,
        phone: values.phone.trim(),
        email: values.email.trim() || undefined,
        needDescription: values.needDescription.trim(),
      };

      await submitRfp(submissionValues);

      setValues(initialValues);
      setErrors({});
      setTouchedFields({});
      setCurrentStep(0);
      setIsConfirmModalOpen(false);
      setSuccessModalData({
        organization: submissionValues.organization,
        domain: submissionValues.domain,
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

  const returnToHome = () => {
    if (typeof window === "undefined") return;
    window.location.href = "/";
  };

  const getFieldError = (field: keyof RfpFormValues) =>
    touchedFields[field] ? errors[field] : undefined;

  const getFieldClass = (field: keyof RfpFormValues) =>
    getFieldError(field)
      ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100"
      : undefined;

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
              <div className="h-2 overflow-hidden rounded-full bg-[linear-gradient(90deg,#efe2ff,#dffdf7)]">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,var(--gbh-violet-700),var(--gbh-magenta),var(--gbh-mint-deep))] transition-all duration-400"
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
                          ? "border-[var(--gbh-mint-deep)] bg-[linear-gradient(145deg,rgba(238,223,255,0.82),rgba(228,255,250,0.86))] shadow-[0_8px_18px_rgba(75,31,172,0.15)]"
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

            <div className="rounded-3xl border border-purple-200 bg-[linear-gradient(155deg,rgba(255,255,255,0.95),rgba(243,233,249,0.75),rgba(227,255,249,0.7))] p-5 md:p-6">
              <p className="text-xs uppercase tracking-[0.18em] text-purple-600">
                {wizardSteps[currentStep].subtitle}
              </p>

              {currentStep === 0 && (
                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm text-purple-800">Organisation *</label>
                    <Input
                      id={fieldIds.organization}
                      value={values.organization}
                      onChange={(event) => setField("organization", event.target.value)}
                      onBlur={(event) =>
                        touchAndValidateField("organization", event.currentTarget.value)
                      }
                      placeholder="Nom de votre organisation"
                      maxLength={ORGANIZATION_MAX_LEN}
                      aria-invalid={Boolean(getFieldError("organization"))}
                      aria-describedby="rfp-organization-error"
                      className={getFieldClass("organization")}
                    />
                    {getFieldError("organization") && (
                      <p id="rfp-organization-error" className="mt-1 text-xs text-rose-600">
                        {getFieldError("organization")}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm text-purple-800">Secteur</label>
                    <Input
                      id={fieldIds.sector}
                      value={values.sector}
                      onChange={(event) => setField("sector", event.target.value)}
                      onBlur={(event) => touchAndValidateField("sector", event.currentTarget.value)}
                      placeholder="Ex: Energie, Mines, Services"
                      maxLength={SECTOR_MAX_LEN}
                      aria-invalid={Boolean(getFieldError("sector"))}
                      aria-describedby="rfp-sector-error"
                      className={getFieldClass("sector")}
                    />
                    {getFieldError("sector") && (
                      <p id="rfp-sector-error" className="mt-1 text-xs text-rose-600">
                        {getFieldError("sector")}
                      </p>
                    )}
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
                        id={fieldIds.domain}
                        value={values.domain}
                        onChange={(event) => setField("domain", event.target.value)}
                        onBlur={(event) =>
                          touchAndValidateField("domain", event.currentTarget.value)
                        }
                        className={`w-full rounded-2xl border-2 bg-white px-4 py-3 text-base text-purple-900 shadow-sm transition-all focus:outline-none focus:ring-2 ${
                          getFieldError("domain")
                            ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100"
                            : "border-purple-200 focus:border-[var(--gbh-mint-deep)] focus:ring-[var(--gbh-mint-soft)]"
                        }`}
                        aria-invalid={Boolean(getFieldError("domain"))}
                        aria-describedby="rfp-domain-error"
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
                        id={fieldIds.domain}
                        value={values.domain}
                        onChange={(event) => setField("domain", event.target.value)}
                        onBlur={(event) =>
                          touchAndValidateField("domain", event.currentTarget.value)
                        }
                        placeholder="Saisissez le domaine concerne"
                        maxLength={DOMAIN_MAX_LEN}
                        aria-invalid={Boolean(getFieldError("domain"))}
                        aria-describedby="rfp-domain-error"
                        className={getFieldClass("domain")}
                      />
                    )}
                    {getFieldError("domain") && (
                      <p id="rfp-domain-error" className="mt-1 text-xs text-rose-600">
                        {getFieldError("domain")}
                      </p>
                    )}
                  </div>
                  <div className="rounded-2xl border border-purple-200 bg-[linear-gradient(145deg,rgba(255,255,255,0.88),rgba(228,255,250,0.72))] px-4 py-4 text-sm text-purple-700">
                    Selectionnez le domaine qui correspond a la mission. Vous pourrez
                    detailler le besoin a la prochaine etape.
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm text-purple-800">Duree souhaitee (jours)</label>
                    <Input
                      id={fieldIds.timeline}
                      inputMode="numeric"
                      value={values.timeline}
                      onChange={(event) => setField("timeline", event.target.value)}
                      onBlur={(event) =>
                        touchAndValidateField("timeline", event.currentTarget.value)
                      }
                      placeholder="Ex: 2 semaines, 1 mois"
                      maxLength={TIMELINE_MAX_LEN}
                      aria-invalid={Boolean(getFieldError("timeline"))}
                      aria-describedby="rfp-timeline-error"
                      className={getFieldClass("timeline")}
                    />
                    <p className="mt-1 text-xs text-purple-600">
                      Saisissez une duree en jours calendaires (ex: 30).
                    </p>
                    {getFieldError("timeline") && (
                      <p id="rfp-timeline-error" className="mt-1 text-xs text-rose-600">
                        {getFieldError("timeline")}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm text-purple-800">Budget estimatif (USD)</label>
                    <Input
                      id={fieldIds.estimatedBudget}
                      inputMode="numeric"
                      value={values.estimatedBudget}
                      onChange={(event) => setField("estimatedBudget", event.target.value)}
                      onBlur={(event) =>
                        touchAndValidateField("estimatedBudget", event.currentTarget.value)
                      }
                      placeholder="Ex: 25 000"
                      maxLength={BUDGET_MAX_LEN}
                      aria-invalid={Boolean(getFieldError("estimatedBudget"))}
                      aria-describedby="rfp-estimated-budget-error"
                      className={getFieldClass("estimatedBudget")}
                    />
                    <p className="mt-1 text-xs text-purple-600">
                      Montant en dollars americains (USD).
                    </p>
                    {getFieldError("estimatedBudget") && (
                      <p id="rfp-estimated-budget-error" className="mt-1 text-xs text-rose-600">
                        {getFieldError("estimatedBudget")}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm text-purple-800">Contact</label>
                    <Input
                      id={fieldIds.contactName}
                      value={values.contactName}
                      onChange={(event) => setField("contactName", event.target.value)}
                      onBlur={(event) =>
                        touchAndValidateField("contactName", event.currentTarget.value)
                      }
                      placeholder="Nom du point focal"
                      maxLength={CONTACT_MAX_LEN}
                      aria-invalid={Boolean(getFieldError("contactName"))}
                      aria-describedby="rfp-contact-name-error"
                      className={getFieldClass("contactName")}
                    />
                    {getFieldError("contactName") && (
                      <p id="rfp-contact-name-error" className="mt-1 text-xs text-rose-600">
                        {getFieldError("contactName")}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm text-purple-800">Telephone *</label>
                    <Input
                      id={fieldIds.phone}
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      value={values.phone}
                      onChange={(event) => setField("phone", event.target.value)}
                      onBlur={(event) => touchAndValidateField("phone", event.currentTarget.value)}
                      placeholder="+243 ..."
                      maxLength={PHONE_MAX_LEN}
                      aria-invalid={Boolean(getFieldError("phone"))}
                      aria-describedby="rfp-phone-error"
                      className={getFieldClass("phone")}
                    />
                    {getFieldError("phone") && (
                      <p id="rfp-phone-error" className="mt-1 text-xs text-rose-600">
                        {getFieldError("phone")}
                      </p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm text-purple-800">Email</label>
                    <Input
                      id={fieldIds.email}
                      type="email"
                      autoComplete="email"
                      value={values.email}
                      onChange={(event) => setField("email", event.target.value)}
                      onBlur={(event) => touchAndValidateField("email", event.currentTarget.value)}
                      placeholder="contact@organisation.com"
                      maxLength={EMAIL_MAX_LEN}
                      aria-invalid={Boolean(getFieldError("email"))}
                      aria-describedby="rfp-email-error"
                      className={getFieldClass("email")}
                    />
                    {getFieldError("email") && (
                      <p id="rfp-email-error" className="mt-1 text-xs text-rose-600">
                        {getFieldError("email")}
                      </p>
                    )}
                  </div>
                  <div className="md:col-span-2 rounded-2xl border border-purple-200 bg-[linear-gradient(145deg,rgba(247,235,255,0.84),rgba(228,255,250,0.76))] px-4 py-3 text-sm text-purple-700">
                    Le formulaire B2B est distinct du flux de prise de rendez-vous.
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="text-sm text-purple-800">Description du besoin *</label>
                    <Textarea
                      id={fieldIds.needDescription}
                      value={values.needDescription}
                      onChange={(event) => setField("needDescription", event.target.value)}
                      onBlur={(event) =>
                        touchAndValidateField("needDescription", event.currentTarget.value)
                      }
                      rows={6}
                      placeholder="Contexte, objectifs, contraintes, livrables attendus..."
                      maxLength={NEED_DESCRIPTION_MAX_LEN}
                      aria-invalid={Boolean(getFieldError("needDescription"))}
                      aria-describedby="rfp-need-description-error rfp-need-description-meta"
                      className={getFieldClass("needDescription")}
                    />
                    <p id="rfp-need-description-meta" className="mt-1 text-xs text-purple-600">
                      {values.needDescription.trim().length}/{NEED_DESCRIPTION_MAX_LEN} caracteres
                    </p>
                    {getFieldError("needDescription") && (
                      <p id="rfp-need-description-error" className="mt-1 text-xs text-rose-600">
                        {getFieldError("needDescription")}
                      </p>
                    )}
                  </div>

                  <div className="rounded-2xl border border-purple-200 bg-[linear-gradient(145deg,rgba(255,255,255,0.88),rgba(228,255,250,0.65))] p-4">
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
                        <span className="text-purple-600">Duree (jours):</span>{" "}
                        {values.timeline || "-"}
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
                    {isSubmitting ? "Envoi en cours..." : "Envoyer la consultation"}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      {isConfirmModalOpen && (
        <div
          className="fixed inset-0 z-[75] flex items-center justify-center bg-[radial-gradient(circle_at_top,rgba(161,114,202,0.25),transparent_35%),radial-gradient(circle_at_18%_88%,rgba(114,246,223,0.2),transparent_36%),rgba(22,10,45,0.68)] px-4 py-8"
          role="dialog"
          aria-modal="true"
          aria-label="Confirmation consultation B2B"
          onClick={() => {
            if (isSubmitting) return;
            setIsConfirmModalOpen(false);
          }}
        >
          <div
            className="w-full max-w-xl rounded-3xl border border-purple-200 bg-[linear-gradient(145deg,#ffffff,#f4ebff,#e5fff8)] p-6 shadow-[0_24px_60px_rgba(28,10,65,0.45)]"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="text-xs uppercase tracking-[0.2em] text-purple-600">Confirmation</p>
            <h3 className="mt-2 text-2xl text-purple-900">
              Valider l&apos;envoi de votre consultation B2B ?
            </h3>
            <p className="mt-3 text-sm text-purple-700">
              Vous allez transmettre cette consultation a l&apos;equipe GBH. Un conseiller vous
              recontactera rapidement.
            </p>

            <div className="mt-4 rounded-2xl border border-purple-200 bg-[linear-gradient(145deg,rgba(255,255,255,0.92),rgba(228,255,250,0.68))] p-4 text-sm text-purple-800">
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

      {successModalData && (
        <div
          className="fixed inset-0 z-[76] flex items-center justify-center bg-[radial-gradient(circle_at_top,rgba(161,114,202,0.25),transparent_35%),radial-gradient(circle_at_18%_88%,rgba(114,246,223,0.2),transparent_36%),rgba(22,10,45,0.7)] px-4 py-8"
          role="dialog"
          aria-modal="true"
          aria-label="Consultation envoyee"
          onClick={() => setSuccessModalData(null)}
        >
          <div
            className="w-full max-w-xl rounded-3xl border border-purple-200 bg-[linear-gradient(145deg,#ffffff,#f4ebff,#e5fff8)] p-6 shadow-[0_24px_60px_rgba(28,10,65,0.45)]"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="text-xs uppercase tracking-[0.2em] text-teal-700">Succes</p>
            <h3 className="mt-2 text-2xl text-purple-900">
              Consultation envoyee avec succes
            </h3>
            <p className="mt-3 text-sm text-purple-700">
              Merci. Votre demande a bien ete transmise a l&apos;equipe GBH.
            </p>

            <div className="mt-4 rounded-2xl border border-purple-200 bg-[linear-gradient(145deg,rgba(255,255,255,0.92),rgba(228,255,250,0.68))] p-4 text-sm text-purple-800">
              <p>
                <span className="text-purple-600">Organisation:</span>{" "}
                {successModalData.organization}
              </p>
              <p className="mt-1">
                <span className="text-purple-600">Domaine:</span> {successModalData.domain}
              </p>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                onClick={() => setSuccessModalData(null)}
              >
                Rester sur cette page
              </Button>
              <Button type="button" className="rounded-full" onClick={returnToHome}>
                Retourner a l&apos;accueil
              </Button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed right-4 top-24 z-[70]">
          <div
            className="max-w-sm rounded-2xl bg-rose-600 px-4 py-3 text-sm text-white shadow-xl"
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

