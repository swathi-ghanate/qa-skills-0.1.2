/**
 * AUTO-GENERATED — do not edit by hand.
 * Source:    tests/testcases/login/AUTH-01.yaml
 * Flow:      AUTH-01 — workbench_login_valid_credentials
 * Contract:  ui-contract.json v1.3.0
 * Generator: /playwright-gen login AUTH-01
 */
import { test, expect } from '@playwright/test'
import * as allure from 'allure-js-commons'
import { WorkbenchUiEmployeeUserLoginPage } from '../../pages/WorkbenchUiEmployeeUserLoginPage.page'
import { HomePage } from '../../pages/HomePage.page'
import { WorkbenchUiEmployeePage } from '../../pages/WorkbenchUiEmployeePage.page'
import { expectPathname, urlFor } from '../../helpers/routes'
import { installOverlayHandlers, waitForLoaderGone, fillPrivately } from '../../helpers/app'
import { requiredEnv } from '../../helpers/requiredEnv'

const BASE_URL = (process.env.QA_UI_BASE_URL || '').trim() || 'https://sierraleone-hcm.digit.org/workbench-ui/employee'   // .env QA_UI_BASE_URL normally supplies this
const YAML_SOURCE = 'tests/testcases/login/AUTH-01.yaml'
const CITY = 'Sierra Leone'

test.describe('AUTH-01 workbench_login_valid_credentials', {
  tag: ['@AUTH-01', '@login', '@P0'],
}, () => {
  // Actor `unauthenticated`: this flow tests the login form itself, so it must start logged out
  // instead of using the saved session that playwright.config.ts applies by default.
  test.use({ storageState: { cookies: [], origins: [] } })

  test('AUTH-01-H1: Log in through the workbench login after being redirected from /workbench-ui/employee', {
    tag: ['@smoke', '@regression'],
  }, async ({ page }) => {
    // --- Traceability ---
    await allure.tms(YAML_SOURCE + '#AUTH-01-H1', 'AUTH-01-H1')
    await allure.parameter('case_id', 'AUTH-01-H1')
    await allure.parameter('flow_id', 'AUTH-01')
    await allure.parameter('module', 'login')
    await allure.parameter('type', 'happy_path')
    await allure.parameter('priority', 'P0')
    await allure.parameter('test_data_ref', 'AUTH-01-H1')
    await allure.parameter('yaml_source', YAML_SOURCE)

    // --- Allure report metadata ---
    await allure.epic('login')
    await allure.feature('workbench_login_valid_credentials')
    await allure.story('Log in through the workbench login after being redirected from /workbench-ui/employee')
    await allure.severity('critical')
    await allure.tag('smoke')
    await allure.tag('regression')
    await allure.description('Core login through the workbench entry URL the team uses, including the redirect from /workbench-ui/employee to the login page.\n\nSource: ' + YAML_SOURCE + '#AUTH-01-H1')

    const login = new WorkbenchUiEmployeeUserLoginPage(page)
    const loader = new HomePage(page)
    const workbench = new WorkbenchUiEmployeePage(page)

    // --- Precondition: this case's own start state ---
    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      // Fresh context (storageState emptied above); credentials must be present before we start.
      requiredEnv('QA_USERNAME')
      requiredEnv('QA_PASSWORD')
    })

    // --- Steps ---
    await allure.step('1. Open /workbench-ui/employee and wait for the URL to become /workbench-ui/employee/user/login', async () => {
      await page.goto(urlFor(BASE_URL, WorkbenchUiEmployeePage.PATH))
      await expectPathname(page, WorkbenchUiEmployeeUserLoginPage.PATH)
    })

    await allure.step('2. Wait for animation_1dcbe0 (loader) to be hidden', async () => {
      await waitForLoaderGone(loader.animation1dcbe0())
    })

    await allure.step('3. Fill username_30177a with QA_USERNAME from .env', async () => {
      await login.username30177a().fill(requiredEnv('QA_USERNAME'))
    })

    await allure.step('4. Fill password_53fc5f with QA_PASSWORD from .env', async () => {
      await fillPrivately(login.password53fc5f(), requiredEnv('QA_PASSWORD'))   // keeps the password out of report step titles
    })

    await allure.step("5. Click select_an_option_be0437, then choose the option 'Sierra Leone' (option selector not in contract; observed as '#jk-dropdown-unique .digit-dropdown-item')", async () => {
      await login.selectCity(CITY)
      await expect(login.field28b6e46()).toHaveValue(CITY)
    })

    await allure.step('6. Click by_clicking_i_accept_the_410d00 to tick the privacy consent checkbox field_3_b57319', async () => {
      await login.byClickingIAcceptThe410d00().click()
      await expect(login.field3B57319()).toBeChecked()
    })

    await allure.step('7. Click continue_5f8c5f', async () => {
      await expect(login.continue5f8c5f()).toBeEnabled()
      await login.continue5f8c5f().click()
    })

    await allure.step('8. Wait for the URL to become /workbench-ui/employee and for animation_1dcbe0 to be hidden', async () => {
      await expectPathname(page, WorkbenchUiEmployeePage.PATH)
      await waitForLoaderGone(loader.animation1dcbe0())
    })

    // --- Assertions ---
    await allure.step('Assert: url_pathname_is_workbench_ui_employee', async () => {
      await expectPathname(page, WorkbenchUiEmployeePage.PATH)
    })

    await allure.step('Assert: commodity_management_card_visible', async () => {
      await expect(workbench.commodityManagement2ffe55().first()).toBeVisible()
    })

    await allure.step('Assert: login_form_not_visible', async () => {
      await expect(login.username30177a()).toBeHidden()
    })
  })

  test('AUTH-01-H2: Log in when opening the workbench login page directly', {
    tag: ['@regression'],
  }, async ({ page }) => {
    // --- Traceability ---
    await allure.tms(YAML_SOURCE + '#AUTH-01-H2', 'AUTH-01-H2')
    await allure.parameter('case_id', 'AUTH-01-H2')
    await allure.parameter('flow_id', 'AUTH-01')
    await allure.parameter('module', 'login')
    await allure.parameter('type', 'happy_path')
    await allure.parameter('priority', 'P1')
    await allure.parameter('test_data_ref', 'AUTH-01-H2')
    await allure.parameter('yaml_source', YAML_SOURCE)

    // --- Allure report metadata ---
    await allure.epic('login')
    await allure.feature('workbench_login_valid_credentials')
    await allure.story('Log in when opening the workbench login page directly')
    await allure.severity('normal')
    await allure.tag('regression')
    await allure.description('Same login started from the direct login URL (the QA_LOGIN_URL used by global-setup) rather than via the redirect, and checks the city value is set.\n\nSource: ' + YAML_SOURCE + '#AUTH-01-H2')

    const login = new WorkbenchUiEmployeeUserLoginPage(page)
    const loader = new HomePage(page)
    const workbench = new WorkbenchUiEmployeePage(page)

    // --- Precondition: this case's own start state ---
    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      requiredEnv('QA_USERNAME')
      requiredEnv('QA_PASSWORD')
    })

    // --- Steps ---
    await allure.step('1. Open /workbench-ui/employee/user/login', async () => {
      await login.goto(BASE_URL)
      await expectPathname(page, WorkbenchUiEmployeeUserLoginPage.PATH)
    })

    await allure.step('2. Wait for animation_1dcbe0 (loader) to be hidden', async () => {
      await waitForLoaderGone(loader.animation1dcbe0())
    })

    await allure.step('3. Fill username_30177a with QA_USERNAME from .env', async () => {
      await login.username30177a().fill(requiredEnv('QA_USERNAME'))
    })

    await allure.step('4. Fill password_53fc5f with QA_PASSWORD from .env', async () => {
      await fillPrivately(login.password53fc5f(), requiredEnv('QA_PASSWORD'))   // keeps the password out of report step titles
    })

    await allure.step("5. Click select_an_option_be0437, then choose the option 'Sierra Leone'", async () => {
      await login.selectCity(CITY)
    })

    await allure.step("6. Verify field_2_8b6e46 shows 'Sierra Leone'", async () => {
      await expect(login.field28b6e46()).toHaveValue(CITY)
    })

    await allure.step('7. Click by_clicking_i_accept_the_410d00 to tick field_3_b57319', async () => {
      await login.byClickingIAcceptThe410d00().click()
      await expect(login.field3B57319()).toBeChecked()
    })

    await allure.step('8. Click continue_5f8c5f', async () => {
      await expect(login.continue5f8c5f()).toBeEnabled()
      await login.continue5f8c5f().click()
    })

    await allure.step('9. Wait for the URL to become /workbench-ui/employee', async () => {
      await expectPathname(page, WorkbenchUiEmployeePage.PATH)
      await waitForLoaderGone(loader.animation1dcbe0())
    })

    // --- Assertions ---
    await allure.step('Assert: url_pathname_is_workbench_ui_employee', async () => {
      await expectPathname(page, WorkbenchUiEmployeePage.PATH)
    })

    await allure.step('Assert: commodity_management_card_visible', async () => {
      await expect(workbench.commodityManagement2ffe55().first()).toBeVisible()
    })
  })
})
