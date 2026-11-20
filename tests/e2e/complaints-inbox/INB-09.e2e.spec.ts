/**
 * AUTO-GENERATED — do not edit by hand.
 * Source:    tests/testcases/complaints-inbox/INB-09.yaml
 * Flow:      INB-09 — open_complaint_details
 * Contract:  ui-contract.json v1.3.0 (the details page is NOT in the contract; verified live, read-only, 2026-11-20)
 * Generator: /playwright-gen complaints-inbox
 * Auth:      default actor (admin) — saved workbench-login session (playwright.config.ts) + restoreSavedSession().
 * Safety:    read-only; every request that is not a read is aborted (blockNonReadRequests).
 * Privacy:   only QA-TEST complaints are opened, and only after checking the single result link is that number;
 *            labels and our own complaint number are asserted, never the complainant's name or number.
 * Deferred:  rbac_checks INB-09-RBAC-1 (pgr-services request/_search) and INB-09-RBAC-2 (egov-wf process/_search),
 *            API-level → /script-gen.
 */
import { test, expect, type Response } from '@playwright/test'
import * as allure from 'allure-js-commons'
import { PaymentsUiEmployeePgrInboxV2Page } from '../../pages/PaymentsUiEmployeePgrInboxV2Page.page'
import { PaymentsUiEmployeePgrComplaintDetailsPage } from '../../pages/PaymentsUiEmployeePgrComplaintDetailsPage.page'
import { installOverlayHandlers, blockNonReadRequests, waitForLoaderGone, loadTestData } from '../../helpers/app'
import { expectPathname } from '../../helpers/routes'
import { openInbox, clickAndSearch, clickOnlyComplaintLink, openQaComplaint } from '../../helpers/inbox'
import { traceCase } from '../../helpers/traceability'

const BASE_URL = (process.env.QA_UI_BASE_URL || '').trim() || 'https://sierraleone-hcm.digit.org/workbench-ui/employee'   // .env QA_UI_BASE_URL normally supplies this
const YAML_SOURCE = 'tests/testcases/complaints-inbox/INB-09.yaml'
const FLOW = { yamlSource: YAML_SOURCE, module: 'complaints-inbox', flowId: 'INB-09', flowName: 'open_complaint_details' } as const

type DetailsData = { complaintNumber: string; heading: string; labels: string[] }

test.describe('INB-09 open_complaint_details', {
  tag: ['@INB-09', '@complaints-inbox', '@P0'],
}, () => {
  test("INB-09-H1: Open a QA-TEST complaint's details page from its search result", {
    tag: ['@smoke', '@regression'],
  }, async ({ page }) => {
    await traceCase({
      ...FLOW, caseId: 'INB-09-H1', type: 'happy_path', priority: 'P0', tags: ['smoke', 'regression'], testDataRef: 'INB-09-H1',
      title: "Open a QA-TEST complaint's details page from its search result",
      coverageNote: "The only case that opens a complaint; it checks labels and our own complaint number, never the complainant's details.",
    })
    const data = loadTestData<DetailsData>('INB-09-H1')
    const inbox = new PaymentsUiEmployeePgrInboxV2Page(page)
    const details = new PaymentsUiEmployeePgrComplaintDetailsPage(page)
    let complaintLoaded!: Promise<Response>

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      await blockNonReadRequests(page)
    })

    await allure.step('1. Open /payments-ui/employee/pgr/inbox-v2, wait for animation_1dcbe0 to be hidden and for the first results column header, up to 90 s', async () => {
      await openInbox(page, BASE_URL)
    })
    await allure.step('2. Fill complaintnumber_7836f5 with the QA-TEST complaint number from test data INB-09-H1, click Search and wait for exactly 1 result row', async () => {
      await inbox.complaintnumber7836f5().fill(data.complaintNumber)
      await clickAndSearch(page, () => inbox.search().click())
      await expect(inbox.resultRows()).toHaveCount(1)
    })
    await allure.step("3. Check that the row link (contract gap: a[href*='/pgr/complaint-details/'] filtered by the number) shows exactly that number, then click it", async () => {
      complaintLoaded = page.waitForResponse(r => PaymentsUiEmployeePgrComplaintDetailsPage.COMPLAINT_SEARCH_API_RE.test(r.url()), { timeout: 60_000 })
      await clickOnlyComplaintLink(page, data.complaintNumber)
    })
    await allure.step('4. Wait for the URL pathname to be /payments-ui/employee/pgr/complaint-details/<number>, for animation_1dcbe0 to be hidden and for the POST /pgr-services/v2/request/_search response', async () => {
      await expectPathname(page, PaymentsUiEmployeePgrComplaintDetailsPage.pathFor(data.complaintNumber), 60_000)
      await waitForLoaderGone(inbox.animation1dcbe0())
      expect((await complaintLoaded).status()).toBe(200)
    })

    await allure.step('Assert: url_pathname_is_complaint_details_of_searched_number', async () => {
      await expectPathname(page, PaymentsUiEmployeePgrComplaintDetailsPage.pathFor(data.complaintNumber))
    })
    await allure.step('Assert: complaint_details_heading_visible', async () => {
      await expect(details.heading()).toHaveText(data.heading)
    })
    await allure.step('Assert: details_labels_match_test_data', async () => {
      await expect(details.labels()).toHaveText(data.labels)
    })
    await allure.step('Assert: details_complaint_number_value_is_searched_number', async () => {
      await expect(details.value('Complaint Number')).toHaveText(data.complaintNumber)
    })
    await allure.step('Assert: take_action_button_visible', async () => {
      await expect(details.takeAction()).toBeVisible()
    })
    await allure.step('Assert: view_more_button_visible', async () => {
      await expect(details.viewMore()).toBeVisible()
    })
  })

  test('INB-09-H2: Return to the inbox from a complaint through the PGR Inbox breadcrumb', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await traceCase({
      ...FLOW, caseId: 'INB-09-H2', type: 'happy_path', priority: 'P1', tags: ['regression'], testDataRef: 'INB-09-H2',
      title: 'Return to the inbox from a complaint through the PGR Inbox breadcrumb',
      coverageNote: 'Navigation back from the details page; H1 only goes forward.',
    })
    const data = loadTestData<{ complaintNumber: string }>('INB-09-H2')
    const inbox = new PaymentsUiEmployeePgrInboxV2Page(page)
    let details!: PaymentsUiEmployeePgrComplaintDetailsPage

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      await blockNonReadRequests(page)
    })

    await allure.step('1. Open the QA-TEST complaint from test data INB-09-H2 as in steps 1-4 of INB-09-H1', async () => {
      details = await openQaComplaint(page, BASE_URL, data.complaintNumber)
    })
    await allure.step("2. Click the PGR Inbox breadcrumb (contract gap: getByRole('link', { name: 'PGR Inbox' }), href /payments-ui/employee/pgr/inbox-v2)", async () => {
      await details.pgrInboxBreadcrumb().click()
    })
    await allure.step('3. Wait for the URL pathname to be /payments-ui/employee/pgr/inbox-v2 and for animation_1dcbe0 to be hidden', async () => {
      await expectPathname(page, PaymentsUiEmployeePgrInboxV2Page.PATH, 60_000)
      await waitForLoaderGone(inbox.animation1dcbe0())
    })

    await allure.step('Assert: url_pathname_is_payments_ui_employee_pgr_inbox_v2', async () => {
      await expectPathname(page, PaymentsUiEmployeePgrInboxV2Page.PATH)
    })
    await allure.step('Assert: complaint_number_field_visible', async () => {
      await expect(inbox.complaintnumber7836f5()).toBeVisible()
    })
  })
})
