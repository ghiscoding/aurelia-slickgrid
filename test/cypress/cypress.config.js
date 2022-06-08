const { defineConfig } = require('cypress')

module.exports = defineConfig({
  baseExampleUrl: 'http://localhost:9000/#/slickgrid',
  runMode: 1,
  projectId: 'gtbpy4',
  video: false,
  viewportWidth: 1200,
  viewportHeight: 950,
  fixturesFolder: 'fixtures',
  screenshotsFolder: 'screenshots',
  videosFolder: 'videos',
  defaultCommandTimeout: 10000,
  pageLoadTimeout: 50000,
  retries: {
    runMode: 2,
    openMode: 0,
  },
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./plugins/index.js')(on, config)
    },
    baseUrl: 'http://localhost:9000',
    specPattern: 'integration/**/*.{js,jsx,ts,tsx}',
    supportFile: 'support/index.js',
  },
})
