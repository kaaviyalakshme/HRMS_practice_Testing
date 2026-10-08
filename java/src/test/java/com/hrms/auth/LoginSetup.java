package com.hrms.auth;

import com.hrms.base.Config;
import com.microsoft.playwright.*;
import com.microsoft.playwright.options.AriaRole;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;

import java.nio.file.Files;
import java.util.regex.Pattern;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

/**
 * Signs in once and saves the session. Run with: mvn test -Plogin
 *
 * With HRMS_USERNAME / HRMS_PASSWORD set it signs in automatically; otherwise a browser
 * opens and you sign in yourself (password, Google or Microsoft). Waits up to 5 minutes.
 */
@Tag("login")
class LoginSetup {
  @Test
  void signInAndSaveSession() throws Exception {
    try (Playwright pw = Playwright.create()) {
      Browser browser = pw.chromium().launch(new BrowserType.LaunchOptions().setHeadless(false));
      BrowserContext context = browser.newContext(new Browser.NewContextOptions()
          .setBaseURL(Config.BASE_URL).setLocale("en-IN").setViewportSize(1600, 900));
      Page page = context.newPage();
      page.navigate("/login");

      if (!Config.USERNAME.isBlank() && !Config.PASSWORD.isBlank()) {
        page.getByLabel("Email").fill(Config.USERNAME);
        page.getByLabel("Password", new Page.GetByLabelOptions().setExact(true)).fill(Config.PASSWORD);
        page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Sign In")).click();
      } else {
        System.out.println(">>> Sign in in the browser window. Waiting up to 5 minutes...");
      }

      page.waitForURL(Pattern.compile("^(?!.*/login).*$"), new Page.WaitForURLOptions().setTimeout(5 * 60_000));
      page.navigate("/employees/new");
      assertThat(page.getByRole(AriaRole.HEADING, new Page.GetByRoleOptions().setName("Add New Employee")))
          .isVisible();
      Files.createDirectories(Config.AUTH_FILE.toAbsolutePath().getParent());
      context.storageState(new BrowserContext.StorageStateOptions().setPath(Config.AUTH_FILE));
      System.out.println(">>> Session saved to " + Config.AUTH_FILE.toAbsolutePath());
      browser.close();
    }
  }
}
