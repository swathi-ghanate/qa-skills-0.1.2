/**
 * AUTO-GENERATED — do not edit by hand.
 * Source:    tests/testcases/login/AUTH-04.yaml
 * Flow:      AUTH-04 — unknown_username_rejected
 * Contract:  ui-contract.json v1.3.0
 * Generator: /playwright-gen login AUTH-04
 */
import { test, expect } from '@playwright/test'
import * as allure from 'allure-js-commons'
import { WorkbenchUiEmployeeUserLoginPage } from '../../pages/WorkbenchUiEmployeeUserLoginPage.page'
import { HomePage } from '../../pages/HomePage.page'
import { expectPathname } from '../../helpers/routes'
import { installOverlayHandlers, waitForLoaderGone, loadTestData, sessionTokenKeys } from '../../helpers/app'

const BASE_URL = (process.env.QA_UI_BASE_URL || '').trim() || 'https://sierraleone-hcm.digit.org/workbench-ui/employee'   // .env QA_UI_BASE_URL normally supplies this
const YAML_SOURCE = 'tests/testcases/login/AUTH-04.yaml'
const CITY = 'Sierra Leone'
const isLoginResponse = (url: string) => /\/user\/oauth\/token/.test(url)

test.describe('AUTH-04 unknown_username_rejected', {
  tag: ['@AUTH-04', '@login', '@P1'],
}, () => {
  test.use({ storageState: { cookies: [], origins: [] } })

  test('AUTH-04-E1: Reject an unknown username with the same message as a wrong password', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await allure.tms(YAML_SOURCE + '#AUTH-04-E1', 'AUTH-04-E1')
    await allure.parameter('case_id', 'AUTH-04-E1')
    await allure.parameter('flow_id', 'AUTH-04')
    await allure.parameter('module', 'login')
    await allure.parameter('type', 'negative')
    await allure.parameter('priority', 'P1')
    await allure.parameter('test_data_ref', 'AUTH-04-E1')
    await allure.parameter('yaml_source', YAML_SOURCE)
    await allure.epic('login')
    await allure.feature('unknown_username_rejected')
    await allure.story('Reject an unknown username with the same message as a wrong password')
    await allure.severity('normal')
    await allure.tag('regression')
    await allure.description('Unknown-account partition; the team confirmed the message is the same as for a wrong password, so the app does not reveal which usernames exist.\n\nSource: ' + YAML_SOURCE + '#AUTH-04-E1')

    const data = loadTestData<{ username: string; password: string; expectedError: string }>('AUTH-04-E1')
    const wrongPasswordMessage = loadTestData<{ expectedError: string }>('AUTH-03-E1').expectedError
    const login = new WorkbenchUiEmployeeUserLoginPage(page)
    const loader = new HomePage(page)

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
    })

    await allure.step('1. Open /workbench-ui/employee/user/login and wait for animation_1dcbe0 to be hidden', async () => {
      await login.goto(BASE_URL)
      await expectPathname(page, WorkbenchUiEmployeeUserLoginPage.PATH)
      await waitForLoaderGone(loader.animation1dcbe0())
      // A cold load can take ~15 s, so allow 60 s for the form to render.
      await expect(login.username30177a()).toBeVisible({ timeout: 60_000 })
    })
    await allure.step('2. Fill username_30177a with the synthetic unknown username from test data AUTH-04-E1', async () => {
      await login.username30177a().fill(data.username)
    })
    await allure.step('3. Fill password_53fc5f with the synthetic password from test data AUTH-04-E1', async () => {
      await login.password53fc5f().fill(data.password)
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
    await allure.step('Assert: login_error_message_same_as_wrong_password', async () => {
      await expect(login.errorToast()).toHaveText(wrongPasswordMessage)
    })
    await allure.step('Assert: no_session_token_in_local_storage', async () => {
      expect(await sessionTokenKeys(page)).toEqual([])
    })
  })
})
