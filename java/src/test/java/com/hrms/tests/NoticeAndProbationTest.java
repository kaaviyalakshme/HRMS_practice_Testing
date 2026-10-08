package com.hrms.tests;

import com.hrms.base.BaseTest;
import com.hrms.data.EmployeeData;
import org.junit.jupiter.api.*;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.ValueSource;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Notice period and probation")
class NoticeAndProbationTest extends BaseTest {
  @Test
  @DisplayName("arrow up increments notice period")
  void arrowUp() {
    form.noticePeriod.fill("30");
    form.noticePeriod.press("ArrowUp");
    assertThat(form.noticePeriod).hasValue("31");
  }

  @Test
  @DisplayName("arrow down stops at 0")
  void arrowDownStopsAtZero() {
    knownBug("no min=0, goes negative", () -> {
      form.noticePeriod.fill("0");
      form.noticePeriod.press("ArrowDown");
      assertThat(form.noticePeriod).hasValue("0");
    });
  }

  @ParameterizedTest(name = "notice period {0} is rejected")
  @ValueSource(strings = {"-5", "5000", "2.5"})
  void invalidNotice(String value) {
    knownBug("notice period accepts " + value, () -> {
      form.fillRequired();
      form.noticePeriod.fill(value);
      form.expectRejected();
    });
  }

  @ParameterizedTest(name = "probation {0} months is rejected")
  @ValueSource(strings = {"-1", "100"})
  void invalidProbation(String value) {
    knownBug("probation accepts " + value, () -> {
      form.fillRequired();
      form.probation.fill(value);
      form.expectRejected();
    });
  }
}
