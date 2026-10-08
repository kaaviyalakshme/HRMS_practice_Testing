import { test, expect } from '../../fixtures/test-fixtures';

test.describe('Names', () => {
  for (const [label, firstName] of [['digits', '12345'], ['special characters', '@#$%']]) {
    test(`first name with ${label} is rejected`, async ({ form }) => {
      test.fail(true, `KNOWN BUG: first name accepts ${label}`);
      await form.fillRequired({ firstName });
      await form.expectRejected();
    });
  }

  test('first name has a length limit', async ({ form }) => {
    test.fail(true, 'KNOWN BUG: no maxlength, 300 characters accepted');
    await form.firstName.fill('A'.repeat(300));
    expect((await form.firstName.inputValue()).length).toBeLessThanOrEqual(100);
  });
});
