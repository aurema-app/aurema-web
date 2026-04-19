import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, OAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Idempotent: Next.js hot-reload re-runs module code; avoid duplicate app init.
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// auth is the same Firebase project as aurema-app (mobile) — invariant that
// keeps firebaseUid identical across platforms and makes RevenueCat
// entitlements cross-platform without extra setup.
export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();

// apple.com provider — only used when NEXT_PUBLIC_APPLE_SIGNIN_ENABLED === 'true'.
export const appleProvider = new OAuthProvider("apple.com");
