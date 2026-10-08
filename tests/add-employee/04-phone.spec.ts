import { test, expect } from '../../fixtures/test-fixtures';

test.describe('Phone and country code', () => {
  for (const [label, phone] of [['5 digits', '12345'], ['12 digits', '987654321012']]) {
    test(`phone with ${label} is rejected`, async ({ form }) => {
      await form.fillRequired({ phone });
      await form.expectRejected('Phone number must be 10 digits');
    });
  }

  test('letters are stripped', async ({ form }) => {
    await form.phone.fill('abcdefghij');
    await expect(form.phone).toHaveValue('');
  });

  test('spaces are stripped', async ({ form }) => {
    await form.phone.fill('98765 43210');
    await expect(form.phone).toHaveValue('9876543210');
  });

  for (const phone of ['0000000000', '1234567890']) {
    test(`invalid Indian mobile ${phone} is rejected`, async ({ form }) => {
      test.fail(true, 'KNOWN BUG: any 10 digits accepted; Indian mobiles start with 6-9');
      await form.fillRequired({ phone });
      await form.expectRejected();
    });
  }

  test('country code selector is present', async ({ page }) => {
    test.fail(true, 'KNOWN GAP: no country code control next to Phone');
    await expect(page.locator('main').getByRole('combobox', { name: /country|code|dial/i })).toHaveCount(1);
  });

  test('maxlength matches the 10-digit placeholder', async ({ form }) => {
    test.fail(true, 'KNOWN BUG: maxlength is 15 while placeholder says 10 digits');
    await expect(form.phone).toHaveAttribute('maxlength', '10');
  });
});
