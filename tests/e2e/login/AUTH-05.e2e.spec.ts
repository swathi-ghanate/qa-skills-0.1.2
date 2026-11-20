/**
 * AUTO-GENERATED — do not edit by hand.
 * Source:    tests/testcases/login/AUTH-05.yaml
 * Flow:      AUTH-05 — protected_workbench_pages_redirect_to_login
 * Contract:  ui-contract.json v1.3.0
 * Generator: /playwright-gen login AUTH-05
 * Deferred:  rbac_checks AUTH-05-RBAC-1/-2 (API-level, endpoints TBD) → /script-gen after `qa-kit api-scrape`.
 */
import { test, expect } from '@playwright/test'
import * as allure from 'allure-js-commons'
import { WorkbenchUiEmployeeUserLoginPage } from '../../pages/WorkbenchUiEmployeeUserLoginPage.page'
import { HomePage } from '../../pages/HomePage.page'
import { WorkbenchUiEmployeePage } from '../../pages/WorkbenchUiEmployeePage.page'
import { WorkbenchUiEmployeeCampaignCommodityCampaigPage } from '../../pages/WorkbenchUiEmployeeCampaignCommodityCampaigPage.page'
import { expectPathname, urlFor } from '../../helpers/routes'
import { installOverlayHandlers, waitForLoaderGone } from '../../helpers/app'

const BASE_URL = (process.env.QA_UI_BASE_URL || '').trim() || 'https://sierraleone-hcm.digit.org/workbench-ui/employee'   // .env QA_UI_BASE_URL normally supplies this
const YAML_SOURCE = 'tests/testcases/login/AUTH-05.yaml'

test.describe('AUTH-05 protected_workbench_pages_redirect_to_login', {
  tag: ['@AUTH-05', '@login', '@P0'],
}, () => {
  // Actor `unauthenticated`: route protection is only observable without a session.
  test.use({ storageState: { cookies: [], origins: [] } })

  test('AUTH-05-H1: Redirect a logged-out visitor from the workbench home to the workbench login', {
    tag: ['@smoke', '@regression'],
  }, async ({ page }) => {
    await allure.tms(YAML_SOURCE + '#AUTH-05-H1', 'AUTH-05-H1')
    await allure.parameter('case_id', 'AUTH-05-H1')
    await allure.parameter('flow_id', 'AUTH-05')
    await allure.parameter('module', 'login')
    await allure.parameter('type', 'happy_path')
    await allure.parameter('priority', 'P0')
    await allure.parameter('test_data_ref', 'AUTH-05-H1')
    await allure.parameter('yaml_source', YAML_SOURCE)
    await allure.epic('login')
    await allure.feature('protected_workbench_pages_redirect_to_login')
    await allure.story('Redirect a logged-out visitor from the workbench home to the workbench login')
    await allure.severity('critical')
    await allure.tag('smoke')
    await allure.tag('regression')
    await allure.description("Route protection for the workbench home (is_protected true), the page the team's login URL points to.\n\nSource: " + YAML_SOURCE + '#AUTH-05-H1')

    const login = new WorkbenchUiEmployeeUserLoginPage(page)
    const loader = new HomePage(page)

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
    })

    await allure.step('1. Open /workbench-ui/employee', async () => {
      await page.goto(urlFor(BASE_URL, WorkbenchUiEmployeePage.PATH))
    })
    await allure.step('2. Wait for the URL to become /workbench-ui/employee/user/login (client-side redirect, up to about 15 s on a cold load)', async () => {
      await expectPathname(page, WorkbenchUiEmployeeUserLoginPage.PATH)
    })
    await allure.step('3. Wait for animation_1dcbe0 to be hidden', async () => {
      await waitForLoaderGone(loader.animation1dcbe0())
    })

    await allure.step('Assert: url_pathname_is_workbench_ui_employee_user_login', async () => {
      await expectPathname(page, WorkbenchUiEmployeeUserLoginPage.PATH)
    })
    await allure.step('Assert: username_field_visible', async () => {
      // A cold load can take ~15 s, so allow 60 s for the form to render.
      await expect(login.username30177a()).toBeVisible({ timeout: 60_000 })
    })
  })

  test('AUTH-05-H2: Redirect a logged-out visitor from a workbench module page to the workbench login', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await allure.tms(YAML_SOURCE + '#AUTH-05-H2', 'AUTH-05-H2')
    await allure.parameter('case_id', 'AUTH-05-H2')
    await allure.parameter('flow_id', 'AUTH-05')
    await allure.parameter('module', 'login')
    await allure.parameter('type', 'happy_path')
    await allure.parameter('priority', 'P1')
    await allure.parameter('test_data_ref', 'AUTH-05-H2')
    await allure.parameter('yaml_source', YAML_SOURCE)
    await allure.epic('login')
    await allure.feature('protected_workbench_pages_redirect_to_login')
    await allure.story('Redirect a logged-out visitor from a workbench module page to the workbench login')
    await allure.severity('normal')
    await allure.tag('regression')
    await allure.description('Deep-link protection: a module page, not the home page, also redirects (observed in the 13 Nov anonymous scrape).\n\nSource: ' + YAML_SOURCE + '#AUTH-05-H2')

    const login = new WorkbenchUiEmployeeUserLoginPage(page)
    const loader = new HomePage(page)
    const commodity = new WorkbenchUiEmployeeCampaignCommodityCampaigPage(page)

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
    })

    await allure.step('1. Open /workbench-ui/employee/campaign/commodity-campaigns', async () => {
      await commodity.goto(BASE_URL)
    })
    await allure.step('2. Wait for the URL to become /workbench-ui/employee/user/login', async () => {
      await expectPathname(page, WorkbenchUiEmployeeUserLoginPage.PATH)
    })
    await allure.step('3. Wait for animation_1dcbe0 to be hidden', async () => {
      await waitForLoaderGone(loader.animation1dcbe0())
    })

    await allure.step('Assert: url_pathname_is_workbench_ui_employee_user_login', async () => {
      await expectPathname(page, WorkbenchUiEmployeeUserLoginPage.PATH)
    })
    await allure.step('Assert: username_field_visible', async () => {
      await expect(login.username30177a()).toBeVisible({ timeout: 60_000 })
    })
  })
})
