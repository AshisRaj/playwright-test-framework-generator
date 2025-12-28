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
  .option('--notify <channels...>', 'Notifications (email,slack,teams)', 'email')
  .option('--zephyr', 'Include Zephyr results stub', false)
  .option('--no-husky', 'Skip Husky hooks')
  .option('--preset <name>', 'Quick preset (web|api|hybrid)', 'web')
  .action(async (projectName, flags) => {
    const answers = await askQuestions(projectName, flags);
    await scaffold(answers);
    console.log(`\n${bold('✔ Done!')} cd ${cyan(projectName)} && npm i && npm test`);
  });

program.parse(process.argv);
