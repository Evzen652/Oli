import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // Záměrně nevyužité identifikátory se v kódu označují prefixem `_`
      // (např. `gen(_level)`, `catch (_)`). Lint má tuto konvenci respektovat.
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      }],
      // České NBSP (U+00A0) je záměrné v zobrazovaném textu (formátování čísel,
      // pevné mezery). Povolit ve stringech/šablonách, ale hlídat v kódu.
      'no-irregular-whitespace': ['error', {
        skipStrings: true,
        skipTemplates: true,
        skipComments: true,
        skipRegExps: true,
      }],
    },
  },
])
