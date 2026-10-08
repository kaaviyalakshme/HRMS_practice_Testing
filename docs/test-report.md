# Add Employee page: test report

**Page:** https://sapiensdemo.inaivia.com/employees/new
**Date:** 2026-10-08
**Browser:** Chromium controlled by Playwright on Kishore's computer, signed in as Kishore
**Result:** 22 passed, 20 failed, 3 observations, plus 3 notes under "Other observations". No employee record was created.

## How the tests were run

- Every test ran in the real browser against the live page. A result is only listed as passed or failed if it was actually executed.
- **No employee was created.** Before testing, every non-GET request from the test browser was blocked, and a test request confirmed the block was working. When the form passed client-side validation, it sent `POST /api/people/api/v1/employees/`. That request was blocked, so the app showed its "Failed to create employee" toast. In this report, **"form tried to save"** means the client-side validation accepted the input.
- **The server was not tested.** The backend never received any of these submissions, so it may still reject some of the values below. Only the form's own validation was tested.
- Each test reloaded the page and filled in a valid baseline first:
  - First name: Test
  - Last name: User
  - Official email: qa.test@example.com
  - Phone: 9876543210
  - Date of birth: 15-05-1995
  - Gender: Male
  - Date of joining: 08-10-2026
  - Department: IT
  - Designation: Software Tester

  Then one field was changed for the test.

## Results

### Required fields and Create Employee button

| # | Test | Expected | Actual | Result |
|---|------|----------|--------|--------|
| 1 | Click Create Employee with an empty form | An error for each required field and no save | Showed 9 errors: First name, Last name, Email, Phone, Date of birth, Gender, Joining date, Department and Designation. No save request was sent. | ✅ Pass |
| 2 | Valid baseline data | The form submits | The form tried to save | ✅ Pass |
| 3 | First name is only spaces | "First name is required" | "First name is required" | ✅ Pass |
| 4 | Double-click Create Employee | One save request | One save request | ✅ Pass |
| 5 | Press Enter in the Last Name field | The form submits | The form submitted (one save request) | ✅ Pass |
| 6 | Cancel button | Goes back to the employee list | Went to /employees | ✅ Pass |

### Email

| # | Test | Expected | Actual | Result |
|---|------|----------|--------|--------|
| 7 | Official email `abc` | Rejected | The browser's own message was shown ("Please include an '@'…"). No save. | ✅ Pass |
| 8 | Official email `abc@company` (no TLD) | Rejected | "Enter a valid email address" | ✅ Pass |
| 9 | Personal email `abc@x` | Rejected | "Enter a valid email address" | ✅ Pass |

### Phone and country code

| # | Test | Expected | Actual | Result | Screenshot |
|---|------|----------|--------|--------|------------|
| 10 | 5 digits | Rejected | "Phone number must be 10 digits" | ✅ Pass | |
| 11 | 12 digits | Rejected | "Phone number must be 10 digits" | ✅ Pass | |
| 12 | Letters `abcdefghij` | Rejected | Letters are removed as you type, then "Phone is required" | ✅ Pass | |
| 13 | `98765 43210` (with a space) | Accepted as 10 digits | The space was removed and the number accepted | ✅ Pass | |
| 14 | `0000000000` | Rejected (Indian mobile numbers start with 6 to 9) | **The form tried to save** | ❌ Fail | [fail-01](screenshots/fail-01-phone-zeros.png) |
| 15 | `1234567890` | Rejected | **The form tried to save** | ❌ Fail | [fail-02](screenshots/fail-02-phone-starts-1.png) |
| 16 | Country code selector | A country code control is present (requested in the test brief) | **There is no country code control.** Phone is a plain text box. Its maxlength is 15, but the placeholder says "Enter 10 digit phone number". | ❌ Fail | [fail-15](screenshots/fail-15-no-country-code.png) |
| 17 | `+919876543210` | Either accepted as +91 or rejected, consistently | Accepted (13 characters), even though a 12-digit number without `+` is rejected | ⚠️ Observation | |

### Names

| # | Test | Expected | Actual | Result | Screenshot |
|---|------|----------|--------|--------|------------|
| 18 | First name `12345` | Rejected | **The form tried to save** | ❌ Fail | [fail-03](screenshots/fail-03-name-digits.png) |
| 19 | First name `@#$%` | Rejected | **The form tried to save** | ❌ Fail | [fail-04](screenshots/fail-04-name-specials.png) |
| 20 | First name with 300 characters | A length limit | No maxlength. **The form tried to save.** | ❌ Fail | |

### Date pickers

| # | Test | Expected | Actual | Result | Screenshot |
|---|------|----------|--------|--------|------------|
| 21 | Type a date of birth with the keyboard (15051995) | 15-05-1995 | 1995-05-15 was stored | ✅ Pass | |
| 22 | Date of birth in the future (2030) | Rejected | Blocked by the field's `max` of 08-10-2016 | ✅ Pass | |
| 23 | Date of birth 01-01-2014 (age 12) | Rejected (working age) | **The form tried to save.** The `max` only enforces an age of 10 or more. | ❌ Fail | [fail-05](screenshots/fail-05-dob-age-12.png) |
| 24 | Date of birth 01-01-1900 (age 126) | Rejected | **The form tried to save.** The field has no `min`. | ❌ Fail | [fail-06](screenshots/fail-06-dob-1900.png) |
| 25 | Date of joining 01-01-1990, before the 1995 date of birth | Rejected | **The form tried to save** | ❌ Fail | [fail-07](screenshots/fail-07-doj-before-dob.png) |
| 26 | Date of joining 01-01-2099 | Rejected or warned | **The form tried to save.** The field has no `min` or `max`. | ❌ Fail | [fail-08](screenshots/fail-08-doj-2099.png) |

### Notice period and probation

| # | Test | Expected | Actual | Result | Screenshot |
|---|------|----------|--------|--------|------------|
| 27 | Notice period, up arrow from 30 | 31 | 31 | ✅ Pass | |
| 28 | Notice period, typing `e5` | Non-numeric input ignored | Became `05` | ✅ Pass | |
| 29 | Notice period −5 | Rejected | **The form tried to save** | ❌ Fail | [fail-09](screenshots/fail-09-notice-negative.png) |
| 30 | Notice period, down arrow 3 times from 0 | Stops at 0 | **Went to −3.** The field has no `min`. | ❌ Fail | [fail-16](screenshots/fail-16-notice-arrow-negative.png) |
| 31 | Notice period 5000 days | Rejected | **The form tried to save.** The field has no `max`. | ❌ Fail | [fail-10](screenshots/fail-10-notice-5000.png) |
| 32 | Notice period 2.5 | Rejected (whole days only) | **The form tried to save** | ❌ Fail | [fail-11](screenshots/fail-11-notice-decimal.png) |
| 33 | Notice period cleared | Required, or the default restored | Silently saved as `0` | ⚠️ Observation | |
| 34 | Probation −1, or down arrow from 0 | Rejected | **The form tried to save.** The arrow also goes to −1. | ❌ Fail | [fail-12](screenshots/fail-12-probation-negative.png) |
| 35 | Probation 100 months | Rejected | **The form tried to save** | ❌ Fail | |

### Address

| # | Test | Expected | Actual | Result | Screenshot |
|---|------|----------|--------|--------|------------|
| 36 | Pincode `abcdef` | Rejected | **The form tried to save** | ❌ Fail | [fail-13](screenshots/fail-13-pincode-letters.png) |
| 37 | Pincode `12345` (5 digits) | Rejected (Indian PIN codes are 6 digits) | **The form tried to save.** The field's maxlength is 10. | ❌ Fail | [fail-14](screenshots/fail-14-pincode-5-digits.png) |
| 38 | "Same as Communication Address" checkbox | Copies the address and locks the fields | Copied the street, city, state and pincode, locked the fields, and kept them in sync when the communication city changed | ✅ Pass | |
| 39 | Unchecking "Same as" | The fields become editable | The fields were unlocked and kept the copied values | ✅ Pass | |
| 40 | Unique field IDs | Each label points to one input | **City, State and Pincode IDs appear twice** (once in each address block). Clicking a Permanent Address label focuses the Communication field instead. This is an accessibility and automation bug. | ❌ Fail | |

### Dropdowns

| # | Test | Expected | Actual | Result | Screenshot |
|---|------|----------|--------|--------|------------|
| 41 | Gender, Employment Type and Work Mode options | Correct lists | Gender: 4 options. Employment Type: 5. Work Mode: 3, with sensible defaults. | ✅ Pass | |
| 42 | Selecting an option (Department = Finance) | The option is selected | Selected | ✅ Pass | |
| 43 | Employee code longer than 20 characters | Capped | Capped at 20 | ✅ Pass | |
| 44 | Quality of the Department and Designation lists | Clean, unique names | **Department** has 42 entries, including `11`, `12345`, `@#$y&**(` and `@...`, plus duplicates: `it` ×9, Finance ×4, Technical, testing and IPO. **Designation** includes `-5667`, `12` ×2 and Test Engineer ×4. **Shift** shows "genaral shift" twice. This is master data, not the form itself, but the form shows it without removing duplicates. | ❌ Fail | [fail-17](screenshots/fail-17-dropdown-junk-data.png) |
| 45 | Location labels | City in brackets | `Chennai ()`, `bangalore ()` and `madurai ()` show empty brackets when the location has no city | ⚠️ Observation | |

### Other observations

- **Cancel with unsaved data:** Cancel leaves the page straight away without asking for confirmation, so the entered data is lost.
- **Dropdowns failing silently:** while I reloaded the page quickly, the API returned HTTP 429 (rate limited) for departments, designations, locations and other lookups. The dropdowns then showed only their placeholder, with no error and no retry, so a user would see empty lists without knowing why.
- **Required fields:** fields marked with `*` don't have the HTML `required` attribute. Validation is only done in JavaScript, which works, but screen readers won't announce those fields as required.

## Not tested

- **Server-side validation and the real submission:** waiting for your approval.
- **The native date picker's calendar popup:** the browser draws it outside the page, so it can't be automated or screenshotted. The date fields were tested by typing and filling values, and through their min and max limits.
