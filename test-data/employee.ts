export interface EmployeeData {
  firstName: string;
  lastName: string;
  officialEmail: string;
  phone: string;
  dateOfBirth: string; // yyyy-mm-dd
  dateOfJoining: string; // yyyy-mm-dd
  gender: string;
  /** Option label; the first real option is used when omitted. */
  department?: string;
  /** Option label; the first real option is used when omitted. */
  designation?: string;
}

/** A valid baseline. Each negative test changes one value. */
export const VALID_EMPLOYEE: EmployeeData = {
  firstName: 'Test',
  lastName: 'User',
  officialEmail: 'qa.test@example.com',
  phone: '9876543210',
  dateOfBirth: '1995-05-15',
  dateOfJoining: new Date().toISOString().slice(0, 10),
  gender: 'Male',
};

/** Unique data for the (opt-in) real submission test. */
export function uniqueEmployee(): EmployeeData {
  const stamp = Date.now();
  return {
    ...VALID_EMPLOYEE,
    firstName: 'Playwright',
    lastName: `QA${String(stamp).slice(-6)}`,
    officialEmail: `pw.qa.${stamp}@example.com`,
  };
}

export const REQUIRED_FIELD_ERRORS = [
  'First name is required',
  'Last name is required',
  'Email is required',
  'Phone is required',
  'Date of birth is required',
  'Gender is required',
  'Joining date is required',
  'Department is required',
  'Designation is required',
];
