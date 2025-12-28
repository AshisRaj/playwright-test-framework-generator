import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { makeTmpDir, read, runCLI } from './helpers';

describe('template validity', () => {
  it('renders VS Code settings and eslint flat config', async () => {
    const tmp = makeTmpDir();
    const name = 'linting';
    await runCLI(tmp, ['init', name, '--pm', 'npm']);
    const root = path.join(tmp, name);
    const vscode = read(path.join(root, '.vscode', 'settings.json'));
    expect(() => JSON.parse(vscode)).not.toThrow();

    const eslint = read(path.join(root, 'eslint.config.js'));
    expect(eslint).toMatch(/export default/);
    expect(eslint).toMatch(/@eslint\/js/);
  });
});
