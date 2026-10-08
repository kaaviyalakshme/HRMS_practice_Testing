package com.hrms.tests;

import com.hrms.base.BaseTest;
import com.hrms.data.EmployeeData;
import org.junit.jupiter.api.*;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.ValueSource;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Required fields and Create Employee button")
class RequiredAndSubmitTest extends BaseTest {
  @Test
  @DisplayName("empty submit shows every required-field error and does not save")
  void emptySubmit() {
    form.expectRejected();
    for (String msg : EmployeeData.REQUIRED_FIELD_ERRORS) assertThat(page.getByText(msg)).isVisible();
  }

  @Test
  @DisplayName("valid data is accepted")
  void validAccepted() {
    form.fillRequired();
    form.expectAccepted();
  }

  @Test
  @DisplayName("whitespace-only first name is rejected")
  void whitespaceName() {
    form.fillRequired(EmployeeData.valid().withFirstName("   "));
    form.expectRejected("First name is required");
  }

  @Test
  @DisplayName("double-click sends only one request")
  void doubleClick() {
    form.fillRequired();
    form.createButton.dblclick();
    page.waitForTimeout(1500);
    assertEquals(1, createGuard.calls());
  }

  @Test
  @DisplayName("Enter key submits the form")
  void enterSubmits() {
    form.fillRequired();
    form.lastName.press("Enter");
    page.waitForTimeout(1000);
    assertEquals(1, createGuard.calls());
  }

  @Test
  @DisplayName("Cancel returns to the employee list")
  void cancel() {
    form.cancelButton.click();
    assertThat(page).hasURL(java.util.regex.Pattern.compile(".*/employees/?$"));
  }
}
