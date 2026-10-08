package com.hrms.tests;

import com.hrms.base.BaseTest;
import com.hrms.data.EmployeeData;
import org.junit.jupiter.api.*;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.ValueSource;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Address")
class AddressTest extends BaseTest {
  @Test
  @DisplayName("\"Same as Communication Address\" copies, locks and syncs")
  void sameAsCommunication() {
    form.commStreet.fill("12 Main St");
    form.commCity.fill("Chennai");
    form.commState.fill("Tamil Nadu");
    form.commPincode.fill("600001");
    form.sameAsComm.check();
    assertThat(form.permStreet).hasValue("12 Main St");
    assertThat(form.permCity).hasValue("Chennai");
    assertThat(form.permState).hasValue("Tamil Nadu");
    assertThat(form.permPincode).hasValue("600001");
    assertThat(form.permStreet).not().isEditable();
    form.commCity.fill("Madurai");
    assertThat(form.permCity).hasValue("Madurai");
    form.sameAsComm.uncheck();
    assertThat(form.permCity).isEditable();
  }

  @ParameterizedTest(name = "pincode {0} is rejected")
  @ValueSource(strings = {"abcdef", "12345"})
  void invalidPincode(String value) {
    knownBug("pincode accepts " + value, () -> {
      form.fillRequired();
      form.commPincode.fill(value);
      form.expectRejected();
    });
  }
}
