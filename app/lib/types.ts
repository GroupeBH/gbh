export type ServiceDomain = {
  id: string;
  name: string;
  description: string;
  shortDescription?: string;
  category?: string;
  audience?: string;
  slug?: string;
  benefits?: string[];
};

export type DomainFetchResult = {
  domains: ServiceDomain[];
  fromFallback: boolean;
  apiError?: string;
};

export type RfpPayload = {
  organization: string;
  sector?: string;
  domain: string;
  deadline?: string;
  timeline?: string;
  budgetRange?: string;
  estimatedBudget?: string;
  contactName?: string;
  source?: "website" | "whatsapp" | "manual";
  phone: string;
  email?: string;
  description?: string;
  needDescription: string;
};

export type RfpResponse = {
  success?: boolean;
  id?: string;
  status?: string;
  message?: string;
};

export type ReferenceCategory =
  | "Formations"
  | "Fourniture & montage"
  | "Apport d'affaires"
  | "Mines";

export type ReferenceItem = {
  id: string;
  client: string;
  category: ReferenceCategory;
  summary: string;
  value?: string;
  year?: string;
  location?: string;
};

export type ReferencesFetchResult = {
  references: ReferenceItem[];
  fromFallback: boolean;
  apiError?: string;
};

export type CaseStudy = {
  id: string;
  slug: string;
  title: string;
  client: string;
  need: string;
  solution: string;
  result: string;
  category: ReferenceCategory;
};

export type CaseStudiesFetchResult = {
  caseStudies: CaseStudy[];
  fromFallback: boolean;
  apiError?: string;
};
