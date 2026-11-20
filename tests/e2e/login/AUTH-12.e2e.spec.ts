/**
 * AUTO-GENERATED — do not edit by hand.
 * Source:    tests/testcases/login/AUTH-12.yaml
 * Flow:      AUTH-12 — login_banner_carousel
 * Contract:  ui-contract.json v1.3.0
 * Generator: /playwright-gen login AUTH-12
 */
import { test, expect } from '@playwright/test'
import * as allure from 'allure-js-commons'
import { WorkbenchUiEmployeeUserLoginPage } from '../../pages/WorkbenchUiEmployeeUserLoginPage.page'
import { HomePage } from '../../pages/HomePage.page'
import { expectPathname } from '../../helpers/routes'
import { installOverlayHandlers, waitForLoaderGone, collectPageErrors } from '../../helpers/app'

const BASE_URL = (process.env.QA_UI_BASE_URL || '').trim() || 'https://sierraleone-hcm.digit.org/workbench-ui/employee'   // .env QA_UI_BASE_URL normally supplies this
const YAML_SOURCE = 'tests/testcases/login/AUTH-12.yaml'

test.describe('AUTH-12 login_banner_carousel', {
  tag: ['@AUTH-12', '@login', '@P2'],
}, () => {
  test.use({ storageState: { cookies: [], origins: [] } })

  test('AUTH-12-H1: Move the login banner carousel forward and back without errors', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await allure.tms(YAML_SOURCE + '#AUTH-12-H1', 'AUTH-12-H1')
    await allure.parameter('case_id', 'AUTH-12-H1')
    await allure.parameter('flow_id', 'AUTH-12')
    await allure.parameter('module', 'login')
    await allure.parameter('type', 'happy_path')
    await allure.parameter('priority', 'P2')
    await allure.parameter('test_data_ref', 'AUTH-12-H1')
    await allure.parameter('yaml_source', YAML_SOURCE)
    await allure.epic('login')
    await allure.feature('login_banner_carousel')
    await allure.story('Move the login banner carousel forward and back without errors')
    await allure.severity('minor')
    await allure.tag('regression')
    await allure.description('Smoke-level check of the carousel controls; all slides share the same text, so slide changes need a visual or manual check.\n\nSource: ' + YAML_SOURCE + '#AUTH-12-H1')

    const login = new WorkbenchUiEmployeeUserLoginPage(page)
    const loader = new HomePage(page)
    let errors: string[] = []

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      errors = collectPageErrors(page)
    })

    await allure.step('1. Open /workbench-ui/employee/user/login and wait for animation_1dcbe0 to be hidden', async () => {
      await login.goto(BASE_URL)
      await expectPathname(page, WorkbenchUiEmployeeUserLoginPage.PATH)
      await waitForLoaderGone(loader.animation1dcbe0())
      // A cold load can take ~15 s, so allow 60 s for the carousel to render.
      await expect(login.navigationButton9c123c()).toBeVisible({ timeout: 60_000 })
    })
    await allure.step('2. Click navigation_button_9c123c (next)', async () => {
      await login.navigationButton9c123c().click()
    })
    await allure.step('3. Click navigation_button_b3a210 (previous)', async () => {
      await login.navigationButtonB3a210().click()
    })

    await allure.step('Assert: url_pathname_is_workbench_ui_employee_user_login', async () => {
      await expectPathname(page, WorkbenchUiEmployeeUserLoginPage.PATH)
    })
    await allure.step('Assert: no_console_errors', async () => {
      expect(errors, 'uncaught page errors or console.error during the test').toEqual([])
    })
    await allure.step('Assert: username_field_visible', async () => {
      await expect(login.username30177a()).toBeVisible()
    })
  })
})
