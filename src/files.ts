/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'node:fs/promises';
import path from 'node:path';
import { render } from './render.js';

export async function ensureDir(p: string) {
  await fs.mkdir(p, { recursive: true });
}

export async function copyDir(src: string, dst: string) {
  // If source doesn't exist, create destination dir and return silently.
  try {
    await fs.access(src);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err: any) {
    await ensureDir(dst);
    return;
  }

  await ensureDir(dst);
  for (const entry of await fs.readdir(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dst, entry.name);
    if (entry.isDirectory()) await copyDir(s, d);
    else await fs.copyFile(s, d);
  }
}

export async function renderAndCopyDir(src: string, dst: string, data: any) {
  // If source doesn't exist, ensure destination directory exists and return.
  try {
    await fs.access(src);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err: any) {
    await ensureDir(dst);
    return;
  }

  // If `src` is a file, render/copy that single file into `dst` (which is treated
  // as a directory). Otherwise treat `src` as a directory and walk it.
  const stat = await fs.stat(src);
  if (stat.isFile()) {
    await ensureDir(dst);
    const content = await fs.readFile(src, 'utf8');
    const out = src.endsWith('.ejs') ? render(content, data) : content;
    const destName = path.basename(src).replace(/\.ejs$/, '');
    const destPath = path.join(dst, destName);
    await fs.writeFile(destPath, out, 'utf8');
    return;
  }

  await ensureDir(dst);
  for (const entry of await fs.readdir(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dst, entry.name.replace(/\.ejs$/, ''));
    if (entry.isDirectory()) await renderAndCopyDir(s, d, data);
    else {
      const content = await fs.readFile(s, 'utf8');
      const out = s.endsWith('.ejs') ? render(content, data) : content;
      await fs.writeFile(d, out, 'utf8');
    }
  }
}

export async function writeJSON(p: string, obj: any) {
  await fs.writeFile(p, JSON.stringify(obj, null, 2) + '\n', 'utf8');
}
