/**
 * AUTO-GENERATED — do not edit by hand.
 * Source:    tests/testcases/user-management/USR-12.yaml
 * Flow:      USR-12 — logged_out_cannot_open_user_pages
 * Contract:  ui-contract.json v1.3.0 (+ live capture 2026-11-18)
 * Generator: /playwright-gen user-management
 * Auth:      unauthenticated — fresh context with no stored session. Only the redirect is asserted; the
 *            payments-ui login is never used (workbench login only).
 * Deferred:  rbac_checks USR-12-RBAC-1 (API-level) → /script-gen after `qa-kit api-scrape`.
 */
import { test, expect } from '@playwright/test'
import * as allure from 'allure-js-commons'
import { PaymentsUiEmployeeHrmsInboxPage } from '../../pages/PaymentsUiEmployeeHrmsInboxPage.page'
import { PaymentsUiEmployeeHrmsCreatePage } from '../../pages/PaymentsUiEmployeeHrmsCreatePage.page'
import { expectPathname, expectPathnameNot } from '../../helpers/routes'
import { installOverlayHandlers } from '../../helpers/app'

const BASE_URL = (process.env.QA_UI_BASE_URL || '').trim() || 'https://sierraleone-hcm.digit.org/workbench-ui/employee'   // .env QA_UI_BASE_URL normally supplies this
const YAML_SOURCE = 'tests/testcases/user-management/USR-12.yaml'

test.describe('USR-12 logged_out_cannot_open_user_pages', {
  tag: ['@USR-12', '@user-management', '@P0'],
}, () => {
  test.use({ storageState: { cookies: [], origins: [] } })

  test('USR-12-H1: Redirect a logged-out visitor away from Search user', {
    tag: ['@smoke', '@regression'],
  }, async ({ page }) => {
    await allure.tms(YAML_SOURCE + '#USR-12-H1', 'USR-12-H1')
    await allure.parameter('case_id', 'USR-12-H1')
    await allure.parameter('flow_id', 'USR-12')
    await allure.parameter('module', 'user-management')
    await allure.parameter('type', 'happy_path')
    await allure.parameter('priority', 'P0')
    await allure.parameter('test_data_ref', 'USR-12-H1')
    await allure.parameter('yaml_source', YAML_SOURCE)
    await allure.epic('user-management')
    await allure.feature('logged_out_cannot_open_user_pages')
    await allure.story('Redirect a logged-out visitor away from Search user')
    await allure.severity('critical')
    await allure.tag('smoke')
    await allure.tag('regression')
    await allure.description('Route protection for the user list; the contract marks the page is_protected false only because it is an unexplored stub.\n\nSource: ' + YAML_SOURCE + '#USR-12-H1')

    const inbox = new PaymentsUiEmployeeHrmsInboxPage(page)

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
    })

    await allure.step('1. Open /payments-ui/employee/hrms/inbox', async () => {
      await inbox.goto(BASE_URL)
    })
    await allure.step('2. Wait for the URL pathname to change away from /payments-ui/employee/hrms/inbox', async () => {
      await expectPathnameNot(page, PaymentsUiEmployeeHrmsInboxPage.PATH, 60_000)
    })

    await allure.step('Assert: url_pathname_is_payments_ui_employee_user_login', async () => {
      await expectPathname(page, PaymentsUiEmployeeHrmsInboxPage.LOGGED_OUT_REDIRECT_PATH)
    })
    await allure.step('Assert: search_fields_not_present', async () => {
      await expect(inbox.username()).toHaveCount(0)
      await expect(inbox.employeeName()).toHaveCount(0)
    })
  })

  test('USR-12-H2: Redirect a logged-out visitor away from Create user', {
    tag: ['@smoke', '@regression'],
  }, async ({ page }) => {
    await allure.tms(YAML_SOURCE + '#USR-12-H2', 'USR-12-H2')
    await allure.parameter('case_id', 'USR-12-H2')
    await allure.parameter('flow_id', 'USR-12')
    await allure.parameter('module', 'user-management')
    await allure.parameter('type', 'happy_path')
    await allure.parameter('priority', 'P0')
    await allure.parameter('test_data_ref', 'USR-12-H2')
    await allure.parameter('yaml_source', YAML_SOURCE)
    await allure.epic('user-management')
    await allure.feature('logged_out_cannot_open_user_pages')
    await allure.story('Redirect a logged-out visitor away from Create user')
    await allure.severity('critical')
    await allure.tag('smoke')
    await allure.tag('regression')
    await allure.description('Route protection for user creation, a different page from H1.\n\nSource: ' + YAML_SOURCE + '#USR-12-H2')

    const form = new PaymentsUiEmployeeHrmsCreatePage(page)

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
    })

    await allure.step('1. Open /payments-ui/employee/hrms/create', async () => {
      await form.goto(BASE_URL)
    })
    await allure.step('2. Wait for the URL pathname to change away from /payments-ui/employee/hrms/create', async () => {
      await expectPathnameNot(page, PaymentsUiEmployeeHrmsCreatePage.PATH, 60_000)
    })

    await allure.step('Assert: url_pathname_is_payments_ui_employee_user_login', async () => {
      await expectPathname(page, PaymentsUiEmployeeHrmsInboxPage.LOGGED_OUT_REDIRECT_PATH)
    })
    await allure.step('Assert: create_form_not_present', async () => {
      await expect(form.username()).toHaveCount(0)
      await expect(form.submit()).toHaveCount(0)
    })
  })
})
