# HRMS Practice Testing

Playwright tests for the **Add New Employee** form at
https://sapiensdemo.inaivia.com/employees/new.

## Setup

```bash
npm install
npx playwright install chromium
```

## Run

```bash
export HRMS_USERNAME="your-user"
export HRMS_PASSWORD="your-password"

npm run test:discover   # list the form's real fields + screenshot
npm test                # run all tests
npm run test:headed     # watch them run in a browser
npm run report          # open the HTML report
```

`tests/auth.setup.ts` logs in once and reuses the session. Locators live in
`pages/AddEmployeePage.ts`; if a field isn't found, run `test:discover` and
adjust its pattern there.

## What's covered (`tests/add-employee.spec.ts`)

- Page loads with First name, Last name, Email, Phone and Save visible
- Fields accept input
- Empty submit shows required-field errors
- Invalid email is rejected
- Phone rejects letters
- Valid data creates an employee (redirect or success message)
- Cancel leaves the form without saving
