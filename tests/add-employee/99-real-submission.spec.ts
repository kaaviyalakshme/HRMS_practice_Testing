import { test, expect } from '@playwright/test';
import { AddEmployeePage } from '../../pages/AddEmployeePage';
import { EMPLOYEE_API } from '../../fixtures/create-guard';
import { uniqueEmployee } from '../../test-data/employee';

// CREATES A REAL EMPLOYEE. Skipped unless ALLOW_REAL_SUBMIT=1.
test.describe('Real submission', () => {
  test.skip(process.env.ALLOW_REAL_SUBMIT !== '1', 'Set ALLOW_REAL_SUBMIT=1 to create a real employee');

  test('creates an employee with valid data', async ({ page }) => {
    const form = new AddEmployeePage(page); // no guard: the request really goes out
    await form.goto();
    await form.fillRequired(uniqueEmployee());
    const response = page.waitForResponse(r => EMPLOYEE_API.test(r.url()) && r.request().method() === 'POST');
    await form.createButton.click();
    const r = await response;
    expect(r.status(), await r.text()).toBeLessThan(300);
    await expect(page).not.toHaveURL(/\/employees\/new/);
  });
});
