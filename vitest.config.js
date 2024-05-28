const { defineConfig } = require("vitest/config");

module.exports = defineConfig({
  test: {
    setupFiles: "./setupTests.js",
    testTimeout: 60000, // Incrementa el tiempo de espera global para todos los tests
  },
});
