import { useEffect, useMemo, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import {
  useAdminCreateBlockMutation,
  useAdminCreateServiceMutation,
  useAdminListAppointmentsQuery,
  useAdminListContactsQuery,
  useAdminLoginMutation,
  useAdminLogoutMutation,
  useAdminRefreshMutation,
  useAdminUpdateServiceMutation,
  useGetServicesQuery,
  type Appointment,
} from "../store/api";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setAdminAuthenticated, setAdminSearch } from "../store/adminSlice";

interface AdminPageProps {
  onNavigate: (page: string) => void;
}

type AppointmentStatus = "réservé" | "en attente" | "confirmé" | "autre";
type AppointmentFilter = "tous" | AppointmentStatus;
type AdminSection = "dashboard" | "appointments" | "messages" | "services" | "settings";

type AppointmentRow = {
  id: string;
  name: string;
  service: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  type: "online" | "presentiel";
  source: Appointment;
};

type MessageRow = {
  id: string;
  name: string;
  subject: string;
  date: string;
  preview: string;
};

const sidebarItems: { key: AdminSection; label: string }[] = [
  { key: "dashboard", label: "Tableau de bord" },
  { key: "appointments", label: "Rendez-vous" },
  { key: "messages", label: "Messages" },
  { key: "services", label: "Services" },
  { key: "settings", label: "Paramètres" },
];

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

const formatCurrency = (amount?: number) => {
  if (amount === undefined || amount === null) return "—";
  return `${new Intl.NumberFormat("fr-FR").format(amount)} CDF`;
};

const emptyServiceForm = {
  id: "",
  name: "",
  description: "",
  category: "",
  forAudience: "",
  slug: "",
};

export function AdminPage({ onNavigate }: AdminPageProps) {
  const dispatch = useAppDispatch();
  const search = useAppSelector((state) => state.admin.search);
  const isAuthenticated = useAppSelector((state) => state.admin.isAuthenticated);

  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [blockForm, setBlockForm] = useState({ date: "", time: "", reason: "" });
  const [blockMessage, setBlockMessage] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<AppointmentFilter>("tous");
  const [activeSection, setActiveSection] =
    useState<AdminSection>("dashboard");
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentRow | null>(null);
  const [serviceForm, setServiceForm] = useState({ ...emptyServiceForm });
  const [serviceMessage, setServiceMessage] = useState<string | null>(null);

  const [login, loginState] = useAdminLoginMutation();
  const [refresh] = useAdminRefreshMutation();
  const [logout] = useAdminLogoutMutation();
  const [createService, createServiceState] = useAdminCreateServiceMutation();
  const [updateService, updateServiceState] = useAdminUpdateServiceMutation();

  const { data: servicesData } = useGetServicesQuery();
  const { data: appointmentsData, isFetching: isLoadingAppointments } =
    useAdminListAppointmentsQuery(undefined, { skip: !isAuthenticated });
  const { data: contactsData, isFetching: isLoadingContacts } =
    useAdminListContactsQuery(undefined, { skip: !isAuthenticated });
  const [createBlock, createBlockState] = useAdminCreateBlockMutation();
  const isServiceSubmitting =
    createServiceState.isLoading || updateServiceState.isLoading;

  useEffect(() => {
    if (activeSection !== "appointments") {
      setSelectedAppointment(null);
    }
  }, [activeSection]);

  const resetServiceForm = (options?: { keepMessage?: boolean }) => {
    setServiceForm({ ...emptyServiceForm });
    if (!options?.keepMessage) {
      setServiceMessage(null);
    }
  };

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
        source: appointment,
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

  const handleServiceSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setServiceMessage(null);
    const name = serviceForm.name.trim();
    const description = serviceForm.description.trim();
    const category = serviceForm.category.trim();
    const forAudience = serviceForm.forAudience.trim();
    if (!name || !description || !category || !forAudience) {
      setServiceMessage("Le nom, la description, la catégorie et le public cible sont requis.");
      return;
    }

    const payload = {
      name,
      description,
      category,
      forAudience,
      ...(serviceForm.slug.trim() ? { slug: serviceForm.slug.trim() } : {}),
    };

    try {
      if (serviceForm.id) {
        await updateService({ id: serviceForm.id, ...payload }).unwrap();
        resetServiceForm({ keepMessage: true });
        setServiceMessage("Service mis à jour avec succès.");
      } else {
        await createService(payload).unwrap();
        resetServiceForm({ keepMessage: true });
        setServiceMessage("Service ajouté avec succès.");
      }
    } catch {
      setServiceMessage("Impossible d'enregistrer le service.");
    }
  };

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

            <div className="mt-4">
              <Button
                type="button"
                variant="outline"
                className="w-full rounded-full"
                onClick={() => onNavigate("register")}
              >
                Acces inscription admin
              </Button>
            </div>
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
                {sidebarItems.map((item) => {
                  const isActive = activeSection === item.key;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setActiveSection(item.key)}
                      className={`w-full text-left rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
                        isActive
                          ? "bg-[var(--gbh-magenta)] text-white shadow"
                          : "text-[var(--gbh-gray-text)] hover:bg-[var(--gbh-gray-ui)]"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
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
            {activeSection === "dashboard" && (
              <>
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
              </>
            )}

            {activeSection === "appointments" && (
              <>
                <div className="rounded-3xl bg-white p-8 shadow-2xl">
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
                          onClick={() => setSelectedAppointment(appointment)}
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
              </>
            )}

            {activeSection === "messages" && (
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
            )}

            {activeSection === "services" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="rounded-3xl bg-white p-8 shadow-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl text-[var(--gbh-black-soft)]">
                        Ajouter / Modifier un service
                      </h2>
                      <p className="text-sm text-[var(--gbh-gray-text)]">
                        Renseignez les informations du service.
                      </p>
                    </div>
                    {serviceForm.id && (
                      <Badge className="bg-[var(--gbh-magenta-light)] text-[var(--gbh-magenta)]">
                        Mode édition
                      </Badge>
                    )}
                  </div>
                  <form className="mt-6 space-y-4" onSubmit={handleServiceSubmit}>
                    <Input
                      placeholder="Nom du service"
                      value={serviceForm.name}
                      onChange={(event) =>
                        setServiceForm({ ...serviceForm, name: event.target.value })
                      }
                      required
                    />
                    <Textarea
                      placeholder="Description du service"
                      value={serviceForm.description}
                      onChange={(event) =>
                        setServiceForm({
                          ...serviceForm,
                          description: event.target.value,
                        })
                      }
                      required
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        placeholder="Catégorie *"
                        value={serviceForm.category}
                        onChange={(event) =>
                          setServiceForm({
                            ...serviceForm,
                            category: event.target.value,
                          })
                        }
                        required
                      />
                      <Input
                        placeholder="Public cible *"
                        value={serviceForm.forAudience}
                        onChange={(event) =>
                          setServiceForm({
                            ...serviceForm,
                            forAudience: event.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <Input
                      placeholder="Slug (optionnel)"
                      value={serviceForm.slug}
                      onChange={(event) =>
                        setServiceForm({ ...serviceForm, slug: event.target.value })
                      }
                    />
                    {serviceMessage && (
                      <div
                        className={`rounded-2xl px-4 py-3 text-sm ${
                          createServiceState.error || updateServiceState.error
                            ? "bg-rose-50 text-rose-700"
                            : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {serviceMessage}
                      </div>
                    )}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        type="submit"
                        className="rounded-full"
                        style={{ backgroundColor: "var(--gbh-magenta)" }}
                        disabled={isServiceSubmitting}
                      >
                        {isServiceSubmitting
                          ? "Enregistrement..."
                          : serviceForm.id
                          ? "Mettre à jour"
                          : "Ajouter le service"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-full"
                        style={{
                          borderColor: "var(--gbh-magenta)",
                          color: "var(--gbh-magenta)",
                        }}
                        onClick={() => resetServiceForm()}
                      >
                        Nouveau
                      </Button>
                    </div>
                  </form>
                </div>

                <div className="rounded-3xl bg-white p-8 shadow-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl text-[var(--gbh-black-soft)]">
                        Services existants
                      </h2>
                      <p className="text-sm text-[var(--gbh-gray-text)]">
                        Cliquez sur un service pour le modifier.
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
                      onClick={() => resetServiceForm()}
                    >
                      Nouveau service
                    </Button>
                  </div>

                  <div className="mt-6 space-y-3">
                    {(servicesData?.services || []).map((service) => {
                      const serviceId =
                        service.id || service._id || service.slug || service.name || "";
                      const isSelected = serviceForm.id === serviceId;
                      return (
                        <div
                          key={serviceId}
                          className={`flex flex-col gap-3 rounded-2xl border p-4 transition-all ${
                            isSelected
                              ? "border-[var(--gbh-magenta)] bg-[var(--gbh-magenta-light)]/30"
                              : "border-gray-100"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <p className="font-semibold text-[var(--gbh-black-soft)]">
                                {service.name}
                              </p>
                              <p className="text-xs text-[var(--gbh-gray-text)]">
                                {service.category || "Catégorie non définie"}
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
                              onClick={() => {
                                setServiceMessage(null);
                                setServiceForm({
                                  id: serviceId,
                                  name: service.name || "",
                                  description: service.description || "",
                                  category: service.category || "",
                                  forAudience: service.forAudience || "",
                                  slug: service.slug || "",
                                });
                              }}
                            >
                              Modifier
                            </Button>
                          </div>
                          {service.description && (
                            <p className="text-sm text-[var(--gbh-gray-text)]">
                              {service.description}
                            </p>
                          )}
                          {(service.forAudience || service.slug) && (
                            <div className="flex flex-wrap gap-2 text-xs text-[var(--gbh-gray-text)]">
                              {service.forAudience && (
                                <span className="rounded-full bg-white px-3 py-1">
                                  {service.forAudience}
                                </span>
                              )}
                              {service.slug && (
                                <span className="rounded-full bg-white px-3 py-1">
                                  {service.slug}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {!servicesData?.services?.length && (
                      <p className="text-sm text-[var(--gbh-gray-text)]">
                        Aucun service chargé pour le moment.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeSection === "settings" && (
              <div className="rounded-3xl bg-white p-8 shadow-2xl">
                <h2 className="text-2xl text-[var(--gbh-black-soft)]">
                  Paramètres
                </h2>
                <p className="text-sm text-[var(--gbh-gray-text)]">
                  Ajustez les préférences de l'administration.
                </p>
                <div className="mt-6 rounded-2xl border border-gray-100 p-4 text-sm text-[var(--gbh-gray-text)]">
                  Paramètres à venir.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {selectedAppointment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8"
          role="dialog"
          aria-modal="true"
          aria-label="Détails du rendez-vous"
          onClick={() => setSelectedAppointment(null)}
        >
          <div
            className="w-full max-w-3xl rounded-3xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--gbh-gray-text)]">
                  Détail du rendez-vous
                </p>
                <h3 className="mt-2 text-2xl text-[var(--gbh-black-soft)]">
                  {selectedAppointment.name}
                </h3>
              </div>
              <button
                type="button"
                className="rounded-full border border-gray-200 px-3 py-1 text-sm text-[var(--gbh-gray-text)] hover:border-[var(--gbh-magenta)] hover:text-[var(--gbh-magenta)] transition-colors"
                onClick={() => setSelectedAppointment(null)}
              >
                Fermer
              </button>
            </div>

            <div className="px-8 py-6 grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <div className="text-xs uppercase text-[var(--gbh-gray-text)]">
                    Référence
                  </div>
                  <div className="text-lg font-semibold text-[var(--gbh-black-soft)]">
                    {selectedAppointment.id}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase text-[var(--gbh-gray-text)]">
                    Service
                  </div>
                  <div className="text-lg font-semibold text-[var(--gbh-black-soft)]">
                    {selectedAppointment.service}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase text-[var(--gbh-gray-text)]">
                    Date & heure
                  </div>
                  <div className="text-lg font-semibold text-[var(--gbh-black-soft)]">
                    {selectedAppointment.date || "—"} · {selectedAppointment.time || "—"}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase text-[var(--gbh-gray-text)]">
                    Type
                  </div>
                  <div className="text-lg font-semibold text-[var(--gbh-black-soft)]">
                    {selectedAppointment.type === "online" ? "En ligne" : "Présentiel"}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-xs uppercase text-[var(--gbh-gray-text)]">
                    Statut
                  </div>
                  <Badge className={statusStyles[selectedAppointment.status]}>
                    {selectedAppointment.status}
                  </Badge>
                </div>
                <div>
                  <div className="text-xs uppercase text-[var(--gbh-gray-text)]">
                    Paiement
                  </div>
                  <div className="text-sm text-[var(--gbh-black-soft)]">
                    {selectedAppointment.source.paymentMethod || "—"}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase text-[var(--gbh-gray-text)]">
                    Montant
                  </div>
                  <div className="text-lg font-semibold text-[var(--gbh-black-soft)]">
                    {formatCurrency(selectedAppointment.source.total ?? selectedAppointment.source.price)}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase text-[var(--gbh-gray-text)]">
                    Durée
                  </div>
                  <div className="text-sm text-[var(--gbh-black-soft)]">
                    {selectedAppointment.source.duration
                      ? `${selectedAppointment.source.duration} min`
                      : "—"}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-8 pb-8">
              <div className="rounded-2xl bg-[var(--gbh-gray-ui)]/70 p-4 text-sm text-[var(--gbh-gray-text)]">
                <div className="font-semibold text-[var(--gbh-black-soft)] mb-1">
                  Coordonnées
                </div>
                <div>{selectedAppointment.source.name || "—"}</div>
                <div>{selectedAppointment.source.email || "—"}</div>
                <div>{selectedAppointment.source.phone || "—"}</div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button
                  type="button"
                  className="rounded-full"
                  style={{ backgroundColor: "var(--gbh-magenta)" }}
                  onClick={() => setSelectedAppointment(null)}
                >
                  Fermer le détail
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
