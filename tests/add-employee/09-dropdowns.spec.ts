import { test, expect } from '../../fixtures/test-fixtures';

test.describe('Dropdowns', () => {
  test('fixed option lists', async ({ form }) => {
    await expect(form.gender.locator('option')).toHaveText(['Select gender', 'Male', 'Female', 'Other', 'Prefer not to say']);
    await expect(form.employmentType.locator('option')).toHaveText(['Full Time', 'Part Time', 'Contract', 'Internship', 'Consultant']);
    await expect(form.workMode.locator('option')).toHaveText(['Office', 'Remote', 'Hybrid']);
  });

  test('selecting a department works', async ({ form }) => {
    await form.department.selectOption({ label: 'Finance' });
    expect(await form.selectedText(form.department)).toBe('Finance');
  });

  test('employee code is capped at 20 characters', async ({ form }) => {
    await form.employeeCode.fill('X'.repeat(30));
    expect((await form.employeeCode.inputValue()).length).toBe(20);
  });

  for (const key of ['department', 'designation', 'shift'] as const) {
    test(`${key} options have no duplicates`, async ({ form }) => {
      test.fail(true, `KNOWN DATA ISSUE: duplicate ${key} entries in master data`);
      const texts = (await form[key].locator('option').allTextContents()).slice(1).map(t => t.trim().toLowerCase());
      expect(texts.length).toBe(new Set(texts).size);
    });
  }
});
