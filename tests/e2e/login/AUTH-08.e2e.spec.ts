/**
 * AUTO-GENERATED — do not edit by hand.
 * Source:    tests/testcases/login/AUTH-08.yaml
 * Flow:      AUTH-08 — session_survives_reload
 * Contract:  ui-contract.json v1.3.0
 * Generator: /playwright-gen login AUTH-08
 * Auth:      default actor (admin) — the saved workbench-login session from global-setup.ts: localStorage applied by
 *            playwright.config.ts, DIGIT sessionStorage restored by restoreSavedSession().
 * Deferred:  rbac_checks AUTH-08-RBAC-1 (API-level, endpoint TBD) → /script-gen after `qa-kit api-scrape`.
 */
import { test, expect } from '@playwright/test'
import * as allure from 'allure-js-commons'
import { WorkbenchUiEmployeePage } from '../../pages/WorkbenchUiEmployeePage.page'
import { HomePage } from '../../pages/HomePage.page'
import { expectPathname } from '../../helpers/routes'
import { installOverlayHandlers, waitForLoaderGone, restoreSavedSession } from '../../helpers/app'

const BASE_URL = (process.env.QA_UI_BASE_URL || '').trim() || 'https://sierraleone-hcm.digit.org/workbench-ui/employee'   // .env QA_UI_BASE_URL normally supplies this
const YAML_SOURCE = 'tests/testcases/login/AUTH-08.yaml'

test.describe('AUTH-08 session_survives_reload', {
  tag: ['@AUTH-08', '@login', '@P1'],
}, () => {
  test('AUTH-08-H1: Stay logged in after reloading the workbench home', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await allure.tms(YAML_SOURCE + '#AUTH-08-H1', 'AUTH-08-H1')
    await allure.parameter('case_id', 'AUTH-08-H1')
    await allure.parameter('flow_id', 'AUTH-08')
    await allure.parameter('module', 'login')
    await allure.parameter('type', 'happy_path')
    await allure.parameter('priority', 'P1')
    await allure.parameter('test_data_ref', 'AUTH-08-H1')
    await allure.parameter('yaml_source', YAML_SOURCE)
    await allure.epic('login')
    await allure.feature('session_survives_reload')
    await allure.story('Stay logged in after reloading the workbench home')
    await allure.severity('normal')
    await allure.tag('regression')
    await allure.description('The localStorage session survives a full SPA reload, which no other case exercises.\n\nSource: ' + YAML_SOURCE + '#AUTH-08-H1')

    const workbench = new WorkbenchUiEmployeePage(page)
    const loader = new HomePage(page)

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      await restoreSavedSession(page)   // saved session = localStorage (config) + DIGIT sessionStorage (this helper)
    })

    await allure.step('1. Open /workbench-ui/employee and wait for animation_1dcbe0 to be hidden', async () => {
      await workbench.goto(BASE_URL)
      await waitForLoaderGone(loader.animation1dcbe0())
    })
    await allure.step('2. Wait for commodity_management_2ffe55 to be visible', async () => {
      // A cold load can take ~15 s, so allow 60 s.
      await expect(workbench.commodityManagement2ffe55().first()).toBeVisible({ timeout: 60_000 })
    })
    await allure.step('3. Reload the page', async () => {
      await page.reload()
    })
    await allure.step('4. Wait for animation_1dcbe0 to be hidden', async () => {
      await waitForLoaderGone(loader.animation1dcbe0())
    })

    await allure.step('Assert: url_pathname_is_workbench_ui_employee', async () => {
      await expectPathname(page, WorkbenchUiEmployeePage.PATH)
    })
    await allure.step('Assert: commodity_management_card_visible', async () => {
      await expect(workbench.commodityManagement2ffe55().first()).toBeVisible({ timeout: 60_000 })
    })
  })
})
