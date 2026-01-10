import { spawnSync } from 'child_process';
import { readdirSync, readFileSync, statSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { describe, expect, it } from 'vitest';

const roots = [process.cwd(), tmpdir()];
const prefixes = ['pw-tests-', 'playwright-test-framework-generator-'];
const scaffoldDirs = roots.flatMap((root) => {
  try {
    return readdirSync(root)
      .filter((name) => {
        try {
          return (
            prefixes.some((p) => name.startsWith(p)) && statSync(join(root, name)).isDirectory()
          );
        } catch {
          return false;
        }
      })
      .map((name) => ({ name, root }));
  } catch {
    return [] as Array<{ name: string; root: string }>;
  }
});

describe('Scaffolded projects: install, check, and playwright', () => {
  it('has at least one scaffolded `pw-tests-*` project', () => {
    expect(scaffoldDirs.length).toBeGreaterThan(0);
  });

  for (const { name, root: dirRoot } of scaffoldDirs) {
    it(
      `${name}: npm i -> npm run check -> npx playwright test --reporter html`,
      () => {
        const cwd = join(dirRoot, name);

        const run = (cmd: string, args: string[]) => {
          const res = spawnSync(cmd, args, { cwd, shell: true, encoding: 'utf8', stdio: 'pipe' });
          const out = (res.stdout || '') + (res.stderr || '');
          return { code: res.status ?? 0, out };
        };

        let r = run('npm', ['i']);
        console.log(`== ${name} : npm i output ==\n${r.out}`);
        if (r.code !== 0) throw new Error(`'npm i' failed in ${name}\n${r.out}`);

        // only run `npm run check` if the package.json defines the script
        let pkgHasCheck = false;
        try {
          const pkg = JSON.parse(readFileSync(join(cwd, 'package.json'), 'utf8'));
          pkgHasCheck = !!(pkg.scripts && pkg.scripts.check);
        } catch (e) {
          // if package.json can't be read, fail early
          throw new Error(`could not read package.json in ${name}: ${String(e)}`);
        }

        if (pkgHasCheck) {
          r = run('npm', ['run', 'check']);
          console.log(`== ${name} : npm run check output ==\n${r.out}`);
          if (r.code !== 0) throw new Error(`'npm run check' failed in ${name}\n${r.out}`);
        } else {
          console.log(`== ${name} : skipping 'npm run check' (script not present) ==`);
        }

        r = run('npx', ['playwright', 'test', '--reporter', 'html']);
        console.log(`== ${name} : npx playwright output ==\n${r.out}`);
        if (r.code !== 0) throw new Error(`'npx playwright test' failed in ${name}\n${r.out}`);
      },
      { timeout: 0 },
    );
  }
});
