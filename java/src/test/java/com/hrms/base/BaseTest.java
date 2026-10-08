package com.hrms.base;

import com.hrms.pages.AddEmployeePage;
import com.microsoft.playwright.*;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.opentest4j.AssertionFailedError;

import java.nio.file.Files;

/**
 * Base class for every test that must NOT create data.
 *
 * One browser per test class, a fresh signed-in context per test. The create guard is
 * installed before the form opens, so no employee record is ever saved.
 */
@ExtendWith(ScreenshotOnFailure.class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public abstract class BaseTest {
  protected Playwright playwright;
  protected Browser browser;
  protected BrowserContext context;
  protected Page page;
  protected CreateGuard createGuard;
  protected AddEmployeePage form;

  @BeforeAll
  void launchBrowser() {
    Assumptions.assumeTrue(Files.exists(Config.AUTH_FILE),
        "No saved session at " + Config.AUTH_FILE.toAbsolutePath() + ". Run: mvn test -Plogin");
    playwright = Playwright.create();
    browser = playwright.chromium().launch(new BrowserType.LaunchOptions()
        .setHeadless(Config.HEADLESS)
        .setSlowMo(Config.SLOW_MO));
  }

  @BeforeEach
  void openForm() {
    context = browser.newContext(new Browser.NewContextOptions()
        .setBaseURL(Config.BASE_URL)
        .setLocale("en-IN")
        .setViewportSize(1600, 900)
        .setStorageStatePath(Config.AUTH_FILE));
    page = context.newPage();
    createGuard = new CreateGuard();
    createGuard.install(page);
    form = new AddEmployeePage(page, createGuard);
    form.open();
  }

  @AfterEach
  void closeContext() {
    if (context != null) context.close();
  }

  @AfterAll
  void closeBrowser() {
    if (browser != null) browser.close();
    if (playwright != null) playwright.close();
  }

  public Page page() {
    return page;
  }

  /**
   * Runs a check for a KNOWN BUG. The test passes while the bug exists (the check fails)
   * and fails once the bug is fixed, telling you to turn it into a normal test.
   */
  protected void knownBug(String reason, Executable check) {
    try {
      check.run();
    } catch (AssertionError | PlaywrightException expected) {
      System.out.println("[known bug still present] " + reason);
      return;
    } catch (Throwable t) {
      throw new RuntimeException(t);
    }
    throw new AssertionFailedError("Expected to fail but passed - is this fixed? " + reason
        + " (remove the knownBug(...) wrapper)");
  }

  @FunctionalInterface
  protected interface Executable {
    void run() throws Throwable;
  }
}
