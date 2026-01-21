/* eslint-disable @typescript-eslint/no-explicit-any */
import inquirer from 'inquirer';

// Define the shape of answers
export type Answers = {
  projectName: string;
  language: 'ts' | 'js';
  packageManager: 'npm' | 'yarn';
  ci: 'github' | 'gitlab' | 'none';
  reporter: 'html' | 'allure' | 'monocart';
  notifications: boolean;
  husky: boolean;
  zephyr: boolean;
  preset: 'web' | 'api' | 'soap' | 'hybrid';
};

// Define question types
type ListQ<K extends keyof Answers> = {
  type: 'list';
  name: K;
  message: string;
  choices: readonly any[];
  default?: Answers[K];
};

// Define question types
type ConfirmQ<K extends keyof Answers> = {
  type: 'confirm';
  name: K;
  message: string;
  default?: boolean;
};

// Union of question types
type Q = ListQ<keyof Answers> | ConfirmQ<keyof Answers>;

/**
 * Prompt user for configuration options
 * @param projectName
 * @param flags
 * @returns --- IGNORE ---
 */
export async function askQuestions(projectName: string, flags: any): Promise<Answers> {
  const nonInteractive =
    !!flags.yes || !!flags.nonInteractive || process.env.CI === '1' || process.env.CI === 'true';
  const base: Partial<Answers> = {
    projectName,
    // Note: --js flag means TS is false, so we invert it here as TS only
    language: flags.js ? 'ts' : 'ts',
    packageManager: flags.pm === 'yarn' ? 'yarn' : 'npm',
    ci: flags.ci,
    reporter: flags.reporter,
    notifications: flags.notifications ?? true,
    husky: flags.husky !== false,
    zephyr: !!flags.zephyr,
    preset: flags.preset,
  };

  // 🚫 No prompts in non-interactive mode: return defaults/flags
  if (nonInteractive) {
    return {
      projectName,
      language: (base.language ?? 'ts') as 'ts' | 'js',
      packageManager: (base.packageManager ?? 'npm') as 'npm' | 'yarn',
      ci: (base.ci ?? 'github') as 'github' | 'gitlab' | 'none',
      reporter: (base.reporter ?? 'allure') as 'html' | 'allure' | 'monocart',
      notifications: base.notifications ?? true,
      husky: base.husky ?? true,
      zephyr: base.zephyr ?? false,
      preset: (base.preset ?? 'web') as 'web' | 'api' | 'soap' | 'hybrid',
    };
  }

  // Interactive mode: prompt user
  const questions = [
    {
      type: 'list',
      name: 'packageManager',
      message: 'Package manager?',
      choices: [
        { name: 'npm', value: 'npm' },
        { name: 'yarn', value: 'yarn' },
      ],
      default: base.packageManager,
    },
    {
      type: 'list',
      name: 'language' as const,
      message: 'Language?',
      choices: [
        { name: 'TypeScript', value: 'ts' },
        { name: 'JavaScript', value: 'js' },
      ],
      default: base.language,
    },
    {
      type: 'list',
      name: 'preset' as const,
      message: 'Preset?',
      choices: [
        { name: 'Web (UI/POM + Fixtures)', value: 'web' },
        { name: 'API (APIClient + Fixtures)', value: 'api' },
        { name: 'Hybrid (UI + API + SOAP + Fixtures)', value: 'hybrid' },
        { name: 'SOAP (SOAPClient + Fixtures)', value: 'soap' },
      ],
      default: base.preset,
    },
    {
      type: 'list',
      name: 'ci' as const,
      message: 'CI provider?',
      choices: ['github', 'gitlab', 'none'],
      default: base.ci,
    },
    {
      type: 'list',
      name: 'reporter' as const,
      message: 'Reporter?',
      choices: ['html', 'allure', 'monocart'],
      default: base.reporter,
    },
    {
      type: 'confirm',
      name: 'notifications' as const,
      message: 'Include notification channels (email, slack, teams):',
      default: base.notifications,
    },
    {
      type: 'confirm',
      name: 'husky' as const,
      message: 'Include Husky pre-commit hooks?',
      default: base.husky,
    },
    {
      type: 'confirm',
      name: 'zephyr' as const,
      message: 'Include Zephyr publish stub?',
      default: base.zephyr,
    },
  ] as const satisfies readonly Q[];

  // One pragmatic cast to avoid the union-overload fight in v12:
  const answers = await (inquirer as any).prompt(questions);

  // Merge base and answers
  return { ...(base as Answers), ...(answers as Answers) };
}
