import { test, expect } from '../../fixtures/test-fixtures';

test.describe('Notice period and probation', () => {
  test('arrow up increments notice period', async ({ form }) => {
    await form.noticePeriod.fill('30');
    await form.noticePeriod.press('ArrowUp');
    await expect(form.noticePeriod).toHaveValue('31');
  });

  test('arrow down stops at 0', async ({ form }) => {
    test.fail(true, 'KNOWN BUG: no min=0, goes negative');
    await form.noticePeriod.fill('0');
    await form.noticePeriod.press('ArrowDown');
    await expect(form.noticePeriod).toHaveValue('0');
  });

  for (const [label, value] of [['negative', '-5'], ['5000 days', '5000'], ['decimal', '2.5']]) {
    test(`notice period ${label} is rejected`, async ({ form }) => {
      test.fail(true, `KNOWN BUG: notice period accepts ${label}`);
      await form.fillRequired();
      await form.noticePeriod.fill(value);
      await form.expectRejected();
    });
  }

  for (const [label, value] of [['negative', '-1'], ['100 months', '100']]) {
    test(`probation ${label} is rejected`, async ({ form }) => {
      test.fail(true, `KNOWN BUG: probation accepts ${label}`);
      await form.fillRequired();
      await form.probation.fill(value);
      await form.expectRejected();
    });
  }
});
