package com.hrms.base;

import com.microsoft.playwright.Page;

import java.util.concurrent.atomic.AtomicInteger;
import java.util.regex.Pattern;

/**
 * Blocks POST requests to the create-employee API and counts them, so a test can tell
 * whether the form accepted the input without ever creating a record.
 */
public class CreateGuard {
  public static final Pattern EMPLOYEE_API = Pattern.compile(".*/api/people/api/v1/employees/?(\\?.*)?$");

  private final AtomicInteger calls = new AtomicInteger();

  public void install(Page page) {
    page.route(EMPLOYEE_API, route -> {
      if ("POST".equals(route.request().method())) {
        calls.incrementAndGet();
        route.abort("blockedbyclient");
      } else {
        route.resume();
      }
    });
  }

  public int calls() {
    return calls.get();
  }
}
