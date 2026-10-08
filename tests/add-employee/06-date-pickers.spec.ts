import { test, expect } from '../../fixtures/test-fixtures';
import { EmployeeData } from '../../test-data/employee';

test.describe('Date pickers', () => {
  test('date of birth can be typed with the keyboard (dd-mm-yyyy locale)', async ({ form, page }) => {
    await form.dateOfBirth.click();
    await page.keyboard.type('15051995');
    await expect(form.dateOfBirth).toHaveValue('1995-05-15');
  });

  test('future date of birth is blocked', async ({ form }) => {
    await form.fillRequired({ dateOfBirth: '2030-01-01' });
    await form.expectRejected();
    expect(await form.nativeMessage(form.dateOfBirth)).not.toBe('');
  });

  const knownBugs: [string, Partial<EmployeeData>, string][] = [
    ['date of birth under 18 is rejected', { dateOfBirth: '2014-01-01' }, 'max only enforces age >= 10'],
    ['date of birth in 1900 is rejected', { dateOfBirth: '1900-01-01' }, 'no min on date of birth'],
    ['joining date before date of birth is rejected', { dateOfJoining: '1990-01-01' }, 'no cross-field check'],
    ['joining date far in the future is rejected', { dateOfJoining: '2099-01-01' }, 'no max on joining date'],
  ];
  for (const [name, overrides, reason] of knownBugs) {
    test(name, async ({ form }) => {
      test.fail(true, `KNOWN BUG: ${reason}`);
      await form.fillRequired(overrides);
      await form.expectRejected();
    });
  }
});
