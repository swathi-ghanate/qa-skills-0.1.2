/** AUTO-GENERATED from contract — re-run /playwright-gen complaints-inbox to refresh */
import { type Page, type Locator, expect } from '@playwright/test'
import { urlFor } from '../helpers/routes'

const exact = (s: string) => new RegExp(`^\\s*${s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`)

/**
 * Complaints inbox ("Search Complaints") — contract page `payments_ui_employee_pgr_inbox_v2` (is_protected).
 * Contract locators keep their element_id names. CONTRACT GAP locators (search button, filters, results table) were
 * verified live, read-only, on 2026-11-20. Never use the contract's row-link elements (pgr_2026_…): they name the
 * complaints listed on 2026-11-20; use complaintLink(number).
 * PRIVACY: the table lists real people's complaints. Tests assert headers, counts and request bodies only, and open
 * only QA-TEST complaints.
 */
export class PaymentsUiEmployeePgrInboxV2Page {
  static readonly PATH = '/payments-ui/employee/pgr/inbox-v2'
  /** Where a logged-out visitor is sent (seen in the 2026-11-20 scrape). Only asserted, never used to log in. */
  static readonly LOGGED_OUT_REDIRECT_PATH = '/payments-ui/employee/user/login'
  /** Target of the breadcrumb Home link (href of home_b6873d). */
  static readonly PAYMENTS_HOME_PATH = '/payments-ui/employee'
  static readonly DETAILS_PATH_PREFIX = '/payments-ui/employee/pgr/complaint-details/'
  /** Search request: sent twice on load, then on Search, Apply, Clear and paging (observed live 2026-11-20). */
  static readonly SEARCH_API_RE = /\/inbox\/v2\/_search(\?|$)/

  constructor(readonly page: Page) {}

  // --- locators from the contract ---
  homeB6873d(): Locator { return this.page.locator('a[href="/payments-ui/employee"]') }
  newComplaintBc0fc8(): Locator { return this.page.locator('a[href="/payments-ui/employee/pgr/create-complaint"]') }
  /** Loader. Marked stale only because it is gone once the page loads; it is still the right thing to wait on. */
  animation1dcbe0(): Locator { return this.page.getByRole('button', { name: 'animation', exact: true }) }
  apply18d6c0(): Locator { return this.page.getByRole('button', { name: 'Apply', exact: true }) }
  clearAllD8e461(): Locator { return this.page.getByRole('button', { name: 'Clear All', exact: true }) }
  clearSearchC692f5(): Locator { return this.page.getByRole('button', { name: 'Clear Search', exact: true }) }
  complaintnumber7836f5(): Locator { return this.page.locator('[name="complaintNumber"]') }
  mobilenumberC51cd9(): Locator { return this.page.locator('[name="mobileNumber"]') }
  /**
   * Date Range (field_2_2ab45f). OVERRIDE: the contract selector getByRole('textbox', { name: 'field_2' }) matches
   * 0 elements (selector audit 2026-11-20); this is the read-only input under the "Date Range" label.
   */
  field22ab45f(): Locator { return this.fieldPair('Date Range').locator('input.digit-employee-select-wrap--elipses[readonly]') }
  firstPageB08b28(): Locator { return this.page.getByRole('button', { name: 'First Page', exact: true }) }
  previousPage131236(): Locator { return this.page.getByRole('button', { name: 'Previous Page', exact: true }) }
  nextPage4297e0(): Locator { return this.page.getByRole('button', { name: 'Next Page', exact: true }) }
  lastPage9cd9d1(): Locator { return this.page.getByRole('button', { name: 'Last Page', exact: true }) }
  /** Rows per page (rows_per_page_70af54). OVERRIDE: the contract records a button (0 matches); it is a <select>. */
  rowsPerPage70af54(): Locator { return this.page.getByRole('combobox', { name: 'Rows per page' }) }

  // --- CONTRACT GAP: search card ---
  search(): Locator { return this.page.getByRole('button', { name: 'Search', exact: true }) }
  /** The calendar icon next to the Date Range field. */
  dateRangeIcon(): Locator { return this.fieldPair('Date Range').locator('svg.cursorPointer') }
  /**
   * The date picker (react-date-range). Verified live 2026-11-20: it opens from the calendar icon, after a click on the
   * field; a click on the field alone opens nothing. It has month/year <select>s and day buttons (button.rdrDay).
   */
  calendar(): Locator { return this.page.locator('.rdrCalendarWrapper') }
  calendarMonthSelect(): Locator { return this.calendar().locator('.rdrMonthPicker select') }
  calendarYearSelect(): Locator { return this.calendar().locator('.rdrYearPicker select') }
  /** A day of the month shown first (not the greyed days of the neighbouring months). */
  calendarDay(day: number): Locator {
    return this.calendar().locator('.rdrMonth').first().locator('button.rdrDay:not(.rdrDayPassive)')
      .filter({ has: this.page.locator('.rdrDayNumber', { hasText: exact(String(day)) }) })
  }

  // --- CONTRACT GAP: filter card ---
  /** A labelled field block of the search or filter card (label text exact, e.g. "Complaint Type"). */
  fieldPair(label: string): Locator {
    return this.page.locator('.digit-label-field-pair').filter({ has: this.page.locator('label.label-styles', { hasText: exact(label) }) })
  }
  /** "Assigned to me" / "Assigned to others". Click the input: the labels are not linked to it (role + name finds 0). */
  assigneeRadio(label: string): Locator {
    return this.page.locator('.radio-option-container').filter({ has: this.page.locator('label', { hasText: exact(label) }) }).locator('input.digit-radio-btn')
  }
  assigneeRadios(): Locator { return this.page.locator('.radio-option-container input.digit-radio-btn') }
  /**
   * Complaint Type is an ordinary labelled dropdown. Country is a boundary dropdown with a different structure
   * (.boundary-dropdown-container, label in div.comment-label; verified live 2026-11-20).
   */
  filterDropdown(label: 'Complaint Type' | 'Country'): Locator {
    if (label === 'Country') return this.countryLabel().locator('xpath=..').locator('input.digit-dropdown-employee-select-wrap--elipses')
    return this.fieldPair(label).locator('.digit-dropdown-employee-select-wrap--elipses')
  }
  /**
   * The Country label. Until the filter card re-mounts (about 1 s after the first interaction with it, observed live
   * 2026-11-20) it shows the raw key "ADMIN_KAMBIA_COUNTRY"; see settleFilterCard() in helpers/inbox.ts.
   */
  countryLabel(): Locator { return this.page.locator('.filter-card .boundary-dropdown-container .comment-label') }
  dropdownOptions(): Locator { return this.page.locator('.digit-dropdown-item:visible') }
  dropdownOption(text: string): Locator { return this.dropdownOptions().filter({ hasText: exact(text) }).first() }
  /**
   * An option shown under any of several labels. The Complaint Type list shows either "Other: Dept-Other" or the
   * translated "Other" depending on when the label translations load (observed live 2026-11-20).
   */
  dropdownOptionAny(texts: string[]): Locator {
    const alternatives = texts.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')
    return this.dropdownOptions().filter({ hasText: new RegExp(`^\\s*(${alternatives})\\s*$`) }).first()
  }
  /** A Status checkbox, e.g. "Pending Assignment". Its <label for> points to an id the input lacks, so select by text. */
  statusCheckbox(label: string): Locator {
    return this.page.locator('.digit-checkbox-container').filter({ has: this.page.locator('label', { hasText: exact(label) }) }).locator('input[type="checkbox"]')
  }

  // --- CONTRACT GAP: results table (react-data-table) ---
  columnHeaders(): Locator { return this.page.locator('[role="table"] [role="columnheader"]') }
  /** Data rows only (the header row is also a [role=row] but has no [role=cell]). */
  resultRows(): Locator { return this.page.locator('[role="table"] [role="row"]:has([role="cell"])') }
  complaintLinks(): Locator { return this.page.locator('[role="table"] a[href*="/pgr/complaint-details/"]') }
  complaintLink(complaintNumber: string): Locator { return this.complaintLinks().filter({ hasText: exact(complaintNumber) }) }
  /** The "1-10 of N" count next to the paging buttons. */
  pageCount(): Locator { return this.page.locator('.rdt_Pagination').getByText(/^\d+-\d+ of \d+$/) }
  /** Empty-result message. Its exact text was not observed yet (2026-11-20); this matches the usual wordings. */
  noResults(): Locator { return this.page.getByText(/no (results|records)|not found/i).first() }

  // --- page actions ---
  async goto(baseURL: string): Promise<void> {
    await this.page.goto(urlFor(baseURL, PaymentsUiEmployeePgrInboxV2Page.PATH))
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/payments-ui\/employee\/pgr\/inbox-v2/)
  }

  /** Open a filter dropdown and choose one option (any of its known labels). */
  async chooseFilterOption(label: 'Complaint Type' | 'Country', option: string | string[]): Promise<void> {
    await this.filterDropdown(label).click()
    await this.dropdownOptionAny(Array.isArray(option) ? option : [option]).click()
  }

  /** The cell of the first result row under a column header (e.g. "Current Status"). */
  async firstRowCell(column: string): Promise<Locator> {
    const headers = (await this.columnHeaders().allInnerTexts()).map(h => h.trim())
    const index = headers.indexOf(column)
    if (index < 0) throw new Error(`Column "${column}" not found; headers are: ${headers.join(' | ')}`)
    return this.resultRows().first().getByRole('cell').nth(index)
  }
}
