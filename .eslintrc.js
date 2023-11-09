module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.json',
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
    'plugin:prettier/recommended',
    'plugin:unicorn/recommended',
  ],
  env: {
    'shared-node-browser': true,
    jest: true,
  },
  rules: {
    'no-underscore-dangle': 0,
    curly: 'error',
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/ban-ts-comment': 0,
    'unicorn/prevent-abbreviations': 0,
    'unicorn/prefer-node-protocol': 0,
    'unicorn/filename-case': 0,
    'unicorn/better-regex': 0,
    '@typescript-eslint/no-empty-function': 0,
  },
}
