// Flat config for ESLint v9+
// Works for JS-only or TS+JS projects, Playwright tests, and Prettier interop.

import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import globals from 'globals';
import * as tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
  // Ignore build and report artifacts
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/bin/**',
      '**/html/**',
      // Ignore generated/other playwrite test workspaces
      '**/pw-tests-*/**',
      '**/tsconfig.json',
      '**/tsconfig.*.json',
      '**/package*.json',
      '**/openapitools.json',
      '**/executors.json',
      '.vscode/**',
      'eslint.config.js',
      '**/.husky/*',
    ],
  },

  // Base language options (Node + ESM)
  {
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: { ...globals.node },
    },
  },

  // JavaScript rules
  js.configs.recommended,

  // TypeScript rules (applies only to *.ts/tsx)
  ...tseslint.configs.recommended,

  {
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE'],
          leadingUnderscore: 'allow',
        },
        {
          selector: 'objectLiteralProperty',
          format: null,
          modifiers: ['requiresQuotes'],
          filter: {
            regex: '^[^_]+$',
            match: true,
          },
        },
        {
          selector: 'function',
          format: ['camelCase'],
        },
        {
          selector: 'method',
          format: ['camelCase'],
        },
        {
          selector: 'class',
          format: ['PascalCase'],
        },
        {
          selector: 'interface',
          format: ['PascalCase'],
        },
        {
          selector: 'typeAlias',
          format: ['PascalCase'],
        },
        {
          selector: 'enum',
          format: ['PascalCase'],
        },
        {
          selector: 'enumMember',
          format: ['UPPER_CASE', 'PascalCase'],
        },
        {
          selector: 'property',
          format: ['camelCase'],
          leadingUnderscore: 'allow',
          modifiers: ['requiresQuotes'],
          filter: {
            regex: '^[^_]+$',
            match: true,
          },
        },
      ],
    },
  },

  // Turn off formatting-related rules to let Prettier handle style
  prettier,
];
