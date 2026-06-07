/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * `prompts.ts`
 *
 * Presents interactive CLI questions (via `inquirer`) and returns a normalized
 * `Answers` object that drives the scaffolder. To support non-interactive
 * environments (CI or `--yes`/`--nonInteractive`) the function also accepts a
 * `flags` object and will short-circuit to sensible defaults when required.
 */
import inquirer from 'inquirer';

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------
// The canonical shape returned by `askQuestions` — used across the codebase
// (templates, scaffold logic, and tests). Keep this in sync with templates.
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

// ---------------------------------------------------------------------------
// Internal helper types for inquirer question shapes
// ---------------------------------------------------------------------------
type ListQ<K extends keyof Answers> = {
  type: 'list';
  name: K;
  message: string;
  // Choices are intentionally `any[]` because inquirer accepts mixed values
  choices: readonly any[];
  default?: Answers[K];
};

type ConfirmQ<K extends keyof Answers> = {
  type: 'confirm';
  name: K;
  message: string;
  default?: boolean;
};

// Union type used to satisfy the `questions` array typing below
type Q = ListQ<keyof Answers> | ConfirmQ<keyof Answers>;

/**
 * Ask the user configuration questions and return a normalized `Answers`.
 *
 * Behavior summary:
 * - If running in non-interactive mode (CI or flags like `--yes`) the function
 *   returns defaults derived from `flags` without prompting.
 * - Otherwise it presents an interactive questionnaire and merges answers with
 *   the initial `base` defaults.
 *
 * @param projectName - the target folder/name for the new project
 * @param flags - parsed CLI flags (may contain defaults like --pm, --js, --ci)
 */
export async function askQuestions(projectName: string, flags: any): Promise<Answers> {
  // Non-interactive detection: either explicit flags or CI environment vars
  const nonInteractive =
    !!flags.yes || !!flags.nonInteractive || process.env.CI === '1' || process.env.CI === 'true';

  // Build a `base` object from flags. The interactive prompts use these values
  // as defaults so users can accept or change them. Use `Partial<Answers>` so
  // missing flags are handled gracefully.
  const base: Partial<Answers> = {
    projectName,
    // NOTE: flags.js indicates the user passed `--js`; default language is
    // TypeScript unless `--js` is present. (Fixed: previously always 'ts')
    language: flags.js ? 'js' : 'ts',
    packageManager: flags.pm === 'yarn' ? 'yarn' : 'npm',
    ci: flags.ci,
    reporter: flags.reporter,
    notifications: flags.notifications ?? true,
    // Accept `--no-husky` by checking !== false
    husky: flags.husky !== false,
    zephyr: !!flags.zephyr,
    preset: flags.preset,
  };

  // If non-interactive, return base values (or sensible defaults) immediately.
  // This is important for CI usage where prompts would block execution.
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

  // Interactive questionnaire. The `as const satisfies readonly Q[]` typing
  // ensures a read-only tuple-like structure while still matching our union
  // `Q` type above.
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

  // `inquirer.prompt` typing can be awkward with our union; cast pragmatically
  // to `any` and rely on the `Answers` type when merging the result.
  const answers = await (inquirer as any).prompt(questions);

  // Merge flag-derived defaults (`base`) with interactive `answers`. Values in
  // `answers` take precedence. The final object conforms to `Answers`.
  return { ...(base as Answers), ...(answers as Answers) };
}
