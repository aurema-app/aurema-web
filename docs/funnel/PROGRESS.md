# PROGRESS

Single source of truth for where we are. Agents: update this at the end of every session.

## Current phase

**Phase 2 — Step engine + primitives — COMPLETE (2026-04-19)**

## Phase checklist

- [x] **Phase 0** — Agent scaffolding (rules + skills + docs)
- [x] **Phase 1** — Funnel shell (Chakra, route group, placeholder step)
- [x] **Phase 2** — Step engine + primitives
- [ ] **Phase 3** — Generate + plan preview
- [ ] **Phase 4** — Account capture (Brevo + Firebase Auth)
- [ ] **Phase 5** — RevenueCat Web Billing config
- [ ] **Phase 6** — Paywall (purchases-js embedded)
- [ ] **Phase 7** — Experiments (Amplitude Experiment, 1 reference)
- [ ] **Phase 8** — Analytics + polish
- [ ] **Phase 9** — QA + deploy

## Open questions (decide before phase lands)

| Phase | Question | Decision | Decided on |
|-------|----------|----------|------------|
| 1 | Chakra v2 vs v3? | v3 (React 19 support) | 2026-04-19 |
| 4 | Apple Sign-In on web enabled at launch? | open | — |
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

## Next session — suggested start

Phase 3: generating screen + plan preview.

1. Add `{ id: 'generating' }` to `flow.ts` and create `src/funnel/steps/GeneratingStep.tsx` using `AutoLoadingBar` (build this primitive in `src/funnel/components/`).
2. Create `src/funnel/steps/PlanPreviewStep.tsx` — static personalized summary reading from `useFunnelAnswers()`.
3. Wire `FrequencyStep` terminal → `generating` by having `useFunnelNavigation`'s `goNext()` at end of flow push to `generating` (it currently no-ops at the last step).
4. Consult `web-funnel/packages/ui/src/growth-plan/GenerateGrowthPlanPersonalize.tsx` per `.cursor/rules/references.mdc` for pattern, translate to Chakra v3.

## Prompt template for phases

```
Read docs/funnel/PROGRESS.md and docs/funnel/00-masterplan.md.
Execute Phase N: <phase title>.

Follow the rules in .cursor/rules/ and the skills in .cursor/skills/.
When done, update docs/funnel/PROGRESS.md (check the box, add notes,
set the next-session hint).
```

For phases 2, 3, 7, 8 explicitly add: *"Consult web-funnel per `.cursor/rules/references.mdc` for primitive patterns."*
