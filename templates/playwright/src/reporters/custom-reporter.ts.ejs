/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  FullConfig,
  Reporter,
  Suite,
  TestCase,
  TestError,
  TestResult,
} from '@playwright/test/reporter';
import { ARTIFACTS_DIR, CONFIG_DIR, logger, PROJECT_ROOT, REPORTS_DIR } from '@utils';
import fs from 'fs';
import { bold, cyan, dim, gray, green, magenta, red, yellow } from 'kolorist';
import path, { join } from 'path';

const REPORT_JSON = path.join(ARTIFACTS_DIR, 'custom-summary.json');

function ensureDir(p: string) {
  fs.mkdirSync(p, { recursive: true });
}

export default class CustomReporter implements Reporter {
  private startedAt = Date.now();
  private projects = new Set<string>();
  private processedKeys = new Set<string>(); // ensure retries counted once per test

  private summary = {
    startedAt: new Date().toISOString(),
    total: 0,
    passed: 0,
    failed: 0, // includes timedOut
    status: '' as string,
    skipped: 0,
    timedOut: 0, // informational
    retriesAttempted: 0,
    durationMs: 0,
    durationHS: '' as string,
    projects: [] as string[],
  };

  private reportMetaData: Record<string, any> = {};

  constructor(options: any = {}) {
    this.reportMetaData = options.reportMetaData || {};
    logger.info('📦 Reporter received metadata:', this.reportMetaData);
  }

  onBegin(config: FullConfig, suite: Suite) {
    ensureDir(ARTIFACTS_DIR);
    const allureResultPath = join(REPORTS_DIR, 'allure-results');

    if (!fs.existsSync(allureResultPath)) {
      fs.mkdirSync(join(allureResultPath), { recursive: true });
    }

    const srcDir = join(CONFIG_DIR, 'executor.json');
    const destDir = join(allureResultPath, 'executor.json');

    fs.copyFileSync(srcDir, destDir);
    logger.info(cyan(`🧪 Test run started with ${suite.allTests().length} tests`));
  }

  onTestBegin(test: TestCase) {
    this.summary.total++;
    const projectName = test.parent.project()?.name || 'default';
    this.projects.add(projectName);
    logger.info(dim(`▶ ${projectName}: ${test.title}`));
  }

  onTestEnd(test: TestCase, result: TestResult) {
    const status = result.status; // 'passed' | 'failed' | 'timedOut' | 'skipped' | 'interrupted'
    const dur = `${result.duration}ms`;
    const title = bold(test.title);

    // ---- retries accounting (only once per test, on its final result) ----
    const isLastEnd = test.results.length > 0 && test.results[test.results.length - 1] === result;
    if (isLastEnd) {
      const key = `${test.location.file}::${test.title}`;
      if (!this.processedKeys.has(key)) {
        const retriesForThisTest = Math.max(0, test.results.length - 1);
        this.summary.retriesAttempted += retriesForThisTest;
        this.processedKeys.add(key);
        if (retriesForThisTest > 0) {
          logger.info(gray(`   ⟳ retries: ${retriesForThisTest}`));
        }
      }
    }

    // ---- status accounting (treat timedOut as failed in summary) ----
    switch (status) {
      case 'passed':
        this.summary.passed++;
        logger.info(green(`✔ PASSED • ${title} (${dur})`));
        break;
      case 'failed':
        this.summary.failed++;
        logger.error(red(`✘ FAILED • ${title} (${dur})`));
        break;
      case 'timedOut':
        this.summary.timedOut++;
        this.summary.failed++; // count timeouts as failures
        logger.error(magenta(`⏱ TIMEOUT • ${title} (${dur})`));
        break;
      case 'skipped':
        this.summary.skipped++;
        logger.warn(yellow(`⚠ SKIPPED • ${title}`));
        break;
      default:
        logger.info(cyan(`ℹ ${status.toUpperCase()} • ${title}`));
    }

    if (result.errors?.length) {
      result.errors.forEach((e: TestError) => {
        logger.error(red(`   ↳ ${e.message || e.value || 'Error'}`));
      });
    }
  }

  async onEnd() {
    this.summary.durationMs = Date.now() - this.startedAt;
    this.summary.durationHS = `${(this.summary.durationMs / 1000).toFixed(2)}s`;
    this.summary.projects = Array.from(this.projects);

    const status = this.summary.total === 0 || this.summary.failed > 0 ? 'Failed' : 'Passed';
    this.summary.status = status;
    const out = { ...this.summary, ...this.reportMetaData };
    fs.writeFileSync(REPORT_JSON, JSON.stringify(out, null, 2));

    logger.info(green(`📄 Custom summary saved: ${path.relative(PROJECT_ROOT, REPORT_JSON)}`));

    // ---- multiline summary ----
    logger.info(bold(cyan('🧾 TEST RUN SUMMARY')));

    logger.info(`${cyan('  Total Tests:')} ${out.total}`);
    logger.info(`${green('  Passed:')} ${out.passed}`);
    logger.info(`${red('  Failed:')} ${out.failed}`);
    if (out.timedOut) logger.info(`${magenta('  Timed Out:')} ${out.timedOut}`);
    logger.info(`${yellow('  Skipped:')} ${out.skipped}`);
    logger.info(`${cyan('  Retries Attempted:')} ${out.retriesAttempted}`);
    logger.info(`${cyan('  Projects:')} ${out.projects.join(', ') || 'default'}`);
    logger.info(`${cyan('  Duration:')} ${out.durationHS}`);

    logger.info(bold(cyan('✅ Test execution complete.\n')));
  }

  onError(error: TestError): void {
    logger.error(red(`❗ Reporter caught error: ${error.message || error.value || error}`));
  }
}
