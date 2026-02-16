import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useAdminRegisterMutation } from "../store/api";

interface AdminRegisterPageProps {
  onNavigate: (page: string) => void;
}

const getErrorMessage = (error: unknown) => {
  if (!error || typeof error !== "object") {
    return "Impossible de creer le compte admin.";
  }

  if ("data" in error) {
    const data = (error as { data?: unknown }).data;
    if (typeof data === "string" && data.trim()) {
      return data;
    }
    if (data && typeof data === "object" && "error" in data) {
      const apiError = (data as { error?: unknown }).error;
      if (typeof apiError === "string" && apiError.trim()) {
        return apiError;
      }
    }
  }

  return "Impossible de creer le compte admin.";
};

export function AdminRegisterPage({ onNavigate }: AdminRegisterPageProps) {
  const [register, registerState] = useAdminRegisterMutation();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    setupKey: "",
  });
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitMessage(null);
    setIsSuccess(false);

    try {
      await register({
        username: form.username.trim(),
        email: form.email.trim() || undefined,
        password: form.password,
        setupKey: form.setupKey,
      }).unwrap();

      setSubmitMessage("Compte admin cree avec succes. Vous pouvez vous connecter.");
      setIsSuccess(true);
      setForm({
        username: "",
        email: "",
        password: "",
        setupKey: "",
      });
    } catch (error) {
      setSubmitMessage(getErrorMessage(error));
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(196,0,255,0.12),_transparent_55%),radial-gradient(circle_at_top_left,_rgba(212,255,0,0.18),_transparent_45%),linear-gradient(180deg,_#ffffff_0%,_#f8f6ff_40%,_#ffffff_100%)]">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="rounded-3xl bg-white p-10 shadow-2xl">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--gbh-gray-text)]">
            Setup admin
          </p>
          <h1 className="mt-2 text-3xl text-[var(--gbh-black-soft)]">
            Inscription administrateur
          </h1>
          <p className="mt-2 text-[var(--gbh-gray-text)]">
            Cette page est reservee a la creation initiale de compte admin via setup key.
          </p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <Input
              type="text"
              placeholder="Nom utilisateur"
              value={form.username}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, username: event.target.value }))
              }
              required
            />
            <Input
              type="email"
              placeholder="Email (optionnel)"
              value={form.email}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, email: event.target.value }))
              }
            />
            <Input
              type="password"
              placeholder="Mot de passe"
              value={form.password}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, password: event.target.value }))
              }
              required
            />
            <Input
              type="password"
              placeholder="Setup key"
              value={form.setupKey}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, setupKey: event.target.value }))
              }
              required
            />

            {submitMessage && (
              <div
                className={`rounded-2xl px-4 py-3 text-sm ${
                  isSuccess
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-rose-50 text-rose-700"
                }`}
              >
                {submitMessage}
              </div>
            )}

            <Button
              type="submit"
              className="w-full rounded-full py-5"
              style={{ backgroundColor: "var(--gbh-magenta)" }}
              disabled={registerState.isLoading}
            >
              {registerState.isLoading ? "Creation..." : "Creer le compte admin"}
            </Button>
          </form>

          <div className="mt-4">
            <Button
              type="button"
              variant="outline"
              className="w-full rounded-full"
              onClick={() => onNavigate("admin")}
            >
              Aller a la connexion admin
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
