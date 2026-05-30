import { Purchases } from "@revenuecat/purchases-js";

// Call exactly once before the first RC API call — never per-page.
export const isRevenueCatEnabled = (): boolean =>
  Boolean(process.env.NEXT_PUBLIC_RC_WEB_PUBLIC_KEY);

export const configureRevenueCat = (appUserId: string): void => {
  const key = process.env.NEXT_PUBLIC_RC_WEB_PUBLIC_KEY;
  if (!key) {
    return;
  }
  Purchases.configure(key, appUserId);
};

export const getRevenueCat = (): Purchases => Purchases.getSharedInstance();
