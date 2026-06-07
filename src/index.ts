import { Command } from 'commander';
import { bold, cyan } from 'kolorist';
import { askQuestions } from './prompts.js';
import { scaffold } from './scaffold.js';

/**
 * Entry point for the CLI.
 *
 * This module wires up `commander` to expose an `init` command that accepts
 * flags and arguments. It validates enum-like options, delegates interactive
 * prompting to `askQuestions`, and calls `scaffold` to generate the project
 * files.
 *
 * Keep this file focused on CLI concerns (parsing, validation, user-facing
 * messages). Business logic (template rendering and file IO) lives in
 * `src/scaffold.ts` and prompt shapes are defined by `src/prompts.ts`.
 */

// Create a new Command instance
const program = new Command();

// Define the CLI top-level metadata
program
  .name('playwright-test-framework-generator')
  .description('Scaffold a Playwright test framework baseline')
  .version('1.0.0');

// ---------------------------------------------------------------------------
// `init` command
// ---------------------------------------------------------------------------
// This command accepts a project name and a small set of flags. Flags are
// intentionally simple and mirrored in `askQuestions` so the scaffolder can
// operate in both interactive and non-interactive modes (CI / automation).
program
  .command('init')
  .argument('<project-name>', 'folder to create')
  .option('-y, --yes', 'Use defaults and skip prompts', false)
  .option('--non-interactive', 'Alias of --yes', false)
  .option('--pm <name>', 'Package manager (npm|yarn)', 'npm')
  .option('--js', 'Use JavaScript instead of TypeScript', false)
  .option('--ci <provider>', 'CI provider (github|gitlab|none)', 'github')
  .option('--reporter <name>', 'Test reporter (html|allure|monocart)', 'allure')
  .option('--notifications <channels...>', 'Notifications (email,slack,teams)', true)
  .option('--zephyr', 'Include Zephyr results stub', false)
  .option('--no-husky', 'Skip Husky hooks', true)
  .option('--preset <name>', 'Quick preset (web|api|soap|hybrid)', 'web')
  .action(async (projectName, flags, cmd) => {
    // Centralized validation for enum-like options. This prevents malformed
    // values from causing confusing template rendering errors later on.
    const allowed = {
      pm: ['npm', 'yarn'],
      ci: ['github', 'gitlab', 'none'],
      reporter: ['html', 'allure', 'monocart'],
      preset: ['web', 'api', 'soap', 'hybrid'],
    };

    const errors = [] as string[];
    if (flags.pm && !allowed.pm.includes(flags.pm)) {
      errors.push(`  --pm must be one of: ${allowed.pm.join(', ')}`);
    }
    if (flags.ci && !allowed.ci.includes(flags.ci)) {
      errors.push(`  --ci must be one of: ${allowed.ci.join(', ')}`);
    }
    if (flags.reporter && !allowed.reporter.includes(flags.reporter)) {
      errors.push(`  --reporter must be one of: ${allowed.reporter.join(', ')}`);
    }
    if (flags.preset && !allowed.preset.includes(flags.preset)) {
      errors.push(`  --preset must be one of: ${allowed.preset.join(', ')}`);
    }

    if (errors.length) {
      // Show a concise validation failure message and print help for usage.
      console.error(`\n${bold('✖ Invalid option(s):')}\n${errors.join('\n')}`);
      cmd.help({ error: true });
      process.exit(1);
    }

    // Delegate to the prompts module which will either prompt the user or
    // return default values when running in non-interactive mode (CI).
    const answers = await askQuestions(projectName, flags);

    // Generate the project files and apply package.json changes.
    await scaffold(answers);

    // Friendly post-install message. Note: users may use yarn instead of npm.
    console.log(`\n${bold('✔ Done!')} cd ${cyan(projectName)} && npm i && npm test`);
  });

// Parse the command-line arguments and run the appropriate command/action
program.parse(process.argv);
