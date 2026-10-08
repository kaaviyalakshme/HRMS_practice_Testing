import { test as setup, expect } from '@playwright/test';
import fs from 'fs';

export const AUTH_FILE = 'playwright/.auth/user.json';

/**
 * Signs in once and saves the session to playwright/.auth/user.json.
 *
 * - With HRMS_USERNAME and HRMS_PASSWORD set (see .env.example), it signs in automatically.
 * - Without them, run `npm run login`: a browser opens and you sign in yourself
 *   (password, Google or Microsoft). The script waits up to 5 minutes.
 *
 * The saved session is reused until it expires; delete the file to sign in again.
 */
setup('authenticate', async ({ page }) => {
  setup.setTimeout(5 * 60_000);
  fs.mkdirSync('playwright/.auth', { recursive: true });
  await page.goto('/login');

  const username = process.env.HRMS_USERNAME;
  const password = process.env.HRMS_PASSWORD;
  if (username && password) {
    await page.getByLabel('Email').fill(username);
    await page.getByLabel('Password', { exact: true }).fill(password);
    await page.getByRole('button', { name: 'Sign In' }).click();
  }

  await page.waitForURL(url => !url.pathname.startsWith('/login'), { timeout: 5 * 60_000 });
  await page.goto('/employees/new');
  await expect(page.getByRole('heading', { name: 'Add New Employee' })).toBeVisible();
  await page.context().storageState({ path: AUTH_FILE });
});
