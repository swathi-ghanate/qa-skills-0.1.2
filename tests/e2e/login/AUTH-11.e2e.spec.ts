/**
 * AUTO-GENERATED — do not edit by hand.
 * Source:    tests/testcases/login/AUTH-11.yaml
 * Flow:      AUTH-11 — privacy_consent_and_policy
 * Contract:  ui-contract.json v1.3.0
 * Generator: /playwright-gen login AUTH-11
 */
import { test, expect, type Page } from '@playwright/test'
import * as allure from 'allure-js-commons'
import { WorkbenchUiEmployeeUserLoginPage } from '../../pages/WorkbenchUiEmployeeUserLoginPage.page'
import { HomePage } from '../../pages/HomePage.page'
import { expectPathname } from '../../helpers/routes'
import { installOverlayHandlers, waitForLoaderGone } from '../../helpers/app'

const BASE_URL = (process.env.QA_UI_BASE_URL || '').trim() || 'https://sierraleone-hcm.digit.org/workbench-ui/employee'   // .env QA_UI_BASE_URL normally supplies this
const YAML_SOURCE = 'tests/testcases/login/AUTH-11.yaml'

async function openLogin(page: Page, login: WorkbenchUiEmployeeUserLoginPage, loader: HomePage): Promise<void> {
  await login.goto(BASE_URL)
  await expectPathname(page, WorkbenchUiEmployeeUserLoginPage.PATH)
  await waitForLoaderGone(loader.animation1dcbe0())
  // A cold load can take ~15 s, so allow 60 s for the form to render.
  await expect(login.username30177a()).toBeVisible({ timeout: 60_000 })
}

test.describe('AUTH-11 privacy_consent_and_policy', {
  tag: ['@AUTH-11', '@login', '@P1'],
}, () => {
  test.use({ storageState: { cookies: [], origins: [] } })

  test('AUTH-11-H1: Tick the privacy consent by clicking its label, with nothing opening', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await allure.tms(YAML_SOURCE + '#AUTH-11-H1', 'AUTH-11-H1')
    await allure.parameter('case_id', 'AUTH-11-H1')
    await allure.parameter('flow_id', 'AUTH-11')
    await allure.parameter('module', 'login')
    await allure.parameter('type', 'happy_path')
    await allure.parameter('priority', 'P1')
    await allure.parameter('test_data_ref', 'AUTH-11-H1')
    await allure.parameter('yaml_source', YAML_SOURCE)
    await allure.epic('login')
    await allure.feature('privacy_consent_and_policy')
    await allure.story('Tick the privacy consent by clicking its label, with nothing opening')
    await allure.severity('normal')
    await allure.tag('regression')
    await allure.description('Team confirmed on 2026-11-16 that this control is just a checkbox and opens nothing.\n\nSource: ' + YAML_SOURCE + '#AUTH-11-H1')

    const login = new WorkbenchUiEmployeeUserLoginPage(page)
    const loader = new HomePage(page)

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
    })

    await allure.step('1. Open /workbench-ui/employee/user/login and wait for animation_1dcbe0 to be hidden', async () => {
      await openLogin(page, login, loader)
    })
    await allure.step('2. Click by_clicking_i_accept_the_410d00', async () => {
      await login.byClickingIAcceptThe410d00().click()
    })

    await allure.step('Assert: consent_checkbox_checked', async () => {
      await expect(login.field3B57319()).toBeChecked()
    })
    await allure.step('Assert: no_dialog_opened', async () => {
      await expect(login.privacyNoticePopup()).toHaveCount(0)
      await expect(page.getByRole('dialog')).toHaveCount(0)
    })
    await allure.step('Assert: url_pathname_is_workbench_ui_employee_user_login', async () => {
      await expectPathname(page, WorkbenchUiEmployeeUserLoginPage.PATH)
    })
  })

  test('AUTH-11-H2: Untick the privacy consent by clicking its label again', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await allure.tms(YAML_SOURCE + '#AUTH-11-H2', 'AUTH-11-H2')
    await allure.parameter('case_id', 'AUTH-11-H2')
    await allure.parameter('flow_id', 'AUTH-11')
    await allure.parameter('module', 'login')
    await allure.parameter('type', 'happy_path')
    await allure.parameter('priority', 'P2')
    await allure.parameter('test_data_ref', 'AUTH-11-H2')
    await allure.parameter('yaml_source', YAML_SOURCE)
    await allure.epic('login')
    await allure.feature('privacy_consent_and_policy')
    await allure.story('Untick the privacy consent by clicking its label again')
    await allure.severity('minor')
    await allure.tag('regression')
    await allure.description('Toggle back to unchecked; AUTH-02-E4 checks the effect on Continue, this checks the checkbox itself.\n\nSource: ' + YAML_SOURCE + '#AUTH-11-H2')

    const login = new WorkbenchUiEmployeeUserLoginPage(page)
    const loader = new HomePage(page)

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
    })

    await allure.step('1. Open /workbench-ui/employee/user/login and wait for animation_1dcbe0 to be hidden', async () => {
      await openLogin(page, login, loader)
    })
    await allure.step('2. Click by_clicking_i_accept_the_410d00 and wait for field_3_b57319 to be checked', async () => {
      await login.byClickingIAcceptThe410d00().click()
      await expect(login.field3B57319()).toBeChecked()
    })
    await allure.step('3. Click by_clicking_i_accept_the_410d00 again', async () => {
      await login.byClickingIAcceptThe410d00().click()
    })

    await allure.step('Assert: consent_checkbox_unchecked', async () => {
      await expect(login.field3B57319()).not.toBeChecked()
    })
  })

  test('AUTH-11-H3: Open the Privacy Policy from the login form', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await allure.tms(YAML_SOURCE + '#AUTH-11-H3', 'AUTH-11-H3')
    await allure.parameter('case_id', 'AUTH-11-H3')
    await allure.parameter('flow_id', 'AUTH-11')
    await allure.parameter('module', 'login')
    await allure.parameter('type', 'happy_path')
    await allure.parameter('priority', 'P1')
    await allure.parameter('test_data_ref', 'AUTH-11-H3')
    await allure.parameter('yaml_source', YAML_SOURCE)
    await allure.epic('login')
    await allure.feature('privacy_consent_and_policy')
    await allure.story('Open the Privacy Policy from the login form')
    await allure.severity('normal')
    await allure.tag('regression')
    await allure.description('The policy itself; its content and close/accept controls are not in the contract (capture selector on first run).\n\nSource: ' + YAML_SOURCE + '#AUTH-11-H3')

    const login = new WorkbenchUiEmployeeUserLoginPage(page)
    const loader = new HomePage(page)

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
    })

    await allure.step('1. Open /workbench-ui/employee/user/login and wait for animation_1dcbe0 to be hidden', async () => {
      await openLogin(page, login, loader)
    })
    await allure.step('2. Click privacy_policy_29eb8b', async () => {
      await login.privacyPolicy29eb8b().click()
    })

    await allure.step('Assert: privacy_policy_content_visible', async () => {
      // Popup observed live on 2026-11-16 (contract gap): ".digit-popup-overlay" titled "Privacy Notice".
      await expect(login.privacyNoticePopup()).toBeVisible()
      await expect(login.privacyNoticePopup()).toContainText('Privacy Notice')
    })
  })
})
