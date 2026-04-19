# PROGRESS

Single source of truth for where we are. Agents: update this at the end of every session.

## Current phase

**Phase 3 — Generate + plan preview — COMPLETE (2026-04-19)**

## Phase checklist

- [x] **Phase 0** — Agent scaffolding (rules + skills + docs)
- [x] **Phase 1** — Funnel shell (Chakra, route group, placeholder step)
- [x] **Phase 2** — Step engine + primitives
- [x] **Phase 3** — Generate + plan preview
- [ ] **Phase 4** — Account capture (Firestore `funnel_leads` + Firebase Auth)
- [ ] **Phase 5** — RevenueCat Web Billing config
- [ ] **Phase 6** — Paywall (purchases-js embedded)
- [ ] **Phase 7** — Experiments (Amplitude Experiment, 1 reference)
- [ ] **Phase 8** — Analytics + polish
- [ ] **Phase 9** — QA + deploy

## Open questions (decide before phase lands)

| Phase | Question | Decision | Decided on |
|-------|----------|----------|------------|
| 1 | Chakra v2 vs v3? | v3 (React 19 support) | 2026-04-19 |
| 4 | Auth model for the funnel. | Google, Apple, **email-link (passwordless)**. No email/password. Admin-SDK + custom-token approach rejected for enumeration risk. | 2026-04-19 |
| 4 | Email-link deep-linking replacement for Dynamic Links (sunset 25 Aug 2025)? | open — choose between Firebase Hosting `linkDomain` (e.g. `links.aurema-app.com`) vs. native iOS Universal Links + Android App Links on `aurema-app.com`. Decide during phase 4; the mobile-side work lives in `aurema-app`. | — |
| 4 | Apple Sign-In on web enabled at launch? | open — gated by `NEXT_PUBLIC_APPLE_SIGNIN_ENABLED`; button hidden until Services ID + .p8 key are configured. | — |
| 5 | Same entitlement ID as mobile? Verify with user. | open | — |
| 6 | Fallback if RC embed styling is limiting? | `presentPaywall()` with themed RC-hosted paywall | 2026-04-19 |
| 7 | Which first experiment to run? | open — candidate: intro hero | — |

## Releases

- `@chakra-ui/react` 3.34.0 pinned (2026-04-19)
- `@emotion/react` 11.14.0 pinned (2026-04-19)
- `next-themes` 0.4.6 pinned (2026-04-19)

## Notes / gotchas encountered

- Chakra v3 uses `createSystem(defaultConfig, defineConfig({...}))` + `<ChakraProvider value={system}>` — completely different API from v2's `extendTheme` + `<ChakraProvider theme={...}>`. Do not copy web-funnel reference verbatim.
- `next-themes` installed alongside Chakra v3 for future dark mode support if needed; not wired in yet.
- Lockfile warning (`Found multiple lockfiles`) is benign — caused by a parent-directory `package-lock.json` unrelated to this repo.
- **Phase 2 (2026-04-19)**: `flow.ts` does NOT store component refs to avoid a circular-import cycle (`flow → steps → useFunnelNavigation → flow`). The component map lives in `[stepId]/page.tsx` instead. This is a clean and intentional deviation from the plan's type signature.
- `ANSWERS_STORAGE_KEY = 'aurema.funnel.answers.v1'` exported from `types.ts` and used by both `FunnelContext.tsx` and any future migration code.
- Analytics stub is a `console.debug` in dev only; Phase 8 swaps in the real Amplitude call.
- 5 steps shipped: `intro`, `goal`, `age`, `current-state`, `frequency`.
- **Phase 3 (2026-04-19)**: `AutoLoadingBar` primitive added to `src/funnel/components/`. `GeneratingPlanStep` auto-advances after ~4s with rotating reassurance copy. `PlanPreviewStep` derives a templated summary from all current answers (goal, frequency, currentState, ageRange). `PaywallStep` is a placeholder stub for Phase 6. Flow extended to 8 steps: `…frequency → generating → plan-preview → paywall`. CTA on plan-preview navigates to `/growth-plan/paywall`.

## Next session — suggested start

Phase 4: Account capture (Firestore `funnel_leads` + Firebase Auth — email-link passwordless).

Auth model locked in: **Google, Apple, email-link (passwordless)**. No email/password. See `docs/funnel/05-auth.md` for the full rationale.

1. Add `{ id: 'email' }` and `{ id: 'sign-in' }` between `plan-preview` and `paywall` in `flow.ts` (with `when` gates so already-authenticated users skip them).
2. In `aurema-backend`, add a `POST /api/funnel/leads` route that writes `{ email, source: 'growth-plan', capturedAt, funnelVariant? }` into a new Firestore `funnel_leads` collection (no auth required; rate-limit lightly).
3. Build `EmailStep.tsx` — captures `userEmail`, calls the new backend route via `src/funnel/services/leadsClient.ts`, stores in `FunnelAnswers`. Non-blocking on backend errors.
4. Build `src/funnel/services/firebaseClient.ts` — initializes the Firebase Web SDK with `NEXT_PUBLIC_FIREBASE_*` env vars, same project as mobile.
5. Build `SignInStep.tsx` with three paths:
   - Google OAuth (`signInWithPopup(GoogleAuthProvider)`)
   - Apple OAuth (`signInWithPopup(OAuthProvider('apple.com'))`), only rendered when `NEXT_PUBLIC_APPLE_SIGNIN_ENABLED === 'true'`
   - Email-link (`sendSignInLinkToEmail(auth, email, actionCodeSettings)`) — use the email from step 8, show "Check your email" screen with resend button
6. Build `/growth-plan/verify/page.tsx` — runs `signInWithEmailLink`, hydrates the funnel state from localStorage, stores `firebaseUid`, routes to the paywall.
7. Add `NEXT_PUBLIC_FIREBASE_*`, `NEXT_PUBLIC_APPLE_SIGNIN_ENABLED`, and the `linkDomain` value (once decided) to `.env.example`.
8. Decide the Dynamic-Links replacement path (open question above) and implement the correct `actionCodeSettings.linkDomain` accordingly. If choosing native Universal Links / App Links, note the mobile-side work for later and ship web without `linkDomain` for now — emails will still work, they'll just land in a browser first.
9. Whitelist dev + prod hosts in Firebase Console → Auth → Settings → Authorized domains.

## Prompt template for phases

```
Read docs/funnel/PROGRESS.md and docs/funnel/00-masterplan.md.
Execute Phase N: <phase title>.

Follow the rules in .cursor/rules/ and the skills in .cursor/skills/.
When done, update docs/funnel/PROGRESS.md (check the box, add notes,
set the next-session hint).
```

For phases 2, 3, 7, 8 explicitly add: *"Consult web-funnel per `.cursor/rules/references.mdc` for primitive patterns."*
