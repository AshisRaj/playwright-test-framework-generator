import path from 'path';
import { describe, expect, it } from 'vitest';
import { makeTmpDir, runCLI } from './helpers';

const distEntry = path.resolve(process.cwd(), 'dist/index.js'); // your built CLI

describe('CLI help', () => {
  it('prints help for `init -h` with all options', async () => {
    const tmp = makeTmpDir();
    const { out, exitCode } = await runCLI(tmp, 'node', [distEntry, 'init', '-h']);

    // Commander usually exits 0 for help
    expect(exitCode).toBe(0);

    // Top usage line (escape [options])
    expect(out).toMatch(
      /^Usage:\s+playwright-test-framework-generator init \[options\] <project-name>/im,
    );

    // Arguments section
    expect(out).toMatch(/Arguments:\s+project-name\s+folder to create/im);

    // Options section
    expect(out).toMatch(/Options:/i);

    // Key options present in help output
    // Update these expectations when options change
    expect(out).toMatch(/-y, --yes\s+Use defaults and skip prompts \(default: false\)/i);
    expect(out).toMatch(/--non-interactive\s+Alias of --yes \(default: false\)/i);
    expect(out).toMatch(/--pm <name>\s+Package manager \(npm\|yarn\) \(default: "npm"\)/i);
    expect(out).toMatch(/--js\s+Use JavaScript instead of TypeScript \(default:\s+false\)/i);
    expect(out).toMatch(
      /--ci <provider>\s+CI provider \(github\|gitlab\|none\) \(default:\s+"github"\)/i,
    );
    expect(out).toMatch(
      /--reporter <name>\s+Test reporter \(html\|allure\|monocart\) \(default:\s+"allure"\)/i,
    );
    expect(out).toMatch(
      /--notifications <channels...>\s+Notifications \(email,slack,teams\) \(default:\s+true\)/i,
    );
    expect(out).toMatch(/--zephyr\s+Include Zephyr results stub \(default: false\)/i);
    expect(out).toMatch(/--no-husky\s+Skip Husky hooks/i);
    expect(out).toMatch(
      /--preset <name>\s+Quick preset \(web\|api\|soap\|hybrid\) \(default:\s+"web"\)/i,
    );
    expect(out).toMatch(/-h, --help\s+display help for command/i);
  });
});
