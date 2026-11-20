/**
 * AUTO-GENERATED — do not edit by hand.
 * Source:    tests/testcases/login/AUTH-09.yaml
 * Flow:      AUTH-09 — password_visibility_toggle
 * Contract:  ui-contract.json v1.3.0
 * Generator: /playwright-gen login AUTH-09
 */
import { test, expect, type Page } from '@playwright/test'
import * as allure from 'allure-js-commons'
import { WorkbenchUiEmployeeUserLoginPage } from '../../pages/WorkbenchUiEmployeeUserLoginPage.page'
import { HomePage } from '../../pages/HomePage.page'
import { expectPathname } from '../../helpers/routes'
import { installOverlayHandlers, waitForLoaderGone, loadTestData, effectiveInputType } from '../../helpers/app'

const BASE_URL = (process.env.QA_UI_BASE_URL || '').trim() || 'https://sierraleone-hcm.digit.org/workbench-ui/employee'   // .env QA_UI_BASE_URL normally supplies this
const YAML_SOURCE = 'tests/testcases/login/AUTH-09.yaml'

async function openLogin(page: Page, login: WorkbenchUiEmployeeUserLoginPage, loader: HomePage): Promise<void> {
  await login.goto(BASE_URL)
  await expectPathname(page, WorkbenchUiEmployeeUserLoginPage.PATH)
  await waitForLoaderGone(loader.animation1dcbe0())
  // A cold load can take ~15 s, so allow 60 s for the form to render.
  await expect(login.username30177a()).toBeVisible({ timeout: 60_000 })
}

test.describe('AUTH-09 password_visibility_toggle', {
  tag: ['@AUTH-09', '@login', '@P2'],
}, () => {
  test.use({ storageState: { cookies: [], origins: [] } })

  test('AUTH-09-H1: Show the password when Visibility is clicked', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await allure.tms(YAML_SOURCE + '#AUTH-09-H1', 'AUTH-09-H1')
    await allure.parameter('case_id', 'AUTH-09-H1')
    await allure.parameter('flow_id', 'AUTH-09')
    await allure.parameter('module', 'login')
    await allure.parameter('type', 'happy_path')
    await allure.parameter('priority', 'P2')
    await allure.parameter('test_data_ref', 'AUTH-09-H1')
    await allure.parameter('yaml_source', YAML_SOURCE)
    await allure.epic('login')
    await allure.feature('password_visibility_toggle')
    await allure.story('Show the password when Visibility is clicked')
    await allure.severity('minor')
    await allure.tag('regression')
    await allure.description('Reveal state of the toggle.\n\nSource: ' + YAML_SOURCE + '#AUTH-09-H1')

    // Synthetic value only: the real password must never appear in traces or screenshots.
    const data = loadTestData<{ password: string }>('AUTH-09-H1')
    const login = new WorkbenchUiEmployeeUserLoginPage(page)
    const loader = new HomePage(page)

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
    })

    await allure.step('1. Open /workbench-ui/employee/user/login and wait for animation_1dcbe0 to be hidden', async () => {
      await openLogin(page, login, loader)
    })
    await allure.step('2. Fill password_53fc5f with the synthetic value from AUTH-09-H1', async () => {
      await login.password53fc5f().fill(data.password)
      await expect(login.password53fc5f()).toHaveAttribute('type', 'password')
    })
    await allure.step('3. Click visibility_0fd527', async () => {
      await login.visibility0fd527().click()
    })

    await allure.step('Assert: password_field_type_is_text', async () => {
      // The app sets type="passwordToText" (not "text"); browsers render an unknown type as text, so assert the
      // effective type (DOM property) the user sees, not the raw attribute. Observed live on 2026-11-16.
      await expect.poll(() => effectiveInputType(login.password53fc5f())).toBe('text')
    })
  })

  test('AUTH-09-H2: Hide the password again when Visibility is clicked a second time', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await allure.tms(YAML_SOURCE + '#AUTH-09-H2', 'AUTH-09-H2')
    await allure.parameter('case_id', 'AUTH-09-H2')
    await allure.parameter('flow_id', 'AUTH-09')
    await allure.parameter('module', 'login')
    await allure.parameter('type', 'happy_path')
    await allure.parameter('priority', 'P2')
    await allure.parameter('test_data_ref', 'AUTH-09-H2')
    await allure.parameter('yaml_source', YAML_SOURCE)
    await allure.epic('login')
    await allure.feature('password_visibility_toggle')
    await allure.story('Hide the password again when Visibility is clicked a second time')
    await allure.severity('minor')
    await allure.tag('regression')
    await allure.description('Hide transition back to masked; H1 only covers reveal.\n\nSource: ' + YAML_SOURCE + '#AUTH-09-H2')

    const data = loadTestData<{ password: string }>('AUTH-09-H2')
    const login = new WorkbenchUiEmployeeUserLoginPage(page)
    const loader = new HomePage(page)

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
    })

    await allure.step('1. Open /workbench-ui/employee/user/login and wait for animation_1dcbe0 to be hidden', async () => {
      await openLogin(page, login, loader)
    })
    await allure.step('2. Fill password_53fc5f with the synthetic value from AUTH-09-H2', async () => {
      await login.password53fc5f().fill(data.password)
    })
    await allure.step('3. Click visibility_0fd527 and wait for password_53fc5f to have type text', async () => {
      await login.visibility0fd527().click()
      await expect.poll(() => effectiveInputType(login.password53fc5f())).toBe('text')
    })
    await allure.step('4. Click the Visibility Off toggle (visibility_0fd527 is renamed Visibility Off once the password is shown; contract gap)', async () => {
      await login.visibilityOff().click()
    })

    await allure.step('Assert: password_field_type_is_password', async () => {
      await expect(login.password53fc5f()).toHaveAttribute('type', 'password')
    })
  })
})
