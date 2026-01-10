import { spawn, spawnSync } from 'child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'fs';
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
          const full = join(root, name);
          const hasPkg = existsSync(join(full, 'package-lock.json'));
          return prefixes.some((p) => name.startsWith(p)) && statSync(full).isDirectory() && hasPkg;
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
      { timeout: 0 },
      async () => {
        const cwd = join(dirRoot, name);

        // if there's no package.json, this scaffold is incomplete — skip it
        const pkgPath = join(cwd, 'package.json');
        try {
          statSync(pkgPath);
        } catch {
          console.log(`== ${name} : missing package.json, skipping install/check/playwright ==`);
          return;
        }

        const run = (cmd: string, args: string[]) => {
          const res = spawnSync(cmd, args, { cwd, shell: true, encoding: 'utf8', stdio: 'pipe' });
          const out = (res.stdout || '') + (res.stderr || '');
          return { code: res.status ?? 0, out };
        };

        let r = run('npm', ['i']);
        console.log(`== ${name} : npm i output ==\n${r.out}`);
        if (r.code !== 0) throw new Error(`'npm i' failed in ${name}\n${r.out}`);

        // read package.json to detect `start` and `check` scripts
        let pkgHasCheck = false;
        let pkgHasStart = false;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let pkg: any = {};
        try {
          pkg = JSON.parse(readFileSync(join(cwd, 'package.json'), 'utf8'));
          pkgHasCheck = !!(pkg.scripts && pkg.scripts.check);
          pkgHasStart = !!(pkg.scripts && pkg.scripts.start);
        } catch (e) {
          throw new Error(`could not read package.json in ${name}: ${String(e)}`);
        }

        // start server if needed
        let serverProc: ReturnType<typeof spawn> | null = null;
        if (pkgHasStart) {
          serverProc = spawn('npm', ['start'], { cwd, shell: true, stdio: 'pipe' });
          serverProc.stdout?.on('data', (d) =>
            console.log(`== ${name} server stdout ==\n${d.toString()}`),
          );
          serverProc.stderr?.on('data', (d) =>
            console.error(`== ${name} server stderr ==\n${d.toString()}`),
          );
          // give the server a moment to boot
          await new Promise((res) => setTimeout(res, 3000));
        }

        try {
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
        } finally {
          if (serverProc) {
            try {
              serverProc.kill('SIGTERM');
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (e) {
              /* ignore */
            }
          }
        }
      },
    );
  }
});
