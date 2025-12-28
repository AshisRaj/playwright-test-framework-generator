import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { exists, makeTmpDir, read, readJSON, runCLI } from './helpers';

// helper to build args from a case
function toArgs(name: string, c: any): string[] {
  const args = ['init', name, '--pm', c.pm, '--reporter', c.reporter, '--ci', c.ci];
  if (c.lang === 'js') args.push('--js');
  if (c.husky === false) args.push('--no-husky');
  // non-interactive
  args.push('-y');
  return args;
}

// Assertions that adapt to options
function expectScripts(pkg: any, c: any) {
  const pmBin = c.pm === 'yarn' ? 'yarn' : 'npx';
  const xenv = `${pmBin} cross-env`;

  // core test scripts
  expect(pkg.scripts.test).toMatch(`playwright test`);
  expect(pkg.scripts['test:ui']).toMatch(`playwright test --ui`);
  expect(pkg.scripts['test:headed']).toMatch(`playwright test --headed`);

  if (c.reporter === 'allure') {
    // cross-env should be prefixed by pmBin
    expect(pkg.scripts['report:generate']).toBe(
      `${xenv} ALLURE_NO_ANALYTICS=1 allure generate --single-file artifacts/reports/allure-results -o artifacts/reports/allure-report --clean`,
    );
    expect(pkg.scripts['report:open']).toBe(
      `${xenv} ALLURE_NO_ANALYTICS=1 allure open artifacts/reports/allure-report`,
    );
  } else if (c.reporter === 'monocart') {
    expect(pkg.scripts['report:open']).toBe(
      `${pmBin} monocart show-report artifacts/reports/monocart-report/index.json --open`,
    );
  } else if (c.reporter === 'html') {
    expect(pkg.scripts['report:open']).toBe(`${pmBin} playwright show-report`);
  } else if (c.reporter === 'list') {
    // no openable report for list
    expect(pkg.scripts['report:open']).toBeUndefined();
  }

  // Husky wiring
  if (c.husky === false) {
    expect(pkg.scripts.prepare).toBeUndefined();
    expect(pkg['lint-staged']).toBeUndefined();
  } else {
    expect(pkg.scripts.prepare).toBe('husky');
    expect(pkg['lint-staged']).toBeTruthy();
  }
}

function expectFiles(root: string, c: any) {
  // base files always
  if (['github', 'gitlab'].includes(c.ci)) {
    expect(
      exists(
        path.join(
          root,
          c.ci === 'github'
            ? ['.github', 'workflows', 'github-ci.yml'].join(path.sep)
            : '.gitlab-ci.yml',
        ),
      ),
    ).toBe(true);
  }

  if (c.husky === true) {
    expect(exists(path.join(root, '.husky', 'commit-msg'))).toBe(true);
    expect(exists(path.join(root, '.husky', 'pre-commit'))).toBe(true);
  }
  expect(exists(path.join(root, '.vscode', 'settings.json'))).toBe(true);
  expect(exists(path.join(root, '.vscode', 'extensions.json'))).toBe(true);

  if (['allure', 'monocart'].includes(c.reporter)) {
    expect(
      exists(
        path.join(
          root,
          'docs',
          'reporters',
          c.reporter === 'allure' ? 'allure' : 'monocart',
          'README.md',
        ),
      ),
    ).toBe(true);
  }

  expect(exists(path.join(root, '.vscode', 'extensions.json'))).toBe(true);

  expect(exists(path.join(root, 'package.json'))).toBe(true);

  expect(exists(path.join(root, 'playwright.config.ts'))).toBe(true);
  expect(exists(path.join(root, 'src', 'utils', 'global-setup.ts'))).toBe(true);
  expect(exists(path.join(root, 'src', 'utils', 'global-teardown.ts'))).toBe(true);
  // custom reporter always included with runner=playwright
  expect(exists(path.join(root, 'src', 'reporters', 'custom-reporter.ts'))).toBe(true);
}

describe('init (matrix)', () => {
  const cases = [
    // minimal TS + npm + allure + playwright + github + husky on
    {
      id: 'ts-npm-allure-pw-gh-husky',
      lang: 'ts',
      pm: 'npm',
      reporter: 'allure',
      ci: 'github',
      husky: true,
    },
    // monocart + yarn
    {
      id: 'ts-yarn-monocart-pw-gh-husky',
      lang: 'ts',
      pm: 'yarn',
      reporter: 'monocart',
      ci: 'github',
      husky: true,
    },
    // html + npm + gitlab
    {
      id: 'js-npm-html-pw-gl-nohusky',
      lang: 'js',
      pm: 'npm',
      reporter: 'html',
      ci: 'gitlab',
      husky: false,
    },
    // list + yarn + none runner
    {
      id: 'ts-yarn-list-none-none-husky',
      lang: 'ts',
      pm: 'yarn',
      ci: 'none',
      reporter: 'monocart',
      husky: true,
    },
  ] as const;

  for (const c of cases) {
    it(`scaffolds: ${c.id}`, async () => {
      const tmp = makeTmpDir();
      const name = `proj-${c.id}`;
      const { out, exitCode } = await runCLI(tmp, toArgs(name, c));

      expect(exitCode).toBe(0);
      expect(out).toMatch(/Create project folder/i);

      const root = path.join(tmp, name);
      const pkg = readJSON(path.join(root, 'package.json'));
      expect(pkg.type).toBe('module');

      // Files & scripts according to options
      expectFiles(root, c);
      expectScripts(pkg, c);

      // Playwright config sanity where applicable
      const cfg = read(path.join(root, 'playwright.config.ts'));
      // reporter presence
      if (c.reporter === 'allure') {
        expect(cfg).toMatch(/"allure-playwright", {/);
        expect(cfg).toMatch(/resultsDir: .*allure-results/);
      }
      if (c.reporter === 'monocart') {
        expect(cfg).toMatch(/"monocart-reporter", {/);
        expect(cfg).toMatch(/outputFile: .*monocart-report.*index\.html/);
      }

      expect(cfg).toMatch(/reportMetaData = \s*new MetadataBuilder()/);
      // custom reporter also present
      expect(cfg).toMatch(/\.\/src\/reporters\/custom-reporter\.ts/);

      // custom reporter file exists
      expect(exists(path.join(root, 'src', 'reporters', 'custom-reporter.ts'))).toBe(true);
      // path safety
      expect(cfg).toMatch(/PROJECT_ROOT|fileURLToPath/);
    }, 120_000);
  }
});
