// eslint.config.js - FINAL CLEAN CONFIGURATION

import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

// 💥 FIX: Define __dirname using Node.js path/url modules 💥
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// ----------------------------------------------------------------------

export default defineConfig([
  globalIgnores(['dist']),

  {
    files: ['**/*.{ts,tsx}'],

    // 1. Language and Parser Configuration
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: globals.browser,
      parser: tseslint.parser,

      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname,
      },
    },

    // 2. Base Extensions
    extends: [
      js.configs.recommended,
      // Load recommended TypeScript rules
      ...tseslint.configs.recommended,
    ],

    // 3. Plugins (Must be defined as an object)
    plugins: {
      // Defining plugins here ensures the flat config format is satisfied
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },

    // 4. Rule Overrides (The explicit object structure)
    rules: {
      // General TypeScript/Cleanup
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],

      // Disable legacy React rules
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'react/prop-types': 'off',

      // 💥 CRITICAL: This MUST be 'off' and MUST be applied correctly. 💥
      'react-refresh/only-export-components': 'off',
    },

    settings: {
      react: {
        version: 'detect',
      },
    },
  },
]);
