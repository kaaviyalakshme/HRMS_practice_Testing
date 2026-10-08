import { test, expect } from '@playwright/test';
import { AddEmployeePage, uniqueEmployee } from '../pages/AddEmployeePage';

test.describe('Add New Employee form', () => {
  let form: AddEmployeePage;

  test.beforeEach(async ({ page }) => {
    form = new AddEmployeePage(page);
    await form.goto();
  });

  test('page loads with the core fields visible', async ({ page }) => {
    await expect(page).toHaveURL(/\/employees\/new/);
    await expect(form.firstName).toBeVisible();
    await expect(form.lastName).toBeVisible();
    await expect(form.email).toBeVisible();
    await expect(form.phone).toBeVisible();
    await expect(form.submitButton).toBeVisible();
  });

  test('fields accept typed input', async () => {
    await form.firstName.fill('John');
    await form.lastName.fill('Doe');
    await form.email.fill('john.doe@example.com');
    await form.phone.fill('9876543210');

    await expect(form.firstName).toHaveValue('John');
    await expect(form.lastName).toHaveValue('Doe');
    await expect(form.email).toHaveValue('john.doe@example.com');
    await expect(form.phone).toHaveValue('9876543210');
  });

  test('submitting an empty form shows required-field errors', async ({ page }) => {
    await form.submit();

    await expect(page).toHaveURL(/\/employees\/new/);
    const htmlInvalid = await form.firstName.evaluate(
      (el) => !(el as HTMLInputElement).checkValidity?.(),
    );
    if (!htmlInvalid) {
      await expect(form.validationMessages().first()).toBeVisible();
    }
  });

  test('rejects an invalid email address', async ({ page }) => {
    await form.fillForm(uniqueEmployee({ email: 'not-an-email' }));
    await form.submit();

    await expect(page).toHaveURL(/\/employees\/new/);
    const htmlInvalid = await form.email.evaluate(
      (el) => !(el as HTMLInputElement).checkValidity?.(),
    );
    if (!htmlInvalid) {
      await expect(form.validationMessages().first()).toBeVisible();
    }
  });

  test('phone field does not accept letters', async () => {
    await form.phone.fill('');
    await form.phone.pressSequentially('abc123');
    const value = await form.phone.inputValue();
    // Either letters are stripped on input, or the form flags the field invalid on submit.
    if (/[a-z]/i.test(value)) {
      await form.submit();
      await expect(form.validationMessages().first()).toBeVisible();
    } else {
      expect(value).toBe('123');
    }
  });

  test('creates a new employee with valid data', async ({ page }) => {
    const employee = uniqueEmployee();
    await form.fillForm(employee);
    await form.submit();

    // Success = leaving /new, or a success toast/message.
    const success = page.getByText(/success|created|added|saved/i).first();
    await expect
      .poll(async () => !/\/employees\/new/.test(page.url()) || (await success.isVisible()), {
        timeout: 15_000,
      })
      .toBe(true);

    // If redirected to the list, the new employee should be there.
    if (/\/employees\/?(\?.*)?$/.test(page.url())) {
      await expect(page.getByText(employee.lastName).first()).toBeVisible();
    }
  });

  test('cancel leaves the form without saving', async ({ page }) => {
    test.skip(!(await form.cancelButton.isVisible()), 'No cancel button on this form');
    await form.firstName.fill('ShouldNotSave');
    await form.cancelButton.click();
    await expect(page).not.toHaveURL(/\/employees\/new/);
  });
});
