export type Service = {
  id?: string;
  _id?: string;
  name: string;
  description: string;
  category?: string;
  forAudience?: string;
  slug?: string;
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
