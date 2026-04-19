---
name: new-experiment
description: >-
  Add a new Amplitude Experiment variant to the Aurema funnel. Use when
  A/B-testing a step, hero, or paywall variant.
---

# Add a new experiment

## 0. Precondition

The flag must exist in the Amplitude Experiment dashboard with variants named exactly as they'll appear in the code. Confirm with the user before touching code.

## 1. Register the flag

Edit `src/funnel/experiments/experiments.constants.ts`:

```ts
export const EXPERIMENTS = {
  // ...existing
  MY_EXPERIMENT: {
    key: 'funnel-my-experiment',
    variants: ['control', 'variant-a'] as const,
    defaultVariant: 'control',
  },
} as const
```

The `key` must match the Amplitude flag key character-for-character.

## 2. Create variant components

Create one file per variant. Example for a hero experiment on the intro step:

- `src/funnel/steps/intro/IntroControl.tsx`
- `src/funnel/steps/intro/IntroVariantA.tsx`

Keep them independent — do not share conditional logic between them. Duplicate deliberately; experiments are short-lived.

## 3. Wire it up

In the parent step file:

```tsx
import { useVariant } from '@/funnel/experiments/useVariant'
import { EXPERIMENTS } from '@/funnel/experiments/experiments.constants'
import { IntroControl } from './intro/IntroControl'
import { IntroVariantA } from './intro/IntroVariantA'

export const IntroStep = () => {
  const variant = useVariant(EXPERIMENTS.MY_EXPERIMENT)
  if (variant === 'variant-a') return <IntroVariantA />
  return <IntroControl />
}
```

`useVariant` auto-fires the `$exposure` event on first read. Do not fire it manually.

## 4. Update the docs

Add a row to `docs/funnel/04-experiments.md`:

| Key | Status | Started | Hypothesis | Owner |
|-----|--------|---------|------------|-------|

## 5. Verify

- Force a variant locally by appending `?amp_exp_variant_<key>=variant-a` (if the Amplitude SDK supports it in your setup) or via Amplitude's preview tool.
- Check that switching variants re-renders cleanly and analytics `step_view` events include variant context.

## Checklist

- [ ] Flag + variants added to `experiments.constants.ts`
- [ ] One component per variant
- [ ] `useVariant` used in the parent
- [ ] Experiment logged in `docs/funnel/04-experiments.md`
- [ ] Tested both variants locally
