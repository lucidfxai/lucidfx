module.exports = {
  roots: ['<rootDir>/src'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': ["ts-jest", { tsconfig: "tsconfig.test.json" }],
  },
  testMatch: ['**/src/**/*.test.ts', '**/src/**/*.test.tsx'],
  testPathIgnorePatterns: ['/node_modules/', '/integration_tests/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
