import { Page, Locator, expect } from '@playwright/test';

export interface EmployeeData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth?: string;   // yyyy-mm-dd
  dateOfJoining?: string; // yyyy-mm-dd
  gender?: string;
  department?: string;
  designation?: string;
}

/**
 * Page object for /employees/new.
 * Locators match by visible label first, then by name/id/placeholder, so they
 * survive small markup differences. If a field isn't found, run
 * `npm run test:discover` and adjust the matching pattern below.
 */
export class AddEmployeePage {
  readonly page: Page;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly email: Locator;
  readonly phone: Locator;
  readonly dateOfBirth: Locator;
  readonly dateOfJoining: Locator;
  readonly gender: Locator;
  readonly department: Locator;
  readonly designation: Locator;
  readonly submitButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstName = this.field(/first\s*name/i, 'first');
    this.lastName = this.field(/last\s*name/i, 'last');
    this.email = this.field(/e-?mail/i, 'email');
    this.phone = this.field(/phone|mobile|contact/i, 'phone');
    this.dateOfBirth = this.field(/date\s*of\s*birth|dob|birth/i, 'birth');
    this.dateOfJoining = this.field(/joining|join\s*date|hire|start\s*date/i, 'join');
    this.gender = this.field(/gender/i, 'gender');
    this.department = this.field(/department/i, 'department');
    this.designation = this.field(/designation|job\s*title|position|role/i, 'designation');
    this.submitButton = page.getByRole('button', { name: /save|submit|add employee|create/i }).first();
    this.cancelButton = page.getByRole('button', { name: /cancel|back/i }).first();
  }

  private field(label: RegExp, key: string): Locator {
    const byAttr = this.page.locator(
      `input[name*="${key}" i], input[id*="${key}" i], input[placeholder*="${key}" i], ` +
        `select[name*="${key}" i], select[id*="${key}" i], textarea[name*="${key}" i]`,
    );
    return this.page.getByLabel(label).or(byAttr).first();
  }

  async goto() {
    await this.page.goto('/employees/new');
    await expect(this.firstName).toBeVisible();
  }

  /** Fills a text input, native <select>, or custom dropdown. */
  async setValue(locator: Locator, value: string) {
    const tag = await locator.evaluate((el) => el.tagName.toLowerCase());
    if (tag === 'select') {
      await locator.selectOption({ label: value }).catch(() => locator.selectOption(value));
      return;
    }
    const role = await locator.getAttribute('role');
    if (role === 'combobox' || (await locator.getAttribute('readonly')) !== null) {
      await locator.click();
      await this.page.getByRole('option', { name: value, exact: false }).first().click();
      return;
    }
    await locator.fill(value);
  }

  async fillForm(data: EmployeeData) {
    await this.setValue(this.firstName, data.firstName);
    await this.setValue(this.lastName, data.lastName);
    await this.setValue(this.email, data.email);
    await this.setValue(this.phone, data.phone);
    if (data.dateOfBirth && (await this.dateOfBirth.count())) await this.setValue(this.dateOfBirth, data.dateOfBirth);
    if (data.dateOfJoining && (await this.dateOfJoining.count())) await this.setValue(this.dateOfJoining, data.dateOfJoining);
    if (data.gender && (await this.gender.count())) await this.setValue(this.gender, data.gender);
    if (data.department && (await this.department.count())) await this.setValue(this.department, data.department);
    if (data.designation && (await this.designation.count())) await this.setValue(this.designation, data.designation);
  }

  async submit() {
    await this.submitButton.click();
  }

  /** Any visible validation message (HTML5 or app-rendered). */
  validationMessages(): Locator {
    return this.page.locator(
      '[role="alert"], .error, .invalid-feedback, .text-danger, .field-error, [class*="error" i], [aria-invalid="true"]',
    );
  }
}

export function uniqueEmployee(overrides: Partial<EmployeeData> = {}): EmployeeData {
  const id = Date.now().toString().slice(-6);
  return {
    firstName: 'Test',
    lastName: `Auto${id}`,
    email: `test.auto${id}@example.com`,
    phone: `98${id}${id.slice(0, 2)}`,
    dateOfBirth: '1995-06-15',
    dateOfJoining: new Date().toISOString().slice(0, 10),
    gender: 'Male',
    ...overrides,
  };
}
