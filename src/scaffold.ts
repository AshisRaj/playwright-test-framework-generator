/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ora from 'ora';
import { copyDir, ensureDir, renderAndCopyDir, writeJSON } from './files.js';
import type { Answers } from './prompts.js';

// Determine __dirname in ES module scope
const dirname = path.dirname(fileURLToPath(import.meta.url));

// Template path helper
const TPL = (p: string) => path.join(dirname, '..', 'templates', p);

/**
 * Scaffold a new project based on answers
 * @param a The answers object containing user selections
 */
export async function scaffold(a: Answers) {
  const dest = path.resolve(process.cwd(), a.projectName);

  const spinner = ora(`Scaffolding project: ${a.projectName}...`).start();

  setTimeout(() => {
    spinner.color = 'yellow';
  }, 1000);

  // Step helper
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

  // Create project directory
  await step(`Create project folder: ${a.projectName}`, async () => {
    await fs.mkdir(dest, { recursive: true });
  });

  // Base files and folders
  await step(
    'Scaffold base files and folders (.vscode/, .editorconfig, .gitignore, .prettierignore, .prettierrc, eslint.config.js, package.json, README.md, tsconfig.json)',
    async () => {
      await renderAndCopyDir(TPL('base'), dest, a);
    },
  );

  // Playwright-specific structure
  await step(
    'Add Playwright structure (src => configs, environments, helpers, reporters, utils)',
    async () => {
      ['configs', 'environments', 'helpers', 'reporters', 'utils'].forEach(async (folder) => {
        await renderAndCopyDir(
          TPL(`playwright/src/common/${folder}`),
          path.join(dest, 'src', folder),
          a,
        );
      });
    },
  );

  // Preset-specific structure
  await step('Add Playwright config (playwright.config.ts)', async () => {
    await renderAndCopyDir(TPL('playwright/playwright.config.ts.ejs'), dest, a);
  });

  // Presets: web / api / soap / hybrid
  if (a.preset === 'web') {
    await step('Add Web as preset (UI/POM + fixtures)', async () => {
      await renderAndCopyDir(TPL('playwright/src/pages'), path.join(dest, 'src', 'pages'), a);
      await renderAndCopyDir(
        TPL('playwright/src/fixtures/web'),
        path.join(dest, 'src', 'fixtures'),
        a,
      );
      await renderAndCopyDir(
        TPL('playwright/src/fixtures/index.ts.ejs'),
        path.join(dest, 'src', 'fixtures'),
        a,
      );
      await renderAndCopyDir(
        TPL('playwright/src/data/ui'),
        path.join(dest, 'src', 'data', 'ui'),
        a,
      );
      await renderAndCopyDir(
        TPL('playwright/src/data/index.ts.ejs'),
        path.join(dest, 'src', 'data'),
        a,
      );
      await renderAndCopyDir(TPL('playwright/tests/ui'), path.join(dest, 'tests/ui'), a);
    });
  }
  if (a.preset === 'api') {
    await step('Add API as preset (API Server, services, tests and fixtures)', async () => {
      await renderAndCopyDir(
        TPL('playwright/src/fixtures/api'),
        path.join(dest, 'src', 'fixtures'),
        a,
      );
      await renderAndCopyDir(
        TPL('playwright/src/fixtures/index.ts.ejs'),
        path.join(dest, 'src', 'fixtures'),
        a,
      );
      await renderAndCopyDir(
        TPL('playwright/src/common/servers'),
        path.join(dest, 'src', 'servers'),
        a,
      );
      await renderAndCopyDir(
        TPL('playwright/src/services/api/'),
        path.join(dest, 'src', 'services', 'api'),
        a,
      );
      await renderAndCopyDir(
        TPL('playwright/src/services/index.ts.ejs'),
        path.join(dest, 'src', 'services'),
        a,
      );
      await renderAndCopyDir(
        TPL('playwright/src/data/api/'),
        path.join(dest, 'src', 'data', 'api'),
        a,
      );
      await renderAndCopyDir(
        TPL('playwright/src/data/index.ts.ejs'),
        path.join(dest, 'src', 'data'),
        a,
      );
      await renderAndCopyDir(TPL('playwright/tests/api'), path.join(dest, 'tests/api'), a);
    });
  }
  if (a.preset === 'soap') {
    await step('Add SOAP preset (WSDL client, services, tests and fixtures)', async () => {
      await renderAndCopyDir(
        TPL('playwright/src/fixtures/soap'),
        path.join(dest, 'src', 'fixtures'),
        a,
      );
      await renderAndCopyDir(
        TPL('playwright/src/fixtures/index.ts.ejs'),
        path.join(dest, 'src', 'fixtures'),
        a,
      );
      await renderAndCopyDir(
        TPL('playwright/src/services/soap/'),
        path.join(dest, 'src', 'services', 'soap'),
        a,
      );
      await renderAndCopyDir(
        TPL('playwright/src/services/index.ts.ejs'),
        path.join(dest, 'src', 'services'),
        a,
      );
      await renderAndCopyDir(
        TPL('playwright/src/data/soap'),
        path.join(dest, 'src', 'data', 'soap'),
        a,
      );
      await renderAndCopyDir(
        TPL('playwright/src/data/index.ts.ejs'),
        path.join(dest, 'src', 'data'),
        a,
      );
      await renderAndCopyDir(TPL('playwright/tests/soap'), path.join(dest, 'tests/soap'), a);
    });
  }
  if (a.preset === 'hybrid') {
    await step('Add Hybrid (UI + API + SOAP + Fixtures) as preset', async () => {
      // Add UI part
      await renderAndCopyDir(TPL('playwright/src/pages'), path.join(dest, 'src', 'pages'), a);
      await renderAndCopyDir(
        TPL('playwright/src/fixtures/hybrid'),
        path.join(dest, 'src', 'fixtures'),
        a,
      );
      await renderAndCopyDir(
        TPL('playwright/src/fixtures/index.ts.ejs'),
        path.join(dest, 'src', 'fixtures'),
        a,
      );
      await renderAndCopyDir(TPL('playwright/tests/ui'), path.join(dest, 'tests/ui'), a);
      await renderAndCopyDir(TPL('playwright/tests/api'), path.join(dest, 'tests/api'), a);
      await renderAndCopyDir(TPL('playwright/tests/soap'), path.join(dest, 'tests/soap'), a);

      // Also include API + SOAP artifacts for hybrid (API + SOAP)
      await renderAndCopyDir(
        TPL('playwright/src/common/servers'),
        path.join(dest, 'src', 'servers'),
        a,
      );
      await renderAndCopyDir(
        TPL('playwright/src/services/'),
        path.join(dest, 'src', 'services'),
        a,
      );
      await renderAndCopyDir(
        TPL('playwright/src/services/index.ts.ejs'),
        path.join(dest, 'src', 'services'),
        a,
      );

      await renderAndCopyDir(TPL('playwright/src/data'), path.join(dest, 'src', 'data'), a);
      await renderAndCopyDir(
        TPL('playwright/src/data/index.ts.ejs'),
        path.join(dest, 'src', 'data'),
        a,
      );
      // Ensure common data subfolders exist (some CI checkouts omit empty template dirs)
      await ensureDir(path.join(dest, 'src', 'data', 'api'));
      await ensureDir(path.join(dest, 'src', 'data', 'soap'));
      await ensureDir(path.join(dest, 'src', 'data', 'ui'));
    });
  }

  // Extras: reporters, notifications, CI, husky, zephyr
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

  // Finalize package.json with dependencies and scripts
  const pkgPath = path.join(dest, 'package.json');
  const pkg = JSON.parse((await fs.readFile(pkgPath)).toString());
  let deps: Record<string, string>;
  let devDeps: Record<string, string>;
  // Dependencies and devDependencies
  await step('Prepare package.json dependencies and scripts', async () => {
    deps = {
      '@playwright/test': '^1.51.1',
      axios: '^1.9.0',
      dotenv: '^16.5.0',
      yarn: a.packageManager === 'yarn' ? '^1.22.22' : (undefined as any),
    };
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
        ? { express: '^5.2.1', '@types/express': '^5.0.6' }
        : (undefined as any)),
      // Add the command-line if user chose Allure
      ...(a.reporter !== 'monocart'
        ? {
            'allure-playwright': '^3.2.1',
            'allure-commandline': '^2.34.1',
          }
        : (undefined as any)),
      // Add Monocart only when chosen
      ...(a.reporter === 'monocart'
        ? {
            'monocart-reporter': '^2.9.18',
          }
        : (undefined as any)),

      // TypeScript toolchain (only when TS is chosen)
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
            nodemailer: '^7.0.11',
            '@slack/webhook': '^7.0.6',
            '@types/nodemailer': '^7.0.4',
          }
        : (undefined as any)),
      ...(a.preset === 'api' || a.preset === 'soap' || a.preset === 'hybrid'
        ? {
            ajv: '^8.12.0',
            'ajv-formats': '^2.1.1',
          }
        : (undefined as any)),
      ...(a.preset === 'soap' || a.preset === 'hybrid'
        ? {
            'fast-xml-parser': '^5.3.3',
          }
        : (undefined as any)),
    };
  });

  await step('Finalize package.json', async () => {
    pkg.dependencies = { ...(pkg.dependencies ?? {}), ...deps };
    pkg.devDependencies = {
      ...(pkg.devDependencies ?? {}),
      ...Object.fromEntries(Object.entries(devDeps).filter(([, v]) => v)),
    };
    if (a.husky) {
      pkg['lint-staged'] = {
        '*.{ts,js}': [
          'eslint . --fix --max-warnings 0 --no-cache',
          'prettier -w . --ignore-pattern .prettierignore',
        ],
      };
      pkg.scripts = { ...(pkg.scripts ?? {}), prepare: 'husky' };
    }

    // Reporter-specific scripts (npm vs yarn aware)
    pkg.scripts = pkg.scripts ?? {};
    const pmBin = a.packageManager === 'yarn' ? 'yarn' : 'npx';
    const xenv = `${pmBin} cross-env`;

    if (a.reporter === 'allure') {
      // Generate & open Allure
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

  // Extra docs
  await step('Include docs', async () => {
    await copyDir(TPL('docs/best-practices'), path.join(dest, 'docs/best-practices'));
  });
}
