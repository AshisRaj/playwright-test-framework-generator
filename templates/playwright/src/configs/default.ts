import path from 'path';
import { FrameworkConfig } from './types';

const defaultConfig: FrameworkConfig = {
  envName: 'dev',
  baseURL: 'https://www.saucedemo.com/',
  APP_BASE_URL: 'https://www.saucedemo.com/',
  API_BASE_URL: 'http://localhost:3000',
  timeout: 90000,
  expectTimeout: 10000,
  reporter: 'allure',
  reportDir: path.join(process.cwd(), 'artifacts', 'reports'),
  projects: [
    {
      name: 'chromium',
      device: 'Desktop Chrome',
      actionTimeout: 0,
      navigationTimeout: 0,
    },
  ],
  actionTimeout: 0,
  navigationTimeout: 0,
};

export default defaultConfig;
