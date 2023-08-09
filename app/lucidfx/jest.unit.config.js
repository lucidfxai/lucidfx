module.exports = {
  roots: ['<rootDir>/src', '<rootDir>/server'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': ["ts-jest", { tsconfig: "tsconfig.test.json" }],
  },
  testMatch: ['**/src/**/*.test.ts', '**/src/**/*.test.tsx', '**/server/**/*.test.ts', '**/server/**/*.test.tsx'],
  testPathIgnorePatterns: ['/node_modules/', '/integration_tests/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
