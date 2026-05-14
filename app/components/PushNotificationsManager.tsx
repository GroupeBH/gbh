"use client";

import { useEffect, useState } from "react";
import type { MessagePayload } from "firebase/messaging";
import {
  isBrowserPushSupported,
  refreshPushToken,
  requestPushToken,
  subscribeToForegroundMessages,
  type PushPermission,
  type PushTokenResult,
} from "@/app/lib/firebase-messaging";

type SetupStatus = "idle" | "loading" | "error" | "enabled";

const toErrorMessage = (result: PushTokenResult) => {
  switch (result.reason) {
    case "missing-firebase-config":
      return "Configuration Firebase manquante. Verifiez les variables NEXT_PUBLIC_FIREBASE_*.";
    case "missing-vapid-key":
      return "La cle publique Web Push (VAPID) est manquante.";
    case "permission-not-granted":
      return "Permission de notification non accordee.";
    case "messaging-not-supported":
      return "FCM n'est pas supporte par ce navigateur.";
    case "empty-token":
      return "Firebase n'a retourne aucun token pour cet appareil.";
    case "runtime-error":
      return result.error
        ? `Erreur Firebase: ${result.error}`
        : "Erreur Firebase pendant l'activation.";
    case "unsupported-browser":
      return "Les notifications push ne sont pas supportees ici.";
    default:
      return "Impossible d'activer les notifications.";
  }
};

const showForegroundNotification = (payload: MessagePayload) => {
  if (Notification.permission !== "granted") return;

  const title = payload.notification?.title || "Nouvelle notification";
  const body = payload.notification?.body || "";
  const icon = payload.notification?.icon || "/gbh.png";
  const notification = new Notification(title, { body, icon });
  notification.onclick = () => window.focus();
};

export function PushNotificationsManager() {
  const [status, setStatus] = useState<SetupStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const permission: PushPermission = isBrowserPushSupported()
    ? Notification.permission
    : "unsupported";

  const enableNotifications = async () => {
    setStatus("loading");
    setErrorMessage("");

    const result = await requestPushToken();

    if (!result.token) {
      setStatus("error");
      setErrorMessage(toErrorMessage(result));
      return;
    }

    setStatus("enabled");
    setErrorMessage("");
  };

  useEffect(() => {
    if (permission !== "granted" || status !== "idle") return;

    let active = true;

    const syncToken = async () => {
      setStatus("loading");
      const result = await refreshPushToken();
      if (!active) return;

      if (!result.token) {
        setStatus("error");
        setErrorMessage(toErrorMessage(result));
        return;
      }

      if (!active) return;
      setStatus("enabled");
      setErrorMessage("");
    };

    void syncToken();

    return () => {
      active = false;
    };
  }, [permission, status]);

  useEffect(() => {
    if (permission !== "granted") return;

    let unsubscribe: (() => void) | null = null;

    const startListener = async () => {
      unsubscribe = await subscribeToForegroundMessages(showForegroundNotification);
    };

    void startListener();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [permission]);

  if (permission === "unsupported") return null;
  if (status === "enabled") return null;

  return (
    <aside className="fixed bottom-4 right-4 z-50 w-[min(360px,calc(100vw-2rem))] rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur">
      <p className="text-sm font-semibold text-slate-900">Notifications push</p>
      <p className="mt-1 text-xs text-slate-600">
        {permission === "denied"
          ? "Le navigateur bloque les notifications. Autorisez-les dans les parametres du site."
          : "Activez FCM pour recevoir les alertes envoyees par le backend."}
      </p>

      {errorMessage ? <p className="mt-2 text-xs text-red-600">{errorMessage}</p> : null}

      {permission !== "denied" ? (
        <button
          type="button"
          onClick={() => {
            void enableNotifications();
          }}
          disabled={status === "loading"}
          className="mt-3 inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "loading"
            ? "Activation..."
            : permission === "granted"
              ? "Synchroniser le token"
              : "Activer les notifications"}
        </button>
      ) : null}
    </aside>
  );
}
