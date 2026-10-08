# HRMS Practice Testing

Playwright + TypeScript tests for the **Add New Employee** form at
https://sapiensdemo.inaivia.com/employees/new.

Selectors come from the live page. **The same suite is also available in Java** (Maven + JUnit 5): see [`java/README.md`](java/README.md). Every test (except the opt-in one) **blocks the create-employee API**, so running the suite never creates a record.

## Project structure

```
.
├── .vscode/                  VS Code settings, debug config, recommended extensions
├── docs/
│   ├── test-report.md        Manual test report (2026-10-08) with results
│   └── screenshots/          Screenshots of each failure
├── java/                     Same suite in Playwright for Java (Maven + JUnit 5)
├── fixtures/
│   ├── create-guard.ts       Blocks + counts POST /employees/ calls
│   └── test-fixtures.ts      `test` with `form` and `createGuard` fixtures
├── pages/
│   └── AddEmployeePage.ts    Page object: locators and helper actions
├── test-data/
│   └── employee.ts           Valid baseline data and expected error messages
├── tests/
│   ├── auth.setup.ts         Sign in once, save session
│   └── add-employee/
│       ├── 01-form-structure.spec.ts
│       ├── 02-required-and-submit.spec.ts
│       ├── 03-email.spec.ts
│       ├── 04-phone.spec.ts
│       ├── 05-names.spec.ts
│       ├── 06-date-pickers.spec.ts
│       ├── 07-notice-and-probation.spec.ts
│       ├── 08-address.spec.ts
│       ├── 09-dropdowns.spec.ts
│       └── 99-real-submission.spec.ts   (creates a real employee, opt-in)
├── playwright.config.ts
├── run-tests.bat             Double-click runner for Windows
└── .env.example
```

## Open in VS Code

1. Install [Node.js](https://nodejs.org) 18+ and [VS Code](https://code.visualstudio.com).
2. Clone and open:
   ```bash
   git clone https://github.com/kaaviyalakshme/HRMS_practice_Testing.git
   cd HRMS_practice_Testing
   code .
   ```
3. Accept the **recommended extensions** prompt (Playwright Test for VS Code, ESLint, Prettier).
4. In the VS Code terminal:
   ```bash
   npm install
   npx playwright install chromium
   npm run login      # a browser opens; sign in. Session is saved to playwright/.auth/user.json
   ```
   To sign in automatically instead, copy `.env.example` to `.env` and fill in `HRMS_USERNAME` / `HRMS_PASSWORD`.
5. Open the **Testing** panel (flask icon) to run or debug any test with one click, or use **Run and Debug → "Debug current spec file"**.

## Commands

| Command | What it does |
|---|---|
| `npm test` | Run all tests headless |
| `npm run test:headed` | Run with a visible browser |
| `npm run test:ui` | Playwright UI mode (watch, time-travel) |
| `npm run test:debug` | Step through with the Playwright inspector |
| `npm run report` | Open the HTML report (screenshots, videos, traces) |
| `npm run typecheck` | TypeScript check |
| `npm run test:real-submit` | **Creates a real employee** (only this test) |

On Windows you can also double-click `run-tests.bat`.

## Known bugs (`test.fail()`)

Tests marked `test.fail()` cover bugs found on 2026-10-08 (see `docs/test-report.md`): phone digits, names, date ranges, notice/probation ranges, pincode, duplicate ids, duplicate dropdown data and the missing country code. They **pass while the bug exists**. When a bug is fixed, Playwright reports "expected to fail but passed": delete that `test.fail()` line.

## Notes

- Tests run one at a time (`workers: 1`) because the demo API returns HTTP 429 on rapid reloads.
- The keyboard date test assumes an en-IN (dd-mm-yyyy) locale, set in `playwright.config.ts`.
- If a saved session expires, delete `playwright/.auth/user.json` and run `npm run login` again.
