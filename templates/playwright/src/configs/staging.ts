import defaultConfig from './default';
import { FrameworkConfig } from './types';

const stagingConfig: Partial<FrameworkConfig> = {
  envName: 'staging',
  baseURL: process.env.BASE_URL || defaultConfig.baseURL,
  APP_BASE_URL: process.env.APP_BASE_URL || defaultConfig.APP_BASE_URL,
  API_BASE_URL: process.env.API_BASE_URL || defaultConfig.API_BASE_URL,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reporter: (process.env.REPORTER as any) || defaultConfig.reporter,
  reportDir: defaultConfig.reportDir,
  timeout: 150000,
  expectTimeout: 20000,
  actionTimeout: 20000,
};

export default stagingConfig;
