---
name: new-funnel-step
description: >-
  Add a new step to the Aurema growth-plan funnel. Use when creating a new
  question, screen, generating state, or any additional step between the intro
  and the paywall.
---

# Add a new funnel step

Follow these steps in order. Do not skip any.

## 1. Define answer shape (if the step captures data)

Edit `src/funnel/state/types.ts` and add a field:

```ts
export type FunnelAnswers = {
  goal?: 'clarity' | 'calm' | 'focus'
  // ...add your new answer key + type here
}
```

If the step is purely informational (e.g. a "generating plan" screen), skip this.

## 2. Create the step component

Path: `src/funnel/steps/MyNewStep.tsx`

```tsx
'use client'

import { StepShell } from '@/funnel/components/StepShell'
import { OptionText } from '@/funnel/components/OptionText'
import { useFunnelAnswers } from '@/funnel/state/useFunnelAnswers'
import { useFunnelNavigation } from '@/funnel/flow/useFunnelNavigation'
import { track } from '@/funnel/analytics/track'

export const MyNewStep = () => {
  const { answer, setAnswer } = useFunnelAnswers('myNewField')
  const { goNext } = useFunnelNavigation()

  const onPick = (value: string) => {
    setAnswer('myNewField', value)
    track('answer_selected', { stepId: 'my-new-step', value })
    goNext()
  }

  return (
    <StepShell title="Your question here">
      <OptionText selected={answer === 'a'} onClick={() => onPick('a')}>Option A</OptionText>
      <OptionText selected={answer === 'b'} onClick={() => onPick('b')}>Option B</OptionText>
    </StepShell>
  )
}
```

## 3. Register the step in the flow

Edit `src/funnel/flow/flow.ts`. Insert the step at the correct position:

```ts
export const flow: FunnelStep[] = [
  { id: 'goal',       component: GoalStep },
  { id: 'my-new-step', component: MyNewStep }, // <- added here
  { id: 'age',        component: AgeStep },
  // ...
]
```

The `id` must be URL-safe (kebab-case). It becomes the route segment `/growth-plan/my-new-step`.

## 4. Fire a view event

Add an automatic `track('step_view', { stepId })` in `StepShell`. If `StepShell` already does this (check first), skip.

## 5. Verify

- Run `yarn dev`.
- Visit `/growth-plan` and click through. Your step should appear in the expected position.
- Check Amplitude dev project for `step_view` and `answer_selected` events.
- Reload mid-funnel: answers should persist.

## 6. Formatting + commit

```sh
{ git diff --name-only HEAD; git ls-files --others --exclude-standard; } | xargs npx prettier --write --ignore-unknown
```

Commit with message: `feat(funnel): add <step-id> step`.

## Checklist

- [ ] Answer type added to `FunnelAnswers` (if applicable)
- [ ] Step component in `src/funnel/steps/`
- [ ] Step registered in `flow.ts`
- [ ] `step_view` + `answer_selected` events fire
- [ ] Persists across reload
- [ ] Prettier run
