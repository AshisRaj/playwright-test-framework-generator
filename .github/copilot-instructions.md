<!-- .github/copilot-instructions.md - Concise guidance for AI coding agents -->

# Playwright Test Framework Generator — Quick Agent Guide

Purpose: get an AI coding agent productive fast. This file highlights the repo's architecture, workflows, patterns, and exact edit points you will use when making changes.

**Big Picture:**
- CLI scaffolder that renders `templates/` (EJS) into a target project and updates `package.json`/docs.
- Main runtime flow: `bin/cli.js` -> `dist/index.js` (build) -> `src/index.ts` (args) -> `src/prompts.ts` (Answers) -> `src/scaffold.ts` -> `src/render.ts` + `src/files.ts` (render + write).

**Key Files to Open First:**
- `src/prompts.ts`: canonical `Answers` type and flags used by templates.
- `src/scaffold.ts`: orchestration — how presets are chosen and how package.json is mutated.
- `src/render.ts` and `src/files.ts`: EJS rendering helpers and `renderAndCopyDir` usage.
- `templates/`: inspect `templates/base/`, `templates/playwright/`, and `templates/extras/presets/` (e.g., `soap/`).
- `bin/cli.js`: how the built CLI is executed (`dist/` required).

**Developer Workflows / Commands:**
- Build the CLI: `npm run build` (produces `dist/`).
- Local run (after build): `node ./bin/cli.js init my-tests --preset hybrid --reporter allure --ci github`.
- Fast dev loop: `npm run dev` (watcher), then run the CLI in another shell after compile.
- Lint: `npm run lint` (root). For generated projects: `npm --prefix ./path/to/generated run lint`.
- Typecheck: `npm run typecheck` or `npx tsc --noEmit`.
- Tests: `npx vitest` or `npm test`.
- Enable Husky hooks locally: `npx husky install` (or `npm run prepare`).

**Templates & Presets:**
- Add a preset: create `templates/extras/presets/<name>/` and add a call in `src/scaffold.ts` using `renderAndCopyDir`.
- Template variables come from the `Answers` object in `src/prompts.ts` — change both when adding variables.
- Keep `templates/base/package.json.ejs`, `tsconfig.json.ejs`, and `eslint` settings in sync with generated project expectations.

**Conventions & Gotchas:**
- ESM + TypeScript: `package.json` uses `type: "module"` and built JS imports include `.js` extensions (see `bin/cli.js`).
- The scaffolder mutates `package.json` programmatically in `src/scaffold.ts` — prefer editing that file if you need different dependency wiring.
- Templates may rely on helper files under `templates/playwright/` and `templates/extras/` — copy helpers as-is when adding presets.

**Husky & CI:**
- Hook templates live in `husky/` (used as templates for generated projects).
- CI templates for generated projects are under `templates/ci/` (GitHub/GitLab examples).

**Debugging Tips:**
- Run the CLI against a temporary directory to inspect outputs (`node ./bin/cli.js init /tmp/x --preset web`).
- Add `console.log` or throw inside `src/scaffold.ts` steps to surface errors (steps wrapped with `ora` spinners).
- For rendering issues, import and call `src/render.ts` from a small Node script to reproduce.

**Quick grep targets:** `src/scaffold.ts`, `src/prompts.ts`, `src/render.ts`, `src/files.ts`, `templates/`, `husky/`, `eslint.config.js`.

If you want, I can: update a preset, add a new template, or walk through adding CI/lint steps — tell me which and I'll implement it.
