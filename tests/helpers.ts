import { execa } from 'execa';
import fs from 'fs-extra';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import stripAnsi from 'strip-ansi';

/**
 * Create a temporary directory
 * @param prefix
 * @returns The path to the created temporary directory
 */
export const makeTmpDir = (prefix = 'playwright-test-framework-generator-') => {
  const dir = mkdtempSync(path.join(tmpdir(), prefix));
  return dir;
};

/**
 * Run a CLI command in a given directory
 * @param cwd
 * @param command
 * @param args
 * @param env
 * @returns The result of the CLI command execution
 */
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

/**
 * Read and parse JSON file
 * @param file
 * @returns The parsed JSON object
 */
export const readJSON = (file: string) => {
  return JSON.parse(readFileSync(file, 'utf8'));
};

/**
 * Check if path exists
 * @param p
 * @returns Whether the path exists
 */
export const exists = (p: string) => {
  return fs.pathExistsSync(p);
};

/**
 * Read file as string
 * @param file
 * @returns The content of the file as a string
 */
export const read = (file: string) => {
  return readFileSync(file, 'utf8');
};

/**
 * Get size of file or directory
 * @param p
 * @returns The size of the file or directory in bytes
 */
export const getSize = (p: string): number => {
  const stats = fs.statSync(p);
  if (stats.isFile()) {
    return stats.size;
  } else if (stats.isDirectory()) {
    let totalSize = 0;
    const files = fs.readdirSync(p);
    for (const file of files) {
      totalSize += getSize(path.join(p, file));
    }
    return totalSize;
  }
  return 0;
};
