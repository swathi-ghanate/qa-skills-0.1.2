/** AUTO-GENERATED from contract — re-run /playwright-gen login AUTH-01 to refresh */
import { type Page, type Locator } from '@playwright/test'

/**
 * Contract page `home`: the DIGIT app loader that every DIGIT page shows while it boots.
 * Specs use it only to wait for a page to finish loading (waitForLoaderGone).
 * It is NOT the post-login page: after the workbench login the app lands on /workbench-ui/employee
 * (WorkbenchUiEmployeePage.PATH), which is what the login specs assert.
 * (The contract recorded this element on the crawl's warm-up page; that URL plays no part in the tests.)
 */
export class HomePage {
  constructor(readonly page: Page) {}

  // --- locators ---
  /** App loader shown while any DIGIT page boots. (animation_1dcbe0-2 is a duplicate record of the same element.) */
  animation1dcbe0(): Locator { return this.page.getByRole('button', { name: 'animation', exact: true }) }
}
