package com.hrms.pages;

import com.hrms.base.CreateGuard;
import com.hrms.data.EmployeeData;
import com.microsoft.playwright.Locator;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.options.AriaRole;
import com.microsoft.playwright.options.SelectOption;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

/**
 * Page object for /employees/new.
 *
 * Selectors were taken from the live DOM (2026-10-08). The app's ids contain "*" and
 * "(", so attribute selectors are used. City/State/Pincode ids are duplicated across
 * the two address blocks (a known bug), so those are picked by index.
 */
public class AddEmployeePage {
  private final Page page;
  private final CreateGuard guard;

  // Personal information
  public final Locator firstName, middleName, lastName, officialEmail, personalEmail, phone,
      dateOfBirth, gender, nationality, fatherName;
  // Address information
  public final Locator commStreet, commCity, commState, commPincode, sameAsComm,
      permStreet, permCity, permState, permPincode;
  // Employment information
  public final Locator employeeCode, dateOfJoining, department, designation, location,
      reportingManager, leavePolicy, shift, employmentType, workMode, probation, noticePeriod;
  // Actions
  public final Locator createButton, cancelButton;

  public AddEmployeePage(Page page, CreateGuard guard) {
    this.page = page;
    this.guard = guard;

    firstName = id("first-name-*");
    middleName = id("middle-name");
    lastName = id("last-name-*");
    officialEmail = id("official-email-*");
    personalEmail = id("personal-email");
    phone = id("phone-*");
    dateOfBirth = id("date-of-birth-*");
    gender = id("gender-*");
    nationality = id("nationality");
    fatherName = id("father's-name");

    commStreet = page.locator("main textarea").nth(0);
    commCity = id("city").nth(0);
    commState = id("state").nth(0);
    commPincode = id("pincode").nth(0);
    sameAsComm = page.getByRole(AriaRole.CHECKBOX,
        new Page.GetByRoleOptions().setName("Same as Communication Address"));
    permStreet = page.locator("main textarea").nth(1);
    permCity = id("city").nth(1);
    permState = id("state").nth(1);
    permPincode = id("pincode").nth(1);

    employeeCode = id("employee-code");
    dateOfJoining = id("date-of-joining-*");
    department = id("department-*");
    designation = id("designation-*");
    location = id("location");
    reportingManager = id("reporting-manager");
    leavePolicy = id("leave-policy");
    shift = id("shift-(optional)");
    employmentType = id("employment-type");
    workMode = id("work-mode");
    probation = id("probation-period-(months)");
    noticePeriod = id("notice-period-(days)");

    createButton = page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Create Employee"));
    cancelButton = page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Cancel"));
  }

  private Locator id(String value) {
    return page.locator("[id=\"" + value.replace("\"", "\\\"") + "\"]");
  }

  /** Opens the form, dismisses the first-visit tour and waits for the lookup dropdowns. */
  public void open() {
    page.navigate("/employees/new");
    assertThat(page.getByRole(AriaRole.HEADING, new Page.GetByRoleOptions().setName("Add New Employee")))
        .isVisible();
    Locator skipTour = page.getByRole(AriaRole.BUTTON, new Page.GetByRoleOptions().setName("Skip Tour"));
    try {
      skipTour.waitFor(new Locator.WaitForOptions().setTimeout(1500));
      skipTour.click();
    } catch (RuntimeException noTour) {
      // tour not shown
    }
    // Lookups load async; the demo API can answer 429 when pages are reloaded quickly.
    long deadline = System.currentTimeMillis() + 15_000;
    while (designation.locator("option").count() <= 1) {
      if (System.currentTimeMillis() > deadline) throw new AssertionError("Dropdown lookups did not load");
      page.waitForTimeout(250);
    }
  }

  /** Fills every required field. */
  public void fillRequired(EmployeeData d) {
    firstName.fill(d.firstName());
    lastName.fill(d.lastName());
    officialEmail.fill(d.officialEmail());
    phone.fill(d.phone());
    dateOfBirth.fill(d.dateOfBirth());
    dateOfJoining.fill(d.dateOfJoining());
    gender.selectOption(new SelectOption().setLabel(d.gender()));
    department.selectOption(d.department() == null ? new SelectOption().setIndex(1) : new SelectOption().setLabel(d.department()));
    designation.selectOption(d.designation() == null ? new SelectOption().setIndex(1) : new SelectOption().setLabel(d.designation()));
  }

  public void fillRequired() {
    fillRequired(EmployeeData.valid());
  }

  public void submit() {
    createButton.click();
    page.waitForTimeout(1000);
  }

  /** Submits and asserts the form did NOT try to save (optionally checks the error text). */
  public void expectRejected(String message) {
    submit();
    assertEquals(0, guard.calls(), "form should NOT have tried to save");
    if (message != null) assertThat(page.getByText(message).first()).isVisible();
  }

  public void expectRejected() {
    expectRejected(null);
  }

  /** Submits and asserts the form tried to save exactly once (the call itself is blocked). */
  public void expectAccepted() {
    submit();
    assertEquals(1, guard.calls(), "form should have tried to save once");
  }

  /** The browser's built-in validation message for a field ("" when valid). */
  public String nativeMessage(Locator field) {
    return (String) field.evaluate("e => e.validationMessage");
  }

  public String selectedText(Locator select) {
    return (String) select.evaluate("s => s.options[s.selectedIndex].text");
  }
}
