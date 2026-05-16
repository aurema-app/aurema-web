# Phase Prompts

Copy-paste prompts for each phase. Run one per agent session. Start with Plan mode for non-trivial phases, review the proposed plan, then switch to Agent mode.

At the end of every session the agent should update [PROGRESS.md](./PROGRESS.md): tick the phase box, add notes under "Notes / gotchas encountered", and rewrite the "Next session — suggested start" block.

---

## Phase 2 — Step engine + primitives

```
Read docs/funnel/PROGRESS.md, docs/funnel/01-architecture.md, and
docs/funnel/02-steps.md. Execute Phase 2.

Deliverables:
- src/funnel/state/types.ts with FunnelAnswers type
- src/funnel/state/FunnelContext.tsx with provider + useFunnelAnswers hook,
  persisted to localStorage under aurema.funnel.answers.v1
- src/funnel/flow/flow.ts with the ordered step array and FunnelStep type
- src/funnel/flow/useFunnelNavigation.ts with goNext() / goPrev() that
  respects `when` predicates
- src/funnel/components/ primitives: StepShell (fires step_view), OptionText,
  OptionWithImage, ContinueButton, ProgressBar, FunnelHeader
- src/app/(funnel)/growth-plan/[stepId]/page.tsx that resolves the step
  from the flow array
- 3–5 real steps wired end-to-end: goal, age, current-state, frequency
  (see 02-steps.md inventory)

Constraints:
- Follow .cursor/rules/funnel-architecture.mdc for the step pattern
- Chakra v3 only inside (funnel); no Tailwind inside funnel components
- No index.ts barrels in src/funnel/**
- Answers persist across reload

Verify:
- /growth-plan redirects to the first step
- Clicking an option advances to the next step
- Reloading mid-funnel keeps the answers
- / (marketing) still looks identical

Run prettier on touched files when done. Update PROGRESS.md.

Reference implementations (adapt, do not copy — see
.cursor/rules/references.mdc for stack differences):
- /Users/senolfratila/work/web-funnel/packages/ui/src/growth-plan/OptionText.tsx
- /Users/senolfratila/work/web-funnel/packages/ui/src/growth-plan/OptionTextWithImage.tsx
- /Users/senolfratila/work/web-funnel/packages/ui/src/growth-plan/ProgressBar.tsx
- /Users/senolfratila/work/web-funnel/apps/deepstash/src/growth-plan/steps/baseline/StepsBaseline.tsx
```

---

## Phase 3 — Generate + plan preview

```
Read docs/funnel/PROGRESS.md and docs/funnel/02-steps.md. Execute Phase 3.

Deliverables:
- src/funnel/components/AutoLoadingBar.tsx — fills over a configurable
  duration, fires onComplete
- src/funnel/steps/GeneratingPlanStep.tsx — shows AutoLoadingBar + rotating
  reassurance copy, auto-advances on complete
- src/funnel/steps/PlanPreviewStep.tsx — static personalized summary derived
  from current answers, CTA button that navigates to /growth-plan/paywall
- Register both steps in flow.ts in the right order (after frequency,
  before email/sign-in/paywall)

Constraints:
- Use Chakra v3 + theme tokens from src/funnel/theme/chakraTheme.ts
- No real plan generation yet — the "summary" is a templated string using
  answers (e.g. "A {frequency} plan for {goal}")
- Respect .cursor/rules/funnel-architecture.mdc and chakra-usage.mdc

Verify:
- Generating step shows for ~4s then auto-advances
- Plan preview reflects answers from earlier steps
- CTA navigates to /growth-plan/paywall (placeholder route is fine — real
  paywall lands in Phase 6)

Run prettier. Update PROGRESS.md.

Reference implementations (adapt — see .cursor/rules/references.mdc):
- /Users/senolfratila/work/web-funnel/packages/ui/src/growth-plan/AutoLoadingBar.tsx
- /Users/senolfratila/work/web-funnel/packages/ui/src/growth-plan/GenerateGrowthPlanPersonalize.tsx
```

---

## Phase 4 — Account capture (Firestore funnel_leads + Firebase Auth, email-link passwordless)

```
Read docs/funnel/PROGRESS.md, docs/funnel/05-auth.md, and
.cursor/rules/auth.mdc. Execute Phase 4.

Auth model: Google, Apple, and email-link (passwordless). NO
email/password. NO Admin-SDK createUser + custom-token shortcut (rejected
for enumeration risk — see 05-auth.md).

Lead capture goes into a new Firestore collection `funnel_leads` on
aurema-backend. No third-party ESP.

Backend deliverables (in /Users/senolfratila/work/aurema-backend):
- New route POST /api/funnel/leads (public, lightly rate-limited) that
  creates a doc in the Firestore `funnel_leads` collection with shape:
    { email, source: 'growth-plan', capturedAt, funnelVariant?, userAgent? }
  Upsert by email is fine; do NOT dedupe in a way that hides repeat
  captures from different sessions / funnels.
- Reuse existing express patterns (controllers/routes folders); no new deps
- Unit test for the controller that asserts shape + timestamp

Frontend deliverables (in aurema-web):

1. src/funnel/services/leadsClient.ts — POST wrapper around the backend route.

2. src/funnel/services/firebaseClient.ts — initializes the Firebase Web SDK
   using NEXT_PUBLIC_FIREBASE_* env vars (document every var in .env.example).
   Uses the SAME Firebase project as aurema-app (mobile).

3. src/funnel/services/authActionCode.ts — exports the ActionCodeSettings
   object used for sendSignInLinkToEmail. Default url:
   'https://aurema-app.com/growth-plan/verify'. Include `linkDomain` only
   if the user has decided on the Firebase-Hosting replacement for Dynamic
   Links (see PROGRESS.md open question). If undecided, ship without
   linkDomain — links will still work, they just land in the browser
   rather than deep-linking into the mobile app.

4. src/funnel/hooks/useFirebaseUser.ts — returns { user, loading }.

5. src/funnel/steps/EmailStep.tsx — captures userEmail, calls leadsClient,
   stores in FunnelAnswers, advances. On backend error, let the user
   continue anyway (don't block the funnel on analytics).

6. src/funnel/steps/SignInStep.tsx — three-option chooser with this
   render order:
   - "Continue with Google" (signInWithPopup(GoogleAuthProvider))
   - "Continue with Apple" (signInWithPopup(OAuthProvider('apple.com'))),
     ONLY rendered when NEXT_PUBLIC_APPLE_SIGNIN_ENABLED === 'true'
   - "Continue with email" — prefills the email from FunnelAnswers,
     calls sendSignInLinkToEmail(auth, email, actionCodeSettings) and
     stores { email } in localStorage under 'aurema.pendingEmail'. After
     sending, the step renders a "Check your email" view with the
     destination email, a resend button (throttle 30s), and keeps
     Google/Apple visible as fallbacks.
   On any successful sign-in (Google / Apple / returning via verify route),
   store firebaseUid + verified email in funnel state.

7. src/app/(funnel)/growth-plan/verify/page.tsx — on mount:
   - If isSignInWithEmailLink(auth, window.location.href) is false,
     render an error state with a "start over" CTA.
   - Read email from localStorage ('aurema.pendingEmail'); if missing,
     prompt via a small Chakra form (different-device case).
   - Call signInWithEmailLink(auth, email, window.location.href).
   - Remove 'aurema.pendingEmail' from localStorage.
   - Restore funnel state if hydration hasn't happened yet, then router.push
     to '/growth-plan/paywall'.
   - Surface errors clearly (expired link, wrong email).

8. Register EmailStep and SignInStep in flow.ts between plan-preview and
   paywall, with `when` predicates so already-captured / already-signed-in
   users skip them.

Env vars to document in .env.example:
- NEXT_PUBLIC_FIREBASE_API_KEY
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- NEXT_PUBLIC_FIREBASE_PROJECT_ID
- NEXT_PUBLIC_FIREBASE_APP_ID
- NEXT_PUBLIC_APPLE_SIGNIN_ENABLED=false

Constraints:
- Follow .cursor/rules/auth.mdc exactly
- NO email/password anywhere. NO createUserWithEmailAndPassword.
- NO Admin SDK createUser + custom token flows.
- NO merging the lead-capture email with the Firebase email — keep both
  (the funnel_leads row stays; user doc uses the Firebase-verified email).
- NO @getbrevo/brevo imports in this phase. The dep stays in package.json
  for the marketing subscribe route; funnel does not use it.
- Apple button HIDDEN unless NEXT_PUBLIC_APPLE_SIGNIN_ENABLED === 'true'.

Verify:
- Submitting an email in dev creates a doc in Firestore `funnel_leads`.
- If the backend route is down, EmailStep still lets the user proceed.
- Google sign-in works against the dev Firebase project, populating
  firebaseUid in funnel state.
- "Continue with email" sends a link from Firebase Auth (check inbox).
  Clicking the link opens /growth-plan/verify which completes sign-in
  and lands on /growth-plan/paywall.
- Opening the email link in an incognito window (different-device case)
  prompts for email and then completes sign-in correctly.
- Reloading mid-funnel preserves state; reaching /growth-plan/sign-in
  while already signed in skips to the next step.

Run prettier. Update PROGRESS.md. Note:
- Whether the Dynamic-Links replacement was decided (linkDomain vs.
  native Universal/App Links). If deferred, flag for Phase 9 QA.
- Any Apple Sign-In config work outstanding.

Reference implementations:
- Firebase Auth docs (firebase.google.com) — primary reference. Read:
  - https://firebase.google.com/docs/auth/web/email-link-auth
  - https://firebase.google.com/docs/auth/web/google-signin
  - https://firebase.google.com/docs/auth/web/apple
- aurema-backend/src/controllers/*.js — express controller pattern for
  the leads endpoint
- web-funnel references are LIMITED: workplace uses a different auth
  stack. Only consult for EmailStep copy / layout inspiration:
  /Users/senolfratila/work/web-funnel/apps/deepstash/src/components/sign-up/SignUpStepContentBaseline.tsx
```

---

## Phase 5 — RevenueCat Web Billing config

```
Read docs/funnel/PROGRESS.md, docs/funnel/03-payments.md, and
.cursor/rules/payments.mdc. Execute Phase 5.

This phase is 80% dashboard work. Implementation in code is minimal.

Dashboard tasks (for the user to do — agent should list them clearly and
WAIT for confirmation before proceeding with code changes):
- Connect Stripe account in RevenueCat
- Create a "Aurema Web" Web Billing config pointed at that Stripe account
- Mirror mobile's entitlement (same ID!) and products to a `default` web offering
- Generate a Web Billing public API key

Backend code changes (in /Users/senolfratila/work/aurema-backend):
- Extend aurema-backend/src/controllers/webhookController.js so that on
  INITIAL_PURCHASE / RENEWAL it also writes
  `subscriptionSource: event.store === 'STRIPE' ? 'web' : 'mobile'` on the user doc
- Add a unit test that feeds a sample RC webhook payload with store='STRIPE'
  and asserts the user doc is updated correctly (subscriptionStatus='active',
  subscriptionSource='web'). Use the existing test runner if one exists;
  otherwise set up jest minimally.
- Document the "App User ID == Firebase UID" invariant in a README note
  or jsdoc on the webhook handler

aurema-web code changes:
- Add NEXT_PUBLIC_RC_WEB_PUBLIC_KEY placeholder to .env.example
- Create src/funnel/services/revenueCatClient.ts that exports
  configureRevenueCat(firebaseUid) — DO NOT call it yet, that's Phase 6

Constraints:
- NO Stripe SDK in aurema-backend. NO Stripe routes. NO Stripe webhook.
  RevenueCat's existing webhook handles everything.
- Do not change anything about mobile (aurema-app) — entitlement ID just
  needs to match.

Verify:
- Unit test passes
- aurema-backend still starts and existing RevenueCat webhook tests (if any) still pass
- The user has confirmed dashboard config is done before marking phase complete

Update PROGRESS.md. List any entitlement / product IDs agreed on.

Reference implementations:
- DO NOT consult web-funnel for this phase. Workplace uses Stripe directly;
  we use RevenueCat. Confusion risk is high.
- Primary reference: https://docs.revenuecat.com/docs/web/web-billing/web-sdk
  and docs/funnel/03-payments.md
```

---

## Phase 6 — Paywall (RevenueCat Web SDK)

```
Read docs/funnel/PROGRESS.md, docs/funnel/03-payments.md, and
.cursor/rules/payments.mdc. Execute Phase 6.

Deliverables:
- Install @revenuecat/purchases-js
- Wire configureRevenueCat(firebaseUid) into the funnel layout so it runs
  exactly once after Firebase sign-in completes
- src/app/(funnel)/growth-plan/paywall/page.tsx:
    * On mount, fetch offerings via purchases.getOfferings()
    * Render a Chakra wrapper with the offering selector (monthly / annual
      if both exist), terms + privacy link block (GrowthPlanPolicy),
      and a container div for the embedded checkout
    * On "Continue", call purchases.purchase({
        rcPackage, htmlTarget, customerEmail, metadata: { source: 'growth-plan' }
      })
    * On resolved promise -> router.push('/growth-plan/activate')
    * On error -> show a toast, keep the user on the paywall
- src/app/(funnel)/growth-plan/activate/page.tsx:
    * Poll GET /api/user (proxy to aurema-backend user endpoint) for up to
      10s, checking subscriptionStatus === 'active'
    * On timeout, fall back to purchases.getCustomerInfo() — entitlements
      check is authoritative
    * On active: show success + CTA deep link to the app
    * On pending after fallback: show a soft pending state + support email

Constraints:
- No Stripe SDK imports anywhere
- App User ID on RC MUST be Firebase UID — verify by inspecting the first
  purchase in the RC dashboard after test
- Paywall is behind sign-in: if firebaseUid missing, redirect to /sign-in
  step rather than rendering the paywall

Verify (sandbox mode in RC, Stripe test cards):
- 4242 4242 4242 4242 → success, activate page flips to success within 10s
- 4000 0000 0000 9995 → declined, user stays on paywall with error toast
- Post-success, /api/user shows subscriptionStatus: 'active' in Firestore
- RC dashboard shows a customer keyed by Firebase UID

Run prettier. Update PROGRESS.md. Note anything about embed styling that
needs follow-up in Phase 8 (polish).

Reference implementations:
- DO NOT consult web-funnel for payments. Workplace uses Stripe Elements
  directly — entirely different API.
- Primary: https://docs.revenuecat.com/docs/web/web-billing/web-sdk
- docs/funnel/03-payments.md has the exact code shape to follow
```

---

## Phase 7 — Experiments (Amplitude Experiment, flags-only)

```
Read docs/funnel/PROGRESS.md, docs/funnel/04-experiments.md, and
.cursor/rules/experiments.mdc. Execute Phase 7.

Deliverables:
- Install @amplitude/experiment-js-client (and @amplitude/analytics-browser
  if not already)
- src/funnel/experiments/amplitudeExperimentClient.ts — singleton client
  initialized with NEXT_PUBLIC_AMPLITUDE_DEPLOYMENT_KEY
- src/funnel/experiments/useVariant.ts — hook that returns the variant
  for a given EXPERIMENTS entry, auto-fires $exposure on first read,
  defaults to defaultVariant while the client boots
- src/funnel/experiments/experiments.constants.ts — EXPERIMENTS registry
  with one real entry: INTRO_HERO with variants ['control', 'variant-a']
- Ship ONE reference experiment on the intro step:
    * src/funnel/steps/intro/IntroControl.tsx (the current intro content)
    * src/funnel/steps/intro/IntroVariantA.tsx (a distinct hero copy/layout)
    * Parent IntroStep uses useVariant(EXPERIMENTS.INTRO_HERO) to switch
- Update docs/funnel/04-experiments.md with the INTRO_HERO row under
  "Active experiments"

Constraints:
- Follow .cursor/rules/experiments.mdc — one file per variant, no inline
  branching beyond a simple switch
- No SSR variant resolution; brief control flash on first paint is fine
- Do not fire $exposure manually

Verify:
- With the Amplitude dev deployment, setting the variant via the Amplitude
  Experiment preview tool changes which component renders on /growth-plan
- $exposure events appear in Amplitude after the step mounts
- Both variants render cleanly on reload

Run prettier. Update PROGRESS.md.

Reference implementations (adapt — see .cursor/rules/references.mdc):
- /Users/senolfratila/work/web-funnel/apps/deepstash/src/constants/experiments.ts
  — registry shape pattern
- Any `useVariant` / experiment hook under
  /Users/senolfratila/work/web-funnel/packages/ui/src/hooks/ if present
  — adapt client-side only, ignore SSR bits
```

---

## Phase 8 — Analytics + polish

```
Read docs/funnel/PROGRESS.md. Execute Phase 8.

Analytics deliverables:
- src/funnel/analytics/track.ts — typed wrapper over @amplitude/analytics-browser
  with a closed enum of event names:
    'step_view', 'answer_selected', 'email_captured',
    'sign_in_started', 'sign_in_completed',
    'paywall_view', 'purchase_started', 'purchase_completed', 'purchase_failed',
    'experiment_exposed'
- Wire step_view into StepShell (should be in place from Phase 2 — verify)
- Wire answer_selected into every step's option handler
- Wire the remaining events at the right call sites (sign in, paywall,
  purchase, etc.)
- Initialize Amplitude once in the funnel layout with
  NEXT_PUBLIC_AMPLITUDE_API_KEY

Polish deliverables:
- Loading states on every async boundary (steps that fetch, sign-in,
  paywall offerings, activate polling)
- Error states with retry affordance
- Mobile-first pass: open /growth-plan at 375px width and walk through
  the entire flow; fix any layout issues
- Accessibility pass: buttons reachable via keyboard, focus rings visible,
  alt text on images, aria-labels on icon-only buttons
- Prefers-reduced-motion: AutoLoadingBar + any framer-motion / Chakra
  animations respect it

Constraints:
- No console.log in committed code
- Do not add analytics inside React effects that fire on every render —
  use the typed wrapper's call sites

Verify:
- All event types fire at least once during a full funnel walkthrough
  (check Amplitude dev project)
- /growth-plan looks and behaves correctly on 375px and 1440px widths
- Keyboard-only navigation works from step 1 through paywall

Run prettier. Update PROGRESS.md.

Reference implementations (adapt — see .cursor/rules/references.mdc):
- /Users/senolfratila/work/web-funnel/packages/ui/src/ — look for any
  track/analytics wrapper; take the typed-events pattern, drop anything
  specific to their attribution stack
- /Users/senolfratila/work/web-funnel/apps/deepstash/src/ — how they
  sprinkle events across steps
```

---

## Phase 9 — QA + deploy

```
Read docs/funnel/PROGRESS.md and docs/funnel/03-payments.md. Execute Phase 9.

Deliverables:
- docs/funnel/09-qa-checklist.md with a manual QA pass list covering:
    * Happy path: fresh browser → complete funnel → subscribe → activate
    * Resume path: reload mid-funnel, continue
    * Sign-in paths: Google and email-link (Apple only if NEXT_PUBLIC_APPLE_SIGNIN_ENABLED is on).
      For email-link, also test the different-device case: send from desktop,
      open the link on mobile; the verify page should prompt for the email.
    * Paywall edge cases: declined card, 3DS card, abandon + return
    * Activate race: simulate slow webhook (manual pause in RC dashboard
      or disable briefly) and verify getCustomerInfo() fallback works
    * Marketing site regression: /, /privacy, /terms look untouched
    * Mobile cross-check: buying on web instantly activates entitlement in
      the mobile app (same Firebase UID signed in on both)
- docs/funnel/rc-sandbox-runbook.md with the exact steps to enable RC
  sandbox mode, test cards, and how to reset test customers
- Production env vars documented (list every NEXT_PUBLIC_* and server-only
  var with source)
- Update .env.example with every var used by the funnel
- Bump aurema-web version in package.json (see .cursor/skills/bump-version)

Deploy (after user sign-off on QA):
- Merge to main
- Verify /growth-plan on production renders and the first real subscription
  flows end to end (use a card, refund via RC dashboard afterwards)

Constraints:
- Do not ship with Apple Sign-In enabled unless Services ID config is
  confirmed done
- Do not roll attribution or add any third-party scripts not already listed
  in .env.example

Verify:
- QA checklist fully ticked
- One successful production subscription end-to-end, refunded after

Update PROGRESS.md — mark Phase 9 complete, archive open questions, note
the go-live date.

Reference implementations (limited for this phase):
- /Users/senolfratila/work/web-funnel/apps/deepstash/tests/playwright/
  — if we ever want a Playwright suite post-launch, the smoke tests there
  are a reasonable starting point. Out of scope for this phase unless the
  user explicitly asks.
```
