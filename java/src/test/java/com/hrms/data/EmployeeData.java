package com.hrms.data;

import java.time.LocalDate;
import java.util.List;

/** Form data. Builder-style "with" methods return a copy with one value changed. */
public record EmployeeData(
    String firstName,
    String lastName,
    String officialEmail,
    String phone,
    String dateOfBirth,   // yyyy-mm-dd
    String dateOfJoining, // yyyy-mm-dd
    String gender,
    String department,    // option label; null = first real option
    String designation    // option label; null = first real option
) {
  /** A valid baseline. Each negative test changes one value. */
  public static EmployeeData valid() {
    return new EmployeeData("Test", "User", "qa.test@example.com", "9876543210",
        "1995-05-15", LocalDate.now().toString(), "Male", null, null);
  }

  /** Unique data for the opt-in real submission test. */
  public static EmployeeData unique() {
    long stamp = System.currentTimeMillis();
    String suffix = String.valueOf(stamp).substring(String.valueOf(stamp).length() - 6);
    return valid().withFirstName("Playwright").withLastName("QA" + suffix)
        .withOfficialEmail("pw.qa." + stamp + "@example.com");
  }

  public EmployeeData withFirstName(String v) { return new EmployeeData(v, lastName, officialEmail, phone, dateOfBirth, dateOfJoining, gender, department, designation); }
  public EmployeeData withLastName(String v) { return new EmployeeData(firstName, v, officialEmail, phone, dateOfBirth, dateOfJoining, gender, department, designation); }
  public EmployeeData withOfficialEmail(String v) { return new EmployeeData(firstName, lastName, v, phone, dateOfBirth, dateOfJoining, gender, department, designation); }
  public EmployeeData withPhone(String v) { return new EmployeeData(firstName, lastName, officialEmail, v, dateOfBirth, dateOfJoining, gender, department, designation); }
  public EmployeeData withDateOfBirth(String v) { return new EmployeeData(firstName, lastName, officialEmail, phone, v, dateOfJoining, gender, department, designation); }
  public EmployeeData withDateOfJoining(String v) { return new EmployeeData(firstName, lastName, officialEmail, phone, dateOfBirth, v, gender, department, designation); }

  public static final List<String> REQUIRED_FIELD_ERRORS = List.of(
      "First name is required",
      "Last name is required",
      "Email is required",
      "Phone is required",
      "Date of birth is required",
      "Gender is required",
      "Joining date is required",
      "Department is required",
      "Designation is required");
}
