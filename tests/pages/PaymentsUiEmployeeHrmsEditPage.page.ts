/** AUTO-GENERATED — re-run /playwright-gen user-management to refresh (NOT IN CONTRACT: captured live 2026-11-16, re-verified 2026-11-18) */
import { type Page, type Locator } from '@playwright/test'

const exact = (s: string) => new RegExp(`^\\s*${s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`)

/**
 * Edit Employee — /payments-ui/employee/hrms/edit/<username>, opened from Take Action on the details page.
 * Field ids embed the username (`hrms-edit-<username>-hr_*_label`), so fields are matched by id suffix.
 * Its heading says "Create User" (a misleading heading; reported as a finding). No password fields.
 */
export class PaymentsUiEmployeeHrmsEditPage {
  static readonly PATH_PREFIX = '/payments-ui/employee/hrms/edit/'
  /** Assumed DIGIT HRMS update endpoint (not yet observed: Submit was never clicked); confirm on the first USR-11 run. */
  static readonly UPDATE_API_RE = /\/egov-hrms\/employees\/_update(\?|$)/

  constructor(readonly page: Page) {}

  /** A form field by its id suffix, e.g. field('emp_id_label') → [id^="hrms-edit-"][id$="-hr_emp_id_label"]. */
  field(suffix: string): Locator { return this.page.locator(`[id^="hrms-edit-"][id$="-hr_${suffix}"]`) }
  username(): Locator { return this.field('emp_id_label') }
  designation(): Locator { return this.field('employment_designation_label') }
  sectionHeading(name: string): Locator { return this.page.locator('header.digit-card-section-header').filter({ hasText: exact(name) }) }
  submit(): Locator { return this.page.getByRole('button', { name: 'Submit', exact: true }) }
  /** The Create form shows this on Submit when another employee has the mobile number; watched here in case Edit does the same. */
  mobileTakenToast(): Locator { return this.page.getByText('Mobile number already exist!', { exact: true }) }
  /** "Ready to Submit ?" popup that opens after Submit, as on Create (observed 2026-11-18); its own Submit sends the update. */
  confirmDialog(): Locator {
    return this.page.locator('div')
      .filter({ has: this.page.getByText('Ready to Submit ?', { exact: true }) })
      .filter({ has: this.page.getByRole('button', { name: 'Submit', exact: true }) })
      .last()
  }
  confirmSubmit(): Locator { return this.confirmDialog().getByRole('button', { name: 'Submit', exact: true }) }

  async chooseDesignation(option: string): Promise<void> {
    await this.page.locator('.digit-dropdown-select', { has: this.designation() }).click()
    await this.page.locator('.digit-dropdown-employee-select-wrap', { has: this.designation() })
      .locator('.digit-dropdown-item').filter({ hasText: exact(option) }).first().click()
  }
}
