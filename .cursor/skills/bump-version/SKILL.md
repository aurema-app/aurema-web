---
name: bump-version
description: >-
  Bump the aurema-web version in package.json before a deploy. Use when
  preparing a release or when the user says "bump the version".
---

# Bump version

## 1. Decide bump type

- **patch** (0.1.0 → 0.1.1): bug fixes, copy changes, no behavior change
- **minor** (0.1.0 → 0.2.0): new step, new experiment, new feature
- **major** (0.1.0 → 1.0.0): breaking change to state shape, routing, or public API

If unclear, ask the user.

## 2. Edit `package.json`

```json
{
  "name": "aurema-web",
  "version": "0.2.0"
}
```

Do not use `npm version` / `yarn version` — they create a tag, which we don't want here.

## 3. Update `docs/funnel/PROGRESS.md`

Add a line under "Releases":

```md
- v0.2.0 — 2026-04-19 — phase 2 (step engine + primitives)
```

## 4. Commit

```sh
git add package.json docs/funnel/PROGRESS.md
git commit -m "chore: bump version to v0.2.0"
```

## Checklist

- [ ] `package.json` version updated
- [ ] `docs/funnel/PROGRESS.md` updated
- [ ] Commit created (no tag)
