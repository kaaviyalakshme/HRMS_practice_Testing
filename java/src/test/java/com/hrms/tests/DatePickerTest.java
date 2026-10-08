package com.hrms.tests;

import com.hrms.base.BaseTest;
import com.hrms.data.EmployeeData;
import org.junit.jupiter.api.*;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.ValueSource;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Date pickers")
class DatePickerTest extends BaseTest {
  @Test
  @DisplayName("date of birth can be typed with the keyboard (dd-mm-yyyy locale)")
  void keyboardEntry() {
    form.dateOfBirth.click();
    page.keyboard().type("15051995");
    assertThat(form.dateOfBirth).hasValue("1995-05-15");
  }

  @Test
  @DisplayName("future date of birth is blocked")
  void futureDob() {
    form.fillRequired(EmployeeData.valid().withDateOfBirth("2030-01-01"));
    form.expectRejected();
    assertFalse(form.nativeMessage(form.dateOfBirth).isEmpty());
  }

  @ParameterizedTest(name = "date of birth {0} is rejected ({1})")
  @CsvSource({"2014-01-01, under 18", "1900-01-01, age 126"})
  void unrealisticDob(String dob, String why) {
    knownBug("date of birth only has max (age >= 10), no min: " + why, () -> {
      form.fillRequired(EmployeeData.valid().withDateOfBirth(dob));
      form.expectRejected();
    });
  }

  @ParameterizedTest(name = "joining date {0} is rejected ({1})")
  @CsvSource({"1990-01-01, before date of birth", "2099-01-01, far future"})
  void invalidJoiningDate(String doj, String why) {
    knownBug("joining date has no range or cross-field check: " + why, () -> {
      form.fillRequired(EmployeeData.valid().withDateOfJoining(doj));
      form.expectRejected();
    });
  }
}
