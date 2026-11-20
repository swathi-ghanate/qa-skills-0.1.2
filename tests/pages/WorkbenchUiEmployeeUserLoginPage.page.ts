/** AUTO-GENERATED from contract — re-run /playwright-gen login AUTH-01 to refresh */
import { type Page, type Locator, expect } from '@playwright/test'
import { urlFor } from '../helpers/routes'

/** Workbench login — contract page `workbench_ui_employee_user_login` (/workbench-ui/employee/user/login). */
export class WorkbenchUiEmployeeUserLoginPage {
  static readonly PATH = '/workbench-ui/employee/user/login'

  constructor(readonly page: Page) {}

  // --- locators: contract page.elements ---
  navigationButtonB3a210(): Locator { return this.page.getByRole('button', { name: '<', exact: true }) }
  navigationButton9c123c(): Locator { return this.page.getByRole('button', { name: '>', exact: true }) }
  visibility0fd527(): Locator { return this.page.getByRole('button', { name: 'Visibility', exact: true }) }
  /** Country/State/City dropdown wrapper — receives the click (the input underneath is covered). */
  selectAnOptionBe0437(): Locator { return this.page.getByRole('button', { name: 'Select an option', exact: true }) }
  /** Privacy consent label — clicking it ticks/unticks the checkbox; nothing opens (team-confirmed 2026-11-16). */
  byClickingIAcceptThe410d00(): Locator { return this.page.getByRole('button', { name: 'By clicking, I accept the', exact: true }) }
  forgotPassword54faff(): Locator { return this.page.getByRole('button', { name: 'Forgot password?', exact: true }) }
  /** Accessible name has a leading space in the app (" Privacy Policy"); Playwright trims it. */
  privacyPolicy29eb8b(): Locator { return this.page.getByRole('button', { name: ' Privacy Policy', exact: true }) }
  continue5f8c5f(): Locator { return this.page.getByRole('button', { name: 'Continue', exact: true }) }
  username30177a(): Locator { return this.page.locator('[name="username"]') }
  password53fc5f(): Locator { return this.page.locator('[name="password"]') }

  // --- locators: contract form https_sierraleone_hcm_digit_org_workbenc_996dec fields ---
  username5a3c4c(): Locator { return this.page.locator('#user-login-standalone-core_login_username-field') }
  password181b4b(): Locator { return this.page.locator('#user-login-standalone-core_login_password-field') }
  /** Country/State/City input — read its value here; click selectAnOptionBe0437() to open it. */
  field28b6e46(): Locator { return this.page.locator('#user-login-standalone-core_common_city-field') }
  /** Privacy consent checkbox — read its state here; tick it via byClickingIAcceptThe410d00(). */
  field3B57319(): Locator { return this.page.locator('#privacy-component-check') }

  /**
   * CONTRACT GAP: dropdown options are not in the contract.
   * Observed live (2026-11-13/16) as `#jk-dropdown-unique .digit-dropdown-item`; Sierra Leone has one option.
   */
  cityOption(name: string): Locator {
    return this.page.locator('#jk-dropdown-unique .digit-dropdown-item').filter({ hasText: name })
  }

  /** CONTRACT GAP (observed live 2026-11-16): failed-login toast, a div[role="alert"] reading "Invalid login credentials". */
  errorToast(): Locator { return this.page.getByRole('alert') }

  /** CONTRACT GAP (observed live 2026-11-16): "Privacy Notice" popup opened by privacyPolicy29eb8b(). */
  privacyNoticePopup(): Locator { return this.page.locator('.digit-popup-overlay') }

  /**
   * CONTRACT GAP (observed live 2026-11-16): the password eye toggle once the password is shown.
   * After visibility0fd527() is clicked, the same icon's accessible name changes to "Visibility Off".
   */
  visibilityOff(): Locator { return this.page.getByRole('button', { name: 'Visibility Off', exact: true }) }

  /** CONTRACT GAP (observed live 2026-11-16): where forgotPassword54faff() leads; the page is not in the contract. */
  static readonly FORGOT_PASSWORD_PATH = '/workbench-ui/employee/user/forgot-password'

  // --- page actions ---
  async goto(baseURL: string): Promise<void> {
    await this.page.goto(urlFor(baseURL, WorkbenchUiEmployeeUserLoginPage.PATH))
  }

  /** Open the Country/State/City dropdown and choose an option. */
  async selectCity(name: string): Promise<void> {
    await this.selectAnOptionBe0437().click()
    await this.cityOption(name).click()
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/workbench-ui\/employee\/user\/login/)
  }
}
