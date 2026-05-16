# PROGRESS

Single source of truth for where we are. Agents: update this at the end of every session.

## Current phase

**Lexi Funnel Rebrand — COMPLETE (2026-05-16)**

## Phase checklist

- [x] **Phase 0** — Agent scaffolding (rules + skills + docs)
- [x] **Phase 1** — Funnel shell (Chakra, route group, placeholder step)
- [x] **Phase 2** — Step engine + primitives
- [x] **Phase 3** — Generate + plan preview
- [x] **Phase 4** — Account capture (Firestore `funnel_leads` + Firebase Auth)
- [ ] **Phase 5** — RevenueCat Web Billing config _(code done; RC dashboard + backend pending)_
- [ ] **Phase 6** — Paywall _(code done; end-to-end test requires RC dashboard config)_
- [x] **Phase 7** — Experiments (Amplitude Experiment, 1 reference — INTRO_HERO)
- [x] **Phase 8** — Analytics + polish
- [ ] **Phase 9** — QA + deploy

## Open questions (decide before phase lands)

| Phase | Question                                                                    | Decision                                                                                                                                                                                                                                                         | Decided on |
| ----- | --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| 1     | Chakra v2 vs v3?                                                            | v3 (React 19 support)                                                                                                                                                                                                                                            | 2026-04-19 |
| 4     | Auth model for the funnel.                                                  | Google, Apple, **email-link (passwordless)**. No email/password. Admin-SDK + custom-token approach rejected for enumeration risk.                                                                                                                                | 2026-04-19 |
| 4     | Email-link deep-linking replacement for Dynamic Links (sunset 25 Aug 2025)? | **Deferred to Phase 9 QA.** Shipped without `linkDomain` — email links land in the browser at `/growth-plan/verify`. Mobile deep-linking requires choosing Firebase Hosting `linkDomain` vs. native Universal/App Links; mobile-side work lives in `aurema-app`. | —          |
| 4     | Apple Sign-In on web enabled at launch?                                     | **Deferred.** Button hidden (`NEXT_PUBLIC_APPLE_SIGNIN_ENABLED=false`). Requires Apple Developer Services ID, domain + return URL, and .p8 key in Firebase Console → Auth → Apple. See `docs/funnel/05-auth.md`.                                                 | —          |
| 5     | Same entitlement ID as mobile? Verify with user.                            | **open — must confirm before Phase 6**                                                                                                                                                                                                                           | —          |
| 6     | Fallback if RC embed styling is limiting?                                   | `presentPaywall()` with themed RC-hosted paywall                                                                                                                                                                                                                 | 2026-04-19 |
| 7     | Which first experiment to run?                                              | open — candidate: intro hero                                                                                                                                                                                                                                     | —          |

## Releases

- `@chakra-ui/react` 3.34.0 pinned (2026-04-19)
- `@emotion/react` 11.14.0 pinned (2026-04-19)
- `next-themes` 0.4.6 pinned (2026-04-19)
- `@revenuecat/purchases-js` 1.41.0 installed (2026-05-16)
- `@amplitude/analytics-browser` 2.42.3 installed (2026-05-16)
- `@amplitude/experiment-js-client` 1.21.1 installed (2026-05-16)

## Notes / gotchas encountered

- Chakra v3 uses `createSystem(defaultConfig, defineConfig({...}))` + `<ChakraProvider value={system}>` — completely different API from v2's `extendTheme` + `<ChakraProvider theme={...}>`. Do not copy web-funnel reference verbatim.
- `next-themes` installed alongside Chakra v3 for future dark mode support if needed; not wired in yet.
- Lockfile warning (`Found multiple lockfiles`) is benign — caused by a parent-directory `package-lock.json` unrelated to this repo.
- **Phase 2 (2026-04-19)**: `flow.ts` does NOT store component refs to avoid a circular-import cycle (`flow → steps → useFunnelNavigation → flow`). The component map lives in `[stepId]/page.tsx` instead. This is a clean and intentional deviation from the plan's type signature.
- `ANSWERS_STORAGE_KEY = 'aurema.funnel.answers.v1'` exported from `types.ts` and used by both `FunnelContext.tsx` and any future migration code.
- Analytics stub is a `console.debug` in dev only; Phase 8 swaps in the real Amplitude call.
- 5 steps shipped: `intro`, `goal`, `age`, `current-state`, `frequency`.
- **Phase 3 (2026-04-19)**: `AutoLoadingBar` primitive added to `src/funnel/components/`. `GeneratingPlanStep` auto-advances after ~4s with rotating reassurance copy. `PlanPreviewStep` derives a templated summary from all current answers (goal, frequency, currentState, ageRange). `PaywallStep` is a placeholder stub for Phase 6. Flow extended to 8 steps: `…frequency → generating → plan-preview → paywall`. CTA on plan-preview navigates to `/growth-plan/paywall`.
- **Phase 5 (2026-05-16)**: `@revenuecat/purchases-js` 1.41.0 installed. `src/funnel/services/revenueCatClient.ts` created — exports `configureRevenueCat(firebaseUid)` and `getRevenueCat()`. Guards missing `NEXT_PUBLIC_RC_WEB_PUBLIC_KEY` with a warning rather than a throw. `.env.example` created with every `NEXT_PUBLIC_*` and server-only var documented (Firebase, RC, Amplitude, Brevo, backend URL). Firebase `firebaseClient.ts` patched to not throw at module-load time when env vars are absent (uses `?? 'not-configured'` fallbacks — auth calls still fail with a clear error). RC dashboard config, products/offerings, and `aurema-backend` webhook extension (`subscriptionSource`) are **user action items** — see dashboard checklist below. Phase 5 is complete on the code side; mark the checkbox after the RC dashboard is configured and the backend is updated.

  **Phase 5 dashboard checklist** (do in RevenueCat):
  - [ ] Connect Stripe account: RC → Account Settings → Integrations → Stripe
  - [ ] Create "Aurema Web" app: RC → Apps & Providers → Add App → Web Billing, point at the Stripe account
  - [ ] Verify entitlement ID matches mobile (e.g. `pro`) — same ID is required for cross-platform entitlements
  - [ ] Create web products in RC/Stripe matching mobile SKUs (`aurema_monthly`, `aurema_yearly` if applicable)
  - [ ] Create `default` offering with `monthly` + `annual` packages
  - [ ] Generate Web Billing **public** API key → copy into `.env.local` as `NEXT_PUBLIC_RC_WEB_PUBLIC_KEY`
  - [ ] Confirm existing RC webhook URL is still configured and reachable from `aurema-backend`

  **Phase 5 backend checklist** (in `aurema-backend`):
  - [ ] `webhookController.js` — on `INITIAL_PURCHASE` / `RENEWAL`, set `subscriptionSource: event.store === 'STRIPE' ? 'web' : 'mobile'` on the user doc
  - [ ] Unit test: feed sample RC webhook payload `store: 'STRIPE'` → assert `subscriptionStatus: 'active'`, `subscriptionSource: 'web'`
  - [ ] JSDoc on the webhook handler documenting the "App User ID == Firebase UID" invariant

- **Phases 7 + 8 (2026-05-16)**: Amplitude analytics fully wired. `amplitudeClient.ts` — singleton init with `flushIntervalMillis: 0` (events sent immediately so `step_exit` isn't lost on navigation). `track.ts` — typed wrapper with closed `EVENTS` const (no string literals anywhere else). `StepShell` — fires `step_view` with `step_index`, `total_steps`, `funnel_progress_pct`; fires `step_exit` with `time_spent_ms` + `time_spent_s` on unmount. `AmplitudeBootstrap` component in `providers.tsx` — initialises Amplitude + experiment client once, keeps user identity + all answer properties (`goal`, `age_range`, `current_state`, `frequency`, `email_captured`, `signed_in`) in sync via `identify`. Every answer step also calls `setAmplitudeUserProperties` at pick time. Sign-in events: `sign_in_started` on button click, `sign_in_completed` with method + user id set, `sign_in_failed` with error. Purchase events: `paywall_viewed`, `purchase_started`, `purchase_completed` (sets `plan_type` + `subscribed` user props), `purchase_failed`. Post-purchase: `subscription_activated` (method: backend\_poll|rc\_fallback), `subscription_pending`. Experiment: `amplitudeExperimentClient.ts` singleton with `automaticExposureTracking: true`; `useVariant` hook polls for client readiness, returns `defaultVariant` on first render. `INTRO_HERO` experiment: `IntroControl.tsx` (existing copy) vs `IntroVariantA.tsx` (outcome-focused "Build the mind you want." copy). `IntroStep.tsx` delegates to variant component via `useVariant`. Experiment registered in `04-experiments.md`.

- **Phase 6 (2026-05-16)**: Paywall and activate pages built. `src/app/(funnel)/growth-plan/paywall/page.tsx` — fetches offerings from RC, renders monthly/annual package selector cards, calls `purchases.purchase({rcPackage, htmlTarget, customerEmail, metadata})`, shows inline error on failure. `src/app/(funnel)/growth-plan/activate/page.tsx` — polls `/api/user` every 500ms for 10s, falls back to `purchases.getCustomerInfo()` if backend unreachable/timeout, shows success (App Store + Play Store CTAs) or soft-pending state. `src/app/api/user/route.ts` — thin Next.js proxy to `aurema-backend` with 3s timeout. `src/funnel/components/GrowthPlanPolicy.tsx` — shared T&Cs/privacy link block. `configureRevenueCat` wired into `SignInStep` (Google + Apple) and `verify/page.tsx` (email-link). `PaywallStep.tsx` updated to redirect to `/growth-plan/paywall` since the dedicated page takes precedence. **Entitlement ID hardcoded as `'pro'`** — must be confirmed against mobile before marking Phase 5/6 complete. App Store / Play Store URLs in `activate/page.tsx` are placeholders (`id000000000`) — update before launch.

- **Lexi Funnel Rebrand (2026-05-16)**: Complete visual and copy overhaul of the growth-plan funnel. Lexi is the new mascot (situationship advisor — "Zero patience. Big heart."). Color system updated: `#FF7DBA` pink primary, `#C7A6F7` lavender secondary, `#FAFAFF` bg.canvas, charcoal text. New 13-screen flow: `landing → social-proof → peace-breaker → overthinking → digital-anxiety → friend-group → projection → reinforcement → pattern-detected → evidence → analyzing → teaser → email → sign-in → paywall`. All 6 quiz steps (3–8) use a shared `QuizStep` template component with `feedbackRules` + `autoAdvance` props. `AnalyzingStep` fires a real POST to `/api/lexi/analyze` (gpt-4o-mini, graceful fallback when `OPENAI_API_KEY` unset). `TeaserStep` displays the extracted phrase + pattern. `PatternDetectedStep` (Screen 9) shows animated progress bars as a "scan detected" illusion. `EvidenceStep` (Screen 10) has text area, quick-chip excuses, and file upload option. Landing screen shows the Lexi hero.png image prominently. Mascot represented with emoji avatars (`LexiAvatar`) across all other screens. `FunnelAnswers` storage key bumped to `v2` (old `v1` cache auto-discarded). Old Aurema step files deleted (GoalStep, AgeStep, CurrentStateStep, FrequencyStep, GeneratingPlanStep, PlanPreviewStep, IntroStep, intro/ dir). `providers.tsx` updated to sync new Lexi answer keys as Amplitude user properties. Pre-existing Chakra v3 `Button/Text as="a"` errors in `activate/page.tsx` and `GrowthPlanPolicy.tsx` fixed using Next.js `<Link>`. `OPENAI_API_KEY` added to `.env.example`. Zero TypeScript errors.

- **Phase 4 (2026-04-19)**: Firebase Auth wired (Google, Apple-flagged, email-link passwordless). `aurema-backend` gains `POST /api/funnel/leads` (Firestore `funnel_leads` collection, auto-id, inline rate-limiter, no new deps). Frontend: `firebaseClient.ts`, `leadsClient.ts`, `authActionCode.ts` (no `linkDomain` — deferred), `useFirebaseUser.ts` hook, `EmailStep`, `SignInStep` (with 30s resend throttle + Google/Apple fallbacks in "Check your email" view), `/growth-plan/verify` page (same-device + different-device cases). Flow extended to 10 steps: `…plan-preview → email → sign-in → paywall` with `when` predicates skipping already-captured/signed-in users. `PlanPreviewStep` now uses `goNext()` so predicates route correctly. `NEXT_PUBLIC_APPLE_SIGNIN_ENABLED=false` gates Apple button. Backend controller unit test deferred — follow-up. CORS: production aurema-web host not yet in allow-list (flag for deploy).

## Next session — suggested start

**Phase 9: QA + deploy.** Before starting:

1. Fill in `.env.local` from `.env.example` — Firebase, RC, Amplitude, backend URL, `OPENAI_API_KEY` (optional for Lexi LLM).
2. RC dashboard: complete the Phase 5 dashboard checklist.
3. Backend: update `webhookController.js` with `subscriptionSource` + unit test.
4. Confirm entitlement ID is `'pro'` (or update `ENTITLEMENT_ID` in `activate/page.tsx`).
5. Update App Store / Play Store URLs in `activate/page.tsx` (placeholder `id000000000`).
6. Create Amplitude project → `NEXT_PUBLIC_AMPLITUDE_API_KEY`.
7. Create Amplitude Experiment deployment → `NEXT_PUBLIC_AMPLITUDE_DEPLOYMENT_KEY`.
8. Create flag `funnel-intro-hero` in Amplitude Experiment, variants `control` / `variant-a`.
9. Add `localhost` + `aurema-app.com` to Firebase Console → Auth → Authorized domains.
10. Full sandbox run: Stripe test card `4242 4242 4242 4242` → confirm activate page + Amplitude events.
11. Lexi hero.png and sheet.png are in `public/lexi/` — confirm they load in production (Next.js Image optimization, no CDN auth needed).

## Prompt template for phases

```
Read docs/funnel/PROGRESS.md and docs/funnel/00-masterplan.md.
Execute Phase N: <phase title>.

Follow the rules in .cursor/rules/ and the skills in .cursor/skills/.
When done, update docs/funnel/PROGRESS.md (check the box, add notes,
set the next-session hint).
```

For phases 2, 3, 7, 8 explicitly add: _"Consult web-funnel per `.cursor/rules/references.mdc` for primitive patterns."_
