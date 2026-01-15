import { readFileSync, statSync } from 'fs';
import path, { join } from 'path';
import { describe, expect, it } from 'vitest';
import { runCLI } from './helpers';

const distEntry = path.resolve(process.cwd(), 'dist/index.js'); // your built CLI

describe('Scaffolded projects: install, check, and playwright', () => {
  it(`npm i -> npm run check -> npx playwright test --reporter html`, async () => {
    // Create a temporary directory for the test project
    const testProjectName = `pw-tests-${Date.now()}`;
    const scaffoldTestDir = path.join(process.cwd(), testProjectName);
    let res = await runCLI(process.cwd(), `mkdir`, [testProjectName]);
    console.log('Created test dir:', testProjectName, res);

    // Scaffold the project
    const args = [
      'init',
      testProjectName,
      '--pm',
      'npm',
      '--preset',
      'soap',
      '--reporter',
      'html',
      '-y',
    ];
    const { exitCode } = await runCLI(process.cwd(), 'node', [distEntry, ...args]);
    expect(exitCode).toBe(0);

    // Install dependencies
    res = await runCLI(scaffoldTestDir, 'npm', ['i']);
    console.log(`npm install output for ${scaffoldTestDir}:\n`, res.out);
    expect(res.exitCode).toBe(0);
    expect(res.out).toMatch(/added \d+ packages, and audited \d+ packages in|up to date/i);

    // Check if the project has a 'check' script
    res = await runCLI(scaffoldTestDir, 'npm', ['run', 'check']);
    expect(res.exitCode).toBe(0);
    expect(res.out).toMatch(/tsc --noEmit/);
    expect(res.out).toMatch(/eslint . --fix --max-warnings 0 --no-cache/);

    // Run Playwright tests with HTML reporter
    res = await runCLI(scaffoldTestDir, 'npm', ['run', 'test:headed']);
    expect(res.exitCode).toBe(0);
    expect(res.out).toMatch(/Test run started with \d+ tests/i);

    // Ensure the HTML report was generated
    const reportPath = join(scaffoldTestDir, 'artifacts', 'reports', 'html-reports', 'index.html');
    expect(statSync(reportPath).isFile()).toBe(true);

    // Optionally, you can also check if the report contains expected content
    const reportContent = readFileSync(reportPath, 'utf8');
    expect(reportContent).toContain('Playwright E2E Framework');
  });
});
