"use client";

import {
  type FirebaseApp,
  getApp,
  getApps,
  initializeApp,
} from "firebase/app";
import {
  getMessaging,
  getToken,
  isSupported,
  onMessage,
  type MessagePayload,
  type Messaging,
} from "firebase/messaging";

type FirebaseWebConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
};

export const FCM_TOKEN_STORAGE_KEY = "gbh:fcm:web-token";

export type PushPermission = NotificationPermission | "unsupported";

export type PushTokenResult = {
  permission: PushPermission;
  token: string | null;
  reason?:
    | "unsupported-browser"
    | "missing-firebase-config"
    | "missing-vapid-key"
    | "permission-not-granted"
    | "messaging-not-supported"
    | "empty-token"
    | "runtime-error";
  error?: string;
};

const cleanEnv = (value: string | undefined) => value?.trim() || "";

const hasLocalStorage = () =>
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

export const getCachedPushToken = () => {
  if (!hasLocalStorage()) return "";
  return window.localStorage.getItem(FCM_TOKEN_STORAGE_KEY)?.trim() || "";
};

export const cachePushToken = (token: string) => {
  const cleanedToken = token.trim();
  if (!cleanedToken || !hasLocalStorage()) return;
  window.localStorage.setItem(FCM_TOKEN_STORAGE_KEY, cleanedToken);
};

const readFirebaseConfig = (): FirebaseWebConfig | null => {
  const config: FirebaseWebConfig = {
    apiKey: cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
    authDomain: cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN),
    projectId: cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
    storageBucket: cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET),
    messagingSenderId: cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID),
    appId: cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_APP_ID),
  };

  if (
    !config.apiKey ||
    !config.authDomain ||
    !config.projectId ||
    !config.storageBucket ||
    !config.messagingSenderId ||
    !config.appId
  ) {
    return null;
  }

  return config;
};

const readVapidKey = () => cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY);

const buildServiceWorkerUrl = (config: FirebaseWebConfig) => {
  const search = new URLSearchParams({
    apiKey: config.apiKey,
    authDomain: config.authDomain,
    projectId: config.projectId,
    storageBucket: config.storageBucket,
    messagingSenderId: config.messagingSenderId,
    appId: config.appId,
  });

  return `/firebase-messaging-sw.js?${search.toString()}`;
};

const getFirebaseApp = (config: FirebaseWebConfig): FirebaseApp => {
  return getApps().length > 0 ? getApp() : initializeApp(config);
};

export const isBrowserPushSupported = () =>
  typeof window !== "undefined" &&
  typeof navigator !== "undefined" &&
  "Notification" in window &&
  "serviceWorker" in navigator;

let messagingPromise: Promise<Messaging | null> | null = null;

const getMessagingClient = async (config: FirebaseWebConfig): Promise<Messaging | null> => {
  if (!isBrowserPushSupported()) {
    return null;
  }

  if (!messagingPromise) {
    messagingPromise = (async () => {
      const supported = await isSupported();
      if (!supported) return null;
      const app = getFirebaseApp(config);
      return getMessaging(app);
    })();
  }

  return messagingPromise;
};

const resolvePermission = async (
  requestPermission: boolean,
): Promise<NotificationPermission> => {
  if (requestPermission) {
    return Notification.requestPermission();
  }
  return Notification.permission;
};

const readPushToken = async (requestPermission: boolean): Promise<PushTokenResult> => {
  if (!isBrowserPushSupported()) {
    return { permission: "unsupported", token: null, reason: "unsupported-browser" };
  }

  const config = readFirebaseConfig();
  if (!config) {
    return {
      permission: Notification.permission,
      token: null,
      reason: "missing-firebase-config",
    };
  }

  const vapidKey = readVapidKey();
  if (!vapidKey) {
    return {
      permission: Notification.permission,
      token: null,
      reason: "missing-vapid-key",
    };
  }

  try {
    const permission = await resolvePermission(requestPermission);
    if (permission !== "granted") {
      return { permission, token: null, reason: "permission-not-granted" };
    }

    const messaging = await getMessagingClient(config);
    if (!messaging) {
      return { permission, token: null, reason: "messaging-not-supported" };
    }

    const registration = await navigator.serviceWorker.register(
      buildServiceWorkerUrl(config),
    );

    const token = await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration: registration,
    });

    if (!token) {
      return { permission, token: null, reason: "empty-token" };
    }

    cachePushToken(token);

    return { permission, token };
  } catch (error) {
    return {
      permission: Notification.permission,
      token: null,
      reason: "runtime-error",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const requestPushToken = () => readPushToken(true);

export const refreshPushToken = () => readPushToken(false);

export const getPushTokenIfAvailable = async () => {
  const cachedToken = getCachedPushToken();
  if (cachedToken) return cachedToken;

  const result = await refreshPushToken();
  return result.token || "";
};

export const subscribeToForegroundMessages = async (
  handler: (payload: MessagePayload) => void,
) => {
  const config = readFirebaseConfig();
  if (!config) return null;

  const messaging = await getMessagingClient(config);
  if (!messaging) return null;

  return onMessage(messaging, handler);
};
