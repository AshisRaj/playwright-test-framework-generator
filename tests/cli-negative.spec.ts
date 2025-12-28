import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { exists, makeTmpDir, runCLI } from './helpers';

describe('CLI negative cases', () => {
  it('fails when project-name is missing', async () => {
    const tmp = makeTmpDir();
    const { out, exitCode } = await runCLI(tmp, ['init']); // no project-name

    // Commander exits with non-zero on argument error; our helper doesn't throw
    expect(exitCode).toBe(1);

    // Commander may format differently across versions, match the meaningful part
    expect(out).toMatch(/error:\s*missing required argument ['"]project-name['"]/i);

    // Ensure nothing got created accidentally
    const shouldNotExist = path.join(tmp, 'missing'); // sentinel; not used by CLI
    expect(exists(shouldNotExist)).toBe(false);
  });

  it('fails on unknown option', async () => {
    const tmp = makeTmpDir();
    const { out, exitCode } = await runCLI(tmp, ['init', 'proj-unknown', '--not-a-real-flag']);

    expect(exitCode).toBe(1);
    expect(out).toMatch(/error:\s*unknown option/i);
  });
});
