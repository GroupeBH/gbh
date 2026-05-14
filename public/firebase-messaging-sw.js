importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js");
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js",
);

const currentUrl = new URL(self.location.href);
const firebaseConfig = {
  apiKey: currentUrl.searchParams.get("apiKey"),
  authDomain: currentUrl.searchParams.get("authDomain"),
  projectId: currentUrl.searchParams.get("projectId"),
  storageBucket: currentUrl.searchParams.get("storageBucket"),
  messagingSenderId: currentUrl.searchParams.get("messagingSenderId"),
  appId: currentUrl.searchParams.get("appId"),
};

const hasConfig =
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.storageBucket &&
  firebaseConfig.messagingSenderId &&
  firebaseConfig.appId;

if (hasConfig) {
  firebase.initializeApp(firebaseConfig);

  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    const title = payload.notification?.title || "Nouvelle notification";
    const options = {
      body: payload.notification?.body || "",
      icon: payload.notification?.icon || "/gbh.png",
      data: payload.data || {},
    };

    self.registration.showNotification(title, options);
  });
}
