/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';
import os from 'os';
import path from 'path';

export interface BaseMetadata {
  project: string;
  preset: string;
  ci: string;
  reporter: string;
  language: string;
  env: string;
  generatedAt: string;
  date: string;
}

export interface SystemMetadata {
  hostname: string;
  user: string;
  platform: string;
  release: string;
  version: string;
  type: string;
  node: string;
  playwright: string;
}

export interface CIMetadata {
  commit: string;
  branch: string;
  runId?: string;
  pipelineUrl?: string;
}

export type Metadata = BaseMetadata & SystemMetadata & CIMetadata & Record<string, any>;

/**
 * Advanced Metadata Builder
 */
export class MetadataBuilder {
  private meta: Partial<Metadata> = {};

  constructor() {
    this.addGeneratedTime();
    this.addSystemInfo();
    this.addCIInfo();
  }

  /** 🧩 Add base config info supplied from caller */
  addBase(base: Partial<BaseMetadata>) {
    this.meta = { ...this.meta, ...base };
    return this;
  }

  /** 🧩 Add any custom metadata */
  add(key: string, value: any) {
    this.meta[key] = value;
    return this;
  }

  /** 🧩 Add multiple custom metadata entries */
  addMany(obj: Record<string, any>) {
    this.meta = { ...this.meta, ...obj };
    return this;
  }

  /** 🧩 Final metadata object */
  build(): Metadata {
    return this.meta as Metadata;
  }

  /** 🧩 Optional — write metadata to a JSON file */
  writeToFile(filePath: string) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(this.meta, null, 2));
    return this;
  }

  // ───────────────────────────────────────────────
  // INTERNAL AUTO-POPULATION HELPERS
  // ───────────────────────────────────────────────

  private addGeneratedTime() {
    const now = new Date();
    this.meta.generatedAt = now.toISOString();
    this.meta.date = now.toLocaleString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  private addSystemInfo() {
    this.meta.hostname = os.hostname();

    try {
      this.meta.user = os.userInfo().username;
    } catch {
      this.meta.user = '';
    }

    this.meta.platform = os.platform();
    this.meta.release = os.release();
    this.meta.version = typeof (os as any).version === 'function' ? (os as any).version() : '';
    this.meta.type = os.type();
    this.meta.node = process.version;
  }

  private addCIInfo() {
    // GitHub Actions
    if (process.env.GITHUB_SHA) {
      this.meta.commit = process.env.GITHUB_SHA;
      this.meta.branch = process.env.GITHUB_REF_NAME || 'main';
      this.meta.runId = process.env.GITHUB_RUN_ID;
      this.meta.pipelineUrl = `https://github.com/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`;
      return;
    }

    // GitLab
    if (process.env.CI_COMMIT_SHA) {
      this.meta.commit = process.env.CI_COMMIT_SHA;
      this.meta.branch = process.env.CI_COMMIT_REF_NAME;
      this.meta.pipelineUrl = process.env.CI_PIPELINE_URL;
      return;
    }

    // Jenkins
    if (process.env.GIT_COMMIT) {
      this.meta.commit = process.env.GIT_COMMIT;
      this.meta.branch = process.env.GIT_BRANCH || 'local';
      this.meta.runId = process.env.BUILD_ID;
      this.meta.pipelineUrl = process.env.BUILD_URL;
      return;
    }

    // Local fallback
    this.meta.commit = 'local';
    this.meta.branch = 'local';
  }
}
