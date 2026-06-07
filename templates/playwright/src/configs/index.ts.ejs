import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import defaultConfig from './default';
import localConfig from './dev';
import qaConfig from './qa';
import stagingConfig from './staging';
import { FrameworkConfig } from './types';

type EnvKey = 'dev' | 'qa' | 'staging';

function loadDotenvIfPresent(env: string) {
  try {
    const envFile = path.resolve(process.cwd(), 'src', 'environments', `.env.${env}`);
    if (fs.existsSync(envFile)) {
      dotenv.config({ path: envFile });
      return envFile;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    // ignore errors
  }
  return undefined;
}

export function getConfig(env?: string): FrameworkConfig {
  const rawEnv = (env || process.env.PLAYWRIGHT_ENV || process.env.ENV || 'dev').toLowerCase();
  const key = (['dev', 'qa', 'staging'].includes(rawEnv) ? rawEnv : 'dev') as EnvKey;

  // load corresponding .env file if present
  const dotenvFile = loadDotenvIfPresent(key);

  const partials: Partial<FrameworkConfig> =
    key === 'qa' ? qaConfig : key === 'staging' ? stagingConfig : localConfig;

  const merged: FrameworkConfig = {
    ...defaultConfig,
    ...partials,
    envName: key,
    dotenvFile,
  } as FrameworkConfig;

  return merged;
}

export default getConfig;
