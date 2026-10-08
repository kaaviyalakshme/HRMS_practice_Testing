import { test as base } from '@playwright/test';
import { AddEmployeePage } from '../pages/AddEmployeePage';
import { CreateGuard } from './create-guard';

type Fixtures = {
  /** Counts (and blocks) create-employee calls. Installed before the page loads. */
  createGuard: CreateGuard;
  /** The Add Employee form, already opened and ready. */
  form: AddEmployeePage;
};

/**
 * Use this `test` in every spec that must NOT create data. It installs the create
 * guard automatically, so no employee record is ever saved.
 */
export const test = base.extend<Fixtures>({
  createGuard: async ({ page }, use) => {
    const guard = new CreateGuard();
    await guard.install(page);
    await use(guard);
  },
  form: async ({ page, createGuard }, use) => {
    const form = new AddEmployeePage(page, createGuard);
    await form.goto();
    await use(form);
  },
});

export { expect } from '@playwright/test';
