import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ora from 'ora';
import { copyDir, renderAndCopyDir, writeJSON } from './files.js';
import type { Answers } from './prompts.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TPL = (p: string) => path.join(__dirname, '..', 'templates', p);

export async function scaffold(a: Answers) {
  const dest = path.resolve(process.cwd(), a.projectName);

  const spin = ora({ spinner: 'dots' });
  const step = async (label: string, fn: () => Promise<void>) => {
    spin.start(label);
    try {
      await fn();
      spin.succeed(label);
    } catch (err) {
      spin.fail(label);
      throw err;
    }
  };

  await step(`Create project folder: ${a.projectName}`, async () => {
    await fs.mkdir(dest, { recursive: true });
  });

  // 1) Base files
  await step(
    'Scaffold base files and folders (.vscode/, .editorconfig, .gitignore, .prettierignore, .prettierrc, eslint.config.js, package.json, README.md, tsconfig.json)',
    async () => {
      await renderAndCopyDir(TPL('base'), dest, a);
    },
  );

  // 2) Playwright structure
  await step(
    'Add Playwright structure (src => config, data, environments, fixtures, helpers, pages, reporters, services, utils, tests => cart, checkout, inventory), playwright.config.ts)',
    async () => {
      await renderAndCopyDir(TPL('playwright'), dest, a);
    },
  );

  // 3) Reporters:  Allure / Monocart / html
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

  // 4) package.json dependency wiring
  const pkgPath = path.join(dest, 'package.json');
  const pkg = JSON.parse((await fs.readFile(pkgPath)).toString());

  const deps: Record<string, string> = {
    '@playwright/test': '^1.51.1',
    axios: '^1.9.0',
    dotenv: '^16.5.0',
    yarn: a.packageManager === 'yarn' ? '^1.22.22' : (undefined as any),
  };
  const devDeps: Record<string, string> = {
    // core tooling
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
    'allure-playwright': a.reporter === 'allure' ? '^3.2.1' : (undefined as any),
    // Add the command-line if user chose Allure
    'allure-commandline': a.reporter === 'allure' ? '^2.34.1' : (undefined as any),
    // Add Monocart only when chosen
    'monocart-reporter': a.reporter === 'monocart' ? '^2.9.18' : (undefined as any),
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
      : {}),
    ...(a.notifications
      ? {
          nodemailer: '^7.0.11',
          '@slack/webhook': '^7.0.6',
          '@types/nodemailer': '^7.0.4',
        }
      : {}),
  };

  // 5) Doc structure
  await step('Include docs', async () => {
    await copyDir(TPL('docs/best-practices'), path.join(dest, 'docs/best-practices'));
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
}
