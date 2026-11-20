/**
 * AUTO-GENERATED — do not edit by hand.
 * Source:    tests/testcases/login/AUTH-10.yaml
 * Flow:      AUTH-10 — forgot_password_opens_reset_page
 * Contract:  ui-contract.json v1.3.0
 * Generator: /playwright-gen login AUTH-10
 */
import { test, expect } from '@playwright/test'
import * as allure from 'allure-js-commons'
import { WorkbenchUiEmployeeUserLoginPage } from '../../pages/WorkbenchUiEmployeeUserLoginPage.page'
import { HomePage } from '../../pages/HomePage.page'
import { expectPathname } from '../../helpers/routes'
import { installOverlayHandlers, waitForLoaderGone } from '../../helpers/app'

const BASE_URL = (process.env.QA_UI_BASE_URL || '').trim() || 'https://sierraleone-hcm.digit.org/workbench-ui/employee'   // .env QA_UI_BASE_URL normally supplies this
const YAML_SOURCE = 'tests/testcases/login/AUTH-10.yaml'

test.describe('AUTH-10 forgot_password_opens_reset_page', {
  tag: ['@AUTH-10', '@login', '@P1'],
}, () => {
  test.use({ storageState: { cookies: [], origins: [] } })

  test('AUTH-10-H1: Open the password-reset page from Forgot password? without submitting', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await allure.tms(YAML_SOURCE + '#AUTH-10-H1', 'AUTH-10-H1')
    await allure.parameter('case_id', 'AUTH-10-H1')
    await allure.parameter('flow_id', 'AUTH-10')
    await allure.parameter('module', 'login')
    await allure.parameter('type', 'happy_path')
    await allure.parameter('priority', 'P1')
    await allure.parameter('test_data_ref', 'AUTH-10-H1')
    await allure.parameter('yaml_source', YAML_SOURCE)
    await allure.epic('login')
    await allure.feature('forgot_password_opens_reset_page')
    await allure.story('Open the password-reset page from Forgot password? without submitting')
    await allure.severity('normal')
    await allure.tag('regression')
    await allure.description('Navigation to password reset; the reset path and its form are not in the contract (likely /workbench-ui/employee/user/forgot-password, to confirm on first run).\n\nSource: ' + YAML_SOURCE + '#AUTH-10-H1')

    const login = new WorkbenchUiEmployeeUserLoginPage(page)
    const loader = new HomePage(page)

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      // Navigation only: the reset form is never submitted (it may send a code to a real user).
    })

    await allure.step('1. Open /workbench-ui/employee/user/login and wait for animation_1dcbe0 to be hidden', async () => {
      await login.goto(BASE_URL)
      await expectPathname(page, WorkbenchUiEmployeeUserLoginPage.PATH)
      await waitForLoaderGone(loader.animation1dcbe0())
      // A cold load can take ~15 s, so allow 60 s for the form to render.
      await expect(login.forgotPassword54faff()).toBeVisible({ timeout: 60_000 })
    })
    await allure.step('2. Click forgot_password_54faff', async () => {
      await login.forgotPassword54faff().click()
    })
    await allure.step('3. Wait for the URL to change away from /workbench-ui/employee/user/login and for animation_1dcbe0 to be hidden', async () => {
      await expectPathname(page, WorkbenchUiEmployeeUserLoginPage.FORGOT_PASSWORD_PATH)
      await waitForLoaderGone(loader.animation1dcbe0())
    })

    await allure.step('Assert: url_pathname_is_forgot_password_page', async () => {
      // Path observed live on 2026-11-16 (contract gap: the reset page is not in the contract).
      await expectPathname(page, WorkbenchUiEmployeeUserLoginPage.FORGOT_PASSWORD_PATH)
    })
    await allure.step('Assert: login_form_not_visible', async () => {
      await expect(login.username30177a()).toBeHidden()
    })
  })
})
