# Release Notes

All notable changes to this project will be documented in this file.

## [Unreleased]

- Initial release notes file created.

## [1.0.0] - 2026-01-16

- Initial public release of playwright-test-framework-generator.
- Supports non-interactive and interactive CLI scaffolding.
- Presets: web, api, hybrid, soap.
- Built-in support for Allure, Monocart, and HTML reporters.
- CI templates for GitHub and GitLab.
- Notification hooks (Gmail & Slack) and Zephyr stub included.
- Husky pre-commit hooks and lint/type-check integration.

## [1.0.1] - 2026-05-07

- Minimised the number of sub-folders under `src` from 10 to 5 to minimise pain of context switching.
- Moved the `data` folder out of `src` so it sits parallel to `src`, also renamed to test-data (industry standard).
- Reorganised files and folders under `templates/playwright`.
- Optimised `src/scaffold.ts` and added comments/JSDoc across files under `src` folder.
- Added support for GraphQL and Apollo GraphQL client calls and tests.
- Documentation updates, and miscellaneous bug fixes and test repairs.
