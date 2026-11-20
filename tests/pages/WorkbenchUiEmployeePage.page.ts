/** AUTO-GENERATED from contract — re-run /playwright-gen login AUTH-01 to refresh */
import { type Page, type Locator, expect } from '@playwright/test'
import { urlFor } from '../helpers/routes'

/** Workbench home after login — contract page `workbench_ui_employee` (/workbench-ui/employee, is_protected). */
export class WorkbenchUiEmployeePage {
  static readonly PATH = '/workbench-ui/employee'

  constructor(readonly page: Page) {}

  // --- locators: header ---
  tenantTenantsSiE1381e(): Locator { return this.page.getByRole('button', { name: 'TENANT_TENANTS_SI', exact: true }) }
  english495985(): Locator { return this.page.getByRole('button', { name: 'English', exact: true }) }
  /** FRAGILE (selector audit): the accessible name "S" is the test account's initial, so it changes with the account. */
  s24f482(): Locator { return this.page.getByRole('button', { name: 'S', exact: true }) }
  /** Appears only after the user menu (s24f482) is opened — match_count 0 while closed. */
  logout8358e8(): Locator { return this.page.getByRole('button', { name: 'Logout', exact: true }) }

  // --- locators: module cards (duplicate records commodity_management_2ffe55-2 / tenant_tenants_si_e1381e-2 share these selectors) ---
  commodityManagement2ffe55(): Locator { return this.page.getByRole('button', { name: 'Commodity Management', exact: true }) }
  setupPaymentAttributes86ccb4(): Locator { return this.page.getByRole('button', { name: 'Setup Payment Attributes', exact: true }) }
  manageCampaignD9185d(): Locator { return this.page.getByRole('button', { name: 'Manage campaign', exact: true }) }
  campaignSettingsCa1e28(): Locator { return this.page.getByRole('button', { name: 'Campaign settings', exact: true }) }
  localizationA64437(): Locator { return this.page.getByRole('button', { name: 'Localization', exact: true }) }
  mdms25e21f(): Locator { return this.page.getByRole('button', { name: 'MDMS', exact: true }) }
  howItWorksEfeb53(): Locator { return this.page.getByRole('button', { name: 'How it works', exact: true }) }
  boundaryManagement31fe45(): Locator { return this.page.getByRole('button', { name: 'Boundary management', exact: true }) }
  myCampaignsF6aa30(): Locator { return this.page.getByRole('button', { name: 'My campaigns', exact: true }) }
  createCampaignAf3021(): Locator { return this.page.getByRole('button', { name: 'Create campaign', exact: true }) }
  searchUser8a67fa(): Locator { return this.page.getByRole('button', { name: 'Search user', exact: true }) }
  createUser980434(): Locator { return this.page.getByRole('button', { name: 'Create user', exact: true }) }
  searchComplaintC22151(): Locator { return this.page.getByRole('button', { name: 'Search complaint', exact: true }) }
  createComplaint17f516(): Locator { return this.page.getByRole('button', { name: 'Create complaint', exact: true }) }
  dashboard8806f1(): Locator { return this.page.getByRole('button', { name: 'Dashboard', exact: true }) }

  // --- page actions ---
  async goto(baseURL: string): Promise<void> {
    await this.page.goto(urlFor(baseURL, WorkbenchUiEmployeePage.PATH))
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/workbench-ui\/employee\/?$/)
  }
}
