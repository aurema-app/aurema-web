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

## Phase 4 — Account capture (Brevo + Firebase Auth)

```
Read docs/funnel/PROGRESS.md and docs/funnel/05-auth.md. Execute Phase 4.

Deliverables:
- src/funnel/services/brevoClient.ts — server-side wrapper using the
  existing @getbrevo/brevo dep (add env var BREVO_API_KEY to .env.example)
- src/app/api/funnel/lead/route.ts — POST { email } -> Brevo contact
- src/funnel/steps/EmailStep.tsx — collects email, posts to the route
  handler, stores in funnel state as `userEmail`, advances
- src/funnel/services/firebaseClient.ts — initializes the Firebase web SDK
  using NEXT_PUBLIC_FIREBASE_* env vars (document in .env.example).
  Uses the SAME Firebase project as aurema-app (mobile).
- src/funnel/hooks/useFirebaseUser.ts
- src/funnel/steps/SignInStep.tsx — three buttons (Google, Apple, email/password).
  On success, stores `firebaseUid` + verified `email` in funnel state.
- Register EmailStep and SignInStep in flow.ts with `when` predicates so
  they skip if the user is already captured / signed in

Constraints:
- Follow .cursor/rules/auth.mdc exactly
- Apple button only renders if NEXT_PUBLIC_APPLE_SIGNIN_ENABLED === 'true'
  — do NOT enable it yet (requires Apple Services ID config, tracked in 05-auth.md)
- Do not merge the lead-capture email with the Firebase email — keep both
- Do not roll magic-link or phone auth

Verify:
- Submitting an email in dev creates a Brevo contact (or returns a clean
  error if BREVO_API_KEY missing)
- Google sign-in works against the dev Firebase project, populating
  `firebaseUid` in funnel state
- If the user reloads after sign-in, state is preserved
- Reaching /growth-plan/sign-in while already signed in skips to the next step

Run prettier. Update PROGRESS.md. Note any Apple Sign-In config work
outstanding so Phase 9 QA catches it.

Reference implementations:
- Firebase Auth docs (firebase.google.com) — this is the primary reference
- web-funnel references are LIMITED here: workplace uses a different auth
  stack. Only consult for EmailStep UX/copy:
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
    * Sign-in paths: Google, email/password (Apple only if enabled)
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
