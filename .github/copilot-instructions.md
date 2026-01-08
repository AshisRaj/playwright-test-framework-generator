<!-- .github/copilot-instructions.md - Guidance for AI coding agents working on this repo -->

# Playwright Test Framework Generator — Agent Instructions

Purpose: help an AI coding assistant become productive quickly in this repository. Focus on the generator architecture, conventions, workflows, and concrete edit points — now including linting, typechecking, docs, and pre-commit hooks.

1. Big picture

- **What this repo is:** a CLI that scaffolds Playwright projects from EJS templates. The generator renders `templates/` into a new project folder and updates `package.json` and docs.
- **Main flow:** CLI (`bin/cli.js`) → `src/index.ts` (command parsing) → `src/prompts.ts` (answers shape) → `src/scaffold.ts` (orchestration) → `src/render.ts` + `src/files.ts` (render & write templates).

2. Key entry points & files to inspect

- `bin/cli.js` — runtime entry that loads `dist/index.js` after build.
- `src/index.ts` — CLI definitions and flags (options like `--preset`, `--reporter`, `--ci`, `--pm`, `--js`).
- `src/prompts.ts` — canonical `Answers` shape used across the codebase; update this when changing template variables.
- `src/scaffold.ts` — primary orchestration: copies/renders template directories and mutates the target `package.json`.
- `src/render.ts` — EJS-based rendering wrapper used for templates.
- `src/files.ts` — helpers used to copy and render directories and single files into the generated project.
- `templates/` — template source files; use `*.ejs` placeholders and keep conventions consistent with existing templates.
- `husky/` — contains the committed hook scripts used in generated projects (e.g., `commit-msg`, `pre-commit`). See repository-level Husky support below.

3. What changed (new things to be aware of)

- **Linters:** ESLint is configured in `eslint.config.js` and templates include `eslint` rules. Use `npm run lint` to lint the generator codebase and `npm --prefix <generated-project> run lint` for generated projects.
- **Typechecks:** The repo uses TypeScript type checking. Use `npm run typecheck` (or `tsc --noEmit`) to validate types. Tests may run typechecks as part of CI.
- **Additional docs (`*.md`):** There are new/updated `.md` files (`CONTRIBUTING.md`, `README.md`, `docs/`), add or update these when expanding scaffolds or contributing guidance.
- **Husky & pre-commit hooks:** Husky files live under `husky/`. Generated projects include scripts/hooks to run linters and tests pre-commit. When modifying hooks, keep the `husky/` templates in sync.

4. Developer workflows (how to run & debug)

- Build the CLI (recommended before running locally): `npm run build` (outputs `dist/`).
- Run the CLI locally without a global install: `node ./bin/cli.js init my-tests --preset hybrid --reporter allure --ci github`.
- Fast iteration during development: run `npm run dev` (TypeScript watcher) and in another shell run the local CLI after compile completes.
- Linting: `npm run lint` (project root). For a generated project: `npm --prefix ./path/to/generated run lint`.
- Typechecking: `npm run typecheck` or `npx tsc --noEmit`.
- Husky: to enable local hooks after cloning, run `npx husky install` (or `npm run prepare` if a `prepare` script exists). Pre-commit hooks will run automatically on commit.
- Unit tests: `npx vitest` or `npm test`.

5. Templates & adding presets

- Templates are EJS files under `templates/`. Use `src/render.ts` and `renderAndCopyDir` helpers in `src/files.ts` to add new templated content.
- To add a new preset: add files under `templates/extras/presets/<your-preset>/` and update `src/scaffold.ts` to call `renderAndCopyDir` for your preset (follow `web`, `api`, `hybrid` examples).
- When adding or changing templates that affect code quality, update `eslint.config.js`, `tsconfig.json.ejs`, and any `package.json.ejs` scripts to ensure the generated project runs `lint` and `typecheck` in CI or pre-commit hooks.

6. Conventions & patterns specific to this repo

- ESM + TypeScript: `package.json` uses `type: \"module\"`. Built JS files target ESM and import paths include `.js` extension (see `bin/cli.js`).
- Template variables: the generator relies on the `Answers` structure returned by `src/prompts.ts`. When adding template variables, update `prompts` and the `Answers` typing.
- Dependency wiring: `src/scaffold.ts` programmatically merges dependencies into the generated project's `package.json`. Modify that logic if you need to change how dependencies or devDependencies are injected.

7. Husky and pre-commit hooks (practical notes)

- Location: repository-level hook templates are in `husky/` (for use in generated projects and guidance).
- Typical pre-commit tasks: run `npm run lint`, `npm run typecheck` (optional), and lightweight tests. Keep hooks fast — prefer lint-staged for staged-only checks.
- Installing hooks locally after cloning: run `npx husky install` or `npm run prepare`. CI runs do not require Husky.

8. Debugging tips

- Inspect the temporary `dest` directory created by the scaffold (the generator writes directly to `process.cwd()` + project name). Run the CLI with a disposable folder.
- Use `console.log` or throw from `src/scaffold.ts` step handlers to reveal failing render/copy operations. Steps are wrapped in `ora` spinners so failures are visible.
- For template rendering issues, render a single file using a small Node snippet that imports `src/render.ts`.
- If lint errors appear, run `npm run lint -- --fix` where appropriate; for type errors, run `npm run typecheck` and fix TypeScript issues.

9. Tests & CI notes

- Internal tests live under `tests/` and use `vitest`. Run `npx vitest` locally.
- CI workflows live under `templates/ci/` for generated projects. These templates include lint and typecheck steps; update them when changing lint or typecheck behavior.

10. Useful grep targets (quick jump list)

- `src/scaffold.ts` — orchestration and presets
- `src/prompts.ts` — answers/flags
- `templates/base/package.json.ejs` — base package script templates
- `templates/playwright/` — default Playwright layout used by scaffolds
- `eslint.config.js` — linter rules and conventions
- `husky/` — hook templates used by generated projects

If anything in these instructions is unclear or you want a walkthrough (e.g., adding a preset, extending hooks, or adding CI lint/typecheck steps), tell me which part and I will iterate.
