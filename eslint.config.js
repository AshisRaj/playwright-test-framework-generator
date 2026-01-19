// Flat config for ESLint v9+
// Works for JS-only or TS+JS projects, Playwright tests, and Prettier interop.

import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import globals from 'globals';
import path from 'path';
import * as tseslint from 'typescript-eslint';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
      parser: '@typescript-eslint/parser',
      parserOptions: {
        tsconfigRootDir: __dirname,
      },
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
        // Variable names (camelCase or UPPER_CASE for constants)
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
        // Function names (camelCase)
        {
          selector: 'function',
          format: ['camelCase'],
        },
        // Method names (camelCase)
        {
          selector: 'method',
          format: ['camelCase'],
        },
        // Class names (PascalCase)
        {
          selector: 'class',
          format: ['PascalCase'],
        },
        // Interface names (PascalCase with "I" prefix)
        {
          selector: 'interface',
          format: ['PascalCase'],
          // custom: {
          //   regex: '^I[A-Z]',
          //   match: true,
          // },
        },
        // Type aliases (PascalCase)
        {
          selector: 'typeAlias',
          format: ['PascalCase'],
        },
        // Enum names (PascalCase)
        {
          selector: 'enum',
          format: ['PascalCase'],
        },
        // Enum members (UPPER_CASE or PascalCase)
        {
          selector: 'enumMember',
          format: ['UPPER_CASE', 'PascalCase'],
        },
        // Property names (camelCase)
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
