import { defineConfig, devices } from '@playwright/test';
import fs from 'fs';

// Load HRMS_USERNAME / HRMS_PASSWORD / BASE_URL from a local .env file if present.
if (fs.existsSync('.env')) {
  for (const line of fs.readFileSync('.env', 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

const AUTH_FILE = 'playwright/.auth/user.json';

export default defineConfig({
  testDir: './tests',
  timeout: 45_000,
  expect: { timeout: 10_000 },
  // The demo API rate-limits (HTTP 429) when pages reload quickly, so run one at a time.
  workers: 1,
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.BASE_URL ?? 'https://sapiensdemo.inaivia.com',
    locale: 'en-IN',
    viewport: { width: 1600, height: 900 },
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'setup', testMatch: /auth\.setup\.ts/, use: { ...devices['Desktop Chrome'], viewport: { width: 1600, height: 900 } } },
    {
      name: 'chromium',
      testMatch: /.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], viewport: { width: 1600, height: 900 }, storageState: AUTH_FILE },
      // Sign in only when there is no saved session yet.
      dependencies: fs.existsSync(AUTH_FILE) ? [] : ['setup'],
    },
  ],
});
