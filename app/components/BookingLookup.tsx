"use client";

import { useMemo, useState } from "react";
import {
  useGetServicesQuery,
  useLookupAppointmentMutation,
  type Appointment,
} from "../store/api";
import { getApiErrorMessage } from "../lib/api";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const formatDateDisplay = (date?: string) => {
  if (!date) return "-";
  const [year, month, day] = date.split("-");
  if (!year || !month || !day) return date;
  return `${day}/${month}/${year}`;
};

const appointmentStatusLabel = (status?: string) => {
  const value = (status || "").toLowerCase();
  if (value === "booked" || value === "reserved" || value === "created") return "Reserve";
  if (value === "confirmed" || value === "confirme") return "Confirme";
  if (value === "pending" || value === "en_attente" || value === "awaiting") return "En attente";
  if (value === "canceled" || value === "cancelled" || value === "annule") return "Annule";
  return status || "-";
};

const appointmentTypeLabel = (type?: string) =>
  type === "presentiel" ? "Presentiel" : type === "online" ? "En ligne" : "-";

const paymentMethodLabel = (paymentMethod?: string) =>
  paymentMethod === "place" ? "Sur place" : paymentMethod === "online" ? "En ligne" : "-";

export function BookingLookup() {
  const { data: servicesData } = useGetServicesQuery();
  const [lookupAppointment, { isLoading }] = useLookupAppointmentMutation();
  const [lookupId, setLookupId] = useState("");
  const [lookupMessage, setLookupMessage] = useState<string | null>(null);
  const [lookupResult, setLookupResult] = useState<Appointment | null>(null);

  const serviceNameMap = useMemo(() => {
    const map = new Map<string, string>();
    (servicesData?.services ?? []).forEach((service, index) => {
      const id = service.id || service._id || service.slug || `service-${index}`;
      map.set(id, service.name);
    });
    return map;
  }, [servicesData]);

  const handleSubmit = async (event: React.FormEvent) => {
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
      setLookupMessage("Reservation retrouvee.");
    } catch (error) {
      setLookupMessage(
        getApiErrorMessage(error, "Aucune reservation trouvee pour cet identifiant."),
      );
    }
  };

  return (
    <section className="py-16 bg-[linear-gradient(180deg,#f9f6ff,#ebfffa,#f5f9ff)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-purple-200 bg-white/80 p-6 md:p-8 shadow-[0_20px_36px_rgba(61,24,153,0.12)] backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-2xl text-purple-900">Retrouver une reservation</h2>
              <p className="text-sm text-purple-700">
                Saisissez la reference recue par email apres votre prise de rendez-vous.
              </p>
            </div>
            <form
              className="w-full lg:w-auto flex flex-col sm:flex-row gap-3"
              onSubmit={handleSubmit}
            >
              <Input
                value={lookupId}
                onChange={(event) => setLookupId(event.target.value)}
                placeholder="Ex: 67c9a2f7d2f0f9b0c9..."
                className="sm:min-w-[320px] bg-white"
              />
              <Button type="submit" className="rounded-full" disabled={isLoading}>
                {isLoading ? "Recherche..." : "Rechercher"}
              </Button>
            </form>
          </div>

          {lookupMessage && (
            <div
              className={`mt-4 rounded-2xl px-4 py-3 text-sm ${
                lookupResult ? "bg-[var(--gbh-mint-soft)] text-teal-800" : "bg-rose-50 text-rose-700"
              }`}
            >
              {lookupMessage}
            </div>
          )}

          {lookupResult && (
            <div className="mt-4 rounded-2xl border border-purple-100 bg-white p-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-xs uppercase text-purple-500">Reference</div>
                <div className="font-semibold text-purple-900">
                  {lookupResult.id || lookupResult._id || "-"}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase text-purple-500">Service</div>
                <div className="font-semibold text-purple-900">
                  {lookupResult.serviceId
                    ? serviceNameMap.get(lookupResult.serviceId) || lookupResult.serviceId
                    : "-"}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase text-purple-500">Date et heure</div>
                <div className="font-semibold text-purple-900">
                  {formatDateDisplay(lookupResult.date)} - {lookupResult.time || "-"}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase text-purple-500">Statut</div>
                <div className="font-semibold text-purple-900">
                  {appointmentStatusLabel(lookupResult.status)}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase text-purple-500">Type</div>
                <div className="font-semibold text-purple-900">
                  {appointmentTypeLabel(lookupResult.type)}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase text-purple-500">Paiement</div>
                <div className="font-semibold text-purple-900">
                  {paymentMethodLabel(lookupResult.paymentMethod)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

