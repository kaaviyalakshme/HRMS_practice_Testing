package com.hrms.tests;

import com.hrms.base.BaseTest;
import com.hrms.data.EmployeeData;
import org.junit.jupiter.api.*;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.ValueSource;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Names")
class NamesTest extends BaseTest {
  @ParameterizedTest(name = "first name \"{0}\" is rejected")
  @ValueSource(strings = {"12345", "@#$%"})
  void invalidFirstName(String value) {
    knownBug("first name accepts digits and special characters", () -> {
      form.fillRequired(EmployeeData.valid().withFirstName(value));
      form.expectRejected();
    });
  }

  @Test
  @DisplayName("first name has a length limit")
  void lengthLimit() {
    knownBug("no maxlength, 300 characters accepted", () -> {
      form.firstName.fill("A".repeat(300));
      assertTrue(form.firstName.inputValue().length() <= 100);
    });
  }
}
