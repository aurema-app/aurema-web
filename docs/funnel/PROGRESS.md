# PROGRESS

Single source of truth for where we are. Agents: update this at the end of every session.

## Current phase

**Phase 0 — Agent scaffolding — COMPLETE (2026-04-19)**

## Phase checklist

- [x] **Phase 0** — Agent scaffolding (rules + skills + docs)
- [ ] **Phase 1** — Funnel shell (Chakra, route group, placeholder step)
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

<!-- Add a line here when `package.json` version changes. -->

## Notes / gotchas encountered

- _empty_

## Next session — suggested start

Phase 1: funnel shell.

1. Install `@chakra-ui/react@^3` + `@emotion/react@^11`.
2. Create `src/app/(funnel)/growth-plan/layout.tsx` with Chakra provider.
3. Create `src/funnel/theme/chakraTheme.ts` with Aurema color tokens.
4. Render a placeholder `IntroStep` at `/growth-plan` to verify the route group loads.
5. Open `/` in a browser — marketing page must look identical (no Chakra bleed).

Expected output: `/growth-plan` renders a Chakra-styled placeholder. `/` is unchanged.

Reference (adapt, do not copy — see `.cursor/rules/references.mdc` for caveats):
- `/Users/senolfratila/work/web-funnel/apps/deepstash/src/app/layout.tsx` for Chakra provider shape (v2 → translate to v3)

## Prompt template for phases

```
Read docs/funnel/PROGRESS.md and docs/funnel/00-masterplan.md.
Execute Phase N: <phase title>.

Follow the rules in .cursor/rules/ and the skills in .cursor/skills/.
When done, update docs/funnel/PROGRESS.md (check the box, add notes,
set the next-session hint).
```

For phases 2, 3, 7, 8 explicitly add: *"Consult web-funnel per `.cursor/rules/references.mdc` for primitive patterns."*
