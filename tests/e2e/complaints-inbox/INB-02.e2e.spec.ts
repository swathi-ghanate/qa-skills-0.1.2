/**
 * AUTO-GENERATED — do not edit by hand.
 * Source:    tests/testcases/complaints-inbox/INB-02.yaml
 * Flow:      INB-02 — search_by_complaint_number
 * Contract:  ui-contract.json v1.3.0 (scraped 2026-11-20; contract gaps verified live, read-only, 2026-11-20)
 * Generator: /playwright-gen complaints-inbox
 * Auth:      default actor (admin) — saved workbench-login session (playwright.config.ts) + restoreSavedSession().
 * Safety:    read-only; every request that is not a read is aborted (blockNonReadRequests).
 * Privacy:   only QA-TEST complaint numbers are searched; other rows are counted, never read.
 * Hand-off:  INB-02-H2 searches the newest complaint CMP-08 recorded in .qa/run-state/created-complaints.json (in a
 *            full run complaints/ runs before complaints-inbox/, so it is the one created earlier in the same run;
 *            run alone, it is the one from the last CMP-08 run), or QA_INBOX_COMPLAINT_NUMBER.
 * Deferred:  rbac — the inbox search API check is INB-13-RBAC-1 (→ /script-gen).
 */
import { test, expect, type Response } from '@playwright/test'
import * as allure from 'allure-js-commons'
import { PaymentsUiEmployeePgrInboxV2Page } from '../../pages/PaymentsUiEmployeePgrInboxV2Page.page'
import { installOverlayHandlers, blockNonReadRequests, loadTestData } from '../../helpers/app'
import { openInbox, clickAndSearch, clickAndMaybeSearch, inboxSearchBody, filterFields, latestCreatedComplaint } from '../../helpers/inbox'
import { traceCase } from '../../helpers/traceability'

const BASE_URL = (process.env.QA_UI_BASE_URL || '').trim() || 'https://sierraleone-hcm.digit.org/workbench-ui/employee'   // .env QA_UI_BASE_URL normally supplies this
const YAML_SOURCE = 'tests/testcases/complaints-inbox/INB-02.yaml'
const FLOW = { yamlSource: YAML_SOURCE, module: 'complaints-inbox', flowId: 'INB-02', flowName: 'search_by_complaint_number' } as const
const OPEN_STEP = '1. Open /payments-ui/employee/pgr/inbox-v2, wait for animation_1dcbe0 to be hidden and for the first results column header, up to 90 s'

test.describe('INB-02 search_by_complaint_number', {
  tag: ['@INB-02', '@complaints-inbox', '@P0'],
}, () => {
  test('INB-02-H1: Find exactly one complaint when searching a QA-TEST complaint number', {
    tag: ['@smoke', '@regression'],
  }, async ({ page }) => {
    await traceCase({
      ...FLOW, caseId: 'INB-02-H1', type: 'happy_path', priority: 'P0', tags: ['smoke', 'regression'], testDataRef: 'INB-02-H1',
      title: 'Find exactly one complaint when searching a QA-TEST complaint number',
      coverageNote: 'Main search path of the inbox, on a fixed QA-TEST complaint; no other case searches by complaint number.',
    })
    const data = loadTestData<{ complaintNumber: string }>('INB-02-H1')
    const inbox = new PaymentsUiEmployeePgrInboxV2Page(page)
    let search!: Response

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      await blockNonReadRequests(page)
    })

    await allure.step(OPEN_STEP, async () => {
      await openInbox(page, BASE_URL)
    })
    await allure.step('2. Fill complaintnumber_7836f5 with the complaint number from test data INB-02-H1', async () => {
      await inbox.complaintnumber7836f5().fill(data.complaintNumber)
    })
    await allure.step("3. Click Search (contract gap: getByRole('button', { name: 'Search', exact: true })) and wait for the POST /inbox/v2/_search response", async () => {
      search = await clickAndSearch(page, () => inbox.search().click())
      expect(search.status()).toBe(200)
    })

    await allure.step('Assert: search_request_has_complaint_number', async () => {
      expect(inboxSearchBody(search).inbox?.moduleSearchCriteria?.complaintNumber).toBe(data.complaintNumber)
    })
    await allure.step('Assert: exactly_one_result_row', async () => {
      await expect(inbox.resultRows()).toHaveCount(1)
    })
    await allure.step('Assert: result_link_is_searched_complaint_number', async () => {
      await expect(inbox.complaintLinks()).toHaveText([data.complaintNumber])
    })
  })

  test('INB-02-H2: Find the complaint that CMP-08 created earlier in the same run', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await traceCase({
      ...FLOW, caseId: 'INB-02-H2', type: 'happy_path', priority: 'P1', tags: ['regression'], testDataRef: 'INB-02-H2',
      title: 'Find the complaint that CMP-08 created earlier in the same run',
      coverageNote: 'Cross-module check that a newly filed complaint reaches the inbox; kept out of CMP-08 itself so an inbox defect cannot fail the create test.',
    })
    const data = loadTestData<{ expectedStatus: string }>('INB-02-H2')
    const inbox = new PaymentsUiEmployeePgrInboxV2Page(page)
    let complaintNumber = ''

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      await blockNonReadRequests(page)
    })

    await allure.step('1. Take the complaint number created by CMP-08-H1 in this run', async () => {
      const created = latestCreatedComplaint()
      complaintNumber = created.complaintNumber
      await allure.parameter('complaint_number', complaintNumber)
      await allure.parameter('created_by', `${created.caseId} at ${created.createdAt}`)
    })
    await allure.step('2. Open /payments-ui/employee/pgr/inbox-v2, wait for animation_1dcbe0 to be hidden and for the first results column header, up to 90 s', async () => {
      await openInbox(page, BASE_URL)
    })
    await allure.step('3. Fill complaintnumber_7836f5 with that complaint number', async () => {
      await inbox.complaintnumber7836f5().fill(complaintNumber)
    })
    await allure.step('4. Click Search and wait for the POST /inbox/v2/_search response', async () => {
      const search = await clickAndSearch(page, () => inbox.search().click())
      expect(search.status()).toBe(200)
    })

    await allure.step('Assert: exactly_one_result_row', async () => {
      await expect(inbox.resultRows()).toHaveCount(1)
    })
    await allure.step('Assert: result_link_is_searched_complaint_number', async () => {
      await expect(inbox.complaintLinks()).toHaveText([complaintNumber])
    })
    await allure.step('Assert: result_status_matches_test_data', async () => {
      await expect(await inbox.firstRowCell('Current Status')).toHaveText(data.expectedStatus)
    })
  })

  test('INB-02-E1: Show no complaints for a complaint number that does not exist', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await traceCase({
      ...FLOW, caseId: 'INB-02-E1', type: 'negative', priority: 'P1', tags: ['regression'], testDataRef: 'INB-02-E1',
      title: 'Show no complaints for a complaint number that does not exist',
      coverageNote: 'Empty-result partition of the complaint number search; H1/H2 only cover a number that exists.',
    })
    const data = loadTestData<{ complaintNumber: string }>('INB-02-E1')
    const inbox = new PaymentsUiEmployeePgrInboxV2Page(page)

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      await blockNonReadRequests(page)
    })

    await allure.step(OPEN_STEP, async () => {
      await openInbox(page, BASE_URL)
    })
    await allure.step('2. Fill complaintnumber_7836f5 with the non-existent number from test data INB-02-E1', async () => {
      await inbox.complaintnumber7836f5().fill(data.complaintNumber)
    })
    await allure.step('3. Click Search and wait for the POST /inbox/v2/_search response', async () => {
      const search = await clickAndSearch(page, () => inbox.search().click())
      expect(search.status()).toBe(200)
      await allure.parameter('search_filter_fields', filterFields(inboxSearchBody(search)).join(', ') || '(none)')
    })

    await allure.step('Assert: result_rows_zero', async () => {
      await expect(inbox.resultRows()).toHaveCount(0)
    })
    await allure.step('Assert: no_results_message_visible', async () => {
      await expect(inbox.noResults()).toBeVisible()
    })
  })

  test('INB-02-E2: Keep the default list without an error when searching with every search field empty', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await traceCase({
      ...FLOW, caseId: 'INB-02-E2', type: 'edge_case', priority: 'P1', tags: ['regression'], testDataRef: 'INB-02-E2',
      title: 'Keep the default list without an error when searching with every search field empty',
      coverageNote: 'Empty-input partition of the search card, not listed in the plan; mirrors USR-04-H2 on a different page.',
    })
    const inbox = new PaymentsUiEmployeePgrInboxV2Page(page)

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      await blockNonReadRequests(page)
    })

    await allure.step(OPEN_STEP, async () => {
      await openInbox(page, BASE_URL)
    })
    await allure.step('2. Leave complaintnumber_7836f5, mobilenumber_c51cd9 and the Date Range empty', async () => {
      await expect(inbox.complaintnumber7836f5()).toHaveValue('')
      await expect(inbox.mobilenumberC51cd9()).toHaveValue('')
      await expect(inbox.field22ab45f()).toHaveValue('')
    })
    await allure.step('3. Click Search', async () => {
      const search = await clickAndMaybeSearch(page, () => inbox.search().click())
      await allure.parameter('search_request_sent', search ? 'yes' : 'no')
    })

    await allure.step('Assert: result_rows_between_1_and_10', async () => {
      await expect(inbox.resultRows().first()).toBeVisible()
      const rows = await inbox.resultRows().count()
      expect(rows).toBeGreaterThanOrEqual(1)
      expect(rows).toBeLessThanOrEqual(10)
    })
    await allure.step('Assert: no_error_message_shown', async () => {
      await expect(page.locator('[class*="error-message"]:visible, [class*="toast"][class*="error"]:visible, [role="alert"]:visible')).toHaveCount(0)
    })
  })
})
