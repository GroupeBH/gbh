This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Firebase Cloud Messaging (Push)

Cette app peut maintenant:

- demander la permission navigateur pour les notifications push;
- recuperer un token FCM web;
- conserver ce token localement dans le navigateur;
- ajouter automatiquement ce token dans `POST /api/appointments` via `deviceToken`;
- afficher les notifications FCM en background (service worker) et en foreground.

### Variables d'environnement a ajouter

Dans votre `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_VAPID_KEY=...
```

### Ou recuperer les credentials Firebase

1. Firebase Console -> `Project settings` -> `General` -> `Your apps` (Web app):
   copiez la config JavaScript (`apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`).
2. Firebase Console -> `Project settings` -> `Cloud Messaging` -> `Web Push certificates`:
   copiez la `Key pair` publique (VAPID) pour `NEXT_PUBLIC_FIREBASE_VAPID_KEY`.
3. Backend (envoi FCM server-side): Firebase Console -> `Project settings` -> `Service accounts` -> `Generate new private key`.
   utilisez ce JSON avec Firebase Admin SDK sur votre backend (ne jamais exposer cette cle au frontend).

### Contrat backend attendu

Le backend actuel attend `deviceToken` directement dans `POST /api/appointments`.
Le frontend lit le token FCM local et l'envoie seulement s'il est disponible.

```json
{
  "serviceId": "...",
  "name": "...",
  "email": "...",
  "phone": "...",
  "date": "2026-03-13",
  "time": "14:00",
  "paymentMethod": "place",
  "deviceToken": "fcm_device_token"
}
```

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
