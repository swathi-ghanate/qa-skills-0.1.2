/** AUTO-GENERATED — re-run /playwright-gen complaints-inbox to refresh */
import { type Page, type Locator } from '@playwright/test'

const exact = (s: string) => new RegExp(`^\\s*${s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`)

/**
 * Complaint details — /payments-ui/employee/pgr/complaint-details/<complaintNumber>.
 * TODO (contract gap): page not in contract — it exists only as empty stubs named after real complaints, which
 * must not be used. Every locator below was verified live, read-only, on 2026-11-20 on a QA-TEST complaint.
 * The scraper must never crawl this page: its click-through could press Assign / Reject / Resolve on a real complaint.
 * PRIVACY: the page shows the complainant's name and number. Tests assert labels and our own complaint number only.
 */
export class PaymentsUiEmployeePgrComplaintDetailsPage {
  static readonly PATH_PREFIX = '/payments-ui/employee/pgr/complaint-details/'
  /** Loads the complaint (?tenantId=si&serviceRequestId=<n>). */
  static readonly COMPLAINT_SEARCH_API_RE = /\/pgr-services\/v2\/request\/_search(\?|$)/
  /** Loads the "Assign to" list when the Assign pop-up opens (?tenantId=si&roles=…). */
  static readonly ASSIGNEE_SEARCH_API_RE = /\/egov-hrms\/employees\/_search(\?|$)/

  constructor(readonly page: Page) {}

  static pathFor(complaintNumber: string): string { return PaymentsUiEmployeePgrComplaintDetailsPage.PATH_PREFIX + complaintNumber }

  // --- details ---
  heading(): Locator { return this.page.locator('.digit-inbox-search-composer-header') }
  /** The field labels. Two empty .digit-viewcard-label spacers follow them (observed 2026-11-20), so those are skipped. */
  labels(): Locator { return this.page.locator('.digit-viewcard-label').filter({ hasText: /\S/ }) }
  value(label: string): Locator {
    return this.page.locator('.digit-viewcard-field-pair').filter({ has: this.page.locator('.digit-viewcard-label', { hasText: exact(label) }) }).locator('.digit-viewcard-value')
  }
  takeAction(): Locator { return this.page.getByRole('button', { name: 'Take Action', exact: true }) }
  viewMore(): Locator { return this.page.getByRole('button', { name: 'View More', exact: true }) }
  pgrInboxBreadcrumb(): Locator { return this.page.getByRole('link', { name: 'PGR Inbox', exact: true }) }

  // --- Take Action menu ---
  actionOptions(): Locator { return this.page.locator('.header-dropdown-option') }
  actionOption(name: 'Resolve' | 'Assign' | 'Reject'): Locator { return this.actionOptions().filter({ hasText: exact(name) }) }

  // --- workflow pop-up (Assign complaint / Reject Complaint / Resolve Complaint) ---
  popup(): Locator { return this.page.locator('.pgr-workflow-popup') }
  popupHeading(): Locator { return this.popup().locator('.digit-popup-heading') }
  /** A field label inside the pop-up; the required mark "*" is a separate element, so the label text is exact. */
  popupFieldLabel(label: string): Locator { return this.popup().locator('label.label-styles', { hasText: exact(label) }) }
  comments(): Locator { return this.popup().locator('[name="SelectedComments"]') }
  /** The id embeds the complaint number, so select by suffix. */
  rejectionReason(): Locator { return this.popup().locator('[id$="-cs_reject_complaint"]') }
  assignTo(): Locator { return this.popup().getByPlaceholder('Select Employee') }
  complaintFile(): Locator { return this.popup().locator('#upload-complaintFile') }
  /** Options of an open dropdown. The Assign list holds real staff names: count them, never log them. */
  dropdownOptions(): Locator { return this.page.locator('.digit-dropdown-item:visible, .digit-dropdown-options-card:visible > *') }
  popupError(): Locator { return this.popup().locator('[class*="error"]:visible') }
  popupCancel(): Locator { return this.popup().getByRole('button', { name: 'Cancel', exact: true }) }
  popupSubmit(): Locator { return this.popup().getByRole('button', { name: 'Submit', exact: true }) }

  /** Open Take Action and choose one option; waits for the pop-up. */
  async openAction(name: 'Resolve' | 'Assign' | 'Reject'): Promise<void> {
    await this.takeAction().click()
    await this.actionOption(name).click()
    await this.popup().waitFor({ state: 'visible', timeout: 15_000 })
  }

  /** Close an open dropdown inside the pop-up by clicking the pop-up heading. */
  async closePopupDropdown(): Promise<void> {
    await this.popupHeading().click()
  }
}
