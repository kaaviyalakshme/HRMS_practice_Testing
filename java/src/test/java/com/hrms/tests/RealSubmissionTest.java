package com.hrms.tests;

import com.hrms.base.Config;
import com.hrms.base.CreateGuard;
import com.hrms.data.EmployeeData;
import com.hrms.pages.AddEmployeePage;
import com.microsoft.playwright.*;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;

import java.util.regex.Pattern;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertTrue;

/** CREATES A REAL EMPLOYEE. Runs only with: mvn test -Preal-submit */
@Tag("real-submit")
class RealSubmissionTest {
  @Test
  void createsEmployeeWithValidData() {
    try (Playwright pw = Playwright.create()) {
      Browser browser = pw.chromium().launch(new BrowserType.LaunchOptions().setHeadless(Config.HEADLESS));
      BrowserContext context = browser.newContext(new Browser.NewContextOptions()
          .setBaseURL(Config.BASE_URL).setLocale("en-IN").setViewportSize(1600, 900)
          .setStorageStatePath(Config.AUTH_FILE));
      Page page = context.newPage();
      AddEmployeePage form = new AddEmployeePage(page, new CreateGuard()); // guard NOT installed
      form.open();
      form.fillRequired(EmployeeData.unique());
      Response response = page.waitForResponse(
          r -> CreateGuard.EMPLOYEE_API.matcher(r.url()).matches() && "POST".equals(r.request().method()),
          form.createButton::click);
      assertTrue(response.status() < 300, "Create failed: " + response.status() + " " + response.text());
      assertThat(page).not().hasURL(Pattern.compile(".*/employees/new.*"));
    }
  }
}
