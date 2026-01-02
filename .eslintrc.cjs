module.exports = {
  root: true,

  env: {
    browser: true,
    es2020: true,
  },

  parser: '@typescript-eslint/parser',

  plugins: [
    'react-refresh',
    'prettier',
    'unused-imports',
    'simple-import-sort',
  ],

  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],

  ignorePatterns: ['dist', 'dist-electron', '.eslintrc.cjs'],

  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    'prettier/prettier': 'error',
    'react/react-in-jsx-scope': 'off',

    // =========================
    // ✅ unused import 삭제
    // =========================
    'unused-imports/no-unused-imports': 'error',
    '@typescript-eslint/no-unused-vars': 'off',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],

    // =========================
    // ✅ import 정렬
    // =========================
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          // Node builtins
          ['^node:'],

          // External packages
          ['^@?\\w'],

          // Electron alias (@e)
          ['^@e(/.*|$)'],

          // Renderer alias (@)
          ['^@(/.*|$)'],

          // Relative imports
          ['^\\.'],
        ],
      },
    ],
    'simple-import-sort/exports': 'error',
  },

  settings: {
    react: { version: 'detect' },
  },

  overrides: [
    {
      files: ['**/*.d.ts'],
      rules: {
        'unused-imports/no-unused-vars': 'off',
      },
    },
    {
      files: ['electron/**/*.{ts,cts,mts}'],
      env: { node: true },
    },
  ],
}
