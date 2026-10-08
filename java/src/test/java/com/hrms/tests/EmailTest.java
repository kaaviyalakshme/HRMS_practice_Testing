package com.hrms.tests;

import com.hrms.base.BaseTest;
import com.hrms.data.EmployeeData;
import org.junit.jupiter.api.*;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.ValueSource;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Email")
class EmailTest extends BaseTest {
  @Test
  @DisplayName("official email without @ is blocked by the browser")
  void missingAt() {
    form.fillRequired(EmployeeData.valid().withOfficialEmail("abc"));
    form.expectRejected();
    assertTrue(form.nativeMessage(form.officialEmail).contains("@"));
  }

  @Test
  @DisplayName("official email without TLD is rejected")
  void missingTld() {
    form.fillRequired(EmployeeData.valid().withOfficialEmail("abc@company"));
    form.expectRejected("Enter a valid email address");
  }

  @Test
  @DisplayName("invalid personal email is rejected")
  void personalEmail() {
    form.fillRequired();
    form.personalEmail.fill("abc@x");
    form.expectRejected("Enter a valid email address");
  }
}
