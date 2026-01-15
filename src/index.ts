import { Command } from 'commander';
import { bold, cyan } from 'kolorist';
import { askQuestions } from './prompts.js';
import { scaffold } from './scaffold.js';

const program = new Command();

program
  .name('playwright-test-framework-generator')
  .description('Scaffold a Playwright test framework baseline')
  .version('1.0.0');

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
    // Centralized validation for all enum-like options
    const allowed = {
      pm: ['npm', 'yarn'],
      ci: ['github', 'gitlab', 'none'],
      reporter: ['html', 'allure', 'monocart'],
      preset: ['web', 'api', 'soap', 'hybrid'],
    };
    const errors = [];
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
      console.error(`\n${bold('✖ Invalid option(s):')}\n${errors.join('\n')}`);
      cmd.help({ error: true });
      process.exit(1);
    }
    const answers = await askQuestions(projectName, flags);
    await scaffold(answers);
    console.log(`\n${bold('✔ Done!')} cd ${cyan(projectName)} && npm i && npm test`);
  });

program.parse(process.argv);
