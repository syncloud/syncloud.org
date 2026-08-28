const { defineConfig, devices } = require('@playwright/test')

const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:8080'

module.exports = defineConfig({
  testDir: './e2e',
  outputDir: 'test-results',
  timeout: 60 * 1000,
  expect: { timeout: 10 * 1000 },
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  use: {
    baseURL,
    ignoreHTTPSErrors: true,
    screenshot: 'off',
    trace: 'retain-on-failure',
    video: 'on'
  },
  projects: [
    { name: 'desktop', testIgnore: [/\.mobile\.spec\.js$/], use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', testMatch: [/\.mobile\.spec\.js$/], use: { ...devices['Pixel 5'] } }
  ]
})
