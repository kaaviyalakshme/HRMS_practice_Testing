package com.hrms.base;

import com.microsoft.playwright.Page;
import org.junit.jupiter.api.extension.AfterTestExecutionCallback;
import org.junit.jupiter.api.extension.ExtensionContext;

import java.nio.file.Paths;

/**
 * Saves a full-page screenshot to target/screenshots/ when a test fails.
 * Runs right after the test method, before @AfterEach closes the page.
 */
public class ScreenshotOnFailure implements AfterTestExecutionCallback {
  @Override
  public void afterTestExecution(ExtensionContext ctx) {
    if (ctx.getExecutionException().isEmpty()) return;
    Object instance = ctx.getRequiredTestInstance();
    if (instance instanceof BaseTest t && t.page() != null && !t.page().isClosed()) {
      String name = (ctx.getRequiredTestClass().getSimpleName() + "-" + ctx.getDisplayName())
          .replaceAll("[^A-Za-z0-9._-]+", "_");
      t.page().screenshot(new Page.ScreenshotOptions()
          .setPath(Paths.get("target", "screenshots", name + ".png"))
          .setFullPage(true));
    }
  }
}
