module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: [
    'plugin:react/recommended',
    'standard'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: [
    'react',
    '@typescript-eslint'
  ],
  rules: {
    'no-use-before-define': 'warn',
    'react/prop-types': 'warn',
    'no-extra-semi': 'warn',
    quotes: 'warn',
    semi: 'off',
    'eol-last': 'warn',
    'prefer-const': 'warn',
    'multiline-ternary': 'warn',
    'space-before-function-paren': 'warn',
    'no-unused-vars': 'warn'
  }
}
