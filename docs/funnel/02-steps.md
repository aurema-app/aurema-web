# 02 — Steps

## Step inventory (initial)

This is the v1 flow. Steps are reordered or swapped via `src/funnel/flow/flow.ts`.

| # | id | Purpose | Captures |
|---|----|---------|----------|
| 1 | `intro` | Hero + value prop + CTA | — |
| 2 | `goal` | Why are you here? | `goal` |
| 3 | `age` | Age bracket | `ageRange` |
| 4 | `current-state` | How are you feeling today? | `currentState` |
| 5 | `frequency` | How often do you want to practice? | `frequency` |
| 6 | `generating` | Animated "building your plan" screen | — |
| 7 | `plan-preview` | Static personalized summary | — |
| 8 | `email` | Lead capture (Firestore `funnel_leads`) | `userEmail` |
| 9 | `sign-in` | Firebase auth (Google / Apple / email-link) | `firebaseUid` |
| 10 | `paywall` | RevenueCat checkout | — |
| 11 | `activate` | Success + deep link to app | — |

### Side routes (not part of the linear flow)

| Route | Purpose |
|-------|---------|
| `/growth-plan/verify` | Handles email-link sign-in completion. Runs `signInWithEmailLink`, sets `firebaseUid`, routes the user back into the funnel at the right point (usually paywall). |

## Sign-in step paths

The `sign-in` step is not a single question — it's a chooser with three paths. The UI renders three buttons (Google, Apple, email-link), plus a back link if the user wants to change their earlier email.

- **Google** and **Apple**: popup/redirect OAuth. On success, advance immediately.
- **Email-link**: the funnel calls `sendSignInLinkToEmail` with the email from step 8 (pre-filled, editable). The step then shows a "Check your email" screen with a "Resend link" affordance. When the user clicks the link in their inbox, they land on `/growth-plan/verify` which completes the sign-in and returns them to the funnel at the paywall.

The Apple button is only rendered when `NEXT_PUBLIC_APPLE_SIGNIN_ENABLED === 'true'`.

Keep steps short (< 10s to complete). Any step the user abandons costs us 100% of the remaining funnel.

## Primitives

Defined in `src/funnel/components/`. Reuse these before creating new ones.

- `StepShell` — provides header, progress bar, content area, optional footer CTA. Fires `step_view` event.
- `OptionText` — single-select text option.
- `OptionWithImage` — option with an image or SVG icon.
- `ContinueButton` — primary CTA, full-width on mobile.
- `ProgressBar` — computed from current step index / total steps (excluding paywall + activate).
- `AutoLoadingBar` — fills over N seconds, fires a callback when done.
- `FunnelHeader` — logo + optional back button.
- `GrowthPlanPolicy` — shared T&Cs / privacy link block used on paywall + email / sign-in steps.

## Conventions

- One step per file in `src/funnel/steps/`.
- File name matches `id` in PascalCase + `Step` suffix: `GoalStep.tsx`.
- Steps must be `'use client'` — they all are.
- Never import from another step file. If logic is shared, extract to `components/` or `hooks/`.

## Adding a step

See `.cursor/skills/new-funnel-step/SKILL.md`.

## Removing / reordering

- Update `flow.ts` only. The dynamic route resolves automatically.
- Delete the step component file if no longer referenced.
- Remove its `FunnelAnswers` key if the data is no longer used; otherwise leave it for analytics backfill.
