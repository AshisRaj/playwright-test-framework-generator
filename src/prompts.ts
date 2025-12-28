import inquirer from 'inquirer';

export type Answers = {
  projectName: string;
  language: 'ts' | 'js';
  packageManager: 'npm' | 'yarn';
  ci: 'github' | 'gitlab' | 'none';
  reporter: 'html' | 'allure' | 'monocart';
  notifications: boolean;
  husky: boolean;
  zephyr: boolean;
  preset: 'web' | 'api' | 'hybrid';
};

type ListQ<K extends keyof Answers> = {
  type: 'list';
  name: K;
  message: string;
  choices: readonly any[];
  default?: Answers[K];
};

type ConfirmQ<K extends keyof Answers> = {
  type: 'confirm';
  name: K;
  message: string;
  default?: boolean;
};

type Q = ListQ<keyof Answers> | ConfirmQ<keyof Answers>;

export async function askQuestions(projectName: string, flags: any): Promise<Answers> {
  const nonInteractive =
    !!flags.yes || !!flags.nonInteractive || process.env.CI === '1' || process.env.CI === 'true';
  const base: Partial<Answers> = {
    projectName,
    language: flags.js ? 'js' : 'ts',
    packageManager: flags.pm === 'yarn' ? 'yarn' : 'npm',
    ci: flags.ci,
    reporter: flags.reporter,
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
      preset: (base.preset ?? 'web') as 'web' | 'api' | 'hybrid',
    };
  }

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
        { name: 'Web (UI/POM + fixtures)', value: 'web' },
        { name: 'API (Axios + assertions)', value: 'api' },
        { name: 'Hybrid (UI + API)', value: 'hybrid' },
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

  return { ...(base as Answers), ...(answers as Answers) };
}
