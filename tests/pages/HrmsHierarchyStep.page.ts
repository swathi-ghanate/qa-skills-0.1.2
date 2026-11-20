/** AUTO-GENERATED — re-run /playwright-gen user-management to refresh (CONTRACT GAP: captured live 2026-11-16, re-verified 2026-11-18) */
import { type Page, type Locator } from '@playwright/test'

/** The only hierarchy type offered on sierraleone-hcm (observed live 2026-11-16 and 2026-11-18). */
export const DEFAULT_HIERARCHY_TYPE = 'ADMIN_KAMBIA'

/**
 * "Select hierarchy type" step shown first on both /payments-ui/employee/hrms/inbox and /hrms/create.
 * The URL does not change when Next is clicked: the real page replaces the step, so assert pages by their fields.
 * Not in the contract (both hrms pages are unexplored stubs with 0 elements).
 */
export class HrmsHierarchyStep {
  constructor(readonly page: Page) {}

  heading(): Locator { return this.page.getByText('Select hierarchy type', { exact: true }) }
  /** The step's single dropdown ("Hierarchy type *"). */
  dropdown(): Locator { return this.page.locator('.digit-dropdown-select').first() }
  /** Visible options of the open list; they load a moment after the list opens. */
  options(): Locator { return this.page.locator('.digit-dropdown-item:visible') }
  option(name: string): Locator { return this.options().getByText(name, { exact: true }) }
  next(): Locator { return this.page.getByRole('button', { name: 'Next', exact: true }) }
  /** Toast shown when Next is clicked with nothing chosen (div.toast-label). */
  mandatoryFieldError(): Locator { return this.page.locator('.toast-label').filter({ hasText: /^\s*Please fill the mandatory field\s*$/ }) }

  async openList(): Promise<void> {
    await this.next().waitFor({ state: 'visible', timeout: 60_000 })
    await this.dropdown().click()
  }

  /** Choose `type` and click Next (the step must be showing). */
  async pass(type: string = DEFAULT_HIERARCHY_TYPE): Promise<void> {
    await this.openList()
    await this.option(type).click()
    await this.next().click()
  }
}
