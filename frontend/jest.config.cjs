module.exports = {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\.(css|less|scss)$': '<rootDir>/src/__mocks__/styleMock.js',
    '\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/src/__mocks__/fileMock.js'
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  transform: {
    '^.+\.(js|jsx|ts|tsx)$': 'babel-jest'
  },
  testMatch: ['**/__tests__/**/*.test.(js|jsx|ts|tsx)'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/__mocks__/**',
    '!src/setupTests.js'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  transformIgnorePatterns: [
    '/node_modules/(?!axios).+\.js$'
  ],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  moduleDirectories: ['node_modules', 'src'],
  extensionsToTreatAsEsm: ['.jsx'],
  verbose: true
}
