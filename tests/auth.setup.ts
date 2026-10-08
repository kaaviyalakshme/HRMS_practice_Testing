import { test as setup, expect } from '@playwright/test';
import fs from 'fs';

const authFile = 'playwright/.auth/user.json';

// Logs in once and saves the session so every test starts authenticated.
// Set HRMS_USERNAME / HRMS_PASSWORD in the environment. If the app needs no
// login, the setup just saves an empty session.
setup('authenticate', async ({ page }) => {
  fs.mkdirSync('playwright/.auth', { recursive: true });
  await page.goto('/employees/new');

  const password = page.locator('input[type="password"]');
  if (await password.isVisible({ timeout: 5_000 }).catch(() => false)) {
    const username = process.env.HRMS_USERNAME;
    const pwd = process.env.HRMS_PASSWORD;
    if (!username || !pwd) throw new Error('Set HRMS_USERNAME and HRMS_PASSWORD to log in.');

    await page
      .locator('input[type="email"], input[name*="user" i], input[name*="email" i], input[id*="user" i], input[id*="email" i]')
      .first()
      .fill(username);
    await password.fill(pwd);
    await page.getByRole('button', { name: /log ?in|sign ?in|submit/i }).click();
    await expect(password).toBeHidden({ timeout: 20_000 });
  }

  await page.context().storageState({ path: authFile });
});
