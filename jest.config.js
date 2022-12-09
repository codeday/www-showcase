module.exports = {
  testEnvironment: 'jsdom',
  collectCoverage: true,
  coverageProvider: 'v8',
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!<rootDir>/out/**',
    '!<rootDir>/.next/**',
    '!<rootDir>/*.config.js',
    '!<rootDir>/coverage/**',
  ],
  moduleDirectories: [
    'node_modules',
    __dirname, // makes test-utils.js accessible without relative imports
  ],
  transformIgnorePatterns: ['/node_modules/(?!(@accessible/use-id|@react-hook/passive-layout-effect)/)'],
  setupFiles: ['./setupTests.js'],
  testPathIgnorePatterns: ['__tests__/sampleData.js'],
};
