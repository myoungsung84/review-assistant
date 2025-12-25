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
    'prettier',
  ],

  ignorePatterns: ['dist', 'dist-electron', '.eslintrc.cjs'],

  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    'prettier/prettier': 'error',
    'react/react-in-jsx-scope': 'off',
  },

  settings: {
    react: { version: 'detect' },
  },

  overrides: [
    {
      files: ['electron/**/*.{ts,cts,mts}'],
      env: { node: true },
    },
  ],
}
