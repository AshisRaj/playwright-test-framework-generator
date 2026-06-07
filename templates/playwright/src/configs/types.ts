export type ReporterKind = 'allure' | 'monocart' | 'html' | 'list' | string;

export interface ProjectConfig {
  name: string;
  // optional Playwright device key like 'Desktop Chrome'
  device?: string;
  // per-project action timeout (ms), 0 means disabled
  actionTimeout?: number | 0;
  navigationTimeout?: number | 0;
}

export interface FrameworkConfig {
  // logical environment name (local, qa, staging)
  envName: string;
  // full base URL for tests
  baseURL: string;
  APP_BASE_URL: string;
  API_BASE_URL: string;
  // default test timeout in ms
  timeout: number;
  // expect timeout in ms
  expectTimeout: number;
  // reporter selection
  reporter: ReporterKind;
  // directory for reporter results
  reportDir: string;
  // projects (browsers) config
  projects: ProjectConfig[];
  // per-project action/navigation timeouts (fallback)
  actionTimeout?: number | 0;
  navigationTimeout?: number | 0;
  // optional dotenv filename that was loaded
  dotenvFile?: string;
}
