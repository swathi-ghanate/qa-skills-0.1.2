/**
 * AUTO-GENERATED — do not edit by hand.
 * Source:    tests/testcases/user-management/USR-10.yaml
 * Flow:      USR-10 — create_test_user
 * Contract:  ui-contract.json v1.3.0 (+ live capture 2026-11-16 and 2026-11-18, for contract gaps)
 * Generator: /playwright-gen user-management
 * Auth:      default actor (admin) — saved workbench-login session (localStorage via playwright.config.ts).
 * Here:      USR-10-E1 only. USR-10-H1 starts the one-user-per-run lifecycle (decided 2026-11-18), so it lives in
 *            USR-lifecycle.e2e.spec.ts with the cases that act on its user.
 * E1:        submits the test account's own username. Observed 2026-11-18: after the confirm dialog the app checks the
 *            username itself, shows "Username exists" and sends no create request. A synthetic mobile number is used so
 *            the form's mobile check passes first (see helpers/users.ts).
 * Safety:    _create and _update requests are aborted, so even a broken check cannot create a duplicate user; the
 *            no_create_request_sent assertion reports any attempt.
 * Deferred:  rbac_checks USR-10-RBAC-1 (API-level) → /script-gen after `qa-kit api-scrape`.
 */
import { test, expect } from '@playwright/test'
import * as allure from 'allure-js-commons'
import { PaymentsUiEmployeeHrmsCreatePage } from '../../pages/PaymentsUiEmployeeHrmsCreatePage.page'
import { expectPathname } from '../../helpers/routes'
import { installOverlayHandlers, blockWriteRequests, loadTestData, fillPrivately } from '../../helpers/app'
import {
  type TestUserData, requireTeamAnswers, openCreateUser, fillRequiredFieldsExceptMobile, syntheticMobile, submitAndConfirm, envOrValue,
} from '../../helpers/users'

const BASE_URL = (process.env.QA_UI_BASE_URL || '').trim() || 'https://sierraleone-hcm.digit.org/workbench-ui/employee'   // .env QA_UI_BASE_URL normally supplies this
const YAML_SOURCE = 'tests/testcases/user-management/USR-10.yaml'

test.describe('USR-10 create_test_user', {
  tag: ['@USR-10', '@user-management', '@P0'],
}, () => {
  test('USR-10-E1: Reject a new user whose username already exists', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await allure.tms(YAML_SOURCE + '#USR-10-E1', 'USR-10-E1')
    await allure.parameter('case_id', 'USR-10-E1')
    await allure.parameter('flow_id', 'USR-10')
    await allure.parameter('module', 'user-management')
    await allure.parameter('type', 'negative')
    await allure.parameter('priority', 'P1')
    await allure.parameter('test_data_ref', 'USR-10-E1')
    await allure.parameter('yaml_source', YAML_SOURCE)
    await allure.epic('user-management')
    await allure.feature('create_test_user')
    await allure.story('Reject a new user whose username already exists')
    await allure.severity('normal')
    await allure.tag('regression')
    await allure.description('Uniqueness of usernames; H1 always uses a new username.\n\nSource: ' + YAML_SOURCE + '#USR-10-E1')

    const data = loadTestData<TestUserData & { username: string }>('USR-10-E1')
    let form!: PaymentsUiEmployeeHrmsCreatePage
    let blockedWrites: string[] = []

    await allure.step('Precondition: start state', async () => {
      requireTeamAnswers({ 'the role for test users (test data "role")': data.role })
      await installOverlayHandlers(page)
      blockedWrites = await blockWriteRequests(page)   // a duplicate must never be created, even if the check fails
    })

    await allure.step('1. Open /payments-ui/employee/hrms/create, wait for animation_1dcbe0 to be hidden, choose ADMIN_KAMBIA in the Hierarchy type dropdown and click Next', async () => {
      form = await openCreateUser(page, BASE_URL)
    })
    await allure.step('2. Fill Username (#hrms-create-hr_emp_id_label) with QA_USERNAME from .env', async () => {
      await form.username().fill(envOrValue(data.username))
    })
    await allure.step('3. Fill every other required field as in steps 3-8 of USR-10-H1 (test data USR-10-E1, generated password, synthetic mobile number)', async () => {
      await fillRequiredFieldsExceptMobile(form, data)
      await fillPrivately(form.mobileNumber(), syntheticMobile())
    })
    await allure.step('4. Wait for Submit to be enabled', async () => {
      await expect(form.submit()).toBeEnabled({ timeout: 15_000 })
    })
    await allure.step('5. Click Submit and confirm the "Ready to Submit ?" dialog (a new synthetic number is tried if the mobile number already exists)', async () => {
      await submitAndConfirm(form)
    })

    await allure.step('Assert: duplicate_username_error_visible', async () => {
      await expect(form.usernameTakenToast()).toBeVisible({ timeout: 15_000 })
    })
    await allure.step('Assert: no_create_request_sent', async () => {
      expect(blockedWrites.filter(p => /_create$/.test(p)), 'create requests attempted').toEqual([])
    })
    await allure.step('Assert: still_on_create_user_page', async () => {
      await expectPathname(page, PaymentsUiEmployeeHrmsCreatePage.PATH)
    })
  })
})
