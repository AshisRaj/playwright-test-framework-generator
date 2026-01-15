import { readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';
import { describe, expect, it } from 'vitest';
import { runCLI } from './helpers';

const root = process.cwd();
const scaffoldDirs = readdirSync(root).filter((name) => {
  try {
    return name.startsWith('pw-tests-') && statSync(join(root, name)).isDirectory();
  } catch {
    return false;
  }
});

describe('Scaffolded projects: install, check, and playwright', () => {
  it('has at least one scaffolded `pw-tests-*` project', () => {
    expect(scaffoldDirs.length).toBeGreaterThan(0);
  });

  for (const dir of scaffoldDirs) {
    it(
      `${dir}: npm i -> npm run check -> npx playwright test --reporter html`,
      async () => {
        const cwd = join(root, dir);

        const { out, exitCode } = await runCLI(cwd, 'npm', ['i']);
        expect(exitCode).toBe(0);
        expect(out).toMatch(/added \d+ packages, and audited \d+ packages in|up to date/i);

        // Check if the project has a 'check' script
        let res = await runCLI(cwd, 'npm', ['run', 'check']);
        expect(res.exitCode).toBe(0);

        res = await runCLI(cwd, 'npm', ['run', 'check']);
        if (res.exitCode !== 0) throw new Error(`'npm run check' failed in ${dir}`);

        res = await runCLI(cwd, 'npx', ['playwright', 'test', '--reporter', 'html']);
        expect(res.exitCode).toBe(0);
        // correct this regex for this string: Running 13 tests using 1 worker
        expect(res.out).toMatch(/Running \d+ tests using \d+ worker/i);

        // Ensure the HTML report was generated
        const reportPath = join(cwd, 'playwright-report', 'index.html');
        expect(statSync(reportPath).isFile()).toBe(true);

        // Optionally, you can also check if the report contains expected content
        const reportContent = readFileSync(reportPath, 'utf8');
        expect(reportContent).toContain('Playwright Test Report');
      },
      { timeout: 0 },
    );
  }
});
