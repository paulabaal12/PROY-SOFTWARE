const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    chromeWebSecurity: false,
    viewportHeight: 900,
    viewportWidth: 1200,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  browser: 'chrome',
  // Prueba forzar sin DevTools
  modifyObstructiveCode: true,
});
