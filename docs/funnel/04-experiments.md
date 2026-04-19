# 04 — Experiments

Minimal, client-side, Amplitude Experiment flags only.

## Principles

- One flag per meaningful experiment. No config-flag sprawl.
- Variant names: `control`, `variant-a`, `variant-b`, ... (lowercase, kebab-case).
- Experiments are temporary. If a flag has been in the code for > 6 weeks with no decision, ship a decision or archive it.
- No SSR variant resolution. A brief control-flash on first paint is acceptable; we're optimizing for simplicity.

## Source of truth

`src/funnel/experiments/experiments.constants.ts`:

```ts
export const EXPERIMENTS = {
  INTRO_HERO: {
    key: 'funnel-intro-hero',
    variants: ['control', 'variant-a'] as const,
    defaultVariant: 'control',
  },
} as const
```

## Hook

```ts
const variant = useVariant(EXPERIMENTS.INTRO_HERO)
```

- Returns the current variant, defaulting to `defaultVariant` before the Amplitude client initializes.
- Auto-fires the `$exposure` event on first read.
- Caches per session.

## Adding, removing

See `.cursor/skills/new-experiment/SKILL.md`.

## Active experiments

| Key | Status | Started | Ended | Hypothesis | Result | Owner |
|-----|--------|---------|-------|------------|--------|-------|
| _none yet — first experiment lands in phase 7_ |

## Archived experiments

Move rows here with final result when you conclude one.

## Don'ts

- No feature flags for permanent behavior (use env vars).
- No experiments that affect payment amount or subscription length without explicit business sign-off.
- No more than 2 concurrent experiments on the same step — you lose statistical power.
