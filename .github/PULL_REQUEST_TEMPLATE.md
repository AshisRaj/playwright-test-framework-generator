<!-- Pull Request template with a short checklist focused on tests -->

# Summary

Describe the change in one or two sentences.

## Checklist — Tests

- [ ] I ran `npm run build` and `npx vitest --run` locally and all tests passed.
- [ ] New behavior is covered by unit or integration tests (see `tests/`).
- [ ] Added minimal matrix case(s) to `tests/more-matrix.spec.ts` when adding flags/presets.
- [ ] For logic-heavy changes to `src/scaffold.ts`, I added fast unit tests that mock `src/files.ts` helpers.
- [ ] I used `tests/helpers.ts` utilities (`runCLI`, `makeTmpDir`, `readJSON`, `exists`) when applicable.
- [ ] CI will run `npm run build` before tests (no build-related failures expected).

Optional notes for reviewers:

- If tests are slow, consider suggesting mocks for filesystem-heavy assertions.
- Point out any edge cases that should be added to the matrix during review.
