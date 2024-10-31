require('dotenv').config({ path: '.env.test' });

module.exports = {
  setupFilesAfterEnv: ['<rootDir>/src/tests/setupTests.js'],
  moduleNameMapper: {
    '^prom-client$': '<rootDir>/src/tests/mocks/prom-client-mock.js',
    '^redis$': '<rootDir>/src/tests/mocks/redis-mock.js'
  },
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/config.js"
  ],
  testTimeout: 10000  // αυξάνουμε το timeout σε 10 δευτερόλεπτα
};
