module.exports = {
  collectCoverageFrom: ['src/**/*.{js,jsx}'],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx}',
    '<rootDir>/src/**/?(*.)(spec|test).{js,jsx}',
  ],
  transformIgnorePatterns: ['<rootDir>/.*.test.js', '<rootDir>/node_modules/'],
}
