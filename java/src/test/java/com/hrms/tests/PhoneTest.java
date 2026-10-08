package com.hrms.tests;

import com.hrms.base.BaseTest;
import com.hrms.data.EmployeeData;
import org.junit.jupiter.api.*;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.ValueSource;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Phone and country code")
class PhoneTest extends BaseTest {
  @ParameterizedTest(name = "phone {0} is rejected (wrong length)")
  @ValueSource(strings = {"12345", "987654321012"})
  void wrongLength(String phone) {
    form.fillRequired(EmployeeData.valid().withPhone(phone));
    form.expectRejected("Phone number must be 10 digits");
  }

  @Test
  @DisplayName("letters are stripped")
  void lettersStripped() {
    form.phone.fill("abcdefghij");
    assertThat(form.phone).hasValue("");
  }

  @Test
  @DisplayName("spaces are stripped")
  void spacesStripped() {
    form.phone.fill("98765 43210");
    assertThat(form.phone).hasValue("9876543210");
  }

  @ParameterizedTest(name = "invalid Indian mobile {0} is rejected")
  @ValueSource(strings = {"0000000000", "1234567890"})
  void invalidIndianMobile(String phone) {
    knownBug("any 10 digits accepted; Indian mobiles start with 6-9", () -> {
      form.fillRequired(EmployeeData.valid().withPhone(phone));
      form.expectRejected();
    });
  }

  @Test
  @DisplayName("country code selector is present")
  void countryCode() {
    knownBug("no country code control next to Phone", () ->
        assertThat(page.locator("main").getByRole(com.microsoft.playwright.options.AriaRole.COMBOBOX,
            new com.microsoft.playwright.Locator.GetByRoleOptions()
                .setName(java.util.regex.Pattern.compile("country|code|dial", java.util.regex.Pattern.CASE_INSENSITIVE))))
            .hasCount(1));
  }

  @Test
  @DisplayName("maxlength matches the 10-digit placeholder")
  void maxLength() {
    knownBug("maxlength is 15 while placeholder says 10 digits", () ->
        assertThat(form.phone).hasAttribute("maxlength", "10"));
  }
}
