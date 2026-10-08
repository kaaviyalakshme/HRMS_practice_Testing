package com.hrms.tests;

import com.hrms.base.BaseTest;
import com.hrms.data.EmployeeData;
import org.junit.jupiter.api.*;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.ValueSource;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Dropdowns")
class DropdownTest extends BaseTest {
  @Test
  @DisplayName("fixed option lists")
  void fixedOptions() {
    assertThat(form.gender.locator("option"))
        .hasText(new String[] {"Select gender", "Male", "Female", "Other", "Prefer not to say"});
    assertThat(form.employmentType.locator("option"))
        .hasText(new String[] {"Full Time", "Part Time", "Contract", "Internship", "Consultant"});
    assertThat(form.workMode.locator("option")).hasText(new String[] {"Office", "Remote", "Hybrid"});
  }

  @Test
  @DisplayName("selecting a department works")
  void selectDepartment() {
    form.department.selectOption(new com.microsoft.playwright.options.SelectOption().setLabel("Finance"));
    assertEquals("Finance", form.selectedText(form.department));
  }

  @Test
  @DisplayName("employee code is capped at 20 characters")
  void employeeCodeCap() {
    form.employeeCode.fill("X".repeat(30));
    assertEquals(20, form.employeeCode.inputValue().length());
  }

  @ParameterizedTest(name = "{0} options have no duplicates")
  @ValueSource(strings = {"department", "designation", "shift"})
  void noDuplicates(String key) {
    var select = switch (key) {
      case "department" -> form.department;
      case "designation" -> form.designation;
      default -> form.shift;
    };
    knownBug("duplicate " + key + " entries in master data", () -> {
      var texts = select.locator("option").allTextContents().stream().skip(1)
          .map(t -> t.trim().toLowerCase()).toList();
      assertEquals(texts.size(), new java.util.HashSet<>(texts).size());
    });
  }
}
