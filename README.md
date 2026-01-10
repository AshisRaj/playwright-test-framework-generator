# playwright-test-framework-generator

## Table of Contents

- [Overview](#overview)
- [Key Features/Functionalities/Capabilities](#key-featuresfunctionalitiescapabilities)
- [Tech Stack](#tech-stack)
- [Prerequisite Software and Tools](#prerequisite-software-and-tools)
- [Project Structure and Folder/Files Description](#project-structure-and-folderfiles-description)
- [Setup and Installation](#setup-and-installation)
  - [Prerequisites](#prerequisites)
  - [Clone the repository](#clone-the-repository)
  - [Build the CLI (local)](#build-the-cli-if-running-locally)
  - [Use the CLI to scaffold a project](#use-the-cli-to-scaffold-a-project)
  - [After scaffolding](#after-scaffolding)
- [Testing Strategy](#testing-strategy)

## Overview

A zero‑setup CLI to scaffold Playwright test repositories with batteries included: TS/JS presets, POM, custom fixtures, API client, Allure, CI (GitHub/GitLab), Notifications, Husky hooks, and a Zephyr publish stub.

## Key Features/Functionalities/Capabilities

A compact set of features that this scaffold and CLI provide out of the box:

- Zero‑setup CLI: scaffold a Playwright test repository with a single `init` command.
- TypeScript and JavaScript presets: start tests in your preferred language.
- Page Object Model (POM): pre-built `pages/` structure and example page classes.
- Custom fixtures and extended fixtures: reusable test setup and teardown helpers.
- Built-in API client: utilities to call and validate backend APIs from tests.
- SOAP preset: example SOAP/XML API test scaffold including helpers and templates for SOAP requests and responses.
- Multiple reporters: Allure integration plus a Monocart report output template.
- CI templates: ready-to-use GitHub and GitLab CI workflow templates.
- Notification hooks: built-in notification scripts for test results (Slack/Teams/email).
- Husky git hooks: `pre-commit` and `commit-msg` hooks to enforce standards.
- Environment and config templates: `env.example`, `playwright.config.ts`, and TS configs.
- Linting & syntax checks: scripts and configs for consistent code quality.
- Test runner helpers: scripts for smoke/sanity/regression categorization and parallel runs.
- Report publishing stub: example integration for publishing results (e.g., Zephyr).
- Extensible templates: `templates/` and `extras/` for adding custom bits during scaffolding.

These capabilities are designed to get teams running reliable Playwright test suites fast, while still allowing easy customization and CI integration.

## Tech Stack

- Node.js (v20+): runtime for the CLI and scaffolded projects.
- TypeScript: primary language for the CLI and templates.
- EJS: templating engine used for rendering project files (`*.ejs` templates).
- Playwright: end-to-end test runner and browser automation used in templates.
- Vitest: unit/test runner used for internal tests and examples.
- Package managers: Yarn and npm supported in generated projects.

## Project Structure and Folder/Files Description

Below is a concise description of the main files and folders in this repository. Use these locations when you want to modify the scaffold behavior, templates, or example projects.

### src (primary implementation)

- `src/`: Core implementation of the CLI and scaffolding logic. Contains the entry points, helpers and orchestration code used by the `playwright-test-framework-generator` command.
- `src/index.ts`: CLI entry — parses arguments, configures options, and delegates to the scaffold flow.
- `src/files.ts`: File-system helpers — create directories, copy/write files, and apply file-level transformations.
- `src/prompts.ts`: Interactive prompt definitions and validation used during `init` to collect project choices from the user.
- `src/render.ts`: Template rendering utilities (EJS/placeholder replacement) and helpers that inject variables into templates before writing.
- `src/scaffold.ts`: High-level scaffolding engine — applies templates, runs post-generation steps (like installing deps), and coordinates file creation.
- `src/*`: Other utility modules and small helpers live here (logging, validation, config loaders). Keep core behaviour in `src/` when modifying generator logic.

### templates (scaffold sources)

- `templates/`: Template repository used by the generator. Templates are written as EJS or placeholder-enabled files and are copied + rendered into the target project.
- `templates/base/`: Base project template used for new projects. Contains common files such as `env.example`, `package.json.ejs`, `tsconfig.json`, `README.md.ejs`, and example config files.
- `templates/ci/`: CI pipeline templates. Subfolders include `github/` and `gitlab/` with `*.yml.ejs` workflow templates (e.g. `github-ci.yml.ejs`) — these are rendered based on the `--ci` option.
- `templates/playwright/` and `templates/extras/`: Example Playwright configs, reporters, helpers, and optional extras that can be included when scaffolding (e.g. reporter stubs, notification scripts). These provide ready-to-use test structure and example pages/fixtures.
  - `templates/extras/presets/`: contains additional preset packs such as `web`, `api`, `hybrid`, and `soap` (SOAP/ XML API helpers). Add new presets here when extending the generator.
- `templates/*`: Templates may include nested folders for `playwright/src/`, `playwright/tests/`, `husky/`, and `docs/` to give scaffolded projects a complete starting layout.

How to customize templates:

- Edit or add files under `templates/` to change what the generator writes to a new project.
- Use `<variable>.ejs` placeholders where you need dynamic values; `src/render.ts` handles replacement.
- Add new template sets (e.g. `templates/my-custom-preset/`) and expose them via CLI options if you want custom presets.

## Setup and Installation

Follow these steps to get a local development environment and to use the CLI to scaffold a Playwright project.

### Prerequisites

- Node 20.x
- Yarn 1.22.x (or npm 9+)
- Java / JDK (for Allure reporting) — set `JAVA_HOME` if you plan to use Allure
- Git

### Clone the repository

```sh
git clone https://github.com/AshisRaj/playwright-test-framework-generator.git
cd playwright-test-framework-generator
npm i
```

### Build the CLI (if running locally)

```sh
npm run build
```

### Use the CLI to scaffold a project

Run the generator without installing globally using `npx` or by invoking the local `bin/cli.js`:

Use `node ./bin/cli.js --help` or `npx playwright-test-framework-generator --help` for CLI options.

```sh
# Use npx (preferred)
npx playwright-test-framework-generator init pw-tests-hybrid --reporter allure --ci github --preset hybrid

# Or invoke the local built CLI
node ./bin/cli.js init pw-tests-web

# Example: scaffold the SOAP preset
npx playwright-test-framework-generator init my-soap-project --preset soap --ci github
```

### After scaffolding:

```sh
cd pw-tests-hybrid
npm install   # or yarn install
npx playwright install --with-deps
npm test
```

### Run Tests:

Add/Update the environment related settings into given `my-tests2/src/environments/.env.dev` as default, to be able to successfully run tests and send test result notifications.

Add other environment specific files and use them. e.g. `.env.qa`, `.env.uat`, `.env.staging`.

```sh
# Check variuos scripts to run in package.json.
npm test

# via Test Runner
npm run run-and-notify
```

## Testing strategy

- **Build-first:** tests execute the built CLI (`dist/index.js`). Run `npm run build` before running tests locally.
- **Integration-style matrix:** many tests scaffold temporary projects under the OS temp directory (see `tests/more-matrix.spec.ts`). These exercise combinations of flags (`--pm`, `--reporter`, `--ci`, `--preset`, `--js`, `--no-husky`, `--zephyr`) to validate that templates, `package.json` wiring, and files are generated correctly.
- **Unit tests for inputs:** `tests/prompts.spec.ts` covers `askQuestions` non-interactive mapping so flags map to the `Answers` shape predictably.
- **Helpers:** use `tests/helpers.ts` to run the CLI, create temp dirs, and inspect generated files (`runCLI`, `makeTmpDir`, `readJSON`, `exists`). Follow the helpers when adding new tests.
- **Fast iteration tips:** for faster unit tests, add isolated tests that mock `src/files.ts` or the filesystem instead of creating full scaffolds.
- **Extending the matrix:** add cases to `tests/more-matrix.spec.ts` to cover new flags or presets. Keep each case compact to avoid long test times.

Commands to run tests locally (recommended):

```sh
npm run build
npx vitest --run
```
