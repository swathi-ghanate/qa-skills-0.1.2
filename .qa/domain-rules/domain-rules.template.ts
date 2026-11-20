/**
 * Domain data-generation rules for this project.
 *
 * Copy this file to `project.rules.ts` (any `*.rules.ts` name works) in the same folder and fill in real values for
 * your application. Read by /fixture-fill when populating fixture stubs.
 */
export const rules = {
  // BCP-47 locale used to generate realistic names/addresses/phone numbers for this app.
  locale: 'en-US',

  // Format used for date/timestamp fields (e.g. past dates for "expired" edge cases).
  dateFormat: 'YYYY-MM-DD',

  // File size in bytes that exceeds this app's upload limit, for oversized-file edge cases.
  oversizedBytes: 10 * 1024 * 1024,

  // File extensions this app accepts on upload fields.
  validFileTypes: ['.pdf', '.png', '.jpg'],

  // Fixed OTP value accepted in the QA environment. Leave undefined if this app's
  // auth does not use OTP — /fixture-fill checks the contract/rules file before using it.
  otpValue: undefined as string | undefined,

  // Prefix applied to every seeded record's name/key (followed by a timestamp), so
  // QA-generated data stays identifiable and safe to clean up (see script-gen seed scripts).
  seedPrefix: 'qa-test',
} as const
