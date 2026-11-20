/** AUTO-GENERATED — re-run /playwright-gen user-management to refresh (NOT IN CONTRACT: captured live 2026-11-16, re-verified 2026-11-18) */
import { type Page, type Locator } from '@playwright/test'

const exact = (s: string) => new RegExp(`^\\s*${s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`)

/**
 * Edit Campaign Assignment — /payments-ui/employee/hrms/update/assign-campaign/<username>, opened from Take Action.
 * A "Search Campaign" form above a campaign list whose rows each offer Assign or Unassign.
 */
export class PaymentsUiEmployeeHrmsAssignCampaignPage {
  static readonly PATH_PREFIX = '/payments-ui/employee/hrms/update/assign-campaign/'

  constructor(readonly page: Page) {}

  heading(): Locator { return this.page.getByText('Search Campaign', { exact: true }).first() }
  fieldLabel(label: string): Locator { return this.page.locator('label').filter({ hasText: exact(label) }) }
  projectName(): Locator { return this.page.locator('input[name="name"]') }
  projectNumber(): Locator { return this.page.locator('input[name="projectNumber"]') }
  startDate(): Locator { return this.page.locator('input[name="startDate"]') }
  endDate(): Locator { return this.page.locator('input[name="endDate"]') }
  search(): Locator { return this.page.getByRole('button', { name: 'Search', exact: true }) }
  clear(): Locator { return this.page.getByRole('button', { name: 'Clear', exact: true }) }
  assignButtons(): Locator { return this.page.getByRole('button', { name: 'Assign', exact: true }) }
  unassignButtons(): Locator { return this.page.getByRole('button', { name: 'Unassign', exact: true }) }
  /**
   * The result row holding `text` (best: the project number, which is unique). Verified live 2026-11-18: rows are
   * [role=row] with cells Project number | Project name | Project type | Project boundary type | Project boundary |
   * Assignment, and the Assign/Unassign button sits inside its row.
   */
  campaignRow(text: string): Locator { return this.page.locator('[role="row"]:has([role="cell"])').filter({ hasText: text }) }

  /**
   * "Campaign Assignment" popup opened by Assign (observed 2026-11-18): "Assigned from Date *" (required) and
   * "Assigned till Date" (optional) date inputs, then Cancel / Submit.
   */
  assignmentDialog(): Locator {
    return this.page.locator('div')
      .filter({ has: this.page.getByText('Campaign Assignment', { exact: true }) })
      .filter({ has: this.page.getByRole('button', { name: 'Submit', exact: true }) })
      .last()
  }
  assignedFromDate(): Locator { return this.assignmentDialog().locator('input[type="date"]').first() }
  assignmentSubmit(): Locator { return this.assignmentDialog().getByRole('button', { name: 'Submit', exact: true }) }

  /** Assign sends this after the dialog's Submit; Unassign sends _delete with no confirmation. Both answer 202 (observed 2026-11-18). */
  static readonly STAFF_CREATE_API_RE = /\/project\/staff\/v1\/_create(\?|$)/
  static readonly STAFF_DELETE_API_RE = /\/project\/staff\/v1\/_delete(\?|$)/

  /** Search the campaign list by project name (reloads the rows from the server). */
  async searchCampaign(projectName: string): Promise<void> {
    await this.projectName().fill(projectName)
    await this.search().click()
  }
}
