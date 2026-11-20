/**
 * AUTO-GENERATED — do not edit by hand.
 * Source:    tests/testcases/complaints-inbox/INB-03.yaml
 * Flow:      INB-03 — search_by_mobile_number
 * Contract:  ui-contract.json v1.3.0 (scraped 2026-11-20; contract gaps verified live, read-only, 2026-11-20)
 * Generator: /playwright-gen complaints-inbox
 * Auth:      default actor (admin) — saved workbench-login session (playwright.config.ts) + restoreSavedSession().
 * Safety:    read-only; every request that is not a read is aborted (blockNonReadRequests).
 * Privacy:   QA_COMPLAINANT_MOBILE (team-owned) is filled with fillPrivately and never logged; it lists only
 *            QA-TEST complaints. Rows are counted, never read.
 * Deferred:  rbac — the inbox search API check is INB-13-RBAC-1 (→ /script-gen).
 */
import { test, expect, type Response } from '@playwright/test'
import * as allure from 'allure-js-commons'
import { PaymentsUiEmployeePgrInboxV2Page } from '../../pages/PaymentsUiEmployeePgrInboxV2Page.page'
import { installOverlayHandlers, blockNonReadRequests, loadTestData, fillPrivately } from '../../helpers/app'
import { requiredEnv } from '../../helpers/requiredEnv'
import { openInbox, clickAndSearch, clickAndMaybeSearch, inboxSearchBody } from '../../helpers/inbox'
import { traceCase } from '../../helpers/traceability'

const BASE_URL = (process.env.QA_UI_BASE_URL || '').trim() || 'https://sierraleone-hcm.digit.org/workbench-ui/employee'   // .env QA_UI_BASE_URL normally supplies this
const YAML_SOURCE = 'tests/testcases/complaints-inbox/INB-03.yaml'
const FLOW = { yamlSource: YAML_SOURCE, module: 'complaints-inbox', flowId: 'INB-03', flowName: 'search_by_mobile_number' } as const
const OPEN_STEP = '1. Open /payments-ui/employee/pgr/inbox-v2, wait for animation_1dcbe0 to be hidden and for the first results column header, up to 90 s'

test.describe('INB-03 search_by_mobile_number', {
  tag: ['@INB-03', '@complaints-inbox', '@P1'],
}, () => {
  test('INB-03-H1: List the QA-TEST complaints when searching the team-owned complainant mobile number', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await traceCase({
      ...FLOW, caseId: 'INB-03-H1', type: 'happy_path', priority: 'P1', tags: ['regression'], testDataRef: 'INB-03-H1',
      title: 'List the QA-TEST complaints when searching the team-owned complainant mobile number',
      coverageNote: 'Second search mode; the count grows with every CMP-08 run, so only the presence of a known QA-TEST complaint is asserted.',
    })
    const data = loadTestData<{ knownComplaintNumber: string }>('INB-03-H1')
    const mobile = requiredEnv('QA_COMPLAINANT_MOBILE')
    const inbox = new PaymentsUiEmployeePgrInboxV2Page(page)
    let search!: Response

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      await blockNonReadRequests(page)
    })

    await allure.step(OPEN_STEP, async () => {
      await openInbox(page, BASE_URL)
    })
    await allure.step('2. Fill mobilenumber_c51cd9 with QA_COMPLAINANT_MOBILE from .env (fillPrivately)', async () => {
      await fillPrivately(inbox.mobilenumberC51cd9(), mobile)
    })
    await allure.step('3. Click Search (contract gap) and wait for the POST /inbox/v2/_search response', async () => {
      search = await clickAndSearch(page, () => inbox.search().click())
      expect(search.status()).toBe(200)
    })

    await allure.step('Assert: search_request_has_mobile_number', async () => {
      const sent = inboxSearchBody(search).inbox?.moduleSearchCriteria?.mobileNumber
      expect(sent === mobile, 'moduleSearchCriteria.mobileNumber carries QA_COMPLAINANT_MOBILE (value not logged)').toBe(true)
    })
    await allure.step('Assert: result_rows_at_least_1', async () => {
      await expect(inbox.resultRows().first()).toBeVisible()
    })
    await allure.step('Assert: known_qa_test_complaint_among_results', async () => {
      await expect(inbox.complaintLink(data.knownComplaintNumber)).toHaveCount(1)
    })
  })

  test('INB-03-E1: Show no complaints or a format message for a 3-digit mobile number', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await traceCase({
      ...FLOW, caseId: 'INB-03-E1', type: 'negative', priority: 'P1', tags: ['regression'], testDataRef: 'INB-03-E1',
      title: 'Show no complaints or a format message for a 3-digit mobile number',
      coverageNote: 'Invalid-format partition of the inbox mobile search; CMP-06-E2/E5 check mobile length on the Create complaint form, a different field.',
    })
    const data = loadTestData<{ mobileNumber: string }>('INB-03-E1')
    const inbox = new PaymentsUiEmployeePgrInboxV2Page(page)
    const formatMessage = page.locator('[class*="error"]:visible').filter({ hasText: /mobile|valid/i })

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      await blockNonReadRequests(page)
    })

    await allure.step(OPEN_STEP, async () => {
      await openInbox(page, BASE_URL)
    })
    await allure.step('2. Fill mobilenumber_c51cd9 with the short number from test data INB-03-E1', async () => {
      await inbox.mobilenumberC51cd9().fill(data.mobileNumber)
    })
    await allure.step('3. Click Search', async () => {
      const search = await clickAndMaybeSearch(page, () => inbox.search().click())
      await allure.parameter('search_request_sent', search ? 'yes' : 'no')
    })

    await allure.step('Assert: result_rows_zero_or_format_message_shown', async () => {
      await expect.poll(async () => (await inbox.resultRows().count()) === 0 || (await formatMessage.count()) > 0, {
        message: 'either no result rows or a mobile-number format message',
        timeout: 15_000,
      }).toBe(true)
    })
  })
})
