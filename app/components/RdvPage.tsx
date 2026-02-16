import { useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import {
  useCreateAppointmentMutation,
  useCreatePaymentIntentMutation,
  useGetAvailabilityQuery,
  useGetServicesQuery,
  useLookupAppointmentMutation,
  type Appointment,
  type Service,
} from "../store/api";

interface RdvPageProps {
  onNavigate: (page: string) => void;
}

type ServiceOption = {
  id: string;
  name: string;
  description: string;
  category?: string;
  forAudience?: string;
  price: number;
  duration: string;
};

type AppointmentConfirmation = {
  id: string;
  serviceName: string;
  date: string;
  time: string;
  type: "online" | "presentiel";
  paymentMethod: "online" | "place";
  price: number;
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  paymentStatus: string;
};

const weekDays = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const monthNames = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("fr-FR").format(amount) + " CDF";

const formatISODate = (year: number, month: number, day: number) => {
  const mm = String(month + 1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
};

const formatDateDisplay = (date: string) => {
  if (!date) return "—";
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
};

const appointmentStatusLabel = (status?: string) => {
  const value = (status || "").toLowerCase();
  if (value === "booked" || value === "reserved" || value === "created") return "Réservé";
  if (value === "confirmed" || value === "confirmé") return "Confirmé";
  if (value === "pending" || value === "en_attente" || value === "awaiting") return "En attente";
  if (value === "canceled" || value === "cancelled" || value === "annulé") return "Annulé";
  return status || "—";
};

const appointmentTypeLabel = (type?: string) =>
  type === "presentiel" ? "Présentiel" : type === "online" ? "En ligne" : "—";

const paymentMethodLabel = (paymentMethod?: string) =>
  paymentMethod === "place"
    ? "Sur place"
    : paymentMethod === "online"
    ? "En ligne"
    : "—";

const getApiErrorMessage = (error: unknown, fallback: string) => {
  if (!error || typeof error !== "object") return fallback;

  if ("data" in error) {
    const data = (error as { data?: unknown }).data;
    if (typeof data === "string" && data.trim()) return data;
    if (data && typeof data === "object" && "error" in data) {
      const apiError = (data as { error?: unknown }).error;
      if (typeof apiError === "string" && apiError.trim()) return apiError;
    }
  }

  return fallback;
};

const SLOT_MINUTES = 45;

type TimeRange = {
  start: string;
  end: string;
};

const parseClockToMinutes = (clock: string) => {
  const [h, m] = clock.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return 0;
  return h * 60 + m;
};

const minutesToClock = (minutes: number) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

const dayRangesForDate = (date: Date): TimeRange[] => {
  const weekday = date.getDay();
  if (weekday >= 1 && weekday <= 5) {
    return [
      { start: "09:00", end: "12:00" },
      { start: "14:00", end: "17:00" },
    ];
  }
  if (weekday === 6) {
    return [{ start: "09:00", end: "13:00" }];
  }
  return [];
};

const generateSlotsForDate = (dateStr: string) => {
  if (!dateStr) return [];
  const date = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(date.getTime())) return [];

  const ranges = dayRangesForDate(date);
  if (!ranges.length) return [];

  const slots: string[] = [];
  ranges.forEach((range) => {
    const start = parseClockToMinutes(range.start);
    const end = parseClockToMinutes(range.end);
    for (let cursor = start; cursor + SLOT_MINUTES <= end; cursor += SLOT_MINUTES) {
      slots.push(minutesToClock(cursor));
    }
  });

  return slots;
};

const mapServiceToOption = (service: Service, index: number): ServiceOption => {
  const key = `${service.slug || ""} ${service.name || ""}`.toLowerCase();
  let price = 90000;
  if (key.includes("conseil")) price = 125000;
  if (key.includes("intelligence")) price = 150000;
  if (key.includes("fourniture")) price = 70000;
  if (key.includes("voyage")) price = 65000;
  if (key.includes("commission")) price = 120000;

  return {
    id: service.id || service._id || service.slug || `service-${index}`,
    name: service.name,
    description: service.description,
    category: service.category,
    forAudience: service.forAudience,
    price,
    duration: "60 min",
  };
};

export function RdvPage({ onNavigate }: RdvPageProps) {
  const { data: servicesData, isLoading: isServicesLoading, isError: isServicesError } =
    useGetServicesQuery();
  const [createAppointment, { isLoading: isBooking }] =
    useCreateAppointmentMutation();
  const [createPaymentIntent, { isLoading: isPaying }] =
    useCreatePaymentIntentMutation();
  const [lookupAppointment, { isLoading: isLookupLoading }] =
    useLookupAppointmentMutation();
  const isSubmitting = isBooking || isPaying;

  const [step, setStep] = useState(1);
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const appointmentType: "presentiel" = "presentiel";
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"online" | "place">("place");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [bookingMessage, setBookingMessage] = useState<string | null>(null);
  const [paymentMessage, setPaymentMessage] = useState<string | null>(null);
  const [lookupId, setLookupId] = useState("");
  const [lookupMessage, setLookupMessage] = useState<string | null>(null);
  const [lookupResult, setLookupResult] = useState<Appointment | null>(null);
  const [confirmation, setConfirmation] =
    useState<AppointmentConfirmation | null>(null);
  const actionRef = useRef<HTMLDivElement | null>(null);

  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const services: ServiceOption[] = useMemo(() => {
    return (servicesData?.services ?? []).map(mapServiceToOption);
  }, [servicesData]);

  useEffect(() => {
    if (!selectedServiceId && services.length) {
      setSelectedServiceId(services[0].id);
    }
  }, [services, selectedServiceId]);

  const selectedService = useMemo(
    () => services.find((item) => item.id === selectedServiceId) || services[0],
    [services, selectedServiceId],
  );

  const serviceNameMap = useMemo(() => {
    const map = new Map<string, string>();
    services.forEach((service) => {
      map.set(service.id, service.name);
    });
    return map;
  }, [services]);

  const {
    data: availabilityData,
    isFetching: isAvailabilityLoading,
    isSuccess: isAvailabilitySuccess,
    isError: isAvailabilityError,
  } =
    useGetAvailabilityQuery(
      { date: selectedDate },
      { skip: !selectedDate },
    );

  const availableSlots = availabilityData?.slots ?? [];
  const fullSlots = useMemo(
    () => generateSlotsForDate(selectedDate),
    [selectedDate],
  );
  const availableSlotSet = useMemo(
    () => new Set(availableSlots),
    [availableSlots],
  );

  const availabilityState = !selectedDate
    ? "idle"
    : isAvailabilityLoading
    ? "loading"
    : isAvailabilityError
    ? "error"
    : isAvailabilitySuccess
    ? "ready"
    : "idle";

  useEffect(() => {
    if (availabilityState !== "ready") return;
    if (selectedTime && !availableSlotSet.has(selectedTime)) {
      setSelectedTime("");
    }
  }, [availabilityState, selectedTime, availableSlotSet]);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTime("");
  };

  const handleLookupSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLookupMessage(null);
    setLookupResult(null);

    const appointmentId = lookupId.trim();
    if (!appointmentId) {
      setLookupMessage("Veuillez renseigner un identifiant.");
      return;
    }

    try {
      const result = await lookupAppointment({ id: appointmentId }).unwrap();
      setLookupResult(result);
      setLookupMessage("Rendez-vous retrouvé.");
    } catch (error) {
      setLookupMessage(
        getApiErrorMessage(error, "Aucun rendez-vous trouvé pour cet identifiant."),
      );
    }
  };

  const scrollToActions = () => {
    if (!actionRef.current) return;
    actionRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  const handleMonthChange = (direction: "prev" | "next") => {
    const nextMonth = direction === "next" ? currentMonth + 1 : currentMonth - 1;
    if (nextMonth < 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
      return;
    }
    if (nextMonth > 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
      return;
    }
    setCurrentMonth(nextMonth);
  };

  const calendarCells = useMemo(() => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const offset = (firstDay + 6) % 7;
    const cells: Array<
      | {
          day: number;
          date: string;
          disabled: boolean;
          isToday: boolean;
        }
      | null
    > = Array.from({ length: offset }, () => null);

    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(currentYear, currentMonth, day);
      date.setHours(0, 0, 0, 0);
      const dateString = formatISODate(currentYear, currentMonth, day);
      const isPast = date.getTime() < new Date().setHours(0, 0, 0, 0);
      const isSunday = date.getDay() === 0;
      const isToday = date.getTime() === new Date().setHours(0, 0, 0, 0);
      cells.push({
        day,
        date: dateString,
        disabled: isPast || isSunday,
        isToday,
      });
    }
    return cells;
  }, [currentMonth, currentYear]);

  const canProceedFromStep = (currentStep: number) => {
    if (currentStep === 1) return Boolean(selectedServiceId);
    if (currentStep === 2) return Boolean(appointmentType);
    if (currentStep === 3) return Boolean(selectedDate && selectedTime);
    if (currentStep === 4) {
      return (
        contactInfo.name.trim() &&
        contactInfo.email.trim() &&
        contactInfo.phone.trim() &&
        acceptedTerms
      );
    }
    return true;
  };

  const handleConfirm = async () => {
    setBookingMessage(null);
    setPaymentMessage(null);

    if (!selectedService || !selectedDate || !selectedTime) {
      setBookingMessage("Merci de compléter votre sélection.");
      return;
    }

    try {
      const appointment = await createAppointment({
        serviceId: selectedService.id,
        name: contactInfo.name,
        email: contactInfo.email,
        phone: contactInfo.phone,
        type: appointmentType,
        date: selectedDate,
        time: selectedTime,
        paymentMethod,
        price: selectedService.price,
      }).unwrap();

      const appointmentId = appointment.id || appointment._id || "";
      let paymentStatus = "";

      if (paymentMethod === "online" && appointmentId) {
        const intent = await createPaymentIntent({
          appointmentId,
        }).unwrap();

        if (intent.status === "created") {
          paymentStatus = `Paiement en ligne initié. Montant: ${formatCurrency(intent.amount)}.`;
          setPaymentMessage(paymentStatus);
        } else {
          paymentStatus = "Paiement en ligne non requis.";
          setPaymentMessage(paymentStatus);
        }
      } else {
        paymentStatus = "Paiement sur place confirmé.";
        setPaymentMessage(paymentStatus);
      }

      setBookingMessage(
        "Votre rendez-vous est confirmé. Nous vous contacterons rapidement.",
      );
      setConfirmation({
        id: appointmentId || "—",
        serviceName: selectedService.name,
        date: selectedDate,
        time: selectedTime,
        type: appointmentType,
        paymentMethod,
        price: selectedService.price,
        contact: { ...contactInfo },
        paymentStatus,
      });
    } catch {
      setBookingMessage(
        "Impossible de réserver pour le moment. Merci de réessayer.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="text-center mb-12">
          <div
            className="inline-block px-4 py-2 rounded-full mb-4 text-sm"
            style={{
              backgroundColor: "var(--gbh-magenta-light)",
              color: "var(--gbh-magenta)",
            }}
          >
            PLATEFORME RDV
          </div>
          <h1 className="mb-4 text-[var(--gbh-black-soft)] text-4xl md:text-6xl">
            Prenez rendez-vous{" "}
            <span className="relative inline-block">
              <span className="relative z-10">avec nos experts</span>
              <span
                className="absolute bottom-2 left-0 w-full h-3 -z-0"
                style={{ backgroundColor: "#D4FF00" }}
              ></span>
            </span>
          </h1>
          <p className="text-xl text-[var(--gbh-gray-text)]">
            Sélectionnez votre service, votre créneau et confirmez votre rendez-vous.
          </p>
        </div>

        <div className="mb-10 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <h2 className="text-2xl text-[var(--gbh-black-soft)]">
                Retrouver un rendez-vous
              </h2>
              <p className="text-sm text-[var(--gbh-gray-text)]">
                Entrez l'identifiant reçu par email après la réservation.
              </p>
            </div>
            <form className="w-full lg:w-auto flex flex-col sm:flex-row gap-3" onSubmit={handleLookupSubmit}>
              <Input
                value={lookupId}
                onChange={(event) => setLookupId(event.target.value)}
                placeholder="Ex: 67c9a2f7d2f0f9b0c9..."
                className="sm:min-w-[320px]"
              />
              <Button
                type="submit"
                className="rounded-full"
                style={{ backgroundColor: "var(--gbh-magenta)" }}
                disabled={isLookupLoading}
              >
                {isLookupLoading ? "Recherche..." : "Rechercher"}
              </Button>
            </form>
          </div>

          {lookupMessage && (
            <div
              className={`mt-4 rounded-2xl px-4 py-3 text-sm ${
                lookupResult ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
              }`}
            >
              {lookupMessage}
            </div>
          )}

          {lookupResult && (
            <div className="mt-4 rounded-2xl bg-[var(--gbh-gray-ui)]/70 p-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-xs uppercase text-[var(--gbh-gray-text)]">
                  Référence
                </div>
                <div className="font-semibold text-[var(--gbh-black-soft)]">
                  {lookupResult.id || lookupResult._id || "—"}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase text-[var(--gbh-gray-text)]">
                  Service
                </div>
                <div className="font-semibold text-[var(--gbh-black-soft)]">
                  {lookupResult.serviceId
                    ? serviceNameMap.get(lookupResult.serviceId) || lookupResult.serviceId
                    : "—"}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase text-[var(--gbh-gray-text)]">
                  Date et heure
                </div>
                <div className="font-semibold text-[var(--gbh-black-soft)]">
                  {formatDateDisplay(lookupResult.date || "")} · {lookupResult.time || "—"}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase text-[var(--gbh-gray-text)]">
                  Statut
                </div>
                <div className="font-semibold text-[var(--gbh-black-soft)]">
                  {appointmentStatusLabel(lookupResult.status)}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase text-[var(--gbh-gray-text)]">
                  Type
                </div>
                <div className="font-semibold text-[var(--gbh-black-soft)]">
                  {appointmentTypeLabel(lookupResult.type)}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase text-[var(--gbh-gray-text)]">
                  Paiement
                </div>
                <div className="font-semibold text-[var(--gbh-black-soft)]">
                  {paymentMethodLabel(lookupResult.paymentMethod)}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-5 mb-10">
          {[
            "Service",
            "Type",
            "Date",
            "Coordonnées",
            "Confirmation",
          ].map((label, index) => {
            const stepIndex = index + 1;
            const isActive = step === stepIndex;
            const isDone = step > stepIndex;
            return (
              <div
                key={label}
                className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${
                  isActive
                    ? "border-[var(--gbh-magenta)] bg-white shadow-md"
                    : "border-transparent bg-white/70"
                }`}
              >
                <div
                  className={`h-10 w-10 rounded-xl flex items-center justify-center font-semibold ${
                    isDone
                      ? "bg-[var(--gbh-magenta)] text-white"
                      : "bg-[var(--gbh-magenta-light)] text-[var(--gbh-magenta)]"
                  }`}
                >
                  {stepIndex}
                </div>
                <div>
                  <div className="text-sm text-[var(--gbh-gray-text)]">
                    Étape {stepIndex}
                  </div>
                  <div className="font-semibold text-[var(--gbh-black-soft)]">
                    {label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10">
          {step === 1 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-[var(--gbh-black-soft)] mb-2">
                    Choisissez votre service
                  </h2>
                  <p className="text-[var(--gbh-gray-text)]">
                    Sélectionnez le domaine qui correspond à votre besoin.
                  </p>
                </div>
                <Badge
                  className="rounded-full"
                  style={{
                    backgroundColor: "var(--gbh-magenta-light)",
                    color: "var(--gbh-magenta)",
                  }}
                >
                  {services.length} services
                </Badge>
              </div>

              {isServicesLoading && (
                <p className="text-[var(--gbh-gray-text)] mb-6">
                  Chargement des services...
                </p>
              )}
              {!isServicesLoading && isServicesError && (
                <p className="text-rose-600 mb-6">
                  Impossible de charger les services. Vérifiez que l'API est en ligne.
                </p>
              )}
              {!isServicesLoading && !isServicesError && services.length === 0 && (
                <p className="text-[var(--gbh-gray-text)] mb-6">
                  Aucun service disponible pour le moment.
                </p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service) => {
                  const isSelected = service.id === selectedServiceId;
                  return (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => {
                        setSelectedServiceId(service.id);
                        setStep(2);
                        requestAnimationFrame(scrollToActions);
                      }}
                      className={`text-left rounded-3xl border-2 p-6 transition-all ${
                        isSelected
                          ? "border-[var(--gbh-magenta)] shadow-lg bg-[var(--gbh-magenta-light)]/30"
                          : "border-transparent bg-[var(--gbh-gray-ui)]/60 hover:border-[var(--gbh-magenta-light)]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <h3 className="text-[var(--gbh-black-soft)]">
                            {service.name}
                          </h3>
                          <p className="text-[var(--gbh-gray-text)] text-sm">
                            {service.description}
                          </p>
                        </div>
                        <div className="text-right">
                          <div
                            className="text-lg font-semibold"
                            style={{ color: "var(--gbh-magenta)" }}
                          >
                            {formatCurrency(service.price)}
                          </div>
                          <div className="text-xs text-[var(--gbh-gray-text)]">
                            {service.duration}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs">
                        {service.category && (
                          <span className="rounded-full bg-white px-3 py-1 text-[var(--gbh-gray-text)]">
                            {service.category}
                          </span>
                        )}
                        {service.forAudience && (
                          <span className="rounded-full bg-white px-3 py-1 text-[var(--gbh-gray-text)]">
                            {service.forAudience}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-[var(--gbh-black-soft)] mb-2">
                Rendez-vous au bureau
              </h2>
              <p className="text-[var(--gbh-gray-text)] mb-8">
                Les consultations se font uniquement en présentiel dans nos bureaux à Kinshasa.
              </p>
              <div className="rounded-3xl border border-[var(--gbh-magenta-light)] bg-[var(--gbh-magenta-light)]/30 p-6">
                <div className="text-lg font-semibold text-[var(--gbh-black-soft)]">
                  Type confirmé: Présentiel
                </div>
                <div className="text-sm text-[var(--gbh-gray-text)] mt-2">
                  Vous serez reçu au bureau pour ce rendez-vous.
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-[var(--gbh-black-soft)] mb-2">
                Choisissez une date et un créneau
              </h2>
              <p className="text-[var(--gbh-gray-text)] mb-8">
                Les créneaux disponibles s'affichent selon la date choisie.
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleMonthChange("prev")}
                    >
                      {"<"}
                    </Button>
                    <div className="text-lg font-semibold text-[var(--gbh-black-soft)]">
                      {monthNames[currentMonth]} {currentYear}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleMonthChange("next")}
                    >
                      {">"}
                    </Button>
                  </div>

                  <div className="grid grid-cols-7 gap-2 text-sm text-center mb-3">
                    {weekDays.map((day) => (
                      <div key={day} className="font-semibold text-[var(--gbh-gray-text)]">
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-2">
                    {calendarCells.map((cell, index) => {
                      if (!cell) {
                        return <div key={`empty-${index}`} className="h-12" />;
                      }

                      const isSelected = selectedDate === cell.date;

                      return (
                        <button
                          key={cell.date}
                          type="button"
                          disabled={cell.disabled}
                          onClick={() => handleDateSelect(cell.date)}
                          className={`h-12 rounded-2xl flex items-center justify-center border transition-all ${
                            cell.disabled
                              ? "text-gray-300 border-transparent"
                              : isSelected
                              ? "bg-[var(--gbh-magenta)] text-white border-[var(--gbh-magenta)]"
                              : "border-transparent bg-[var(--gbh-gray-ui)] hover:border-[var(--gbh-magenta)]"
                          } ${
                            cell.isToday && !isSelected
                              ? "border-[var(--gbh-magenta-light)]"
                              : ""
                          }`}
                        >
                          {cell.day}
                        </button>
                      );
                    })}
                  </div>

                  <p className="mt-4 text-xs text-[var(--gbh-gray-text)]">
                    Les dimanches sont indisponibles. Les dates passées sont désactivées.
                  </p>
                </div>

                <div>
                  <div className="rounded-3xl border border-gray-100 bg-[var(--gbh-gray-ui)]/70 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-sm text-[var(--gbh-gray-text)]">
                          Date sélectionnée
                        </div>
                        <div className="text-lg font-semibold text-[var(--gbh-black-soft)]">
                          {formatDateDisplay(selectedDate)}
                        </div>
                      </div>
                      <Badge
                        className="rounded-full"
                        style={{
                          backgroundColor: "var(--gbh-magenta-light)",
                          color: "var(--gbh-magenta)",
                        }}
                      >
                        {selectedDate
                          ? `${availableSlots.length}/${fullSlots.length} créneaux`
                          : "Créneaux"}
                      </Badge>
                    </div>

                    {!selectedDate && (
                      <p className="text-sm text-[var(--gbh-gray-text)]">
                        Choisissez une date pour afficher les disponibilités.
                      </p>
                    )}

                    {selectedDate && fullSlots.length === 0 && (
                      <p className="text-sm text-[var(--gbh-gray-text)]">
                        Aucun créneau prévu pour cette journée.
                      </p>
                    )}

                    {selectedDate && fullSlots.length > 0 && availabilityState === "loading" && (
                      <p className="text-sm text-[var(--gbh-gray-text)]">
                        Chargement des créneaux disponibles...
                      </p>
                    )}

                    {selectedDate &&
                      fullSlots.length > 0 &&
                      availabilityState === "error" && (
                      <p className="text-sm text-rose-600">
                        Impossible de charger les disponibilités. Vérifiez que l'API est
                        en ligne et que `NEXT_PUBLIC_API_BASE_URL` est correct.
                      </p>
                    )}

                    {selectedDate &&
                      fullSlots.length > 0 &&
                      availabilityState === "ready" &&
                      availableSlots.length === 0 && (
                      <p className="text-sm text-[var(--gbh-gray-text)]">
                        Tous les créneaux sont indisponibles pour cette date.
                      </p>
                    )}

                    {selectedDate && fullSlots.length > 0 && availabilityState === "ready" && (
                      <div className="mt-4 flex items-center gap-4 text-xs text-[var(--gbh-gray-text)]">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-[var(--gbh-magenta)]"></span>
                          Disponible
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-gray-300"></span>
                          Indisponible
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-3 gap-3 mt-4">
                      {fullSlots.map((slot) => {
                        const isSelected = selectedTime === slot;
                        const isAvailable =
                          availabilityState === "ready" && availableSlotSet.has(slot);
                        const isPending =
                          availabilityState === "loading" || availabilityState === "error";
                        return (
                          <button
                            key={slot}
                            type="button"
                            disabled={!isAvailable}
                            onClick={() => {
                              if (isAvailable) setSelectedTime(slot);
                            }}
                            className={`rounded-2xl border px-3 py-2 text-sm transition-all ${
                              isAvailable
                                ? isSelected
                                  ? "bg-[var(--gbh-magenta)] text-white border-[var(--gbh-magenta)]"
                                  : "border-transparent bg-white hover:border-[var(--gbh-magenta-light)]"
                                : isPending
                                ? "border-dashed border-gray-200 bg-white/80 text-gray-400 cursor-not-allowed"
                                : "border-transparent bg-gray-100 text-gray-400 line-through cursor-not-allowed"
                            }`}
                            title={
                              isAvailable
                                ? "Créneau disponible"
                                : availabilityState === "ready"
                                ? "Créneau indisponible"
                                : "Chargement des disponibilités"
                            }
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-[var(--gbh-black-soft)] mb-2">
                Vos coordonnées
              </h2>
              <p className="text-[var(--gbh-gray-text)] mb-8">
                Renseignez vos informations pour confirmer votre rendez-vous.
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <Label>Nom complet</Label>
                    <Input
                      value={contactInfo.name}
                      onChange={(e) =>
                        setContactInfo({ ...contactInfo, name: e.target.value })
                      }
                      placeholder="Votre nom"
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={contactInfo.email}
                      onChange={(e) =>
                        setContactInfo({ ...contactInfo, email: e.target.value })
                      }
                      placeholder="votre.email@exemple.com"
                    />
                  </div>
                  <div>
                    <Label>Téléphone</Label>
                    <Input
                      type="tel"
                      value={contactInfo.phone}
                      onChange={(e) =>
                        setContactInfo({ ...contactInfo, phone: e.target.value })
                      }
                      placeholder="+243 XXX XXX XXX"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={acceptedTerms}
                      onCheckedChange={(checked) => setAcceptedTerms(checked)}
                    />
                    <span className="text-sm text-[var(--gbh-gray-text)]">
                      J'accepte les conditions et la politique de confidentialité.
                    </span>
                  </div>
                </div>

                <div className="rounded-3xl border border-gray-100 bg-[var(--gbh-gray-ui)]/70 p-6">
                  <h3 className="text-[var(--gbh-black-soft)] mb-4">Récapitulatif</h3>
                  <div className="space-y-3 text-sm text-[var(--gbh-gray-text)]">
                    <div>
                      <div className="text-xs uppercase">Service</div>
                      <div className="font-semibold text-[var(--gbh-black-soft)]">
                        {selectedService?.name || "—"}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs uppercase">Type</div>
                      <div className="font-semibold text-[var(--gbh-black-soft)]">
                        Présentiel (au bureau)
                      </div>
                    </div>
                    <div>
                      <div className="text-xs uppercase">Date</div>
                      <div className="font-semibold text-[var(--gbh-black-soft)]">
                        {formatDateDisplay(selectedDate)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs uppercase">Créneau</div>
                      <div className="font-semibold text-[var(--gbh-black-soft)]">
                        {selectedTime || "—"}
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-white/60 mt-4 pt-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[var(--gbh-gray-text)]">Prix</span>
                      <span className="font-semibold text-[var(--gbh-black-soft)]">
                        {selectedService ? formatCurrency(selectedService.price) : "—"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <h2 className="text-[var(--gbh-black-soft)] mb-2">
                Paiement et confirmation
              </h2>
              <p className="text-[var(--gbh-gray-text)] mb-8">
                Choisissez votre mode de paiement avant de valider le rendez-vous.
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={(value) =>
                      setPaymentMethod(value as "online" | "place")
                    }
                    className="grid gap-4"
                  >
                    {[
                      {
                        value: "place",
                        title: "Paiement sur place",
                        description: "Réglez lors de votre rendez-vous",
                      },
                      {
                        value: "online",
                        title: "Paiement en ligne",
                        description: "Payez maintenant par mobile money ou carte",
                      },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className={`flex items-start gap-4 rounded-3xl border-2 p-6 cursor-pointer transition-all ${
                          paymentMethod === option.value
                            ? "border-[var(--gbh-magenta)] bg-[var(--gbh-magenta-light)]/40"
                            : "border-transparent bg-[var(--gbh-gray-ui)]/60"
                        }`}
                      >
                        <RadioGroupItem value={option.value} />
                        <div>
                          <div className="text-lg font-semibold text-[var(--gbh-black-soft)]">
                            {option.title}
                          </div>
                          <div className="text-sm text-[var(--gbh-gray-text)]">
                            {option.description}
                          </div>
                        </div>
                      </label>
                    ))}
                  </RadioGroup>
                </div>

                <div className="rounded-3xl border border-gray-100 bg-[var(--gbh-gray-ui)]/70 p-6">
                  <h3 className="text-[var(--gbh-black-soft)] mb-4">Résumé final</h3>
                  <div className="space-y-3 text-sm text-[var(--gbh-gray-text)]">
                    <div>
                      <div className="text-xs uppercase">Service</div>
                      <div className="font-semibold text-[var(--gbh-black-soft)]">
                        {selectedService?.name || "—"}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs uppercase">Date</div>
                      <div className="font-semibold text-[var(--gbh-black-soft)]">
                        {formatDateDisplay(selectedDate)} à {selectedTime || "—"}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs uppercase">Contact</div>
                      <div className="font-semibold text-[var(--gbh-black-soft)]">
                        {contactInfo.name || "—"}
                      </div>
                      <div>{contactInfo.email || "—"}</div>
                      <div>{contactInfo.phone || "—"}</div>
                    </div>
                  </div>
                  <div className="border-t border-white/60 mt-4 pt-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[var(--gbh-gray-text)]">Total</span>
                      <span className="font-semibold text-[var(--gbh-black-soft)]">
                        {selectedService ? formatCurrency(selectedService.price) : "—"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {bookingMessage && (
                  <div
                    className={`rounded-2xl px-4 py-3 text-sm ${
                      bookingMessage.includes("confirmé")
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {bookingMessage}
                  </div>
                )}
                {paymentMessage && (
                  <div className="rounded-2xl px-4 py-3 text-sm bg-indigo-50 text-indigo-700">
                    {paymentMessage}
                  </div>
                )}
              </div>
            </div>
          )}

          <div
            ref={actionRef}
            className="mt-10 flex flex-col sm:flex-row justify-between gap-4"
          >
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (step === 1) {
                  onNavigate("home");
                  return;
                }
                setStep((prev) => Math.max(1, prev - 1));
              }}
            >
              Retour
            </Button>

            {step < 5 && (
              <Button
                type="button"
                onClick={() => setStep((prev) => Math.min(5, prev + 1))}
                disabled={!canProceedFromStep(step)}
                className="rounded-full shadow-md"
                style={{ backgroundColor: "var(--gbh-magenta)" }}
              >
                Continuer
              </Button>
            )}

            {step === 5 && (
              <Button
                type="button"
                onClick={handleConfirm}
                disabled={isSubmitting}
                className="rounded-full shadow-md"
                style={{ backgroundColor: "var(--gbh-magenta)" }}
              >
                {isSubmitting ? "Traitement..." : "Confirmer le rendez-vous"}
              </Button>
            )}
          </div>
        </div>
      </div>
      {isSubmitting && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 px-4"
          role="status"
          aria-live="polite"
        >
          <div className="rounded-3xl bg-white px-6 py-5 shadow-2xl flex items-center gap-4">
            <div className="h-10 w-10 rounded-full border-4 border-[var(--gbh-magenta-light)] border-t-[var(--gbh-magenta)] animate-spin"></div>
            <div>
              <p className="text-sm text-[var(--gbh-gray-text)]">
                Traitement en cours...
              </p>
              <p className="text-lg font-semibold text-[var(--gbh-black-soft)]">
                Merci de patienter
              </p>
            </div>
          </div>
        </div>
      )}
      {confirmation && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8"
          role="dialog"
          aria-modal="true"
          aria-label="Rendez-vous réservé"
          onClick={() => setConfirmation(null)}
        >
          <div
            className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <div
                  className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
                  style={{
                    backgroundColor: "var(--gbh-magenta-light)",
                    color: "var(--gbh-magenta)",
                  }}
                >
                  ✅ Rendez-vous réservé
                </div>
                <h3 className="mt-3 text-2xl text-[var(--gbh-black-soft)]">
                  Votre réservation est confirmée
                </h3>
              </div>
              <button
                type="button"
                className="rounded-full border border-gray-200 px-3 py-1 text-sm text-[var(--gbh-gray-text)] hover:border-[var(--gbh-magenta)] hover:text-[var(--gbh-magenta)] transition-colors"
                onClick={() => setConfirmation(null)}
              >
                Fermer
              </button>
            </div>

            <div className="px-8 py-6 grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <div className="text-xs uppercase text-[var(--gbh-gray-text)]">
                    Service
                  </div>
                  <div className="text-lg font-semibold text-[var(--gbh-black-soft)]">
                    {confirmation.serviceName}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase text-[var(--gbh-gray-text)]">
                    Date & heure
                  </div>
                  <div className="text-lg font-semibold text-[var(--gbh-black-soft)]">
                    {formatDateDisplay(confirmation.date)} · {confirmation.time}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase text-[var(--gbh-gray-text)]">
                    Type
                  </div>
                  <div className="text-lg font-semibold text-[var(--gbh-black-soft)]">
                    {confirmation.type === "online" ? "En ligne" : "Présentiel"}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-xs uppercase text-[var(--gbh-gray-text)]">
                    Référence
                  </div>
                  <div className="text-lg font-semibold text-[var(--gbh-black-soft)]">
                    {confirmation.id}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase text-[var(--gbh-gray-text)]">
                    Paiement
                  </div>
                  <div className="text-sm text-[var(--gbh-black-soft)]">
                    {confirmation.paymentStatus}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase text-[var(--gbh-gray-text)]">
                    Total
                  </div>
                  <div className="text-lg font-semibold text-[var(--gbh-black-soft)]">
                    {formatCurrency(confirmation.price)}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-8 pb-8">
              <div className="rounded-2xl bg-[var(--gbh-gray-ui)]/70 p-4 text-sm text-[var(--gbh-gray-text)]">
                Nous avons bien enregistré vos coordonnées ({confirmation.contact.name},{" "}
                {confirmation.contact.email}, {confirmation.contact.phone}). Nous vous
                contacterons avant le rendez-vous.
              </div>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Button
                  type="button"
                  className="rounded-full shadow-md"
                  style={{ backgroundColor: "var(--gbh-magenta)" }}
                  onClick={() => {
                    setConfirmation(null);
                    onNavigate("home");
                  }}
                >
                  Retour à l'accueil
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full"
                  style={{ borderColor: "var(--gbh-magenta)", color: "var(--gbh-magenta)" }}
                  onClick={() => onNavigate("contact")}
                >
                  Besoin d'aide ?
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}





