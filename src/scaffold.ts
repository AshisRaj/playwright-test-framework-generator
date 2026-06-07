/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * `scaffold.ts`
 *
 * Responsible for generating a Playwright test project from templates based on
 * the user's answers. The function drives a sequence of rendering/copying
 * operations and then mutates `package.json` for the generated project.
 *
 * Key responsibilities:
 * - create the project directory
 * - render base templates (editor config, package.json, tsconfig, README)
 * - scaffold Playwright-specific folders (configs, fixtures, pages, tests)
 * - include optional extras (reporters, CI workflows, notifications, husky)
 * - finalize `package.json` dependencies, devDependencies and scripts
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ora from 'ora';
import { copyDir, renderAndCopyDir, writeJSON } from './files.js';
import type { Answers } from './prompts.js';

// Determine __dirname in ESM (fileURLToPath is the portable approach)
const dirname = path.dirname(fileURLToPath(import.meta.url));

// Helper to build an absolute path into the `templates/` folder.
// Usage: TPL('playwright/src/pages') => <repo>/templates/playwright/src/pages
const TPL = (p: string) => path.join(dirname, '..', 'templates', p);

/**
 * Scaffold a new project based on the provided `Answers`.
 *
 * The function is intentionally imperative and sequential: template rendering
 * must happen in a predictable order (base files first, then Playwright
 * structure, presets, extras, and finally package.json updates).
 *
 * @param a - The answers object returned from prompts (see `src/prompts.ts`).
 */
export async function scaffold(a: Answers) {
  // Destination folder for the generated project (resolved from current cwd)
  const dest = path.resolve(process.cwd(), a.projectName);

  // Spinner gives the CLI friendly progress feedback while scaffolding
  const spinner = ora(`Scaffolding project: ${a.projectName}...`).start();

  // Small visual tweak: move to yellow after start so long-running steps feel active
  setTimeout(() => {
    spinner.color = 'yellow';
  }, 1000);

  /**
   * Simple step runner used throughout this file. Each step displays a label
   * in the spinner, executes the async work and reports success/failure.
   *
   * Keeping this as a local helper reduces duplication and provides
   * consistent UX for long scaffolding operations.
   */
  const step = async (label: string, fn: () => Promise<void>) => {
    spinner.start(`\n${label}`);
    try {
      await fn();
      spinner.succeed(label);
    } catch (err) {
      spinner.fail(label);
      throw err;
    }
  };

  // --- Create project directory ---
  // `recursive: true` is a safe no-op if the folder already exists.
  await step(`Create project folder: ${a.projectName}`, async () => {
    await fs.mkdir(dest, { recursive: true });
  });

  // --- Base templates ---
  // These include editor settings, package.json.ejs, README, tsconfig etc.
  await step(
    'Scaffold base files and folders (.vscode/, .editorconfig, .gitignore, .prettierignore, .prettierrc, eslint.config.js, package.json, README.md, tsconfig.json)',
    async () => {
      await renderAndCopyDir(TPL('base'), dest, a);
    },
  );

  // --- Playwright common structure ---
  // Render configs and environments first, then selective utils files.
  await step('Add Playwright structure (src => configs, environments)', async () => {
    // Render common folders sequentially to ensure order and proper awaits
    for (const folder of ['configs', 'environments']) {
      await renderAndCopyDir(TPL(`playwright/src/${folder}`), path.join(dest, 'src', folder), a);
    }

    // Utility files to include depend on chosen preset(s). We build an array
    // with conditional entries and filter `null`s out before rendering.
    const utilsFiles = [
      ['web', 'hybrid'].includes(a.preset) ? 'cookies.ts.ejs' : null,
      'custom-reporter.ts.ejs',
      'global-setup.ts.ejs',
      'global-teardown.ts.ejs',
      'index.ts.ejs',
      'logger.ts.ejs',
      ['api', 'hybrid'].includes(a.preset) ? 'server.ts.ejs' : null,
      'metadata-builder.ts.ejs',
      'paths.ts.ejs',
      'test-runner.ts.ejs',
    ].filter(Boolean) as string[];

    for (const fileOrFolder of utilsFiles) {
      await renderAndCopyDir(
        TPL(`playwright/src/utils/${fileOrFolder}`),
        path.join(dest, 'src', 'utils'),
        a,
      );
    }
  });

  // --- Playwright config ---
  await step('Add Playwright config (playwright.config.ts)', async () => {
    await renderAndCopyDir(TPL('playwright/playwright.config.ts.ejs'), dest, a);
  });

  // --- Preset scaffolding ---
  // Each preset (web, api, soap, hybrid) maps to specific template folders.
  // We keep the rendering logic explicit and readable so future presets are
  // straightforward to add.
  if (a.preset === 'web') {
    await step('Add Web as preset (UI/POM + fixtures)', async () => {
      const webRenders: Array<[string, string]> = [
        ['playwright/src/pages', path.join(dest, 'src', 'pages')],
        ['playwright/src/fixtures/web', path.join(dest, 'src', 'fixtures')],
        ['playwright/src/fixtures/index.ts.ejs', path.join(dest, 'src', 'fixtures')],
        ['playwright/test-data/ui', path.join(dest, 'test-data', 'ui')],
        ['playwright/test-data/index.ts.ejs', path.join(dest, 'test-data')],
        ['playwright/tests/ui', path.join(dest, 'tests/ui')],
      ];

      for (const [tpl, to] of webRenders) {
        await renderAndCopyDir(TPL(tpl), to, a);
      }
    });
  }

  if (a.preset === 'api') {
    await step('Add API as preset (API Server, services, tests and fixtures)', async () => {
      const apiRenders: Array<[string, string]> = [
        ['playwright/src/fixtures/api', path.join(dest, 'src', 'fixtures')],
        ['playwright/src/fixtures/index.ts.ejs', path.join(dest, 'src', 'fixtures')],
        ['playwright/src/utils/api/', path.join(dest, 'src', 'utils', 'api')],
        ['playwright/test-data/api/', path.join(dest, 'test-data', 'api')],
        ['playwright/test-data/index.ts.ejs', path.join(dest, 'test-data')],
        ['playwright/tests/api', path.join(dest, 'tests/api')],
      ];

      for (const [tpl, to] of apiRenders) {
        await renderAndCopyDir(TPL(tpl), to, a);
      }
    });
  }

  if (a.preset === 'soap') {
    await step('Add SOAP preset (WSDL client, services, tests and fixtures)', async () => {
      const soapRenders: Array<[string, string]> = [
        ['playwright/src/fixtures/soap', path.join(dest, 'src', 'fixtures')],
        ['playwright/src/fixtures/index.ts.ejs', path.join(dest, 'src', 'fixtures')],
        ['playwright/src/utils/soap/', path.join(dest, 'src', 'utils', 'soap')],
        ['playwright/test-data/soap', path.join(dest, 'test-data', 'soap')],
        ['playwright/test-data/index.ts.ejs', path.join(dest, 'test-data')],
        ['playwright/tests/soap', path.join(dest, 'tests/soap')],
      ];

      for (const [tpl, to] of soapRenders) {
        await renderAndCopyDir(TPL(tpl), to, a);
      }
    });
  }

  if (a.preset === 'hybrid') {
    await step('Add Hybrid (UI + API + SOAP + Fixtures) as preset', async () => {
      const hybridRenders: Array<[string, string]> = [
        ['playwright/src/pages', path.join(dest, 'src', 'pages')],
        ['playwright/src/fixtures/hybrid', path.join(dest, 'src', 'fixtures')],
        ['playwright/src/fixtures/index.ts.ejs', path.join(dest, 'src', 'fixtures')],
        ['playwright/src/utils/soap/', path.join(dest, 'src', 'utils', 'soap')],
        ['playwright/src/utils/api/', path.join(dest, 'src', 'utils', 'api')],
        ['playwright/tests/ui', path.join(dest, 'tests/ui')],
        ['playwright/tests/api', path.join(dest, 'tests/api')],
        ['playwright/tests/soap', path.join(dest, 'tests/soap')],
      ];

      for (const [tpl, to] of hybridRenders) {
        await renderAndCopyDir(TPL(tpl), to, a);
      }

      // Also include test-data (api/soap/ui/index) used by hybrid setups
      for (const [tpl, to] of [
        ['playwright/test-data/api', path.join(dest, 'test-data', 'api')],
        ['playwright/test-data/soap', path.join(dest, 'test-data', 'soap')],
        ['playwright/test-data/ui', path.join(dest, 'test-data', 'ui')],
        ['playwright/test-data/index.ts.ejs', path.join(dest, 'test-data')],
      ]) {
        await renderAndCopyDir(TPL(tpl), to, a);
      }
    });
  }

  // --- Optional extras: reporters, notifications, CI, husky, zephyr ---
  if (a.reporter === 'allure') {
    await step('Include Allure docs (docs/reporters/allure)', async () => {
      await copyDir(TPL('docs/reporters/allure'), path.join(dest, 'docs/reporters/allure'));
    });
  } else if (a.reporter === 'monocart') {
    await step('Include Monocart docs (docs/reporters/monocart)', async () => {
      await copyDir(TPL('docs/reporters/monocart'), path.join(dest, 'docs/reporters/monocart'));
    });
  }

  if (a.notifications) {
    await step('Add Notifications stub (email, slack, teams)', async () => {
      await renderAndCopyDir(
        TPL('extras/notifications'),
        path.join(dest, 'src', 'tools', 'notifications'),
        a,
      );
    });
  }

  if (a.ci === 'github') {
    await step('Add GitHub Actions workflow', async () => {
      await renderAndCopyDir(TPL('ci/github'), path.join(dest, '.github', 'workflows'), a);
    });
  } else if (a.ci === 'gitlab') {
    await step('Add GitLab CI config', async () => {
      await renderAndCopyDir(TPL('ci/gitlab'), dest, a);
    });
  }

  if (a.husky) {
    await step('Setup Husky hooks (.husky/)', async () => {
      await copyDir(TPL('husky'), path.join(dest, '.husky'));
    });
  }

  if (a.zephyr) {
    await step('Add Zephyr publish stub', async () => {
      await renderAndCopyDir(
        TPL('extras/publications'),
        path.join(dest, 'src', 'tools', 'publications'),
        a,
      );
    });
  }

  // --- Finalize package.json ---
  // Read the rendered `package.json` produced by templates and merge in
  // dependencies/devDependencies based on the user's choices.
  const pkgPath = path.join(dest, 'package.json');
  const pkg = JSON.parse((await fs.readFile(pkgPath)).toString());
  let deps: Record<string, string>;
  let devDeps: Record<string, string>;

  // Build dependency lists in a single step so we can present it in the spinner
  await step('Prepare package.json dependencies and scripts', async () => {
    deps = {
      '@playwright/test': '^1.58.1',
      axios: '^1.9.0',
      dotenv: '^16.5.0',
      // Add `yarn` as a dependency only when user chose yarn as package manager
      yarn: a.packageManager === 'yarn' ? '^1.22.22' : (undefined as any),
    };

    // devDeps includes many optional toolings. We construct the object using
    // spread syntax so entries are only present when relevant to the chosen
    // preset/options (e.g. express for API, Allure for reporters, typescript
    // toolchain when TS/JS selected, etc.).
    devDeps = {
      // core tooling
      '@eslint/json': '^0.12.0',
      '@eslint/markdown': '^6.4.0',
      'eslint-plugin-jsonc': '^2.20.0',
      'adm-zip': '^0.5.16',
      '@types/adm-zip': '^0.5.7',
      eslint: '^9.36.0',
      '@eslint/js': '^9.36.0',
      globals: '^15.12.0',
      'eslint-config-prettier': '^9.1.0',
      'eslint-plugin-playwright': '^2.0.0',
      prettier: '^3.3.3',
      husky: '^9.1.7',
      'lint-staged': '^15.5.1',
      '@faker-js/faker': '^9.7.0',
      chance: '^1.1.12',
      moment: '^2.30.1',
      'cross-env': '^7.0.3',
      lodash: '^4.17.21',
      rimraf: '^6.0.1',
      winston: '^3.17.0',
      'winston-daily-rotate-file': '^5.0.0',
      kolorist: '^1.8.0',
      ...(a.preset === 'api' || a.preset === 'hybrid'
        ? {
            // API-related runtime deps and types
            express: '^5.2.1',
            '@types/express': '^5.0.6',
            '@apollo/client': '^3.8.0',
            graphql: '^16.7.1',
            'cross-fetch': '^3.1.5',
          }
        : (undefined as any)),
      // Add Allure reporting utilities unless Monocart was selected
      ...(a.reporter !== 'monocart'
        ? {
            'allure-playwright': '^3.2.1',
            'allure-commandline': '^2.34.1',
          }
        : (undefined as any)),
      // Monocart reporter only when specifically chosen
      ...(a.reporter === 'monocart'
        ? {
            'monocart-reporter': '^2.9.18',
          }
        : (undefined as any)),

      // TypeScript toolchain (present for both `ts` and `js` selections since
      // repo templates may still rely on types/tools)
      ...(a.language === 'ts' || a.language === 'js'
        ? {
            typescript: '^5.8.3',
            'ts-node': '^10.9.2',
            tsx: '^4.20.6',
            '@types/node': '^20.14.15',
            '@types/argparse': '^2.0.17',
            'typescript-eslint': '^8.8.1',
          }
        : (undefined as any)),
      ...(a.notifications
        ? {
            // Notification-related packages
            nodemailer: '^7.0.11',
            '@slack/webhook': '^7.0.6',
            '@types/nodemailer': '^7.0.4',
          }
        : (undefined as any)),
      ...(a.preset === 'api' || a.preset === 'soap' || a.preset === 'hybrid'
        ? {
            // JSON schema validation helpers for services/tests
            ajv: '^8.12.0',
            'ajv-formats': '^2.1.1',
          }
        : (undefined as any)),
      ...(a.preset === 'soap' || a.preset === 'hybrid'
        ? {
            // SOAP parsing/serialization
            'fast-xml-parser': '^5.3.3',
          }
        : (undefined as any)),
    };
  });

  // Apply the dependency changes and write back `package.json`.
  await step('Finalize package.json', async () => {
    pkg.dependencies = { ...(pkg.dependencies ?? {}), ...deps };
    // Filter out undefined entries from devDeps before merging
    pkg.devDependencies = {
      ...(pkg.devDependencies ?? {}),
      ...Object.fromEntries(Object.entries(devDeps).filter(([, v]) => v)),
    };

    // If husky is requested, add lint-staged and a prepare script
    if (a.husky) {
      pkg['lint-staged'] = {
        '*.{ts,js}': [
          'eslint . --fix --max-warnings 0 --no-cache',
          'prettier -w . --ignore-pattern .prettierignore',
        ],
      };
      pkg.scripts = { ...(pkg.scripts ?? {}), prepare: 'husky' };
    }

    // Reporter-specific scripts: prefer `yarn` binary when user chose yarn,
    // otherwise use `npx` so scripts work across environments.
    pkg.scripts = pkg.scripts ?? {};
    const pmBin = a.packageManager === 'yarn' ? 'yarn' : 'npx';
    const xenv = `${pmBin} cross-env`;

    if (a.reporter === 'allure') {
      // Generate & open Allure: note ALLURE_NO_ANALYTICS=1 to avoid telemetry
      pkg.scripts['report:generate'] =
        `${xenv} ALLURE_NO_ANALYTICS=1 allure generate --single-file artifacts/reports/allure-results -o artifacts/reports/allure-report --clean`;
      pkg.scripts['report:open'] =
        `${xenv} ALLURE_NO_ANALYTICS=1 allure open artifacts/reports/allure-report`;
    } else if (a.reporter === 'monocart') {
      // Monocart: build & open report (npm/yarn aware)
      pkg.scripts['report:open'] =
        `${pmBin} monocart show-report artifacts/reports/monocart-report/index.json --open`;
    } else if (a.reporter === 'html') {
      // Playwright built-in HTML report (npm/yarn aware)
      pkg.scripts['report:open'] = `${pmBin} playwright show-report`;
    }

    await writeJSON(pkgPath, pkg);
  });

  // --- Include best-practices docs ---
  await step('Include docs', async () => {
    await copyDir(TPL('docs/best-practices'), path.join(dest, 'docs/best-practices'));
  });
}
