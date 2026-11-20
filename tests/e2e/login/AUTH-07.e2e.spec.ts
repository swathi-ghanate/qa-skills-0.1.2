/**
 * AUTO-GENERATED — do not edit by hand.
 * Source:    tests/testcases/login/AUTH-07.yaml
 * Flow:      AUTH-07 — workbench_session_opens_complaint_pages
 * Contract:  ui-contract.json v1.3.0
 * Generator: /playwright-gen login AUTH-07
 * Auth:      default actor (admin) — the saved workbench-login session from global-setup.ts: localStorage applied by
 *            playwright.config.ts, DIGIT sessionStorage restored by restoreSavedSession().
 * Deferred:  rbac_checks AUTH-07-RBAC-1 (API-level, endpoint TBD) → /script-gen after `qa-kit api-scrape`.
 */
import { test, expect } from '@playwright/test'
import * as allure from 'allure-js-commons'
import { PaymentsUiEmployeePgrCreateComplaintPage } from '../../pages/PaymentsUiEmployeePgrCreateComplaintPage.page'
import { PaymentsUiEmployeePgrInboxV2Page } from '../../pages/PaymentsUiEmployeePgrInboxV2Page.page'
import { HomePage } from '../../pages/HomePage.page'
import { expectPathname } from '../../helpers/routes'
import { installOverlayHandlers, waitForLoaderGone, restoreSavedSession } from '../../helpers/app'

const BASE_URL = (process.env.QA_UI_BASE_URL || '').trim() || 'https://sierraleone-hcm.digit.org/workbench-ui/employee'   // .env QA_UI_BASE_URL normally supplies this
const YAML_SOURCE = 'tests/testcases/login/AUTH-07.yaml'

test.describe('AUTH-07 workbench_session_opens_complaint_pages', {
  tag: ['@AUTH-07', '@login', '@P1'],
}, () => {
  test('AUTH-07-H1: Open Create complaint with the workbench login session and no second login', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await allure.tms(YAML_SOURCE + '#AUTH-07-H1', 'AUTH-07-H1')
    await allure.parameter('case_id', 'AUTH-07-H1')
    await allure.parameter('flow_id', 'AUTH-07')
    await allure.parameter('module', 'login')
    await allure.parameter('type', 'happy_path')
    await allure.parameter('priority', 'P1')
    await allure.parameter('test_data_ref', 'AUTH-07-H1')
    await allure.parameter('yaml_source', YAML_SOURCE)
    await allure.epic('login')
    await allure.feature('workbench_session_opens_complaint_pages')
    await allure.story('Open Create complaint with the workbench login session and no second login')
    await allure.severity('normal')
    await allure.tag('regression')
    await allure.description('Proves the workbench login session works in the payments-ui app for an in-scope page, without using the payments-ui login. Read-only.\n\nSource: ' + YAML_SOURCE + '#AUTH-07-H1')

    const createComplaint = new PaymentsUiEmployeePgrCreateComplaintPage(page)
    const loader = new HomePage(page)

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      await restoreSavedSession(page)   // saved session = localStorage (config) + DIGIT sessionStorage (this helper)
    })

    await allure.step('1. Open /payments-ui/employee/pgr/create-complaint', async () => {
      await createComplaint.goto(BASE_URL)
    })
    await allure.step('2. Wait for animation_1dcbe0 to be hidden', async () => {
      await waitForLoaderGone(loader.animation1dcbe0())
    })

    await allure.step('Assert: url_pathname_is_payments_ui_employee_pgr_create_complaint', async () => {
      await expectPathname(page, PaymentsUiEmployeePgrCreateComplaintPage.PATH)
    })
    await allure.step('Assert: submit_button_visible', async () => {
      // The first payments-ui load is slow (separate app bundle), so allow 60 s.
      await expect(createComplaint.submitB6846a()).toBeVisible({ timeout: 60_000 })
    })
  })

  test('AUTH-07-H2: Open the complaints inbox with the workbench login session and no second login', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await allure.tms(YAML_SOURCE + '#AUTH-07-H2', 'AUTH-07-H2')
    await allure.parameter('case_id', 'AUTH-07-H2')
    await allure.parameter('flow_id', 'AUTH-07')
    await allure.parameter('module', 'login')
    await allure.parameter('type', 'happy_path')
    await allure.parameter('priority', 'P1')
    await allure.parameter('test_data_ref', 'AUTH-07-H2')
    await allure.parameter('yaml_source', YAML_SOURCE)
    await allure.epic('login')
    await allure.feature('workbench_session_opens_complaint_pages')
    await allure.story('Open the complaints inbox with the workbench login session and no second login')
    await allure.severity('normal')
    await allure.tag('regression')
    await allure.description('Second in-scope complaint page; a different page component from H1, so a session problem specific to the inbox is caught.\n\nSource: ' + YAML_SOURCE + '#AUTH-07-H2')

    const inbox = new PaymentsUiEmployeePgrInboxV2Page(page)

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      await restoreSavedSession(page)   // saved session = localStorage (config) + DIGIT sessionStorage (this helper)
    })

    await allure.step('1. Open /payments-ui/employee/pgr/inbox-v2', async () => {
      await inbox.goto(BASE_URL)
    })
    await allure.step('2. Wait for animation_1dcbe0 to be hidden', async () => {
      await waitForLoaderGone(inbox.animation1dcbe0())
    })

    await allure.step('Assert: url_pathname_is_payments_ui_employee_pgr_inbox_v2', async () => {
      await expectPathname(page, PaymentsUiEmployeePgrInboxV2Page.PATH)
    })
    await allure.step('Assert: complaint_number_field_visible', async () => {
      await expect(inbox.complaintnumber7836f5()).toBeVisible({ timeout: 60_000 })
    })
  })
})
