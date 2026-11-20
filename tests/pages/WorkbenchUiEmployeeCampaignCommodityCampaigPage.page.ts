/** AUTO-GENERATED from contract — re-run /playwright-gen login AUTH-05 to refresh */
import { type Page, type Locator, expect } from '@playwright/test'
import { urlFor } from '../helpers/routes'

/** Commodity campaigns — contract page `workbench_ui_employee_campaign_commodity_campaig` (is_protected). */
export class WorkbenchUiEmployeeCampaignCommodityCampaigPage {
  static readonly PATH = '/workbench-ui/employee/campaign/commodity-campaigns'

  constructor(readonly page: Page) {}

  // --- locators (english_495985-2 is a duplicate record of english495985) ---
  home691dd0(): Locator { return this.page.locator('a[href="/workbench-ui/employee"]') }
  tenantTenantsSiE1381e(): Locator { return this.page.getByRole('button', { name: 'TENANT_TENANTS_SI', exact: true }) }
  english495985(): Locator { return this.page.getByRole('button', { name: 'English', exact: true }) }
  /** FRAGILE (selector audit): "S" is the test account's initial. */
  s24f482(): Locator { return this.page.getByRole('button', { name: 'S', exact: true }) }
  /** match_count 0 at scrape time: revealed by interaction. */
  itnDistributionEa45c1(): Locator { return this.page.getByRole('button', { name: 'ITN Distribution', exact: true }) }
  /** match_count 0 at scrape time: revealed by interaction. */
  ongoing722070(): Locator { return this.page.getByRole('button', { name: 'Ongoing', exact: true }) }
  /** match_count 0 at scrape time: revealed by interaction. */
  viewDashboard9fd00a(): Locator { return this.page.getByRole('button', { name: 'View Dashboard', exact: true }) }
  clear9d06f3(): Locator { return this.page.getByRole('button', { name: 'Clear', exact: true }) }
  sort708f51(): Locator { return this.page.getByRole('button', { name: 'Sort', exact: true }) }
  campaignname80835e(): Locator { return this.page.locator('[name="campaignName"]') }
  /** Appears only after the user menu is opened. */
  logout8358e8(): Locator { return this.page.getByRole('button', { name: 'Logout', exact: true }) }

  // --- page actions ---
  async goto(baseURL: string): Promise<void> {
    await this.page.goto(urlFor(baseURL, WorkbenchUiEmployeeCampaignCommodityCampaigPage.PATH))
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/workbench-ui\/employee\/campaign\/commodity-campaigns/)
  }
}
