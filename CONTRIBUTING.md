# Contributing — Tests & QA

This file documents the testing workflow and practical guidelines for adding and maintaining tests in this repository.

Quick start

- Build before running tests: `npm run build` (tests run the built CLI at `dist/index.js`).
- Run tests: `npx vitest --run` (or `npx vitest` during development).

Why build first

- The test suite executes the compiled CLI (`dist/index.js`) using Node; compiling ensures the runtime shape matches what contributors will use.

Test types in this repo

- Integration-style scaffold tests: `tests/more-matrix.spec.ts` — create temporary scaffolded projects and assert files, templates, and `package.json` wiring.
- Unit tests: `tests/prompts.spec.ts` — test `askQuestions` and other pure functions.
- Helpers: `tests/helpers.ts` contains useful utilities (`runCLI`, `makeTmpDir`, `readJSON`, `exists`) — reuse them when possible.

Adding tests

- Prefer small, focused cases rather than a huge combinatorial matrix. Add new permutations to `tests/more-matrix.spec.ts` for real-world coverage.
- When a new CLI flag or preset is added:
  - Add a unit test if behavior is pure (mapping flags → answers).
  - Add one or two integration cases that exercise the new flag end-to-end (scaffold + assert files & package wiring).

Faster iteration

- For logic-heavy code in `src/scaffold.ts`, write isolated unit tests that mock `src/files.ts` helpers (`renderAndCopyDir`, `copyDir`, `writeJSON`) so you can assert wiring logic without creating on-disk projects.
- Use Vitest's `--watch` or `npm run dev` (TypeScript watch) + running tests in a separate terminal to iterate quickly.

Test naming & timeouts

- Name tests clearly (e.g., `scaffolds and wires deps: web-allure-npm-ts`).
- Integration scaffold tests can be slower; use per-test timeouts (existing tests use `120_000` ms). Only increase timeouts when necessary.

File system and temp dirs

- Tests scaffold into temporary directories (OS temp); `makeTmpDir()` from `tests/helpers.ts` is the helper to use.
- When adding tests that create files, ensure they run cleanly on CI by avoiding assumptions about global state.

Extending the matrix

- Add new entries to `tests/more-matrix.spec.ts` with conservative coverage; avoid adding all permutations at once.
- Consider property-based or rule-based tests (assert invariants) if permutations grow large.

CI considerations

- CI should run `npm run build` before tests. If you change `package.json` wiring logic, add tests to cover the new behavior.

Linting & formatting

- Keep tests consistent with project style. Run `prettier` and `eslint` locally if you change test files.

If you need help

- Add a short note in a PR describing which tests were added and why. If you want, open a draft PR and I can review the test logic and suggest mocks to speed them up.
