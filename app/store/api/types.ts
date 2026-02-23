export type Service = {
  id?: string;
  _id?: string;
  name: string;
  shortDescription?: string;
  description: string;
  benefits?: string[];
  category?: string;
  forAudience?: string;
  slug?: string;
  createdAt?: string;
};

export type Appointment = {
  id?: string;
  _id?: string;
  serviceId?: string;
  name?: string;
  email?: string;
  phone?: string;
  type?: string;
  date?: string;
  time?: string;
  duration?: number;
  price?: number;
  tax?: number;
  total?: number;
  status?: string;
  paymentMethod?: string;
  createdAt?: string;
};

export type ContactMessage = {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt?: string;
};

export type ReservationBlock = {
  id?: string;
  _id?: string;
  date: string;
  time: string;
  reason: string;
  createdAt?: string;
};

export type AvailabilityResponse = {
  date: string;
  timezone: string;
  slots: string[];
};

export type ServicesResponse = {
  services: Service[];
};

export type AppointmentsResponse = {
  appointments: Appointment[];
};

export type ServiceTestimonial = {
  id?: string;
  _id?: string;
  serviceId: string;
  name: string;
  rating: number;
  message: string;
  createdAt?: string;
};

export type ServiceTestimonialsResponse = {
  testimonials: ServiceTestimonial[];
};

export type ContactsResponse = {
  contacts: ContactMessage[];
};

export type PaymentIntentResponse = {
  intentId: string;
  status: string;
  amount: number;
  currency: string;
  method: string;
};

export type B2BRfpStatus = "new" | "reviewing" | "qualified" | "won" | "lost";
export type B2BRfpSource = "website" | "whatsapp" | "manual";

export type B2BRfpLead = {
  id: string;
  organization: string;
  sector?: string;
  domain: string;
  deadline?: string;
  budget_range?: string;
  contact_name?: string;
  phone: string;
  email?: string;
  description: string;
  status: B2BRfpStatus;
  source: B2BRfpSource;
  created_at?: string;
  updated_at?: string;
};

export type B2BRfpListResponse = {
  items: B2BRfpLead[];
  limit: number;
  offset: number;
  total: number;
};

export type B2BReference = {
  id: string;
  client_name: string;
  category: string;
  summary: string;
  location: string;
  logo_url?: string;
  is_public: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
};

export type B2BReferenceUpsertRequest = {
  client_name: string;
  category: string;
  summary: string;
  location: string;
  logo_url?: string;
  is_public?: boolean;
  sort_order?: number;
};

export type B2BReferenceListResponse = {
  items: B2BReference[];
  limit: number;
  offset: number;
  total: number;
};

export type B2BCaseStudy = {
  id: string;
  slug: string;
  title: string;
  category: string;
  client_name: string;
  problem: string;
  solution: string;
  result: string;
  is_published: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
};

export type B2BCaseStudyUpsertRequest = {
  slug?: string;
  title: string;
  category: string;
  client_name: string;
  problem: string;
  solution: string;
  result: string;
  is_published?: boolean;
  sort_order?: number;
};

export type B2BCaseStudyListResponse = {
  items: B2BCaseStudy[];
  limit: number;
  offset: number;
  total: number;
};
