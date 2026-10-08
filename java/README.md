# Add Employee tests: Playwright for Java

This is the Java (Maven + JUnit 5) version of the TypeScript suite in the repo root. It covers the same checks and uses the same selectors and the same safety rule: **no test creates an employee** unless you run the real-submit profile.

## Structure

```
java/
├── pom.xml
└── src/test/java/com/hrms/
    ├── auth/LoginSetup.java            Sign in once, save session   (mvn test -Plogin)
    ├── base/
    │   ├── BaseTest.java               Browser per class, signed-in context per test, knownBug(...)
    │   ├── Config.java                 BASE_URL, HEADLESS, SLOW_MO, credentials
    │   ├── CreateGuard.java            Blocks + counts POST /employees/ calls
    │   └── ScreenshotOnFailure.java    target/screenshots/<test>.png on failure
    ├── data/EmployeeData.java          Valid baseline + expected error messages
    ├── pages/AddEmployeePage.java      Page object: locators and actions
    └── tests/
        ├── FormStructureTest.java      ├── DatePickerTest.java
        ├── RequiredAndSubmitTest.java  ├── NoticeAndProbationTest.java
        ├── EmailTest.java              ├── AddressTest.java
        ├── PhoneTest.java              ├── DropdownTest.java
        ├── NamesTest.java              └── RealSubmissionTest.java  (creates a real employee, opt-in)
```

## Setup (once)

You need JDK 17+ and Maven 3.9+. In VS Code, install the recommended **Extension Pack for Java**.

```bash
cd java
mvn -q test-compile                                   # downloads dependencies
mvn exec:java -Dexec.args="install chromium"          # downloads the browser
mvn test -Plogin                                      # a browser opens: sign in; session is saved
```

The session is saved to `../playwright/.auth/user.json`, which is the same file the TypeScript suite uses, so signing in once covers both suites. To sign in automatically instead, set `HRMS_USERNAME` and `HRMS_PASSWORD` as environment variables.

## Run

| Command | What it does |
|---|---|
| `mvn test` | Run all tests headless |
| `mvn test -DHEADLESS=false` | Watch them run in a browser |
| `mvn test -DHEADLESS=false -DSLOW_MO=500` | Watch them in slow motion |
| `mvn test -Dtest=PhoneTest` | Run one class |
| `mvn test -Dtest=PhoneTest#countryCode` | Run one test |
| `mvn test -Preal-submit` | **Creates a real employee** (only this test) |

Results are written to `target/surefire-reports/`, and failure screenshots to `target/screenshots/`. In VS Code you can also run or debug any test from the Testing panel or with the ▶ next to each method.

If no saved session exists, the test classes are skipped, and Maven prints a message telling you to run `mvn test -Plogin`.

## Known bugs (`knownBug(...)`)

Checks for bugs found on 2026-10-08 are wrapped in `knownBug("reason", () -> { ... })`. JUnit has no `test.fail()`, so this wrapper does the same job:
- While the bug exists, the check fails and the test **passes**.
- When the bug is fixed, the test **fails** with "Expected to fail but passed". Remove the wrapper at that point.

## Notes

- Tests run one at a time because the demo API returns HTTP 429 on rapid reloads.
- The browser locale is en-IN, so typing dates uses dd-mm-yyyy.
