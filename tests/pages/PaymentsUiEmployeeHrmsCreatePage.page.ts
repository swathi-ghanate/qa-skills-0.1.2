/** AUTO-GENERATED — re-run /playwright-gen user-management to refresh (CONTRACT GAP: captured live 2026-11-16, re-verified 2026-11-18) */
import { type Page, type Locator, expect } from '@playwright/test'
import { urlFor } from '../helpers/routes'
import { HrmsHierarchyStep } from './HrmsHierarchyStep.page'

const exact = (s: string) => new RegExp(`^\\s*${s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`)

/**
 * Create user — contract page `payments_ui_employee_hrms_create` (an unexplored stub with 0 elements, so every
 * locator below is a CONTRACT GAP captured live). Field ids follow `#hrms-create-hr_*_label`.
 * Submit stays disabled until the form is valid. The form does not rebuild itself after load (checked 2026-11-16).
 */
export class PaymentsUiEmployeeHrmsCreatePage {
  static readonly PATH = '/payments-ui/employee/hrms/create'
  /** Create request, sent after the "Ready to Submit ?" dialog is confirmed (observed 2026-11-18 with the request aborted). */
  static readonly CREATE_API_RE = /\/egov-hrms\/employees\/_create(\?|$)/
  /** Result screen the app opens after the create request (observed 2026-11-18); its banner text is captured on the first real run. */
  static readonly RESPONSE_PATH = '/payments-ui/employee/hrms/response'

  readonly hierarchy: HrmsHierarchyStep

  constructor(readonly page: Page) {
    this.hierarchy = new HrmsHierarchyStep(page)
  }

  // --- structure ---
  /** Page heading "Create User" (a breadcrumb span also says "Create User", so scope to the header). */
  heading(): Locator { return this.page.locator('header.digit-inbox-search-composer-header').filter({ hasText: exact('Create User') }) }
  /** Section heading: Login Details, Personal Details, Employee Details. */
  sectionHeading(name: string): Locator { return this.page.locator('header.digit-card-section-header').filter({ hasText: exact(name) }) }
  /** Label row of a field; its text ends in "*" when the field is mandatory. */
  fieldLabel(label: string): Locator { return this.page.locator('.label-container').filter({ has: this.page.locator('label', { hasText: exact(label) }) }) }
  /** The error message under `field` (.digit-label-field-pair nests, so take the innermost pair that holds it). */
  fieldError(field: Locator): Locator { return this.page.locator('.digit-label-field-pair', { has: field }).last().locator('.digit-error-message') }

  // --- Login Details ---
  username(): Locator { return this.page.locator('#hrms-create-hr_emp_id_label') }
  password(): Locator { return this.page.locator('#hrms-create-hr_emp_password_label') }
  confirmPassword(): Locator { return this.page.locator('#hrms-create-hr_emp_confirm_password_label') }

  // --- Personal Details ---
  name(): Locator { return this.page.locator('#hrms-create-hr_emp_name_label') }
  /** type=text; exactly 9 digits, any first digit (MDMS minLength/maxLength 9, user + live check 2026-11-20). Error: "Invalid Mobile number". */
  mobileNumber(): Locator { return this.page.locator('#hrms-create-hr_mob_no_label') }
  /** OVERRIDE: both gender radios share this id; nth(0) = Female, nth(1) = Male (observed order). */
  genderRadio(gender: 'Female' | 'Male'): Locator { return this.page.locator('#hrms-create-hr_gender_label').nth(gender === 'Female' ? 0 : 1) }
  genderLabels(): Locator { return this.page.locator('.radio-option-container label[for="hrms-create-hr_gender_label"]') }
  dateOfBirth(): Locator { return this.page.locator('#hrms-create-hr_birth_date_label') }
  email(): Locator { return this.page.locator('#hrms-create-hr_email_label') }
  correspondenceAddress(): Locator { return this.page.locator('#hrms-create-hr_correspondence_address_label') }

  // --- Employee Details ---
  employmentType(): Locator { return this.page.locator('#hrms-create-hr_employment_type_label') }
  dateOfAppointment(): Locator { return this.page.locator('#hrms-create-hr_appointment_date_label') }
  department(): Locator { return this.page.locator('#hrms-create-hr_employment_department_label') }
  designation(): Locator { return this.page.locator('#hrms-create-hr_employment_designation_label') }
  /** Options of the dropdown that holds `input` (the options card sits inside the same .digit-dropdown-employee-select-wrap). */
  dropdownOptions(input: Locator): Locator { return this.page.locator('.digit-dropdown-employee-select-wrap', { has: input }).locator('.digit-dropdown-item') }
  /** Roles multi-select (the only one on the form). */
  rolesInput(): Locator { return this.page.locator('.digit-multiselectdropdown-master input.digit-cursorPointer') }
  /** Visible role options, including the "Select all" row. */
  roleMenuItems(): Locator { return this.page.locator('.digit-multiselectdropodwn-menuitem:visible') }
  roleSelectAll(): Locator { return this.page.locator('.digit-multiselectdropodwn-menuitem.selectAll:visible') }
  roleOption(role: string): Locator { return this.roleMenuItems().filter({ hasText: exact(role) }).first() }

  // --- Jurisdiction ---
  /** One grey card per area; its heading reads "Area 1*", "Area 2*", ... */
  areaHeadings(): Locator { return this.page.locator('.employeeCard h2.digit-card-label') }
  area(n: number): Locator { return this.page.locator('.employeeCard').filter({ has: this.page.locator('h2.digit-card-label', { hasText: new RegExp(`^\\s*Area ${n}\\*?\\s*$`) }) }) }
  /** Country dropdowns, one per area card. */
  countryDropdowns(): Locator { return this.page.locator('.employeeCard .employee-select-wrap') }
  /** Red trash icon at the top right of an added area (Area 1 has none). Observed live 2026-11-18. */
  areaDeleteIcon(n: number): Locator { return this.area(n).locator('svg:has(path[fill="red"])') }
  addJurisdiction(): Locator { return this.page.getByRole('button', { name: 'Add Jurisdiction', exact: true }) }
  /** Open the Country list of an area; options are .profile-dropdown--item (text has a leading space). */
  areaCountryToggle(n: number): Locator { return this.area(n).locator('.employee-select-wrap input').first() }
  areaCountryOption(n: number, country: string): Locator { return this.area(n).locator('.profile-dropdown--item').filter({ hasText: exact(country) }) }

  submit(): Locator { return this.page.getByRole('button', { name: 'Submit', exact: true }) }
  /** Shown after the confirm dialog when the username already exists; no create request is sent (observed live 2026-11-18). */
  usernameTakenToast(): Locator { return this.page.getByText('Username exists', { exact: true }) }
  /** Shown on Submit when another employee already has the mobile number; no create request is sent (observed live 2026-11-18). */
  mobileTakenToast(): Locator { return this.page.getByText('Mobile number already exist!', { exact: true }) }
  /**
   * "Ready to Submit ?" confirmation popup that opens after Submit once the mobile check passes (observed 2026-11-18).
   * The innermost element that holds both its title and its own Submit button (it has Close and Submit).
   */
  confirmDialog(): Locator {
    return this.page.locator('div')
      .filter({ has: this.page.getByText('Ready to Submit ?', { exact: true }) })
      .filter({ has: this.page.getByRole('button', { name: 'Submit', exact: true }) })
      .last()
  }
  confirmSubmit(): Locator { return this.confirmDialog().getByRole('button', { name: 'Submit', exact: true }) }

  // --- page actions ---
  async goto(baseURL: string): Promise<void> {
    await this.page.goto(urlFor(baseURL, PaymentsUiEmployeeHrmsCreatePage.PATH))
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/payments-ui\/employee\/hrms\/create/)
  }

  /** Close any open list by clicking a neutral section heading (verified: closes dropdowns and the Roles menu). */
  async closeLists(): Promise<void> {
    await this.sectionHeading('Login Details').click()
  }

  /** Open the dropdown that holds `input` and return its option texts. */
  async readDropdownOptions(input: Locator): Promise<string[]> {
    await this.page.locator('.digit-dropdown-select', { has: input }).click()
    await this.dropdownOptions(input).first().waitFor({ state: 'visible' })
    const options = (await this.dropdownOptions(input).allInnerTexts()).map(o => o.trim())
    await this.closeLists()
    return options
  }

  async chooseDropdown(input: Locator, option: string): Promise<void> {
    await this.page.locator('.digit-dropdown-select', { has: input }).click()
    await this.dropdownOptions(input).filter({ hasText: exact(option) }).first().click()
  }

  /** Open the Roles menu and return the number of role options, not counting "Select all". */
  async countRoleOptions(): Promise<number> {
    await this.rolesInput().click()
    await this.roleMenuItems().first().waitFor({ state: 'visible' })
    const total = await this.roleMenuItems().count()
    const selectAll = await this.roleSelectAll().count()
    await this.closeLists()
    return total - selectAll
  }

  async chooseRole(role: string): Promise<void> {
    await this.rolesInput().click()
    await this.roleOption(role).click()
    await this.closeLists()
  }

  async chooseCountry(areaNumber: number, country: string): Promise<void> {
    await this.areaCountryToggle(areaNumber).click()
    await this.areaCountryOption(areaNumber, country).click()
  }
}
