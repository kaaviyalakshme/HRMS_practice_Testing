import { Page } from '@playwright/test';

/** The "create employee" API the form calls on submit. */
export const EMPLOYEE_API = /\/api\/people\/api\/v1\/employees\/?(\?.*)?$/;

/**
 * Blocks POST requests to the create-employee API and counts them, so tests can tell
 * whether the form accepted the input without ever creating a record.
 */
export class CreateGuard {
  calls = 0;

  async install(page: Page) {
    await page.route(EMPLOYEE_API, route => {
      if (route.request().method() === 'POST') {
        this.calls++;
        return route.abort('blockedbyclient');
      }
      return route.continue();
    });
  }
}
