import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import Link from "next/link";
import { useState } from "react";
import { useCreateContactMutation } from "../store/api";

const offices = [
  {
    name: "Bureau Sendwe",
    address: "Boulevard Sendwe, immeuble ADI Construct, Kinshasa, RDC",
  },
];

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [createContact, { isLoading, isSuccess, error }] =
    useCreateContactMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    try {
      await createContact(formData).unwrap();
      setStatusMessage("Message envoyé ! Nous vous répondrons dans les plus brefs délais.");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch {
      setStatusMessage("Impossible d'envoyer le message pour le moment.");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="mb-4 text-[var(--gbh-black-soft)]">Contactez-nous</h1>
          <p className="text-xl text-[var(--gbh-gray-text)]">
            Une question ? Un projet ? Nous sommes à votre écoute
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="mb-6 text-[var(--gbh-black-soft)]">Nos coordonnées</h2>

            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 text-2xl"
                  style={{ backgroundColor: "var(--gbh-magenta-light)" }}
                >
                  📍
                </div>
                <div>
                  <h3 className="mb-1 text-[var(--gbh-black-soft)]">Adresse</h3>
                  <p className="text-[var(--gbh-gray-text)]">
                    Boulevard Sendwe, immeuble ADI Construct
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 text-2xl"
                  style={{ backgroundColor: "var(--gbh-magenta-light)" }}
                >
                  ✉️
                </div>
                <div>
                  <h3 className="mb-1 text-[var(--gbh-black-soft)]">Email</h3>
                  <p className="text-[var(--gbh-gray-text)]">contact@gbh.sarl</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 text-2xl"
                  style={{ backgroundColor: "var(--gbh-magenta-light)" }}
                >
                  📞
                </div>
                <div>
                  <h3 className="mb-1 text-[var(--gbh-black-soft)]">Téléphone</h3>
                  <p className="text-[var(--gbh-gray-text)]">+243 999 403 012</p>
                </div>
              </div>
            </div>

            <div
              className="rounded-2xl p-8"
              style={{ backgroundColor: "var(--gbh-magenta-light)" }}
            >
              <h3 className="mb-4" style={{ color: "var(--gbh-magenta-dark)" }}>
                Heures d&apos;ouverture
              </h3>
              <div className="space-y-2 text-[var(--gbh-gray-text)]">
                <div className="flex justify-between">
                  <span>Lundi - Vendredi</span>
                  <span className="font-semibold">09:00 - 17:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Samedi</span>
                  <span className="font-semibold">09:00 - 13:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Dimanche</span>
                  <span className="font-semibold">Fermé</span>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-purple-200 bg-[linear-gradient(135deg,#f7f0ff,#eafffb)] p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-purple-600">
                Projets numeriques
              </p>
              <h3 className="mt-3 text-[var(--gbh-black-soft)]">
                Parlons aussi de Uty, Zwanga, Afya ou BPAC.
              </h3>
              <p className="mt-2 text-sm text-[var(--gbh-gray-text)]">
                GBH promeut des startups numeriques et peut cadrer les echanges
                autour d&apos;un partenariat, d&apos;un MVP ou d&apos;une mise en marche.
              </p>
              <Link
                href="/#projets-numeriques"
                className="mt-5 inline-flex rounded-full border border-purple-300 bg-white/80 px-4 py-2 text-sm font-semibold text-purple-900 transition-colors hover:border-[var(--gbh-mint-deep)]"
              >
                Voir les projets numeriques
              </Link>
            </div>

            <div className="mt-8">
              <h3 className="mb-4 text-[var(--gbh-black-soft)]">Nos bureaux</h3>
              <div className="space-y-4">
                {offices.map((office) => (
                  <article
                    key={office.name}
                    className="rounded-2xl border bg-white p-5"
                    style={{ borderColor: "var(--gbh-magenta-light)" }}
                  >
                    <h4 className="text-[var(--gbh-black-soft)]">{office.name}</h4>
                    <p className="text-sm text-[var(--gbh-gray-text)]">{office.address}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h2 className="mb-6 text-[var(--gbh-black-soft)]">
              Envoyez-nous un message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block mb-2 text-[var(--gbh-black-soft)]">
                  Nom complet <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Votre nom"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block mb-2 text-[var(--gbh-black-soft)]">
                  Email <span className="text-red-500">*</span>
                </label>
                <Input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="votre.email@exemple.com"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block mb-2 text-[var(--gbh-black-soft)]">
                  Téléphone <span className="text-red-500">*</span>
                </label>
                <Input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+243 XXX XXX XXX"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block mb-2 text-[var(--gbh-black-soft)]">
                  Sujet <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Objet de votre message"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block mb-2 text-[var(--gbh-black-soft)]">
                  Message <span className="text-red-500">*</span>
                </label>
                <Textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Décrivez votre demande..."
                  className="w-full min-h-[150px]"
                />
              </div>

              {statusMessage && (
                <div
                  className={`rounded-2xl px-4 py-3 text-sm ${
                    isSuccess
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {statusMessage}
                </div>
              )}

              {error && !statusMessage && (
                <div className="rounded-2xl px-4 py-3 text-sm bg-rose-50 text-rose-700">
                  Une erreur est survenue. Merci de réessayer.
                </div>
              )}

              <Button
                type="submit"
                className="w-full py-6"
                size="lg"
                disabled={isLoading}
                style={{ backgroundColor: "var(--gbh-magenta)" }}
              >
                <span className="text-lg">📨</span>
                {isLoading ? "Envoi en cours..." : "Envoyer le message"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
