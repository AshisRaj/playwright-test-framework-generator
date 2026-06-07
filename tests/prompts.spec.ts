/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it } from 'vitest';
import { askQuestions } from '../src/prompts.js';

describe('askQuestions (non-interactive flags mapping)', () => {
  it('maps flags to Answers correctly (js, yarn, gitlab, monocart, no-husky, zephyr)', async () => {
    const flags = {
      yes: true,
      js: true,
      pm: 'yarn',
      ci: 'gitlab',
      reporter: 'monocart',
      husky: false,
      zephyr: true,
      preset: 'api',
      notifications: false,
    } as any;

    const ans = await askQuestions('myproj', flags);

    expect(ans.projectName).toBe('myproj');
    expect(ans.language).toBe('js');
    expect(ans.packageManager).toBe('yarn');
    expect(ans.ci).toBe('gitlab');
    expect(ans.reporter).toBe('monocart');
    expect(ans.husky).toBe(false);
    expect(ans.zephyr).toBe(true);
    expect(ans.preset).toBe('api');
    expect(ans.notifications).toBe(false);
  });

  it('applies defaults when flags are sparse', async () => {
    const flags = { yes: true } as any;
    const ans = await askQuestions('p2', flags);

    // defaults as declared in prompts.ts
    expect(ans.projectName).toBe('p2');
    expect(ans.language).toBe('ts');
    expect(ans.packageManager).toBe('npm');
    expect(ans.ci).toBe('github');
    expect(ans.reporter).toBe('allure');
    expect(ans.husky).toBe(true);
    expect(ans.zephyr).toBe(false);
    expect(ans.preset).toBe('web');
    expect(ans.notifications).toBe(true);
  });

  it('maps flags to Answers correctly for soap preset (js, npm, github, allure, husky)', async () => {
    const flags = {
      yes: true,
      js: true,
      pm: 'npm',
      ci: 'github',
      reporter: 'allure',
      husky: true,
      preset: 'soap',
      notifications: true,
    } as any;

    const ans = await askQuestions('soapproj', flags);

    expect(ans.projectName).toBe('soapproj');
    expect(ans.language).toBe('js');
    expect(ans.packageManager).toBe('npm');
    expect(ans.ci).toBe('github');
    expect(ans.reporter).toBe('allure');
    expect(ans.husky).toBe(true);
    expect(ans.preset).toBe('soap');
    expect(ans.notifications).toBe(true);
  });
});
