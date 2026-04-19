# PROGRESS

Single source of truth for where we are. Agents: update this at the end of every session.

## Current phase

**Phase 1 — Funnel shell — COMPLETE (2026-04-19)**

## Phase checklist

- [x] **Phase 0** — Agent scaffolding (rules + skills + docs)
- [x] **Phase 1** — Funnel shell (Chakra, route group, placeholder step)
- [ ] **Phase 2** — Step engine + primitives
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

## Next session — suggested start

Phase 2: step engine + primitives.

1. Create `src/funnel/state/FunnelContext.tsx` with `answers: FunnelAnswers`, `setAnswer`, localStorage hydration (key `aurema.funnel.answers.v1`).
2. Create `src/funnel/state/types.ts` with the `FunnelAnswers` type.
3. Define `src/funnel/flow/flow.ts` with at least the first 3–4 step definitions.
4. Implement `src/funnel/flow/useFunnelNavigation.ts` with `goNext()` / `goPrev()`.
5. Add `[stepId]/page.tsx` dynamic route that resolves a step from the flow.
6. Build `OptionText` and `ContinueButton` primitives in `src/funnel/components/`.

Consult `web-funnel/packages/ui/src/growth-plan/` per `.cursor/rules/references.mdc` for primitive patterns (translate Chakra v2 → v3).

## Prompt template for phases

```
Read docs/funnel/PROGRESS.md and docs/funnel/00-masterplan.md.
Execute Phase N: <phase title>.

Follow the rules in .cursor/rules/ and the skills in .cursor/skills/.
When done, update docs/funnel/PROGRESS.md (check the box, add notes,
set the next-session hint).
```

For phases 2, 3, 7, 8 explicitly add: *"Consult web-funnel per `.cursor/rules/references.mdc` for primitive patterns."*
