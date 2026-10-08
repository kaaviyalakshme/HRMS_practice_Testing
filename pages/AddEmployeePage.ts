import { Page, Locator, expect } from '@playwright/test';
import { CreateGuard } from '../fixtures/create-guard';
import { VALID_EMPLOYEE, EmployeeData } from '../test-data/employee';

/**
 * Page object for /employees/new.
 *
 * Selectors were taken from the live DOM (2026-10-08). The app's ids contain "*" and
 * "(", so attribute selectors are used. City/State/Pincode ids are duplicated across
 * the two address blocks (a known bug), so those are picked by index.
 */
export class AddEmployeePage {
  readonly page: Page;
  private readonly guard?: CreateGuard;

  // Personal information
  readonly firstName: Locator;
  readonly middleName: Locator;
  readonly lastName: Locator;
  readonly officialEmail: Locator;
  readonly personalEmail: Locator;
  readonly phone: Locator;
  readonly dateOfBirth: Locator;
  readonly gender: Locator;
  readonly nationality: Locator;
  readonly fatherName: Locator;

  // Address information
  readonly commStreet: Locator;
  readonly commCity: Locator;
  readonly commState: Locator;
  readonly commPincode: Locator;
  readonly sameAsComm: Locator;
  readonly permStreet: Locator;
  readonly permCity: Locator;
  readonly permState: Locator;
  readonly permPincode: Locator;

  // Employment information
  readonly employeeCode: Locator;
  readonly dateOfJoining: Locator;
  readonly department: Locator;
  readonly designation: Locator;
  readonly location: Locator;
  readonly reportingManager: Locator;
  readonly leavePolicy: Locator;
  readonly shift: Locator;
  readonly employmentType: Locator;
  readonly workMode: Locator;
  readonly probation: Locator;
  readonly noticePeriod: Locator;

  // Actions
  readonly createButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page, guard?: CreateGuard) {
    this.page = page;
    this.guard = guard;
    const id = (v: string) => page.locator(`[id="${v}"]`);

    this.firstName = id('first-name-*');
    this.middleName = id('middle-name');
    this.lastName = id('last-name-*');
    this.officialEmail = id('official-email-*');
    this.personalEmail = id('personal-email');
    this.phone = id('phone-*');
    this.dateOfBirth = id('date-of-birth-*');
    this.gender = id('gender-*');
    this.nationality = id('nationality');
    this.fatherName = id("father's-name");

    this.commStreet = page.locator('main textarea').nth(0);
    this.commCity = id('city').nth(0);
    this.commState = id('state').nth(0);
    this.commPincode = id('pincode').nth(0);
    this.sameAsComm = page.getByRole('checkbox', { name: 'Same as Communication Address' });
    this.permStreet = page.locator('main textarea').nth(1);
    this.permCity = id('city').nth(1);
    this.permState = id('state').nth(1);
    this.permPincode = id('pincode').nth(1);

    this.employeeCode = id('employee-code');
    this.dateOfJoining = id('date-of-joining-*');
    this.department = id('department-*');
    this.designation = id('designation-*');
    this.location = id('location');
    this.reportingManager = id('reporting-manager');
    this.leavePolicy = id('leave-policy');
    this.shift = id('shift-(optional)');
    this.employmentType = id('employment-type');
    this.workMode = id('work-mode');
    this.probation = id('probation-period-(months)');
    this.noticePeriod = id('notice-period-(days)');

    this.createButton = page.getByRole('button', { name: 'Create Employee' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
  }

  /** Opens the form, dismisses the first-visit tour and waits for the lookup dropdowns. */
  async goto() {
    await this.page.goto('/employees/new');
    await expect(this.page.getByRole('heading', { name: 'Add New Employee' })).toBeVisible();
    const skipTour = this.page.getByRole('button', { name: 'Skip Tour' });
    if (await skipTour.isVisible({ timeout: 1500 }).catch(() => false)) await skipTour.click();
    // Lookups load async; the demo API can answer 429 when pages are reloaded quickly.
    await expect
      .poll(() => this.designation.locator('option').count(), { timeout: 15_000 })
      .toBeGreaterThan(1);
  }

  /** Fills every required field with valid data; pass overrides to change single values. */
  async fillRequired(overrides: Partial<EmployeeData> = {}) {
    const d = { ...VALID_EMPLOYEE, ...overrides };
    await this.firstName.fill(d.firstName);
    await this.lastName.fill(d.lastName);
    await this.officialEmail.fill(d.officialEmail);
    await this.phone.fill(d.phone);
    await this.dateOfBirth.fill(d.dateOfBirth);
    await this.dateOfJoining.fill(d.dateOfJoining);
    await this.gender.selectOption({ label: d.gender });
    await this.department.selectOption(d.department ? { label: d.department } : { index: 1 });
    await this.designation.selectOption(d.designation ? { label: d.designation } : { index: 1 });
  }

  async submit() {
    await this.createButton.click();
    await this.page.waitForTimeout(1000);
  }

  /** Submits and asserts the form did NOT try to save (optionally checks the error text). */
  async expectRejected(message?: string | RegExp) {
    await this.submit();
    expect(this.requireGuard().calls, 'form should NOT have tried to save').toBe(0);
    if (message) await expect(this.page.getByText(message).first()).toBeVisible();
  }

  /** Submits and asserts the form tried to save exactly once (the call itself is blocked). */
  async expectAccepted() {
    await this.submit();
    expect(this.requireGuard().calls, 'form should have tried to save once').toBe(1);
  }

  /** The browser's built-in validation message for a field ('' when valid). */
  nativeMessage(field: Locator) {
    return field.evaluate((e: HTMLInputElement) => e.validationMessage);
  }

  async selectedText(select: Locator) {
    return select.evaluate((s: HTMLSelectElement) => s.options[s.selectedIndex].text);
  }

  private requireGuard() {
    if (!this.guard) throw new Error('This assertion needs the create guard fixture.');
    return this.guard;
  }
}
