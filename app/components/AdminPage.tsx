import { useEffect, useMemo, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import {
  useAdminCreateBlockMutation,
  useAdminListAppointmentsQuery,
  useAdminListContactsQuery,
  useAdminLoginMutation,
  useAdminLogoutMutation,
  useAdminRefreshMutation,
  useGetServicesQuery,
} from "../store/api";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setAdminAuthenticated, setAdminSearch } from "../store/adminSlice";

interface AdminPageProps {
  onNavigate: (page: string) => void;
}

type AppointmentStatus = "réservé" | "en attente" | "confirmé" | "autre";
type AppointmentFilter = "tous" | AppointmentStatus;

type AppointmentRow = {
  id: string;
  name: string;
  service: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  type: "online" | "presentiel";
};

type MessageRow = {
  id: string;
  name: string;
  subject: string;
  date: string;
  preview: string;
};

const statusStyles: Record<AppointmentStatus, string> = {
  "réservé": "bg-blue-100 text-blue-700",
  "confirmé": "bg-emerald-100 text-emerald-700",
  "en attente": "bg-amber-100 text-amber-700",
  "autre": "bg-slate-100 text-slate-700",
};

const mapStatus = (status?: string): AppointmentStatus => {
  const value = (status || "").toLowerCase();
  if (value === "booked" || value === "reserved" || value === "created") {
    return "réservé";
  }
  if (value === "confirmed" || value === "confirmé") {
    return "confirmé";
  }
  if (value === "pending" || value === "en_attente" || value === "awaiting") {
    return "en attente";
  }
  return "autre";
};

export function AdminPage({ onNavigate }: AdminPageProps) {
  const dispatch = useAppDispatch();
  const search = useAppSelector((state) => state.admin.search);
  const isAuthenticated = useAppSelector((state) => state.admin.isAuthenticated);

  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [blockForm, setBlockForm] = useState({ date: "", time: "", reason: "" });
  const [blockMessage, setBlockMessage] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<AppointmentFilter>("tous");

  const [login, loginState] = useAdminLoginMutation();
  const [refresh] = useAdminRefreshMutation();
  const [logout] = useAdminLogoutMutation();

  const { data: servicesData } = useGetServicesQuery();
  const { data: appointmentsData, isFetching: isLoadingAppointments } =
    useAdminListAppointmentsQuery(undefined, { skip: !isAuthenticated });
  const { data: contactsData, isFetching: isLoadingContacts } =
    useAdminListContactsQuery(undefined, { skip: !isAuthenticated });
  const [createBlock, createBlockState] = useAdminCreateBlockMutation();

  useEffect(() => {
    refresh()
      .unwrap()
      .then(() => dispatch(setAdminAuthenticated(true)))
      .catch(() => dispatch(setAdminAuthenticated(false)));
  }, [dispatch, refresh]);

  const serviceMap = useMemo(() => {
    const map = new Map<string, string>();
    servicesData?.services?.forEach((service) => {
      const id = service.id || service._id || service.slug || service.name;
      if (id) {
        map.set(id, service.name);
      }
    });
    return map;
  }, [servicesData]);

  const appointmentRows: AppointmentRow[] = useMemo(() => {
    if (!appointmentsData?.appointments?.length) {
      return [];
    }

    return appointmentsData.appointments.map((appointment) => {
      const id = appointment.id || appointment._id || "-";
      const serviceName = appointment.serviceId
        ? serviceMap.get(appointment.serviceId) || appointment.serviceId
        : "Service";

      return {
        id,
        name: appointment.name || "Client",
        service: serviceName,
        date: appointment.date || "",
        time: appointment.time || "",
        status: mapStatus(appointment.status),
        type: appointment.type === "presentiel" ? "presentiel" : "online",
      };
    });
  }, [appointmentsData, serviceMap]);

  const statusCounts = useMemo(() => {
    const reserved = appointmentRows.filter((item) => item.status === "réservé").length;
    const pending = appointmentRows.filter((item) => item.status === "en attente").length;
    const confirmed = appointmentRows.filter((item) => item.status === "confirmé").length;
    const other = appointmentRows.filter((item) => item.status === "autre").length;
    return { reserved, pending, confirmed, other };
  }, [appointmentRows]);

  const statusSummary = useMemo(
    () => [
      { key: "réservé" as const, label: "Réservés", value: statusCounts.reserved },
      { key: "en attente" as const, label: "En attente", value: statusCounts.pending },
      { key: "confirmé" as const, label: "Confirmés", value: statusCounts.confirmed },
      { key: "autre" as const, label: "Autres", value: statusCounts.other },
    ],
    [statusCounts],
  );

  const statusFilters = useMemo(
    () => [
      { key: "tous" as const, label: "Tous", value: appointmentRows.length },
      ...statusSummary,
    ],
    [appointmentRows.length, statusSummary],
  );

  const filteredAppointments = useMemo(() => {
    const lower = search.toLowerCase();
    return appointmentRows.filter(
      (appointment) =>
        (statusFilter === "tous" || appointment.status === statusFilter) &&
        (appointment.name.toLowerCase().includes(lower) ||
          appointment.service.toLowerCase().includes(lower) ||
          appointment.id.toLowerCase().includes(lower)),
    );
  }, [appointmentRows, search, statusFilter]);

  const messageRows: MessageRow[] = useMemo(() => {
    if (!contactsData?.contacts?.length) {
      return [];
    }
    return contactsData.contacts.map((message) => ({
      id: message.id || message._id || "",
      name: message.name,
      subject: message.subject,
      date: message.createdAt ? message.createdAt.split("T")[0] : "",
      preview: message.message.slice(0, 60) + "...",
    }));
  }, [contactsData]);

  const stats = useMemo(() => {
    const total = appointmentRows.length;
    const confirmed = appointmentRows.filter((item) => item.status === "confirmé").length;
    const pending = appointmentRows.filter((item) => item.status === "en attente").length;
    return [
      { label: "Rendez-vous à venir", value: String(total) },
      { label: "Messages non lus", value: String(messageRows.length) },
      { label: "Taux de confirmation", value: total ? `${Math.round((confirmed / total) * 100)}%` : "0%" },
      { label: "RDV en attente", value: String(pending) },
    ];
  }, [appointmentRows, messageRows.length]);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await login(credentials).unwrap();
      dispatch(setAdminAuthenticated(true));
    } catch {
      dispatch(setAdminAuthenticated(false));
    }
  };

  const handleLogout = async () => {
    await logout().unwrap().catch(() => undefined);
    dispatch(setAdminAuthenticated(false));
    dispatch(setAdminSearch(""));
  };

  const handleBlockSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBlockMessage(null);

    try {
      await createBlock(blockForm).unwrap();
      setBlockMessage("Créneau bloqué avec succès.");
      setBlockForm({ date: "", time: "", reason: "" });
    } catch {
      setBlockMessage("Impossible de bloquer le créneau.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(196,0,255,0.12),_transparent_55%),radial-gradient(circle_at_top_left,_rgba(212,255,0,0.18),_transparent_45%),linear-gradient(180deg,_#ffffff_0%,_#f8f6ff_40%,_#ffffff_100%)]">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="rounded-3xl bg-white p-10 shadow-2xl">
            <p className="text-sm uppercase tracking-[0.2em] text-[var(--gbh-gray-text)]">
              Accès sécurisé
            </p>
            <h1 className="mt-2 text-3xl text-[var(--gbh-black-soft)]">
              Connexion administrateur
            </h1>
            <p className="mt-2 text-[var(--gbh-gray-text)]">
              Cette zone est réservée à l'équipe GBH. Connectez-vous pour gérer les rendez-vous et les services.
            </p>

            <form className="mt-8 space-y-4" onSubmit={handleLogin}>
              <Input
                type="text"
                placeholder="Identifiant"
                value={credentials.username}
                onChange={(event) =>
                  setCredentials({ ...credentials, username: event.target.value })
                }
                required
              />
              <Input
                type="password"
                placeholder="Mot de passe"
                value={credentials.password}
                onChange={(event) =>
                  setCredentials({ ...credentials, password: event.target.value })
                }
                required
              />

              {loginState.error && (
                <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  Identifiants invalides. Merci de réessayer.
                </div>
              )}

              <Button
                type="submit"
                className="w-full rounded-full py-5"
                style={{ backgroundColor: "var(--gbh-magenta)" }}
                disabled={loginState.isLoading}
              >
                {loginState.isLoading ? "Connexion..." : "Se connecter"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(196,0,255,0.12),_transparent_55%),radial-gradient(circle_at_top_left,_rgba(212,255,0,0.18),_transparent_45%),linear-gradient(180deg,_#ffffff_0%,_#f8f6ff_40%,_#ffffff_100%)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-72">
            <div className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-xl backdrop-blur">
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="h-12 w-12 rounded-2xl flex items-center justify-center text-white text-lg font-semibold"
                  style={{ backgroundColor: "var(--gbh-magenta)" }}
                >
                  AD
                </div>
                <div>
                  <p className="text-sm text-[var(--gbh-gray-text)]">Espace</p>
                  <p className="font-semibold text-[var(--gbh-black-soft)]">
                    Administration
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {[
                  "Tableau de bord",
                  "Rendez-vous",
                  "Messages",
                  "Services",
                  "Paramètres",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl px-4 py-3 text-sm font-medium text-[var(--gbh-gray-text)] hover:bg-[var(--gbh-gray-ui)]"
                  >
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-2xl p-4 bg-[var(--gbh-magenta-light)]">
                <p className="text-sm text-[var(--gbh-magenta-dark)] font-semibold">
                  Accès rapide
                </p>
                <div className="mt-3 space-y-2">
                  <Button
                    className="w-full rounded-full"
                    onClick={() => onNavigate("rdv")}
                    style={{ backgroundColor: "var(--gbh-magenta)" }}
                  >
                    Nouveau RDV
                  </Button>
                  <Button
                    className="w-full rounded-full"
                    variant="outline"
                    onClick={() => onNavigate("home")}
                    style={{
                      borderColor: "var(--gbh-magenta)",
                      color: "var(--gbh-magenta)",
                    }}
                  >
                    Voir le site
                  </Button>
                  <Button
                    className="w-full rounded-full"
                    variant="ghost"
                    onClick={handleLogout}
                  >
                    Se déconnecter
                  </Button>
                </div>
              </div>
            </div>
          </aside>

          <div className="flex-1 space-y-8">
            <div className="rounded-3xl bg-white p-8 shadow-2xl">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-[var(--gbh-gray-text)]">
                    Dashboard
                  </p>
                  <h1 className="text-3xl md:text-4xl text-[var(--gbh-black-soft)]">
                    Vue d'ensemble de l'activité
                  </h1>
                  <p className="mt-2 text-[var(--gbh-gray-text)]">
                    Statut des rendez-vous, messages entrants et disponibilité.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    className="rounded-full px-6"
                    variant="outline"
                    style={{
                      borderColor: "var(--gbh-magenta)",
                      color: "var(--gbh-magenta)",
                    }}
                  >
                    Exporter
                  </Button>
                  <Button
                    className="rounded-full px-6"
                    style={{ backgroundColor: "var(--gbh-magenta)" }}
                  >
                    Synchroniser
                  </Button>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-gray-100 p-5 shadow-sm"
                  >
                    <p className="text-sm text-[var(--gbh-gray-text)]">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-semibold text-[var(--gbh-black-soft)]">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl text-[var(--gbh-black-soft)]">
                    Statut des rendez-vous
                  </h2>
                  <p className="text-sm text-[var(--gbh-gray-text)]">
                    Répartition actuelle des rendez-vous par statut.
                  </p>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {statusSummary.map((status) => (
                  <div
                    key={status.key}
                    className="rounded-2xl border border-gray-100 p-5 shadow-sm"
                  >
                    <p className="text-sm text-[var(--gbh-gray-text)]">
                      {status.label}
                    </p>
                    <p className="text-3xl font-semibold text-[var(--gbh-black-soft)]">
                      {status.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 rounded-3xl bg-white p-8 shadow-2xl">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl text-[var(--gbh-black-soft)]">
                      Rendez-vous à traiter
                    </h2>
                    <p className="text-sm text-[var(--gbh-gray-text)]">
                      Filtre rapide par nom, service ou référence.
                    </p>
                  </div>
                  <div className="w-full md:w-64">
                    <Input
                      value={search}
                      onChange={(event) =>
                        dispatch(setAdminSearch(event.target.value))
                      }
                      placeholder="Rechercher un RDV"
                    />
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {statusFilters.map((filter) => {
                    const isActive = statusFilter === filter.key;
                    return (
                      <button
                        key={filter.key}
                        type="button"
                        onClick={() => setStatusFilter(filter.key)}
                        className={`rounded-full px-4 py-2 text-xs font-semibold border transition-all ${
                          isActive
                            ? "bg-[var(--gbh-magenta)] text-white border-[var(--gbh-magenta)]"
                            : "bg-white border-gray-200 text-[var(--gbh-gray-text)] hover:border-[var(--gbh-magenta)]"
                        }`}
                      >
                        {filter.label} ({filter.value})
                      </button>
                    );
                  })}
                </div>

                {isLoadingAppointments && (
                  <p className="mt-6 text-sm text-[var(--gbh-gray-text)]">
                    Chargement des rendez-vous...
                  </p>
                )}

                {!isLoadingAppointments && filteredAppointments.length === 0 && (
                  <p className="mt-6 text-sm text-[var(--gbh-gray-text)]">
                    Aucun rendez-vous trouvé.
                  </p>
                )}

                <div className="mt-6 space-y-4">
                  {filteredAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 rounded-2xl border border-gray-100 p-4 hover:shadow-md transition-all"
                    >
                      <div>
                        <p className="text-xs text-[var(--gbh-gray-text)]">
                          {appointment.id}
                        </p>
                        <p className="text-lg font-semibold text-[var(--gbh-black-soft)]">
                          {appointment.name}
                        </p>
                        <p className="text-sm text-[var(--gbh-gray-text)]">
                          {appointment.service} · {appointment.type === "online" ? "En ligne" : "Présentiel"}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-[var(--gbh-gray-text)]">
                          {appointment.date} · {appointment.time}
                        </div>
                        <Badge className={statusStyles[appointment.status]}>
                          {appointment.status}
                        </Badge>
                        <Button
                          size="sm"
                          className="rounded-full px-4"
                          style={{ backgroundColor: "var(--gbh-magenta)" }}
                        >
                          Détails
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl bg-white p-8 shadow-2xl">
                <h2 className="text-2xl text-[var(--gbh-black-soft)]">
                  Boîte de réception
                </h2>
                <p className="text-sm text-[var(--gbh-gray-text)]">
                  Messages entrants des formulaires de contact.
                </p>

                {isLoadingContacts && (
                  <p className="mt-6 text-sm text-[var(--gbh-gray-text)]">
                    Chargement des messages...
                  </p>
                )}

                {!isLoadingContacts && messageRows.length === 0 && (
                  <p className="mt-6 text-sm text-[var(--gbh-gray-text)]">
                    Aucun message reçu.
                  </p>
                )}

                <div className="mt-6 space-y-4">
                  {messageRows.map((message) => (
                    <div
                      key={message.id}
                      className="rounded-2xl border border-gray-100 p-4 hover:shadow-md transition-all"
                    >
                      <p className="text-xs text-[var(--gbh-gray-text)]">
                        {message.date}
                      </p>
                      <p className="font-semibold text-[var(--gbh-black-soft)]">
                        {message.subject}
                      </p>
                      <p className="text-sm text-[var(--gbh-gray-text)]">
                        {message.name}
                      </p>
                      <p className="text-sm text-[var(--gbh-gray-text)] mt-2">
                        {message.preview}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-3xl bg-white p-8 shadow-2xl">
                <h2 className="text-2xl text-[var(--gbh-black-soft)]">
                  Bloquer un créneau
                </h2>
                <p className="text-sm text-[var(--gbh-gray-text)]">
                  Fermez un créneau pour indisponibilité temporaire.
                </p>
                <form className="mt-6 space-y-4" onSubmit={handleBlockSubmit}>
                  <Input
                    type="date"
                    value={blockForm.date}
                    onChange={(event) =>
                      setBlockForm({ ...blockForm, date: event.target.value })
                    }
                    required
                  />
                  <Input
                    type="time"
                    value={blockForm.time}
                    onChange={(event) =>
                      setBlockForm({ ...blockForm, time: event.target.value })
                    }
                    required
                  />
                  <Textarea
                    placeholder="Motif ou commentaire"
                    value={blockForm.reason}
                    onChange={(event) =>
                      setBlockForm({ ...blockForm, reason: event.target.value })
                    }
                    required
                  />
                  {blockMessage && (
                    <div
                      className={`rounded-2xl px-4 py-3 text-sm ${
                        createBlockState.error
                          ? "bg-rose-50 text-rose-700"
                          : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {blockMessage}
                    </div>
                  )}
                  <Button
                    className="rounded-full"
                    style={{ backgroundColor: "var(--gbh-magenta)" }}
                    disabled={createBlockState.isLoading}
                  >
                    {createBlockState.isLoading ? "Blocage..." : "Bloquer le créneau"}
                  </Button>
                </form>
              </div>

              <div className="rounded-3xl bg-white p-8 shadow-2xl">
                <h2 className="text-2xl text-[var(--gbh-black-soft)]">
                  Services clés
                </h2>
                <p className="text-sm text-[var(--gbh-gray-text)]">
                  Mettre en avant les offres principales du moment.
                </p>
                <div className="mt-6 space-y-3">
                  {(servicesData?.services?.slice(0, 4) || []).map((service) => (
                    <div
                      key={service.id || service._id || service.name}
                      className="flex items-center justify-between rounded-2xl border border-gray-100 p-4"
                    >
                      <div>
                        <p className="font-semibold text-[var(--gbh-black-soft)]">
                          {service.name}
                        </p>
                        <p className="text-xs text-[var(--gbh-gray-text)]">
                          Mise en avant depuis l'admin
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full"
                        style={{
                          borderColor: "var(--gbh-magenta)",
                          color: "var(--gbh-magenta)",
                        }}
                      >
                        Modifier
                      </Button>
                    </div>
                  ))}

                  {!servicesData?.services?.length && (
                    <p className="text-sm text-[var(--gbh-gray-text)]">
                      Aucun service chargé pour le moment.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
