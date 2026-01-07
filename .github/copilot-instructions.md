<!-- .github/copilot-instructions.md - Guidance for AI coding agents working on this repo -->

# Playwright Test Framework Generator — Agent Instructions

Purpose: help an AI coding assistant become productive quickly in this repository. Focus on the generator architecture, conventions, workflows, and concrete edit points.

1) Big picture
- **What this repo is:** a CLI that scaffolds Playwright projects from EJS templates. The generator renders `templates/` into a new project folder and updates `package.json` and docs.
- **Main flow:** CLI (`bin/cli.js`) → `src/index.ts` (command parsing) → `src/prompts.ts` (answers shape) → `src/scaffold.ts` (orchestration) → `src/render.ts` + `src/files.ts` (render & write templates).

2) Key entry points & files to inspect
- `bin/cli.js` — runtime entry that loads `dist/index.js` after build.
- `src/index.ts` — CLI definitions and flags (options like `--preset`, `--reporter`, `--ci`, `--pm`, `--js`).
- `src/prompts.ts` — canonical `Answers` shape used across the codebase; use this when modifying scaffold logic.
- `src/scaffold.ts` — primary orchestration: copies/renders template directories and mutates the target `package.json`.
- `src/render.ts` — EJS-based rendering wrapper used for templates.
- `templates/` — template source files; use `*.ejs` placeholders and keep conventions consistent with existing templates.

3) Developer workflows (how to run & debug)
- Build the CLI (recommended before running locally): `npm run build` (outputs `dist/`).
- Run local CLI without global install: `node ./bin/cli.js init my-tests --preset hybrid --reporter allure --ci github`.
- Fast iteration during dev: `npm run dev` (runs `tsc -w`) and in another shell run the local `node ./bin/cli.js` after compile completes.
- Unit tests: `npx vitest` or `npm test`.

4) Templates & adding presets
- Templates are EJS files under `templates/`. Use `src/render.ts` and `renderAndCopyDir` helpers in `src/files.ts` to add new templated content.
- To add a new preset: add files under `templates/extras/presets/<your-preset>/` and update `src/scaffold.ts` to call `renderAndCopyDir` for your preset (follow the existing `web`, `api`, `hybrid` examples).
- Reporters and CI blocks are gated by flags in `src/scaffold.ts` — follow those conditionals when modifying behavior.

5) Conventions & patterns specific to this repo
- ESM + TypeScript: `package.json` uses `type: \"module\"`. Built JS files target ESM and import paths include `.js` extension (see `bin/cli.js` behavior).
- Template variables: the generator relies on the `Answers` structure returned by `src/prompts.ts`. When adding template variables, update `prompts` and the `Answers` typing.
- Dependency wiring: `src/scaffold.ts` programmatically merges dependencies into the generated project's `package.json`. If you change package wiring, update that logic rather than editing templates alone.

6) Debugging tips
- Inspect the temporary `dest` directory created by the scaffold (the generator writes directly to `process.cwd()` + project name). Run the CLI with a disposable folder.
- Use `console.log` or throw from `src/scaffold.ts` step handlers to reveal failing render/copy operations. Steps are wrapped in `ora` spinners.
- For template rendering issues, render a single file using a small Node snippet that imports `src/render.ts`.

7) Tests & CI notes
- Internal tests live under `tests/` and use `vitest`. Run `npx vitest` locally.
- Generated projects include CI templates under `templates/ci/github` and `templates/ci/gitlab`. Modify those templates to change the generated CI workflows.

8) Useful grep targets (quick jump list)
- `src/scaffold.ts` — orchestration and presets
- `src/prompts.ts` — answers/flags
- `templates/base/package.json.ejs` — base package script templates
- `templates/playwright/` — default Playwright layout used by scaffolds

If anything in these instructions is unclear or you want me to include more examples (e.g., a walkthrough for adding a new preset or a concrete test to add), tell me which part and I will iterate.
