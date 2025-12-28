import { execa } from 'execa';
import fs from 'fs-extra';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import stripAnsi from 'strip-ansi';

export const makeTmpDir = (prefix = 'gl-pw-gen-') => {
  const dir = mkdtempSync(path.join(tmpdir(), prefix));
  console.log(`dir name - ${dir}`);
  return dir;
};

export const runCLI = async (cwd: string, args: string[], env: Record<string, string> = {}) => {
  const bin = 'node';
  const distEntry = path.resolve(process.cwd(), 'dist/index.js'); // your built CLI
  const cmdArgs = [distEntry, ...args];
  const proc = await execa(bin, cmdArgs, {
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
