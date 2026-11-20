/**
 * AUTO-GENERATED — do not edit by hand.
 * Source:    tests/testcases/complaints-inbox/INB-12.yaml
 * Flow:      INB-12 — inbox_links
 * Contract:  ui-contract.json v1.3.0 (scraped 2026-11-20)
 * Generator: /playwright-gen complaints-inbox
 * Auth:      default actor (admin) — saved workbench-login session (playwright.config.ts) + restoreSavedSession().
 * Safety:    read-only; every request that is not a read is aborted (blockNonReadRequests), so no complaint is created.
 * Note:      payments_ui_employee (ui_pages) gets no page object: its contract elements are all stale and the case
 *            asserts only the landing path (PAYMENTS_HOME_PATH, as in CMP-10-H1).
 * Deferred:  rbac — the inbox search API check is INB-13-RBAC-1 (→ /script-gen).
 */
import { test, expect } from '@playwright/test'
import * as allure from 'allure-js-commons'
import { PaymentsUiEmployeePgrInboxV2Page } from '../../pages/PaymentsUiEmployeePgrInboxV2Page.page'
import { PaymentsUiEmployeePgrCreateComplaintPage } from '../../pages/PaymentsUiEmployeePgrCreateComplaintPage.page'
import { installOverlayHandlers, blockNonReadRequests, restoreSavedSession, waitForLoaderGone } from '../../helpers/app'
import { expectPathname, expectPathnameNot, expectPathnameStartsWith } from '../../helpers/routes'
import { traceCase } from '../../helpers/traceability'

const BASE_URL = (process.env.QA_UI_BASE_URL || '').trim() || 'https://sierraleone-hcm.digit.org/workbench-ui/employee'   // .env QA_UI_BASE_URL normally supplies this
const YAML_SOURCE = 'tests/testcases/complaints-inbox/INB-12.yaml'
const FLOW = { yamlSource: YAML_SOURCE, module: 'complaints-inbox', flowId: 'INB-12', flowName: 'inbox_links' } as const
const OPEN_STEP = '1. Open /payments-ui/employee/pgr/inbox-v2 and wait for animation_1dcbe0 to be hidden'

test.describe('INB-12 inbox_links', {
  tag: ['@INB-12', '@complaints-inbox', '@P1'],
}, () => {
  test("INB-12-H1: Open Create complaint from the inbox's New Complaint link", {
    tag: ['@regression'],
  }, async ({ page }) => {
    await traceCase({
      ...FLOW, caseId: 'INB-12-H1', type: 'happy_path', priority: 'P1', tags: ['regression'], testDataRef: 'INB-12-H1',
      title: "Open Create complaint from the inbox's New Complaint link",
      coverageNote: 'A new way into Create complaint (from the inbox); CMP-01-H1 and AUTH-07-H1 reach it from the home card and by URL. The form is never filled.',
    })
    const inbox = new PaymentsUiEmployeePgrInboxV2Page(page)
    const form = new PaymentsUiEmployeePgrCreateComplaintPage(page)

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      await blockNonReadRequests(page)
      await restoreSavedSession(page)
    })

    await allure.step(OPEN_STEP, async () => {
      await inbox.goto(BASE_URL)
      await waitForLoaderGone(inbox.animation1dcbe0())
    })
    await allure.step('2. Click new_complaint_bc0fc8', async () => {
      await inbox.newComplaintBc0fc8().click()
    })
    await allure.step('3. Wait for the URL pathname to be /payments-ui/employee/pgr/create-complaint and for animation_1dcbe0 to be hidden', async () => {
      await expectPathname(page, PaymentsUiEmployeePgrCreateComplaintPage.PATH, 60_000)
      await waitForLoaderGone(inbox.animation1dcbe0())
    })

    await allure.step('Assert: url_pathname_is_payments_ui_employee_pgr_create_complaint', async () => {
      await expectPathname(page, PaymentsUiEmployeePgrCreateComplaintPage.PATH)
    })
    await allure.step('Assert: complaint_date_field_visible', async () => {
      await expect(form.complaintdate8ac55d()).toBeVisible({ timeout: 30_000 })
    })
  })

  test('INB-12-H2: Leave the inbox through the breadcrumb Home link', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await traceCase({
      ...FLOW, caseId: 'INB-12-H2', type: 'happy_path', priority: 'P1', tags: ['regression'], testDataRef: 'INB-12-H2',
      title: 'Leave the inbox through the breadcrumb Home link',
      coverageNote: 'Same link (home_b6873d) as CMP-10-H1 but from the inbox instead of Create complaint, so the starting state differs.',
    })
    const inbox = new PaymentsUiEmployeePgrInboxV2Page(page)

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      await blockNonReadRequests(page)
      await restoreSavedSession(page)
    })

    await allure.step(OPEN_STEP, async () => {
      await inbox.goto(BASE_URL)
      await waitForLoaderGone(inbox.animation1dcbe0())
    })
    await allure.step('2. Click home_b6873d (breadcrumb Home)', async () => {
      await inbox.homeB6873d().click()
    })
    await allure.step('3. Wait for the URL pathname to change away from /payments-ui/employee/pgr/inbox-v2', async () => {
      await expectPathnameNot(page, PaymentsUiEmployeePgrInboxV2Page.PATH, 60_000)
    })

    await allure.step('Assert: url_pathname_starts_with_payments_ui_employee', async () => {
      await expectPathnameStartsWith(page, PaymentsUiEmployeePgrInboxV2Page.PAYMENTS_HOME_PATH)
    })
    await allure.step('Assert: complaint_number_field_not_present', async () => {
      await expect(inbox.complaintnumber7836f5()).toHaveCount(0)
    })
  })
})
