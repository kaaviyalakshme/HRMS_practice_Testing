import { test, expect } from '../../fixtures/test-fixtures';
import { REQUIRED_FIELD_ERRORS } from '../../test-data/employee';

test.describe('Required fields and Create Employee button', () => {
  test('empty submit shows every required-field error and does not save', async ({ form, page }) => {
    await form.expectRejected();
    for (const msg of REQUIRED_FIELD_ERRORS) await expect(page.getByText(msg)).toBeVisible();
  });

  test('valid data is accepted', async ({ form }) => {
    await form.fillRequired();
    await form.expectAccepted();
  });

  test('whitespace-only first name is rejected', async ({ form }) => {
    await form.fillRequired({ firstName: '   ' });
    await form.expectRejected('First name is required');
  });

  test('double-click sends only one request', async ({ form, createGuard, page }) => {
    await form.fillRequired();
    await form.createButton.dblclick();
    await page.waitForTimeout(1500);
    expect(createGuard.calls).toBe(1);
  });

  test('Enter key submits the form', async ({ form, createGuard, page }) => {
    await form.fillRequired();
    await form.lastName.press('Enter');
    await page.waitForTimeout(1000);
    expect(createGuard.calls).toBe(1);
  });

  test('Cancel returns to the employee list', async ({ form, page }) => {
    await form.cancelButton.click();
    await expect(page).toHaveURL(/\/employees\/?$/);
  });
});
