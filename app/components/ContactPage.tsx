import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useState } from "react";

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Message envoyé ! Nous vous répondrons dans les plus brefs délais.");
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
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
                    Kinshasa, République Démocratique du Congo
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
                  <p className="text-[var(--gbh-gray-text)]">contact@gbh-sarl.cd</p>
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
                  <p className="text-[var(--gbh-gray-text)]">+243 XXX XXX XXX</p>
                </div>
              </div>
            </div>

            <div
              className="rounded-2xl p-8"
              style={{ backgroundColor: "var(--gbh-magenta-light)" }}
            >
              <h3 className="mb-4" style={{ color: "var(--gbh-magenta-dark)" }}>
                Heures d'ouverture
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
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="votre.email@exemple.com"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block mb-2 text-[var(--gbh-black-soft)]">
                  Téléphone
                </label>
                <Input
                  type="tel"
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
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
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
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  placeholder="Décrivez votre demande..."
                  className="w-full min-h-[150px]"
                />
              </div>

              <Button
                type="submit"
                className="w-full py-6"
                size="lg"
                style={{ backgroundColor: "var(--gbh-magenta)" }}
              >
                <span className="text-lg">📨</span>
                Envoyer le message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
