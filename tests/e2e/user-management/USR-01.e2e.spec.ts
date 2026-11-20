/**
 * AUTO-GENERATED — do not edit by hand.
 * Source:    tests/testcases/user-management/USR-01.yaml
 * Flow:      USR-01 — open_search_user_from_home
 * Contract:  ui-contract.json v1.3.0 (+ live capture 2026-11-16, re-verified 2026-11-18, for contract gaps)
 * Generator: /playwright-gen user-management
 * Auth:      default actor (admin) — saved workbench-login session (localStorage via playwright.config.ts,
 *            DIGIT sessionStorage rebuilt by restoreSavedSession()).
 * Safety:    read-only; every _create/_update request is aborted.
 * Deferred:  rbac_checks USR-01-RBAC-1 (API-level) → /script-gen after `qa-kit api-scrape`.
 */
import { test, expect } from '@playwright/test'
import * as allure from 'allure-js-commons'
import { WorkbenchUiEmployeePage } from '../../pages/WorkbenchUiEmployeePage.page'
import { PaymentsUiEmployeeHrmsInboxPage } from '../../pages/PaymentsUiEmployeeHrmsInboxPage.page'
import { HomePage } from '../../pages/HomePage.page'
import { expectPathname } from '../../helpers/routes'
import { installOverlayHandlers, waitForLoaderGone, restoreSavedSession, blockWriteRequests, loadTestData } from '../../helpers/app'

const BASE_URL = (process.env.QA_UI_BASE_URL || '').trim() || 'https://sierraleone-hcm.digit.org/workbench-ui/employee'   // .env QA_UI_BASE_URL normally supplies this
const YAML_SOURCE = 'tests/testcases/user-management/USR-01.yaml'

test.describe('USR-01 open_search_user_from_home', {
  tag: ['@USR-01', '@user-management', '@P0'],
}, () => {
  test('USR-01-H1: Open Search user from the User management card on the workbench home', {
    tag: ['@smoke', '@regression'],
  }, async ({ page }) => {
    await allure.tms(YAML_SOURCE + '#USR-01-H1', 'USR-01-H1')
    await allure.parameter('case_id', 'USR-01-H1')
    await allure.parameter('flow_id', 'USR-01')
    await allure.parameter('module', 'user-management')
    await allure.parameter('type', 'happy_path')
    await allure.parameter('priority', 'P0')
    await allure.parameter('test_data_ref', 'USR-01-H1')
    await allure.parameter('yaml_source', YAML_SOURCE)
    await allure.epic('user-management')
    await allure.feature('open_search_user_from_home')
    await allure.story('Open Search user from the User management card on the workbench home')
    await allure.severity('critical')
    await allure.tag('smoke')
    await allure.tag('regression')
    await allure.description('The real user path into Search user (home card, payments-ui app switch, hierarchy step); nothing else covers the entry.\n\nSource: ' + YAML_SOURCE + '#USR-01-H1')

    const data = loadTestData<{ hierarchyType: string; tableHeaders: string[] }>('USR-01-H1')
    const workbench = new WorkbenchUiEmployeePage(page)
    const inbox = new PaymentsUiEmployeeHrmsInboxPage(page)
    const loader = new HomePage(page)

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      await restoreSavedSession(page)   // the workbench home needs the DIGIT sessionStorage too
      await blockWriteRequests(page)    // read-only case: no user can be created or changed
    })

    await allure.step('1. Open /workbench-ui/employee and wait for animation_1dcbe0 to be hidden', async () => {
      await workbench.goto(BASE_URL)
      await waitForLoaderGone(loader.animation1dcbe0())
    })
    await allure.step('2. Wait for search_user_8a67fa to be visible', async () => {
      await expect(workbench.searchUser8a67fa()).toBeVisible({ timeout: 60_000 })
    })
    await allure.step('3. Click search_user_8a67fa', async () => {
      await workbench.searchUser8a67fa().click()
    })
    await allure.step('4. Wait for the URL pathname to be /payments-ui/employee/hrms/inbox and for animation_1dcbe0 to be hidden', async () => {
      await expectPathname(page, PaymentsUiEmployeeHrmsInboxPage.PATH)
      await waitForLoaderGone(loader.animation1dcbe0())
    })
    await allure.step('5. Choose ADMIN_KAMBIA in the Hierarchy type dropdown and click Next (contract gap: hierarchy step captured live)', async () => {
      await inbox.hierarchy.pass(data.hierarchyType)
      await waitForLoaderGone(loader.animation1dcbe0())
    })

    await allure.step('Assert: url_pathname_is_payments_ui_employee_hrms_inbox', async () => {
      await expectPathname(page, PaymentsUiEmployeeHrmsInboxPage.PATH)
    })
    await allure.step('Assert: search_fields_visible', async () => {
      // The payments-ui app is a separate bundle; its first load is slow, so allow 60 s.
      await expect(inbox.employeeName()).toBeVisible({ timeout: 60_000 })
      await expect(inbox.username()).toBeVisible()
      await expect(inbox.mobileNumber()).toBeVisible()
    })
    await allure.step('Assert: results_table_headers_shown', async () => {
      await expect(inbox.columnHeaders()).toHaveText(data.tableHeaders, { timeout: 60_000 })
    })
  })
})
