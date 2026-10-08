import { test, expect } from '../../fixtures/test-fixtures';

test.describe('Form structure', () => {
  test('shows all sections and core fields', async ({ form, page }) => {
    for (const h of ['Personal Information', 'Address Information', 'Employment Information']) {
      await expect(page.getByRole('heading', { name: h })).toBeVisible();
    }
    for (const el of [form.firstName, form.lastName, form.officialEmail, form.phone, form.dateOfBirth,
      form.gender, form.dateOfJoining, form.department, form.designation, form.probation,
      form.noticePeriod, form.createButton, form.cancelButton]) {
      await expect(el).toBeVisible();
    }
  });

  test('default values', async ({ form }) => {
    await expect(form.nationality).toHaveValue('IN');
    await expect(form.employmentType).toHaveValue('full_time');
    await expect(form.workMode).toHaveValue('office');
    await expect(form.probation).toHaveValue('6');
    await expect(form.noticePeriod).toHaveValue('30');
  });

  test('field ids are unique', async ({ form, page }) => {
    test.fail(true, 'KNOWN BUG: city/state/pincode ids are duplicated across the two address blocks');
    const dups = await page.evaluate(() => {
      const c: Record<string, number> = {};
      document.querySelectorAll('main [id]').forEach(e => (c[e.id] = (c[e.id] || 0) + 1));
      return Object.keys(c).filter(k => c[k] > 1);
    });
    expect(dups).toEqual([]);
  });
});
