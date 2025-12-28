import { describe, expect, it } from 'vitest';
import { makeTmpDir, runCLI } from './helpers';

describe('CLI help', () => {
  it('prints help for `init -h` with all options', async () => {
    const tmp = makeTmpDir();
    const { out, exitCode } = await runCLI(tmp, ['init', '-h']);

    // Commander usually exits 0 for help
    expect(exitCode).toBe(0);

    // Top usage line (escape [options])
    expect(out).toMatch(/^Usage:\s+gl-pw-gen init \[options\] <project-name>/im);

    // Key options present in help output
    expect(out).toMatch(/--pm <name>.*Package manager.*\(npm\|yarn\)/i);
    expect(out).toMatch(/--js\b.*Use JavaScript instead of TypeScript/i);
    expect(out).toMatch(/--ci <provider>.*\(github\|gitlab\|none\)/i);
    expect(out).toMatch(/--reporter <name>.*\(html\|allure\|monocart\)/i);
    expect(out).toMatch(/-y, --yes\b.*Use defaults and skip prompts/i);
    expect(out).toMatch(/--non-interactive\b.*Alias of --yes/i);

    // New/extra options observed in actual help output
    expect(out).toMatch(/--notify <channels\.\.\.>.*Notifications.*\(email\|slack\|teams\)/i);
    expect(out).toMatch(/--zephyr\b/);
    expect(out).toMatch(/--no-husky\b/);
    expect(out).toMatch(/--preset <name>.*Quick preset.*\(web\|api\|hybrid\)/i);
    expect(out).toMatch(/-h, --help\b.*display help for command/i);
  });
});
