/* eslint-disable @typescript-eslint/no-explicit-any */
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { exists, makeTmpDir, readJSON, runCLI } from './helpers';

const distEntry = path.resolve(process.cwd(), 'dist/index.js'); // your built CLI

function toArgs(name: string, c: any): string[] {
  const args = [
    'init',
    name,
    '--pm',
    c.pm,
    '--reporter',
    c.reporter,
    '--ci',
    c.ci,
    '--preset',
    c.preset,
  ];
  if (c.lang === 'js') args.push('--js');
  if (c.husky === false) args.push('--no-husky');
  if (c.zephyr === true) args.push('--zephyr');
  // non-interactive
  args.push('-y');
  return args;
}

describe('init (additional matrix)', () => {
  const cases = [
    {
      id: 'web-allure-npm-ts',
      pm: 'npm',
      reporter: 'allure',
      ci: 'github',
      lang: 'ts',
      preset: 'web',
      husky: true,
      zephyr: false,
    },
    {
      id: 'api-monocart-yarn-js-zephyr',
      pm: 'yarn',
      reporter: 'monocart',
      ci: 'gitlab',
      lang: 'js',
      preset: 'api',
      husky: true,
      zephyr: true,
    },
    {
      id: 'hybrid-html-npm-ts-nohusky',
      pm: 'npm',
      reporter: 'html',
      ci: 'none',
      lang: 'ts',
      preset: 'hybrid',
      husky: false,
      zephyr: false,
    },
    {
      id: 'api-allure-yarn-ts-zephyr-nohusky',
      pm: 'yarn',
      reporter: 'allure',
      ci: 'github',
      lang: 'ts',
      preset: 'api',
      husky: false,
      zephyr: true,
    },

    // Additional permutations to increase coverage
    {
      id: 'web-allure-yarn-gitlab-ts-zephyr',
      pm: 'yarn',
      reporter: 'allure',
      ci: 'gitlab',
      lang: 'ts',
      preset: 'web',
      husky: true,
      zephyr: true,
    },
    {
      id: 'api-monocart-npm-none-js-nohusky',
      pm: 'npm',
      reporter: 'monocart',
      ci: 'none',
      lang: 'js',
      preset: 'api',
      husky: false,
      zephyr: false,
    },
    {
      id: 'hybrid-html-yarn-github-js-husky',
      pm: 'yarn',
      reporter: 'html',
      ci: 'github',
      lang: 'js',
      preset: 'hybrid',
      husky: true,
      zephyr: false,
    },
    {
      id: 'api-allure-npm-gitlab-js-zephyr-nohusky',
      pm: 'npm',
      reporter: 'allure',
      ci: 'gitlab',
      lang: 'js',
      preset: 'api',
      husky: false,
      zephyr: true,
    },

    // SOAP preset coverage
    {
      id: 'soap-allure-npm-ts',
      pm: 'npm',
      reporter: 'allure',
      ci: 'github',
      lang: 'ts',
      preset: 'soap',
      husky: true,
      zephyr: false,
    },
    {
      id: 'web-monocart-yarn-github-ts-husky',
      pm: 'yarn',
      reporter: 'monocart',
      ci: 'github',
      lang: 'ts',
      preset: 'web',
      husky: true,
      zephyr: false,
    },
    {
      id: 'web-html-npm-none-ts-nohusky',
      pm: 'npm',
      reporter: 'html',
      ci: 'none',
      lang: 'ts',
      preset: 'web',
      husky: false,
      zephyr: false,
    },
  ] as const;

  for (const c of cases) {
    it(`scaffolds and wires deps: ${c.id}`, async () => {
      const tmp = makeTmpDir();
      const name = `proj-${c.id}`;
      const { out, exitCode } = await runCLI(tmp, 'node', [distEntry, ...toArgs(name, c)]);

      expect(exitCode).toBe(0);
      expect(out).toMatch(/Create project folder/i);

      const root = path.join(tmp, name);
      const pkg = readJSON(path.join(root, 'package.json'));

      // package manager yarn should add yarn dep
      if (c.pm === 'yarn') {
        expect(pkg.dependencies?.yarn).toBeTruthy();
      }

      // preset-specific wiring
      if (c.preset === 'api' || c.preset === 'hybrid') {
        expect(pkg.devDependencies?.express || pkg.dependencies?.express).toBeTruthy();
      }

      // SOAP preset wiring
      if (c.preset === 'soap' || c.preset === 'hybrid') {
        expect(pkg.devDependencies?.['fast-xml-parser']).toBeTruthy();
      }

      // reporter dependencies
      if (c.reporter === 'allure') {
        expect(pkg.devDependencies?.['allure-playwright']).toBeTruthy();
        expect(pkg.devDependencies?.['allure-commandline']).toBeTruthy();
      } else if (c.reporter === 'monocart') {
        expect(pkg.devDependencies?.['monocart-reporter']).toBeTruthy();
      }

      // notifications default to true for non-interactive; zephyr toggles presence of publications
      if (c.zephyr) {
        expect(exists(path.join(root, 'src', 'tools', 'publications'))).toBe(true);
      }

      // husky wiring
      if (c.husky === false) {
        expect(pkg.scripts?.prepare).toBeUndefined();
        expect(exists(path.join(root, '.husky'))).toBe(false);
      } else {
        expect(pkg.scripts?.prepare).toBe('husky');
        expect(exists(path.join(root, '.husky', 'commit-msg'))).toBe(true);
      }

      // preset files
      if (c.preset === 'web') {
        expect(exists(path.join(root, 'src', 'pages'))).toBe(true);
        expect(exists(path.join(root, 'tests', 'ui'))).toBe(true);
      }
      if (c.preset === 'api') {
        expect(exists(path.join(root, 'src', 'services'))).toBe(true);
        expect(exists(path.join(root, 'tests', 'api'))).toBe(true);
      }
      if (c.preset === 'hybrid') {
        // UI artifacts
        expect(exists(path.join(root, 'src', 'pages'))).toBe(true);
        expect(exists(path.join(root, 'tests', 'ui'))).toBe(true);

        // API artifacts
        expect(exists(path.join(root, 'src', 'services'))).toBe(true);
        expect(exists(path.join(root, 'tests', 'api'))).toBe(true);
        expect(exists(path.join(root, 'src', 'data', 'api'))).toBe(true);

        // SOAP artifacts
        expect(exists(path.join(root, 'src', 'services', 'soap'))).toBe(true);
        expect(exists(path.join(root, 'tests', 'soap'))).toBe(true);
        expect(exists(path.join(root, 'src', 'data', 'soap'))).toBe(true);
      }
      if (c.preset === 'soap') {
        expect(exists(path.join(root, 'src', 'services', 'soap'))).toBe(true);
        expect(exists(path.join(root, 'tests', 'soap'))).toBe(true);
        expect(exists(path.join(root, 'src', 'data', 'soap'))).toBe(true);
      }
    }, 120_000);
  }
});
