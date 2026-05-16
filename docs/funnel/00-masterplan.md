# Aurema Web Funnel — Masterplan

> Living document. Update after each phase. Agents: read this + `PROGRESS.md` at the start of every session.

## Goal

Ship a lightweight growth-plan funnel at `aurema-app.com/growth-plan` that drives new users through ~8 personalization steps into a RevenueCat-powered paywall, creating a Firebase account along the way and starting a subscription.

## Stack summary

| Concern | Choice |
|--------|--------|
| Host app | `aurema-web` (Next 15, React 19) |
| Funnel UI | Chakra UI v3, scoped to `(funnel)` route group |
| Marketing UI | Tailwind v4 + framer-motion (unchanged) |
| Auth | Firebase Auth — Google, Apple, **email-link (passwordless)**. No email/password. |
| Payments | RevenueCat Web Billing via `@revenuecat/purchases-js` (Stripe inside) |
| Experiments | Amplitude Experiment, client-side, flags-only |
| Analytics | Amplitude events |
| Lead capture | Firestore (`funnel_leads` collection) — no ESP in MVP |
| Backend | `aurema-backend` — existing RC webhook handles web + mobile |

## Architecture at a glance

See `01-architecture.md` for detail. Key invariants:

1. **App User ID == Firebase UID** everywhere (web, iOS, Android).
2. **No Stripe SDK in our code.** RC owns that.
3. **Chakra only inside `(funnel)`.** Marketing stays Tailwind.

## Phase roadmap

| Phase | Title | Ships |
|-------|-------|-------|
| 0 | Agent scaffolding | Rules, skills, docs (this directory) |
| 1 | Funnel shell | Chakra provider + `/growth-plan` route group + placeholder step |
| 2 | Step engine + primitives | `FunnelContext`, `flow.ts`, 3–5 real steps |
| 3 | Generate + plan preview | Loading animation + static plan preview |
| 4 | Account capture | Email → Firestore `funnel_leads`; Firebase sign-in (Google / Apple / email-link) + `/growth-plan/verify` handler |
| 5 | RevenueCat Web Billing config | Dashboard config + webhook `subscriptionSource` field |
| 6 | Paywall | `purchases-js` embedded checkout + activate page |
| 7 | Experiments | Amplitude Experiment client + `useVariant` + 1 reference experiment |
| 8 | Analytics + polish | Typed `track()`, events, loading/error states, mobile pass |
| 9 | QA + deploy | QA checklist, RC sandbox runbook, production deploy |

Each phase is a standalone unit of work. Prefer one phase per agent session.

## Non-goals

- No monorepo.
- No SSR experiments.
- No direct Stripe SDK.
- No attribution.
- No multi-paywall.
- No email/password auth (passwordless only).
- No Admin-SDK `createUser` + custom-token mid-funnel (enumeration risk — see `05-auth.md`).
- No Playwright in phase 0 (reconsider after phase 8).

## Open decisions

Tracked in `PROGRESS.md` under "Open questions".
