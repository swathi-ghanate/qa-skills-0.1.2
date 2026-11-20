/** AUTO-GENERATED — re-run /playwright-gen user-management to refresh (CONTRACT GAP: captured live 2026-11-16, re-verified 2026-11-18) */
import { type Page, type Locator, expect } from '@playwright/test'
import { urlFor } from '../helpers/routes'
import { HrmsHierarchyStep } from './HrmsHierarchyStep.page'

const exact = (s: string) => new RegExp(`^\\s*${s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`)

/**
 * Search user — contract page `payments_ui_employee_hrms_inbox` (an unexplored stub with 0 elements, so every
 * locator below is a CONTRACT GAP captured live). Run a guided /rescrape of this page to bring them into the contract.
 * PRIVACY: the results table lists real staff. Tests assert headers, counts and request parameters only.
 */
export class PaymentsUiEmployeeHrmsInboxPage {
  static readonly PATH = '/payments-ui/employee/hrms/inbox'
  /** Where a logged-out visitor is sent (observed live 2026-11-18). Only asserted, never used to log in. */
  static readonly LOGGED_OUT_REDIRECT_PATH = '/payments-ui/employee/user/login'
  /** Search request sent on load, on Search, on Apply Filters and on paging (observed live). */
  static readonly SEARCH_API_RE = /\/egov-hrms\/employees\/_search(\?|$)/

  readonly hierarchy: HrmsHierarchyStep

  constructor(readonly page: Page) {
    this.hierarchy = new HrmsHierarchyStep(page)
  }

  // --- search form ---
  employeeName(): Locator { return this.page.locator('input[name="names"]') }
  username(): Locator { return this.page.locator('input[name="codes"]') }
  mobileNumber(): Locator { return this.page.locator('input[name="phone"]') }
  search(): Locator { return this.page.getByRole('button', { name: 'Search', exact: true }) }
  clear(): Locator { return this.page.getByRole('button', { name: 'Clear', exact: true }) }
  createUserLink(): Locator { return this.page.locator('a[href="/payments-ui/employee/hrms/create"]') }

  // --- filters ---
  /** "By Role" dropdown: the only .digit-dropdown-select on the search page once the hierarchy step is gone. */
  byRoleDropdown(): Locator { return this.page.locator('.digit-dropdown-select').first() }
  /** An option of the open By Role list. `.first()`: "PGR Administrator" is listed twice (observed 2026-11-18). */
  dropdownOption(text: string): Locator { return this.page.locator('.digit-dropdown-item:visible').filter({ hasText: exact(text) }).first() }
  /** Employment Status radio input ("Active" / "Inactive"). Click the input: clicking the label text does not check it. */
  statusRadio(label: string): Locator {
    return this.page.locator('.radio-option-container').filter({ has: this.page.locator('label', { hasText: exact(label) }) }).locator('input.digit-radio-btn')
  }
  statusRadios(): Locator { return this.page.locator('.radio-option-container input.digit-radio-btn') }
  applyFilters(): Locator { return this.page.getByRole('button', { name: 'Apply Filters', exact: true }) }
  clearFilter(): Locator { return this.page.getByRole('button', { name: 'Clear Filter', exact: true }) }

  // --- results ---
  table(): Locator { return this.page.locator('[role="table"]') }
  columnHeaders(): Locator { return this.page.locator('[role="table"] [role="columnheader"]') }
  /** Data rows only (the header row is also a [role=row] inside a rowgroup, but has no [role=cell]). */
  resultRows(): Locator { return this.page.locator('[role="table"] [role="row"]:has([role="cell"])') }
  /** Username cells are links to /hrms/details/<username>. */
  usernameLinks(): Locator { return this.page.locator('[role="table"] span.link') }
  noResults(): Locator { return this.page.getByText('No Results Found', { exact: true }) }
  firstPage(): Locator { return this.page.locator('#pagination-first-page') }
  nextPage(): Locator { return this.page.locator('#pagination-next-page') }

  // --- page actions ---
  async goto(baseURL: string): Promise<void> {
    await this.page.goto(urlFor(baseURL, PaymentsUiEmployeeHrmsInboxPage.PATH))
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/payments-ui\/employee\/hrms\/inbox/)
  }

  /** Fill Username and click Search; resolves with the search response. */
  async searchUsername(username: string) {
    await this.username().fill(username)
    const response = this.page.waitForResponse(r => PaymentsUiEmployeeHrmsInboxPage.SEARCH_API_RE.test(r.url()))
    await this.search().click()
    return response
  }
}
