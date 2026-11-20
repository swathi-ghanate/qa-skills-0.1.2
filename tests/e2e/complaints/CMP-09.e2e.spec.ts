/**
 * AUTO-GENERATED — do not edit by hand.
 * Source:    tests/testcases/complaints/CMP-09.yaml
 * Flow:      CMP-09 — logged_out_cannot_open_create_complaint
 * Contract:  ui-contract.json v1.3.0
 * Generator: /playwright-gen complaints
 * Auth:      unauthenticated — fresh context with no stored session. Only the redirect is asserted; the
 *            payments-ui login is never used (workbench login only).
 * Deferred:  rbac_checks CMP-09-RBAC-1 (API-level, endpoint TBD) → /script-gen after `qa-kit api-scrape`.
 */
import { test, expect } from '@playwright/test'
import * as allure from 'allure-js-commons'
import { PaymentsUiEmployeePgrCreateComplaintPage } from '../../pages/PaymentsUiEmployeePgrCreateComplaintPage.page'
import { expectPathname, expectPathnameNot } from '../../helpers/routes'
import { installOverlayHandlers } from '../../helpers/app'

const BASE_URL = (process.env.QA_UI_BASE_URL || '').trim() || 'https://sierraleone-hcm.digit.org/workbench-ui/employee'   // .env QA_UI_BASE_URL normally supplies this
const YAML_SOURCE = 'tests/testcases/complaints/CMP-09.yaml'

test.describe('CMP-09 logged_out_cannot_open_create_complaint', {
  tag: ['@CMP-09', '@complaints', '@P0'],
}, () => {
  test.use({ storageState: { cookies: [], origins: [] } })

  test('CMP-09-H1: Redirect a logged-out visitor away from Create complaint', {
    tag: ['@smoke', '@regression'],
  }, async ({ page }) => {
    await allure.tms(YAML_SOURCE + '#CMP-09-H1', 'CMP-09-H1')
    await allure.parameter('case_id', 'CMP-09-H1')
    await allure.parameter('flow_id', 'CMP-09')
    await allure.parameter('module', 'complaints')
    await allure.parameter('type', 'happy_path')
    await allure.parameter('priority', 'P0')
    await allure.parameter('test_data_ref', 'CMP-09-H1')
    await allure.parameter('yaml_source', YAML_SOURCE)
    await allure.epic('complaints')
    await allure.feature('logged_out_cannot_open_create_complaint')
    await allure.story('Redirect a logged-out visitor away from Create complaint')
    await allure.severity('critical')
    await allure.tag('smoke')
    await allure.tag('regression')
    await allure.description('Route protection for the complaint form (is_protected: true); AUTH-05 covers workbench pages only.\n\nSource: ' + YAML_SOURCE + '#CMP-09-H1')

    const form = new PaymentsUiEmployeePgrCreateComplaintPage(page)

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
    })

    await allure.step('1. Open /payments-ui/employee/pgr/create-complaint', async () => {
      await form.goto(BASE_URL)
    })
    await allure.step('2. Wait for the URL pathname to change away from /payments-ui/employee/pgr/create-complaint', async () => {
      await expectPathnameNot(page, PaymentsUiEmployeePgrCreateComplaintPage.PATH, 60_000)
    })

    await allure.step('Assert: url_pathname_is_payments_ui_employee_user_login', async () => {
      await expectPathname(page, PaymentsUiEmployeePgrCreateComplaintPage.LOGGED_OUT_REDIRECT_PATH)
    })
    await allure.step('Assert: complaint_type_field_not_present', async () => {
      await expect(form.field09988fc()).toHaveCount(0)
    })
  })
})
