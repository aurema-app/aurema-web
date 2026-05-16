# 03 — Payments (RevenueCat Web Billing)

## Why RevenueCat, not Stripe directly

- Mobile (aurema-app) already uses RevenueCat. Adding a second billing source would create reconciliation nightmares.
- RC Web Billing uses Stripe as the gateway, so we still get Stripe's payment UX.
- The **same** RC webhook our backend already handles (`aurema-backend/src/controllers/webhookController.js`) fires for web purchases.
- Entitlements are unified: purchase on web → active on mobile, and vice versa.

## The invariant

```
Firebase UID == App User ID (everywhere: iOS, Android, Web)
```

If this ever breaks, cross-platform entitlements silently stop working. The webhook unit test added in phase 5 must guard this.

## Config checklist (phase 5)

- [ ] RevenueCat → Account Settings → connect Stripe account
- [ ] Apps & Providers → create "Aurema Web" app with a Web Billing config pointed at the Stripe account
- [ ] Entitlement `pro` (or whatever mobile uses) — make sure it's the **same** entitlement ID as mobile
- [ ] Create web products in Stripe (or in RC) matching the mobile SKUs:
  - `aurema_monthly`
  - `aurema_yearly` (if mobile offers it)
- [ ] Offering: `default` with `monthly` + `annual` packages
- [ ] Generate Web Billing **public** API key → put in `NEXT_PUBLIC_RC_WEB_PUBLIC_KEY`
- [ ] Verify the existing RC webhook URL is still configured and reachable

## Client code

See `src/funnel/services/revenueCatClient.ts` (created in Phase 5).

```ts
import {
  configureRevenueCat,
  getRevenueCat,
} from "@/funnel/services/revenueCatClient";
```

`configureRevenueCat(firebaseUid)` calls `Purchases.configure(NEXT_PUBLIC_RC_WEB_PUBLIC_KEY, firebaseUid)` and guards missing env vars with a warning. Call exactly once, right after Firebase sign-in completes. Never per-page. **Wired in Phase 6.**

## Paywall flow

```ts
const purchases = Purchases.getSharedInstance();
const offerings = await purchases.getOfferings();
const pkg =
  offerings.current?.monthly ?? offerings.current?.availablePackages[0];
if (!pkg) throw new Error("No offering configured");

const result = await purchases.purchase({
  rcPackage: pkg,
  htmlTarget: containerRef.current,
  customerEmail: answers.userEmail,
  metadata: { source: "growth-plan", variant: currentVariant },
});

router.push("/growth-plan/activate");
```

## Activate page

Race condition: the webhook may not have hit Firestore before the user lands here.

```ts
const maxMs = 10_000;
const start = Date.now();
while (Date.now() - start < maxMs) {
  const user = await fetch("/api/user").then((r) => r.json());
  if (user.subscriptionStatus === "active") return renderSuccess();
  await sleep(500);
}

const info = await purchases.getCustomerInfo();
if (info.entitlements.active["pro"]) return renderSuccess();

renderPendingState();
```

## Backend additions

Minimal. In `aurema-backend`:

- Extend the webhook handler to set `subscriptionSource: event.store === 'STRIPE' ? 'web' : 'mobile'`.
- Unit test: feed a sample `INITIAL_PURCHASE` with `store: 'STRIPE'` and assert the user doc updates correctly.

No Stripe SDK. No new routes.

## Testing runbook (draft — finalize in phase 9)

- Enable **sandbox mode** in RC dashboard.
- Use Stripe test card `4242 4242 4242 4242`, any future expiry, any CVC.
- For 3DS, use `4000 0025 0000 3155`.
- For declined, use `4000 0000 0000 9995`.
- Check `/api/user` shows `subscriptionStatus: 'active'` within ~5s of successful checkout.
- Check RevenueCat dashboard → Customers → find by Firebase UID.

## FAQ

**Q: Can a user buy without signing in?**
No. Paywall is behind `SignInStep`. Anonymous RC flow is deferred (see `PROGRESS.md`).

**Q: What if the webhook never fires?**
Fall back to `purchases.getCustomerInfo()` on `/activate` — RC is authoritative. Then log a webhook-missing alert for manual follow-up.

**Q: How do we refund?**
Via RevenueCat dashboard → Customer → Issue refund. RC handles the Stripe refund + fires a cancellation event to our webhook.
