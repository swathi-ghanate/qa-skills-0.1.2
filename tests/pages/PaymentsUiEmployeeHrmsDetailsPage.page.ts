/** AUTO-GENERATED — re-run /playwright-gen user-management to refresh (NOT IN CONTRACT: captured live 2026-11-16, re-verified 2026-11-18) */
import { type Page, type Locator } from '@playwright/test'

const exact = (s: string) => new RegExp(`^\\s*${s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`)

/**
 * User details — /payments-ui/employee/hrms/details/<username>. Not in the contract.
 * It works only when reached from a search result: opening the URL directly shows no Take Action.
 * PRIVACY: never read or log the personal values on this page.
 */
export class PaymentsUiEmployeeHrmsDetailsPage {
  static readonly PATH_PREFIX = '/payments-ui/employee/hrms/details/'

  constructor(readonly page: Page) {}

  /** "Employee Details" is the page header; the other sections are .digit-view-card-header cards. */
  sectionHeading(name: string): Locator {
    return this.page.locator('header.digit-inbox-search-composer-header, .digit-view-card-header').filter({ hasText: exact(name) }).first()
  }
  takeAction(): Locator { return this.page.getByRole('button', { name: 'Take Action' }) }
  /** Items of the open Take Action menu (.header-dropdown-options > .header-dropdown-option). */
  actionItems(): Locator { return this.page.locator('.header-dropdown-options .header-dropdown-option') }
  actionItem(name: string): Locator { return this.actionItems().filter({ hasText: exact(name) }) }

  // --- Deactivate Employee popup (captured 2026-11-18 on a test-created user, nothing submitted) ---
  // Fields: Reason for Deactivation * (dropdown: "User not preset", "NOt Working", "ORDERBYCOMMISSIONER", "Others"),
  // Enter Order No., Effective Date (prefilled with today), Supporting Documents (upload), Enter Remarks.
  // Buttons: Close, Deactivate Employee. Field ids embed the username, so they are matched by suffix.
  deactivationForm(): Locator {
    return this.page.locator('.digit-popup-wrapper').filter({ has: this.page.locator('.digit-popup-heading', { hasText: exact('Deactivate Employee') }) })
  }
  deactivationReason(): Locator { return this.deactivationForm().locator('.comment-section .digit-dropdown-select') }
  deactivationReasonOption(reason: string): Locator { return this.deactivationForm().locator('.digit-dropdown-item').filter({ hasText: exact(reason) }).first() }
  deactivationOrderNo(): Locator { return this.deactivationForm().locator('[id$="-enter-order-no"]') }
  deactivationEffectiveDate(): Locator { return this.deactivationForm().locator('[id$="-effective-date"]') }
  deactivationRemarks(): Locator { return this.deactivationForm().locator('[id$="-enter-remarks"]') }
  deactivationConfirm(): Locator { return this.deactivationForm().getByRole('button', { name: 'Deactivate Employee', exact: true }) }

  async chooseAction(name: string): Promise<void> {
    await this.takeAction().click()
    await this.actionItem(name).click()
  }
}
