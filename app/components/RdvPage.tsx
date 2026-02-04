import { useState } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";

interface RdvPageProps {
  onNavigate: (page: string) => void;
}

const mockReservations: { [key: string]: string[] } = {
  "2026-02-06": ["09:00", "10:00", "14:00"],
  "2026-02-10": ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
  "2026-02-12": ["09:00", "14:00"],
  "2026-02-18": ["10:00", "15:00"],
  "2026-02-24": ["09:00", "10:00", "14:00"],
  "2026-03-03": ["09:00", "11:00"],
  "2026-03-05": ["14:00", "15:00", "16:00"],
};

const services = [
  {
    id: "conseil",
    name: "Conseil stratégique",
    badge: "Consultation particulière",
  },
  {
    id: "intelligence",
    name: "Intelligence opérationnelle",
    badge: "Consultation particulière",
  },
  {
    id: "numerique",
    name: "Laboratoire numérique",
    badge: "Consultation particulière",
  },
  { id: "recrutement", name: "Recrutement", badge: "Consultation particulière" },
  { id: "formation", name: "Formation", badge: "Consultation particulière" },
  { id: "fourniture", name: "Fourniture de biens", badge: "Consultation particulière" },
  { id: "entrepreneuriat", name: "Entrepreneuriat", badge: "Consultation particulière" },
  { id: "fiscalite", name: "Fiscalité", badge: "Consultation particulière" },
  { id: "voyage", name: "Voyage", badge: "Consultation particulière" },
  {
    id: "commission",
    name: "Commission acquisition ou vente de biens",
    badge: "Consultation particulière",
  },
];

export function RdvPage({ onNavigate }: RdvPageProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState("");
  const [consultationType, setConsultationType] = useState("online");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("online");

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

  const daysOfWeek = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

  const generateTimeSlots = (date: string) => {
    const dayOfWeek = new Date(date).getDay();
    const slots: string[] = [];

    if (dayOfWeek === 0) return [];

    if (dayOfWeek === 6) {
      for (let hour = 9; hour < 13; hour++) {
        slots.push(`${hour.toString().padStart(2, "0")}:00`);
      }
    } else {
      for (let hour = 9; hour < 12; hour++) {
        slots.push(`${hour.toString().padStart(2, "0")}:00`);
      }
      for (let hour = 14; hour < 17; hour++) {
        slots.push(`${hour.toString().padStart(2, "0")}:00`);
      }
    }

    return slots;
  };

  const isTimeSlotAvailable = (date: string, time: string) => {
    const reservations = mockReservations[date] || [];
    return !reservations.includes(time);
  };

  const hasAvailableSlots = (date: string) => {
    const allSlots = generateTimeSlots(date);
    if (allSlots.length === 0) return false;
    const reservations = mockReservations[date] || [];
    return allSlots.length > reservations.length;
  };

  const getAvailableSlotsCount = (date: string) => {
    const allSlots = generateTimeSlots(date);
    const reservations = mockReservations[date] || [];
    return allSlots.length - reservations.length;
  };

  const generateCalendar = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const calendar: (number | null)[] = [];

    for (let i = 0; i < startDayOfWeek; i++) {
      calendar.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      calendar.push(day);
    }

    return calendar;
  };

  const isPastDate = (year: number, month: number, day: number) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(year, month, day);
    return checkDate < today;
  };

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDateSelect = (day: number) => {
    const dateStr = `${currentYear}-${(currentMonth + 1)
      .toString()
      .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

    if (isPastDate(currentYear, currentMonth, day) || !hasAvailableSlots(dateStr)) {
      return;
    }

    setSelectedDate(dateStr);
    setSelectedTime("");
  };

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceedFromStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return selectedService !== "";
      case 2:
        return consultationType !== "";
      case 3:
        return selectedDate !== "" && selectedTime !== "";
      case 4:
        return acceptedTerms;
      case 5:
        return paymentMethod !== "";
      default:
        return false;
    }
  };

  const formatDateDisplay = (dateStr: string) => {
    const date = new Date(dateStr);
    const days = [
      "Dimanche",
      "Lundi",
      "Mardi",
      "Mercredi",
      "Jeudi",
      "Vendredi",
      "Samedi",
    ];
    const months = [
      "janvier",
      "février",
      "mars",
      "avril",
      "mai",
      "juin",
      "juillet",
      "août",
      "septembre",
      "octobre",
      "novembre",
      "décembre",
    ];
    return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const consultationPrice = 50000;
  const tvaRate = 0.16;
  const tvaAmount = Math.round(consultationPrice * tvaRate);
  const totalPrice = consultationPrice + tvaAmount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div
            className="inline-block px-4 py-2 rounded-full mb-4 text-sm"
            style={{
              backgroundColor: "var(--gbh-magenta-light)",
              color: "var(--gbh-magenta)",
            }}
          >
            BOOKING PLATFORM
          </div>
          <h1 className="mb-4 text-[var(--gbh-black-soft)] text-4xl md:text-5xl">
            Plateforme de{" "}
            <span className="relative inline-block">
              <span className="relative z-10">rendez-vous</span>
              <span
                className="absolute bottom-2 left-0 w-full h-3 -z-0"
                style={{ backgroundColor: "#D4FF00" }}
              ></span>
            </span>
          </h1>
          <p className="text-lg text-[var(--gbh-gray-text)]">
            Réservez votre consultation en quelques étapes
          </p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex flex-col items-center">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full transition-all shadow-lg ${
                    step <= currentStep
                      ? "text-white scale-110"
                      : "bg-white text-[var(--gbh-gray-text)]"
                  }`}
                  style={
                    step <= currentStep
                      ? { backgroundColor: "var(--gbh-magenta)" }
                      : {}
                  }
                >
                  {step}
                </div>
                <div className="text-xs mt-2 text-[var(--gbh-gray-text)] hidden sm:block">
                  {step === 1 && "Service"}
                  {step === 2 && "Type"}
                  {step === 3 && "Date"}
                  {step === 4 && "Récap"}
                  {step === 5 && "Paiement"}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className="flex-1 h-2 rounded-full transition-all"
                style={{
                  backgroundColor:
                    step <= currentStep ? "var(--gbh-magenta)" : "#E5E7EB",
                }}
              ></div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 mb-6">
          {currentStep === 1 && (
            <div>
              <h2 className="mb-6 text-[var(--gbh-black-soft)]">
                Étape 1 : Choisissez votre service
              </h2>
              <div className="space-y-3">
                {services.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => setSelectedService(service.id)}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md ${
                      selectedService === service.id
                        ? "border-[var(--gbh-magenta)] bg-[var(--gbh-magenta-light)]"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-[var(--gbh-black-soft)]">
                          {service.name}
                        </h3>
                        <Badge
                          className="mt-2"
                          style={{
                            backgroundColor: "var(--gbh-magenta-light)",
                            color: "var(--gbh-magenta)",
                          }}
                        >
                          {service.badge}
                        </Badge>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedService === service.id
                            ? "border-[var(--gbh-magenta)]"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedService === service.id && (
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: "var(--gbh-magenta)" }}
                          ></div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h2 className="mb-6 text-[var(--gbh-black-soft)]">
                Étape 2 : Type de consultation
              </h2>
              <RadioGroup value={consultationType} onValueChange={setConsultationType}>
                <div
                  className={`p-6 border-2 rounded-xl mb-4 cursor-pointer transition-all ${
                    consultationType === "online"
                      ? "border-[var(--gbh-magenta)] bg-[var(--gbh-magenta-light)]"
                      : "border-gray-200"
                  }`}
                  onClick={() => setConsultationType("online")}
                >
                  <div className="flex items-center gap-4">
                    <RadioGroupItem value="online" id="online" />
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                        style={{ backgroundColor: "var(--gbh-magenta-light)" }}
                      >
                        📹
                      </div>
                      <div>
                        <Label htmlFor="online" className="cursor-pointer">
                          En ligne
                        </Label>
                        <p className="text-sm text-[var(--gbh-gray-text)]">
                          Consultation par visioconférence
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
                    consultationType === "presentiel"
                      ? "border-[var(--gbh-magenta)] bg-[var(--gbh-magenta-light)]"
                      : "border-gray-200"
                  }`}
                  onClick={() => setConsultationType("presentiel")}
                >
                  <div className="flex items-center gap-4">
                    <RadioGroupItem value="presentiel" id="presentiel" />
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                        style={{ backgroundColor: "var(--gbh-magenta-light)" }}
                      >
                        📍
                      </div>
                      <div>
                        <Label htmlFor="presentiel" className="cursor-pointer">
                          Présentiel
                        </Label>
                        <p className="text-sm text-[var(--gbh-gray-text)]">
                          Consultation dans nos bureaux
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </RadioGroup>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h2 className="mb-6 text-[var(--gbh-black-soft)]">
                Étape 3 : Sélectionnez une date et un horaire
              </h2>

              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <Button
                    onClick={goToPreviousMonth}
                    variant="outline"
                    size="sm"
                    className="rounded-xl"
                    aria-label="Mois précédent"
                  >
                    <span aria-hidden="true">←</span>
                  </Button>
                  <h3 className="text-xl font-semibold text-[var(--gbh-black-soft)]">
                    {monthNames[currentMonth]} {currentYear}
                  </h3>
                  <Button
                    onClick={goToNextMonth}
                    variant="outline"
                    size="sm"
                    className="rounded-xl"
                    aria-label="Mois suivant"
                  >
                    <span aria-hidden="true">→</span>
                  </Button>
                </div>

                <div className="grid grid-cols-7 gap-2 mb-3">
                  {daysOfWeek.map((day) => (
                    <div
                      key={day}
                      className="text-center text-sm font-semibold text-[var(--gbh-gray-text)] py-2"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {generateCalendar().map((day, index) => {
                    if (day === null) {
                      return <div key={`empty-${index}`} className="aspect-square"></div>;
                    }

                    const dateStr = `${currentYear}-${(currentMonth + 1)
                      .toString()
                      .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
                    const isPast = isPastDate(currentYear, currentMonth, day);
                    const hasSlots = hasAvailableSlots(dateStr);
                    const availableCount = getAvailableSlotsCount(dateStr);
                    const isSelected = selectedDate === dateStr;
                    const isSunday = new Date(dateStr).getDay() === 0;
                    const isFullyBooked = !hasSlots && !isSunday;

                    let dayClasses =
                      "aspect-square flex flex-col items-center justify-center rounded-xl border-2 transition-all relative ";

                    if (isPast || isSunday) {
                      dayClasses +=
                        "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed";
                    } else if (isFullyBooked) {
                      dayClasses +=
                        "bg-red-50 text-red-400 border-red-200 cursor-not-allowed";
                    } else if (isSelected) {
                      dayClasses +=
                        "border-[var(--gbh-magenta)] bg-[var(--gbh-magenta)] text-white cursor-pointer shadow-lg scale-105";
                    } else {
                      dayClasses +=
                        "border-gray-200 hover:border-[var(--gbh-magenta)] hover:shadow-md cursor-pointer";
                    }

                    return (
                      <button
                        key={day}
                        onClick={() => handleDateSelect(day)}
                        disabled={isPast || isSunday || isFullyBooked}
                        className={dayClasses}
                      >
                        <span className="font-semibold">{day}</span>
                        {!isPast && !isSunday && hasSlots && (
                          <span
                            className={`text-xs mt-1 ${
                              isSelected ? "text-white" : "text-green-600"
                            }`}
                          >
                            {availableCount} libre{availableCount > 1 ? "s" : ""}
                          </span>
                        )}
                        {isFullyBooked && (
                          <span className="text-xs mt-1 text-red-500">Complet</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-wrap gap-4 mt-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded border-2 border-green-500 bg-green-50"></div>
                    <span className="text-[var(--gbh-gray-text)]">Disponible</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded border-2 border-red-200 bg-red-50"></div>
                    <span className="text-[var(--gbh-gray-text)]">Complet</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded border-2 border-gray-200 bg-gray-100"></div>
                    <span className="text-[var(--gbh-gray-text)]">Fermé/Passé</span>
                  </div>
                </div>
              </div>

              {selectedDate && (
                <div>
                  <h3 className="mb-4 text-[var(--gbh-black-soft)]">
                    Créneaux horaires disponibles pour le {formatDateDisplay(selectedDate)}
                    <span className="text-sm text-[var(--gbh-gray-text)] ml-2">
                      (Durée : 45 minutes)
                    </span>
                  </h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {generateTimeSlots(selectedDate).map((time) => {
                      const isAvailable = isTimeSlotAvailable(selectedDate, time);
                      const isSelected = selectedTime === time;

                      return (
                        <button
                          key={time}
                          onClick={() => isAvailable && setSelectedTime(time)}
                          disabled={!isAvailable}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            !isAvailable
                              ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                              : isSelected
                              ? "border-[var(--gbh-magenta)] bg-[var(--gbh-magenta)] text-white shadow-lg"
                              : "border-gray-200 hover:border-[var(--gbh-magenta)] hover:shadow-md"
                          }`}
                        >
                          <div className="text-sm mb-1">🕒</div>
                          <div className="font-semibold">{time}</div>
                          {!isAvailable && <div className="text-xs mt-1">Réservé</div>}
                        </button>
                      );
                    })}
                  </div>
                  {new Date(selectedDate).getDay() === 6 && (
                    <p className="text-sm text-[var(--gbh-gray-text)] mt-4 italic">
                      ℹ️ Samedi : créneaux disponibles de 09h00 à 13h00 uniquement
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {currentStep === 4 && (
            <div>
              <h2 className="mb-6 text-[var(--gbh-black-soft)]">
                Étape 4 : Récapitulatif et conditions
              </h2>

              <div className="bg-[var(--gbh-gray-ui)] rounded-xl p-6 mb-6">
                <h3 className="mb-4 text-[var(--gbh-black-soft)]">Votre rendez-vous</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-[var(--gbh-gray-text)]">Service :</span>
                    <span className="font-semibold">
                      {services.find((s) => s.id === selectedService)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--gbh-gray-text)]">Type :</span>
                    <span className="font-semibold capitalize">
                      {consultationType === "online" ? "En ligne" : "Présentiel"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--gbh-gray-text)]">Date :</span>
                    <span className="font-semibold">
                      {selectedDate && formatDateDisplay(selectedDate)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--gbh-gray-text)]">Heure :</span>
                    <span className="font-semibold">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--gbh-gray-text)]">Durée :</span>
                    <span className="font-semibold">45 minutes</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-6">
                <h3 className="mb-4 text-[var(--gbh-black-soft)]">Tarification</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-[var(--gbh-gray-text)]">Consultation :</span>
                    <span className="font-semibold">
                      {consultationPrice.toLocaleString()} CDF
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--gbh-gray-text)]">TVA (16%) :</span>
                    <span className="font-semibold">{tvaAmount.toLocaleString()} CDF</span>
                  </div>
                  <div className="border-t-2 border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between">
                      <span className="font-semibold text-[var(--gbh-black-soft)]">
                        Total TTC :
                      </span>
                      <span
                        className="text-xl font-bold"
                        style={{ color: "var(--gbh-magenta)" }}
                      >
                        {totalPrice.toLocaleString()} CDF
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-xl">
                <Checkbox
                  id="terms"
                  checked={acceptedTerms}
                  onCheckedChange={(checked) => setAcceptedTerms(checked)}
                />
                <Label
                  htmlFor="terms"
                  className="cursor-pointer leading-relaxed text-[var(--gbh-gray-text)]"
                >
                  J'accepte de payer les frais de consultation et de me présenter à l'heure
                  du rendez-vous
                </Label>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div>
              <h2 className="mb-6 text-[var(--gbh-black-soft)]">
                Étape 5 : Choix du mode de paiement
              </h2>

              <div className="bg-[var(--gbh-magenta-light)] rounded-xl p-6 mb-6 text-center">
                <p className="text-[var(--gbh-gray-text)] mb-2">Montant à payer</p>
                <p className="text-4xl font-bold" style={{ color: "var(--gbh-magenta)" }}>
                  {totalPrice.toLocaleString()} CDF
                </p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => setPaymentMethod("online")}
                  className={`w-full p-6 border-2 rounded-xl transition-all flex items-center gap-4 ${
                    paymentMethod === "online"
                      ? "border-[var(--gbh-magenta)] bg-[var(--gbh-magenta-light)]"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: "var(--gbh-magenta-light)" }}
                  >
                    💳
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="mb-1 text-[var(--gbh-black-soft)]">Paiement en ligne</h3>
                    <p className="text-sm text-[var(--gbh-gray-text)]">
                      Carte bancaire, Mobile Money
                    </p>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === "online"
                        ? "border-[var(--gbh-magenta)]"
                        : "border-gray-300"
                    }`}
                  >
                    {paymentMethod === "online" && (
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: "var(--gbh-magenta)" }}
                      ></div>
                    )}
                  </div>
                </button>

                <button
                  onClick={() => setPaymentMethod("place")}
                  className={`w-full p-6 border-2 rounded-xl transition-all flex items-center gap-4 ${
                    paymentMethod === "place"
                      ? "border-[var(--gbh-magenta)] bg-[var(--gbh-magenta-light)]"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: "var(--gbh-magenta-light)" }}
                  >
                    💵
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="mb-1 text-[var(--gbh-black-soft)]">Paiement sur place</h3>
                    <p className="text-sm text-[var(--gbh-gray-text)]">
                      À régler lors du rendez-vous
                    </p>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === "place"
                        ? "border-[var(--gbh-magenta)]"
                        : "border-gray-300"
                    }`}
                  >
                    {paymentMethod === "place" && (
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: "var(--gbh-magenta)" }}
                      ></div>
                    )}
                  </div>
                </button>
              </div>

              <div className="mt-8">
                <Button
                  className="w-full py-6 rounded-full"
                  size="lg"
                  style={{ backgroundColor: "var(--gbh-magenta)" }}
                  onClick={() => {
                    alert(
                      "Rendez-vous confirmé ! Vous recevrez une confirmation par email.",
                    );
                    onNavigate("home");
                  }}
                >
                  {paymentMethod === "online"
                    ? "Procéder au paiement"
                    : "Confirmer le rendez-vous"}
                </Button>
              </div>
            </div>
          )}
        </div>

        {currentStep < 5 && (
          <div className="flex gap-4">
            {currentStep > 1 && (
              <Button
                onClick={prevStep}
                variant="outline"
                className="flex-1 rounded-full"
              >
                <span aria-hidden="true" className="mr-2">
                  ←
                </span>
                Précédent
              </Button>
            )}
            <Button
              onClick={nextStep}
              disabled={!canProceedFromStep(currentStep)}
              className="flex-1 rounded-full"
              style={{ backgroundColor: "var(--gbh-magenta)" }}
            >
              Suivant
              <span aria-hidden="true" className="ml-2">
                →
              </span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
