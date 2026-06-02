import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  timeout: 90000,
  fullyParallel: false,
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:3000',
    viewport: { width: 1440, height: 820 },
    channel: 'chrome',
    headless: false,
    trace: 'off',
    screenshot: 'off',
  },
})
