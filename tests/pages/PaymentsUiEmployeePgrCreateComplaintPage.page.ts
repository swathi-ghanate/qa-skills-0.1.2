/** AUTO-GENERATED from contract — re-run /playwright-gen complaints to refresh (contract gaps captured live 2026-11-16 are marked) */
import { type Page, type Locator, expect } from '@playwright/test'
import { urlFor } from '../helpers/routes'

/** The seven boundary levels of the form, top to bottom (observed live 2026-11-16). */
export const BOUNDARY_LEVELS = ['Country', 'Province', 'District', 'Chiefdom', 'PHU', 'Distribution Point', 'Community'] as const
export type BoundaryLevel = (typeof BOUNDARY_LEVELS)[number]

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/** Create complaint — contract page `payments_ui_employee_pgr_create_complaint` (is_protected). */
export class PaymentsUiEmployeePgrCreateComplaintPage {
  static readonly PATH = '/payments-ui/employee/pgr/create-complaint'
  /** Where a logged-out visitor is sent (observed live 2026-11-16). Only asserted, never used to log in. */
  static readonly LOGGED_OUT_REDIRECT_PATH = '/payments-ui/employee/user/login'
  /** Breadcrumb Home target (contract home_b6873d href). */
  static readonly PAYMENTS_HOME_PATH = '/payments-ui/employee'
  /** Create request sent by Submit (observed live 2026-11-16, blocked during capture). */
  static readonly CREATE_API_RE = /\/pgr-services\/v2\/request\/_create(\?|$)/

  constructor(readonly page: Page) {}

  // --- locators: contract page.elements ---
  homeB6873d(): Locator { return this.page.locator('a[href="/payments-ui/employee"]') }
  chooseFile4a8be7(): Locator { return this.page.getByRole('button', { name: 'Choose file', exact: true }) }
  submitB6846a(): Locator { return this.page.getByRole('button', { name: 'Submit', exact: true }) }
  selectDateF857ea(): Locator { return this.page.getByRole('textbox', { name: 'Select date', exact: true }) }
  complaintdate8ac55d(): Locator { return this.page.locator('[name="ComplaintDate"]') }
  complainantnameF24ee8(): Locator { return this.page.locator('[name="ComplainantName"]') }
  complainantcontactnumber33edae(): Locator { return this.page.locator('[name="ComplainantContactNumber"]') }
  supervisorname5a5518(): Locator { return this.page.locator('[name="SupervisorName"]') }
  supervisorcontactnumber0789ef(): Locator { return this.page.locator('[name="SupervisorContactNumber"]') }
  fileEabcd3(): Locator { return this.page.locator('[name="file"]') }
  addressoneF4f351(): Locator { return this.page.locator('[name="AddressOne"]') }
  addresstwo65ffc0(): Locator { return this.page.locator('[name="AddressTwo"]') }
  landmark931a6c(): Locator { return this.page.locator('[name="landmark"]') }
  postalcode32f79f(): Locator { return this.page.locator('[name="postalCode"]') }

  // --- locators: contract form https_sierraleone_hcm_digit_org_payments_7b2726 fields ---
  /** Complaint Type dropdown input (shows the chosen type). Open the list with complaintTypeArrow(), not by clicking this. */
  field09988fc(): Locator { return this.page.locator('#pgr-create-complaint-cs_complaint_details_complaint_type') }
  /** BROKEN (selector audit): "Country *" input; the contract's generated name "field_3" matches 0 elements. Use boundaryDropdown('Country'). */
  field3F0ae98(): Locator { return this.page.getByRole('textbox', { name: 'field_3', exact: true }) }
  /** OVERRIDE: both complaint-for radios share this id (match_count 2), so take the first = "Myself" (observed order). Click the input, not the label: label[for] targets the first radio. */
  field4Cba6ab(): Locator { return this.page.locator('#pgr-create-complaint-es_createcomplaint_for').nth(0) }
  /** OVERRIDE: second complaint-for radio (shared id, match_count 2) = "Another User". */
  field5Cba6ab(): Locator { return this.page.locator('#pgr-create-complaint-es_createcomplaint_for').nth(1) }
  complainantnameFc3612(): Locator { return this.page.locator('#pgr-create-complaint-complaints_complainant_name') }
  complainantcontactnumber869a24(): Locator { return this.page.locator('#pgr-create-complaint-complaints_complainant_contact_number') }
  supervisornameAbb008(): Locator { return this.page.locator('#pgr-create-complaint-complaints_supervisor_name') }
  supervisorcontactnumberFef562(): Locator { return this.page.locator('#pgr-create-complaint-complaints_supervisor_contact_number') }
  description9237c5(): Locator { return this.page.locator('#pgr-create-complaint-cs_complaint_details_additional_details_description') }
  file34e35c(): Locator { return this.page.locator('#upload-complaintFile') }
  addressone768768(): Locator { return this.page.locator('#pgr-create-complaint-cs_complaint_details_address_1_details') }
  addresstwoAa6d1e(): Locator { return this.page.locator('#pgr-create-complaint-cs_complaint_details_address_2_details') }
  landmarkB88ef6(): Locator { return this.page.locator('#pgr-create-complaint-cs_complaint_landmark__details') }
  postalcode0b8576(): Locator { return this.page.locator('#pgr-create-complaint-cs_complaint_postalcode__details') }

  // --- CONTRACT GAPS (captured live 2026-11-16) ---
  /** The <form> element; it is replaced once shortly after load (see waitForFormRebuild). */
  form(): Locator { return this.page.locator('form').first() }
  /** Section header, e.g. "Complaint Details" (header.digit-card-section-header). */
  sectionHeading(name: string): Locator { return this.page.locator('header.digit-card-section-header').filter({ hasText: new RegExp(`^\\s*${escapeRe(name)}\\s*$`) }) }
  /** Label row of a form-composer field; its text ends in "*" when the field is mandatory. */
  fieldLabel(label: string): Locator { return this.page.locator('.label-container').filter({ has: this.page.locator('label', { hasText: new RegExp(`^\\s*${escapeRe(label)}\\s*$`) }) }) }
  /** Whole form-composer row (label + field + its error text) that contains `field`. */
  fieldRow(field: Locator): Locator { return this.page.locator('.digit-label-field-pair').filter({ has: field }) }
  /** The arrow icon that opens the Complaint Type list; clicking the input or its wrapper does not open it. */
  complaintTypeArrow(): Locator { return this.page.locator('.digit-dropdown-select', { has: this.field09988fc() }).locator('svg') }
  /** The open options card of a dropdown. */
  optionsCard(): Locator { return this.page.locator('.digit-dropdown-options-card') }
  /** One wrapper per boundary level, found by its label ("Country *", "Province", ...). */
  boundaryLevel(level: BoundaryLevel): Locator {
    return this.page.locator('.boundary-dropdown-wrapper').filter({
      has: this.page.locator('.comment-label-without-card', { hasText: new RegExp(`^\\s*${escapeRe(level)}\\s*\\*?\\s*$`) }),
    })
  }
  boundaryLabel(level: BoundaryLevel): Locator { return this.boundaryLevel(level).locator('.comment-label-without-card') }
  boundaryDropdown(level: BoundaryLevel): Locator { return this.boundaryLevel(level).locator('.digit-dropdown-select') }
  boundaryInput(level: BoundaryLevel): Locator { return this.boundaryLevel(level).locator('input') }
  /** A visible option of whichever dropdown is open (boundary dropdowns use .digit-dropdown-item). */
  visibleDropdownItem(text: string): Locator { return this.page.locator('.digit-dropdown-item:visible').getByText(text, { exact: true }) }
  /** Toast shown when Submit is clicked with mandatory fields missing. */
  mandatoryFieldsAlert(): Locator { return this.page.getByText('Please enter all mandatory fields', { exact: true }) }

  // --- page actions ---
  async goto(baseURL: string): Promise<void> {
    await this.page.goto(urlFor(baseURL, PaymentsUiEmployeePgrCreateComplaintPage.PATH))
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/payments-ui\/employee\/pgr\/create-complaint/)
  }

  /**
   * The form rebuilds itself once, 0.2–4 s after Submit appears, and clears anything already entered
   * (observed live 2026-11-16; no reload and no single API response triggers it). Mark the current <form>
   * and wait until it has been replaced; if it is not replaced within 15 s, carry on (callers check values before submit).
   */
  async waitForFormRebuild(timeout = 15_000): Promise<void> {
    await this.submitB6846a().waitFor({ state: 'visible', timeout: 90_000 })
    await this.form().evaluate(f => { (f as HTMLElement).dataset.qaMarker = 'before-rebuild' })
    await this.page
      .waitForFunction(() => !document.querySelector('form')?.dataset.qaMarker, null, { timeout })
      .catch(() => undefined)
  }

  async chooseComplaintType(option: string): Promise<void> {
    await this.complaintTypeArrow().click()
    await this.optionsCard().getByText(option, { exact: true }).click()
  }

  /** Choose `value` in one boundary level; the level must already be visible (each appears after its parent). */
  async chooseBoundary(level: BoundaryLevel, value: string): Promise<void> {
    await this.boundaryDropdown(level).click()
    await this.visibleDropdownItem(value).click()
  }
}
