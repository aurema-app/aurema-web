import { Purchases } from "@revenuecat/purchases-js";

// Invariant: firebaseUid === RC App User ID on every platform (web, iOS, Android).
// If this ever breaks, cross-platform entitlements silently stop working.
// Call exactly once, immediately after Firebase sign-in completes — never per-page.
// Wired in Phase 6 (paywall). Created here (Phase 5) so the import path is stable.
export const isRevenueCatEnabled = (): boolean =>
  Boolean(process.env.NEXT_PUBLIC_RC_WEB_PUBLIC_KEY);

export const configureRevenueCat = (firebaseUid: string): void => {
  const key = process.env.NEXT_PUBLIC_RC_WEB_PUBLIC_KEY;
  if (!key) {
    return;
  }
  Purchases.configure(key, firebaseUid);
};

export const getRevenueCat = (): Purchases => Purchases.getSharedInstance();
