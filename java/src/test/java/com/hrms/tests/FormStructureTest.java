package com.hrms.tests;

import com.hrms.base.BaseTest;
import com.hrms.data.EmployeeData;
import org.junit.jupiter.api.*;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.ValueSource;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Form structure")
class FormStructureTest extends BaseTest {
  @Test
  @DisplayName("shows all sections and core fields")
  void sectionsAndFields() {
    for (String h : new String[] {"Personal Information", "Address Information", "Employment Information"}) {
      assertThat(page.getByRole(com.microsoft.playwright.options.AriaRole.HEADING,
          new com.microsoft.playwright.Page.GetByRoleOptions().setName(h))).isVisible();
    }
    for (var el : new com.microsoft.playwright.Locator[] {form.firstName, form.lastName, form.officialEmail,
        form.phone, form.dateOfBirth, form.gender, form.dateOfJoining, form.department, form.designation,
        form.probation, form.noticePeriod, form.createButton, form.cancelButton}) {
      assertThat(el).isVisible();
    }
  }

  @Test
  @DisplayName("default values")
  void defaults() {
    assertThat(form.nationality).hasValue("IN");
    assertThat(form.employmentType).hasValue("full_time");
    assertThat(form.workMode).hasValue("office");
    assertThat(form.probation).hasValue("6");
    assertThat(form.noticePeriod).hasValue("30");
  }

  @Test
  @DisplayName("field ids are unique")
  void uniqueIds() {
    knownBug("city/state/pincode ids are duplicated across the two address blocks", () -> {
      Object dups = page.evaluate("() => { const c = {}; document.querySelectorAll('main [id]')"
          + ".forEach(e => c[e.id] = (c[e.id] || 0) + 1); return Object.keys(c).filter(k => c[k] > 1); }");
      assertEquals(java.util.List.of(), dups);
    });
  }
}
