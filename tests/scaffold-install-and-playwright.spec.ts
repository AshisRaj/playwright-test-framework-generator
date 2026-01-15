import { readFileSync, statSync } from 'fs';
import path, { join } from 'path';
import { describe, expect, it } from 'vitest';
import { runCLI } from './helpers';

const distEntry = path.resolve(process.cwd(), 'dist/index.js'); // your built CLI

describe('Scaffolded projects: install, check, and playwright', () => {
  it(`npm i -> npm run check -> npx playwright test --reporter html`, async () => {
    const testProjectName = `pw-tests-${Date.now()}`;
    const scaffoldTestDir = path.join(process.cwd(), testProjectName);
    let res = await runCLI(process.cwd(), `mkdir`, [testProjectName]);
    console.log('Created test dir:', testProjectName, res);

    const args = ['init', testProjectName, '--pm', 'npm', '-y'];
    const { exitCode } = await runCLI(process.cwd(), 'node', [distEntry, ...args]);
    expect(exitCode).toBe(0);

    res = await runCLI(scaffoldTestDir, 'npm', ['i']);
    console.log(`npm install output for ${scaffoldTestDir}:\n`, res.out);
    expect(res.exitCode).toBe(0);
    expect(res.out).toMatch(/added \d+ packages, and audited \d+ packages in|up to date/i);

    // Check if the project has a 'check' script
    res = await runCLI(scaffoldTestDir, 'npm', ['run', 'check']);
    expect(res.exitCode).toBe(0);

    res = await runCLI(scaffoldTestDir, 'npm', ['run', 'check']);
    if (res.exitCode !== 0) throw new Error(`'npm run check' failed in ${scaffoldTestDir}`);
    res = await runCLI(scaffoldTestDir, 'npx', ['playwright', 'test', '--reporter', 'html']);
    expect(res.exitCode).toBe(0);
    // correct this regex for this string: Running 13 tests using 1 worker
    expect(res.out).toMatch(/Running \d+ tests using \d+ worker/i);

    // Ensure the HTML report was generated
    const reportPath = join(scaffoldTestDir, 'playwright-report', 'index.html');
    expect(statSync(reportPath).isFile()).toBe(true);

    // Optionally, you can also check if the report contains expected content
    const reportContent = readFileSync(reportPath, 'utf8');
    expect(reportContent).toContain('Playwright Test Report');
  });
});
