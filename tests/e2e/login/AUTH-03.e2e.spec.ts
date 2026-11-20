/**
 * AUTO-GENERATED — do not edit by hand.
 * Source:    tests/testcases/login/AUTH-03.yaml
 * Flow:      AUTH-03 — wrong_password_rejected
 * Contract:  ui-contract.json v1.3.0
 * Generator: /playwright-gen login AUTH-03
 */
import { test, expect, type Page } from '@playwright/test'
import * as allure from 'allure-js-commons'
import { WorkbenchUiEmployeeUserLoginPage } from '../../pages/WorkbenchUiEmployeeUserLoginPage.page'
import { HomePage } from '../../pages/HomePage.page'
import { WorkbenchUiEmployeePage } from '../../pages/WorkbenchUiEmployeePage.page'
import { expectPathname } from '../../helpers/routes'
import { installOverlayHandlers, waitForLoaderGone, loadTestData, sessionTokenKeys, fillPrivately } from '../../helpers/app'
import { requiredEnv } from '../../helpers/requiredEnv'

const BASE_URL = (process.env.QA_UI_BASE_URL || '').trim() || 'https://sierraleone-hcm.digit.org/workbench-ui/employee'   // .env QA_UI_BASE_URL normally supplies this
const YAML_SOURCE = 'tests/testcases/login/AUTH-03.yaml'
const CITY = 'Sierra Leone'
/** DIGIT login posts to the egov-user OAuth endpoint; waiting on it makes each failed attempt deterministic. */
const isLoginResponse = (url: string) => /\/user\/oauth\/token/.test(url)

async function openLogin(page: Page, login: WorkbenchUiEmployeeUserLoginPage, loader: HomePage): Promise<void> {
  await login.goto(BASE_URL)
  await expectPathname(page, WorkbenchUiEmployeeUserLoginPage.PATH)
  await waitForLoaderGone(loader.animation1dcbe0())
  // A cold load can take ~15 s, so allow 60 s for the form to render.
  await expect(login.username30177a()).toBeVisible({ timeout: 60_000 })
}

test.describe('AUTH-03 wrong_password_rejected', {
  tag: ['@AUTH-03', '@login', '@P0'],
}, () => {
  test.use({ storageState: { cookies: [], origins: [] } })

  test('AUTH-03-E1: Reject a wrong password and stay on the workbench login', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await allure.tms(YAML_SOURCE + '#AUTH-03-E1', 'AUTH-03-E1')
    await allure.parameter('case_id', 'AUTH-03-E1')
    await allure.parameter('flow_id', 'AUTH-03')
    await allure.parameter('module', 'login')
    await allure.parameter('type', 'negative')
    await allure.parameter('priority', 'P0')
    await allure.parameter('test_data_ref', 'AUTH-03-E1')
    await allure.parameter('yaml_source', YAML_SOURCE)
    await allure.epic('login')
    await allure.feature('wrong_password_rejected')
    await allure.story('Reject a wrong password and stay on the workbench login')
    await allure.severity('critical')
    await allure.tag('regression')
    await allure.description('Credential rejection for a valid username; the error text is not in the contract and is captured on first run (same text as AUTH-04-E1).\n\nSource: ' + YAML_SOURCE + '#AUTH-03-E1')

    const data = loadTestData<{ wrongPassword: string; expectedError: string }>('AUTH-03-E1')
    const login = new WorkbenchUiEmployeeUserLoginPage(page)
    const loader = new HomePage(page)

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
    })

    await allure.step('1. Open /workbench-ui/employee/user/login and wait for animation_1dcbe0 to be hidden', async () => {
      await openLogin(page, login, loader)
    })
    await allure.step('2. Fill username_30177a with QA_USERNAME from .env', async () => {
      await login.username30177a().fill(requiredEnv('QA_USERNAME'))
    })
    await allure.step('3. Fill password_53fc5f with the synthetic wrong password from test data AUTH-03-E1', async () => {
      await login.password53fc5f().fill(data.wrongPassword)
    })
    await allure.step("4. Click select_an_option_be0437, then choose the option 'Sierra Leone'", async () => {
      await login.selectCity(CITY)
      await expect(login.field28b6e46()).toHaveValue(CITY)
    })
    await allure.step('5. Click by_clicking_i_accept_the_410d00 to tick field_3_b57319', async () => {
      await login.byClickingIAcceptThe410d00().click()
      await expect(login.field3B57319()).toBeChecked()
    })
    await allure.step('6. Click continue_5f8c5f', async () => {
      const response = page.waitForResponse(r => isLoginResponse(r.url()))
      await login.continue5f8c5f().click()
      await response
    })

    await allure.step('Assert: url_pathname_is_workbench_ui_employee_user_login', async () => {
      await expectPathname(page, WorkbenchUiEmployeeUserLoginPage.PATH)
    })
    await allure.step('Assert: login_error_message_visible', async () => {
      await expect(login.errorToast()).toBeVisible()
      await expect(login.errorToast()).toHaveText(data.expectedError)
    })
    await allure.step('Assert: no_session_token_in_local_storage', async () => {
      expect(await sessionTokenKeys(page)).toEqual([])
    })
  })

  test('AUTH-03-E2: Allow a correct login after repeated wrong passwords (no lockout)', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await allure.tms(YAML_SOURCE + '#AUTH-03-E2', 'AUTH-03-E2')
    await allure.parameter('case_id', 'AUTH-03-E2')
    await allure.parameter('flow_id', 'AUTH-03')
    await allure.parameter('module', 'login')
    await allure.parameter('type', 'edge_case')
    await allure.parameter('priority', 'P1')
    await allure.parameter('test_data_ref', 'AUTH-03-E2')
    await allure.parameter('yaml_source', YAML_SOURCE)
    await allure.epic('login')
    await allure.feature('wrong_password_rejected')
    await allure.story('Allow a correct login after repeated wrong passwords (no lockout)')
    await allure.severity('normal')
    await allure.tag('regression')
    await allure.description('Verifies the confirmed no-lockout rule; no other case makes repeated failed attempts.\n\nSource: ' + YAML_SOURCE + '#AUTH-03-E2')

    // SIDE EFFECT: 5 failed logins on the shared test account. The team confirmed there is no lockout;
    // if this test fails, check the account is not locked before re-running other suites.
    const data = loadTestData<{ wrongPassword: string; attempts: number }>('AUTH-03-E2')
    const login = new WorkbenchUiEmployeeUserLoginPage(page)
    const loader = new HomePage(page)
    const workbench = new WorkbenchUiEmployeePage(page)

    /** Make sure city and consent are set (the form may or may not keep them after a failed attempt). */
    const ensureCityAndConsent = async () => {
      if ((await login.field28b6e46().inputValue()) !== CITY) await login.selectCity(CITY)
      if (!(await login.field3B57319().isChecked())) await login.byClickingIAcceptThe410d00().click()
      await expect(login.field3B57319()).toBeChecked()
    }

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
    })

    await allure.step('1. Open /workbench-ui/employee/user/login and wait for animation_1dcbe0 to be hidden', async () => {
      await openLogin(page, login, loader)
    })
    await allure.step('2. Repeat 5 times: fill username_30177a with QA_USERNAME, fill password_53fc5f with the wrong password from AUTH-03-E2, set the city to \'Sierra Leone\' via select_an_option_be0437, tick consent via by_clicking_i_accept_the_410d00 if unticked, click continue_5f8c5f, and wait for the error message', async () => {
      for (let attempt = 1; attempt <= data.attempts; attempt++) {
        await login.username30177a().fill(requiredEnv('QA_USERNAME'))
        await login.password53fc5f().fill(data.wrongPassword)
        await ensureCityAndConsent()
        const response = page.waitForResponse(r => isLoginResponse(r.url()))
        await login.continue5f8c5f().click()
        await response
        await expect(login.errorToast()).toBeVisible()
      }
    })
    await allure.step('3. Fill password_53fc5f with QA_PASSWORD from .env, make sure city and consent are still set, and click continue_5f8c5f', async () => {
      await login.username30177a().fill(requiredEnv('QA_USERNAME'))
      await fillPrivately(login.password53fc5f(), requiredEnv('QA_PASSWORD'))   // keeps the password out of report step titles
      await ensureCityAndConsent()
      await login.continue5f8c5f().click()
    })
    await allure.step('4. Wait for the URL to become /workbench-ui/employee', async () => {
      await expectPathname(page, WorkbenchUiEmployeePage.PATH)
      await waitForLoaderGone(loader.animation1dcbe0())
    })

    await allure.step('Assert: url_pathname_is_workbench_ui_employee', async () => {
      await expectPathname(page, WorkbenchUiEmployeePage.PATH)
    })
    await allure.step('Assert: commodity_management_card_visible', async () => {
      await expect(workbench.commodityManagement2ffe55().first()).toBeVisible()
    })
  })
})
