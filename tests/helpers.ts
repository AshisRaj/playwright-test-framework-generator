import { execa } from 'execa';
import fs from 'fs-extra';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import stripAnsi from 'strip-ansi';

export const makeTmpDir = (prefix = 'playwright-test-framework-generator-') => {
  const dir = mkdtempSync(path.join(tmpdir(), prefix));
  return dir;
};

export const runCLI = async (
  cwd: string,
  command: string,
  args: string[],
  env: Record<string, string> = {},
) => {
  console.log(`Running command: ${command} ${args.join(' ')} in ${cwd}`);
  const proc = await execa(command, args, {
    cwd,
    env: { ...process.env, CI: '1', ...env },
    all: true,
    reject: false, // ← do not throw on non-zero exit
  });
  const out = stripAnsi(proc.all ?? '');
  return {
    out,
    stdout: stripAnsi(proc.stdout ?? ''),
    stderr: stripAnsi(proc.stderr ?? ''),
    exitCode: proc.exitCode ?? 0,
  };
};

export const readJSON = (file: string) => {
  return JSON.parse(readFileSync(file, 'utf8'));
};

export const exists = (p: string) => {
  return fs.pathExistsSync(p);
};

export const read = (file: string) => {
  return readFileSync(file, 'utf8');
};
