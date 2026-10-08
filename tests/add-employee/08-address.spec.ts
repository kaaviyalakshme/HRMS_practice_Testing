import { test, expect } from '../../fixtures/test-fixtures';

test.describe('Address', () => {
  test('"Same as Communication Address" copies, locks and syncs', async ({ form }) => {
    await form.commStreet.fill('12 Main St');
    await form.commCity.fill('Chennai');
    await form.commState.fill('Tamil Nadu');
    await form.commPincode.fill('600001');
    await form.sameAsComm.check();
    await expect(form.permStreet).toHaveValue('12 Main St');
    await expect(form.permCity).toHaveValue('Chennai');
    await expect(form.permState).toHaveValue('Tamil Nadu');
    await expect(form.permPincode).toHaveValue('600001');
    await expect(form.permStreet).not.toBeEditable();
    await form.commCity.fill('Madurai');
    await expect(form.permCity).toHaveValue('Madurai');
    await form.sameAsComm.uncheck();
    await expect(form.permCity).toBeEditable();
  });

  for (const [label, value] of [['letters', 'abcdef'], ['5 digits', '12345']]) {
    test(`pincode with ${label} is rejected`, async ({ form }) => {
      test.fail(true, `KNOWN BUG: pincode accepts ${label}`);
      await form.fillRequired();
      await form.commPincode.fill(value);
      await form.expectRejected();
    });
  }
});
