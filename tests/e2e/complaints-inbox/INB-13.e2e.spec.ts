/**
 * AUTO-GENERATED — do not edit by hand.
 * Source:    tests/testcases/complaints-inbox/INB-13.yaml
 * Flow:      INB-13 — logged_out_inbox
 * Contract:  ui-contract.json v1.3.0 (scraped 2026-11-20; the details page is not in the contract)
 * Generator: /playwright-gen complaints-inbox
 * Auth:      anonymous — runs with an EMPTY storageState (no saved session). Only the redirect is asserted; the
 *            payments-ui login page is never used (workbench login only).
 * Deferred:  rbac_checks INB-13-RBAC-1 (POST /inbox/v2/_search without a token → 401), API-level → /script-gen.
 *            AUTH-07-RBAC-1 targets the same API with a TBD endpoint (propose updating or retiring it).
 */
import { test, expect } from '@playwright/test'
import * as allure from 'allure-js-commons'
import { PaymentsUiEmployeePgrInboxV2Page } from '../../pages/PaymentsUiEmployeePgrInboxV2Page.page'
import { PaymentsUiEmployeePgrComplaintDetailsPage } from '../../pages/PaymentsUiEmployeePgrComplaintDetailsPage.page'
import { installOverlayHandlers, loadTestData } from '../../helpers/app'
import { expectPathname, expectPathnameNot, urlFor } from '../../helpers/routes'
import { traceCase } from '../../helpers/traceability'

const BASE_URL = (process.env.QA_UI_BASE_URL || '').trim() || 'https://sierraleone-hcm.digit.org/workbench-ui/employee'   // .env QA_UI_BASE_URL normally supplies this
const YAML_SOURCE = 'tests/testcases/complaints-inbox/INB-13.yaml'
const FLOW = { yamlSource: YAML_SOURCE, module: 'complaints-inbox', flowId: 'INB-13', flowName: 'logged_out_inbox' } as const

test.describe('INB-13 logged_out_inbox', {
  tag: ['@INB-13', '@complaints-inbox', '@P0'],
}, () => {
  test.use({ storageState: { cookies: [], origins: [] } })   // logged-out visitor: never the saved session

  test('INB-13-H1: Redirect a logged-out visitor away from the complaints inbox', {
    tag: ['@smoke', '@regression'],
  }, async ({ page }) => {
    await traceCase({
      ...FLOW, caseId: 'INB-13-H1', type: 'happy_path', priority: 'P0', tags: ['smoke', 'regression'], testDataRef: 'INB-13-H1',
      title: 'Redirect a logged-out visitor away from the complaints inbox',
      coverageNote: 'Login protection of the inbox page; CMP-09 and USR-12 cover other payments-ui pages.',
    })
    const inbox = new PaymentsUiEmployeePgrInboxV2Page(page)

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
    })

    await allure.step('1. Open /payments-ui/employee/pgr/inbox-v2', async () => {
      await inbox.goto(BASE_URL)
    })
    await allure.step('2. Wait for the URL pathname to change away from /payments-ui/employee/pgr/inbox-v2', async () => {
      await expectPathnameNot(page, PaymentsUiEmployeePgrInboxV2Page.PATH, 60_000)
    })

    await allure.step('Assert: url_pathname_is_payments_ui_employee_user_login', async () => {
      await expectPathname(page, PaymentsUiEmployeePgrInboxV2Page.LOGGED_OUT_REDIRECT_PATH)
    })
    await allure.step('Assert: complaint_number_field_not_present', async () => {
      await expect(inbox.complaintnumber7836f5()).toHaveCount(0)
    })
  })

  test("INB-13-H2: Redirect a logged-out visitor away from a complaint's details page", {
    tag: ['@smoke', '@regression'],
  }, async ({ page }) => {
    await traceCase({
      ...FLOW, caseId: 'INB-13-H2', type: 'happy_path', priority: 'P0', tags: ['smoke', 'regression'], testDataRef: 'INB-13-H2',
      title: "Redirect a logged-out visitor away from a complaint's details page",
      coverageNote: "Login protection of the complaint details page, which holds the complainant's name and number.",
    })
    const data = loadTestData<{ complaintNumber: string }>('INB-13-H2')
    const details = new PaymentsUiEmployeePgrComplaintDetailsPage(page)
    const detailsPath = PaymentsUiEmployeePgrComplaintDetailsPage.pathFor(data.complaintNumber)

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
    })

    await allure.step('1. Open /payments-ui/employee/pgr/complaint-details/<the QA-TEST complaint number from test data INB-13-H2>', async () => {
      await page.goto(urlFor(BASE_URL, detailsPath))
    })
    await allure.step('2. Wait for the URL pathname to change away from the complaint-details path', async () => {
      await expectPathnameNot(page, detailsPath, 60_000)
    })

    await allure.step('Assert: url_pathname_is_payments_ui_employee_user_login', async () => {
      await expectPathname(page, PaymentsUiEmployeePgrInboxV2Page.LOGGED_OUT_REDIRECT_PATH)
    })
    await allure.step('Assert: take_action_button_not_present', async () => {
      await expect(details.takeAction()).toHaveCount(0)
    })
  })
})
