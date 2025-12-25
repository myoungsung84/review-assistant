module.exports = {
  root: true,

  env: {
    browser: true,
    es2020: true,
  },

  parser: '@typescript-eslint/parser',

  plugins: ['react-refresh', 'prettier'],

  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier', // 반드시 맨 마지막
  ],

  ignorePatterns: ['dist', 'dist-electron', '.eslintrc.cjs'],

  rules: {
    // React Refresh (Vite + Electron)
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

    // Prettier를 ESLint 에러로
    'prettier/prettier': 'error',

    // React 17+ JSX runtime
    'react/react-in-jsx-scope': 'off',
  },

  settings: {
    react: {
      version: 'detect',
    },
  },

  overrides: [
    {
      files: ['electron/**/*.ts'],
      env: {
        node: true,
      },
    },
  ],
}
