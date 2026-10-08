import { test } from '@playwright/test';

// Prints every form control on /employees/new (label, name, id, type, required)
// so you can tune the locators in pages/AddEmployeePage.ts to the real markup.
test('list form fields on Add Employee page', async ({ page }) => {
  await page.goto('/employees/new');
  await page.waitForLoadState('networkidle');

  const fields = await page.locator('input, select, textarea, [role="combobox"]').evaluateAll((els) =>
    els.map((el) => {
      const e = el as HTMLInputElement;
      const label =
        (e.id && document.querySelector(`label[for="${e.id}"]`)?.textContent?.trim()) ||
        e.closest('label')?.textContent?.trim() ||
        e.getAttribute('aria-label') ||
        '';
      return {
        tag: e.tagName.toLowerCase(),
        type: e.type ?? '',
        name: e.name ?? '',
        id: e.id,
        label,
        placeholder: e.placeholder ?? '',
        required: e.required || e.getAttribute('aria-required') === 'true',
      };
    }),
  );
  console.table(fields);

  const buttons = await page.getByRole('button').allInnerTexts();
  console.log('Buttons:', buttons.map((b) => b.trim()).filter(Boolean));
  await page.screenshot({ path: 'test-results/add-employee-page.png', fullPage: true });
});
