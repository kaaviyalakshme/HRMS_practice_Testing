import { test, expect } from '../../fixtures/test-fixtures';

test.describe('Email', () => {
  test('official email without @ is blocked by the browser', async ({ form }) => {
    await form.fillRequired({ officialEmail: 'abc' });
    await form.expectRejected();
    expect(await form.nativeMessage(form.officialEmail)).toContain('@');
  });

  test('official email without TLD is rejected', async ({ form }) => {
    await form.fillRequired({ officialEmail: 'abc@company' });
    await form.expectRejected('Enter a valid email address');
  });

  test('invalid personal email is rejected', async ({ form }) => {
    await form.fillRequired();
    await form.personalEmail.fill('abc@x');
    await form.expectRejected('Enter a valid email address');
  });
});
