/**
 * AUTO-GENERATED — do not edit by hand.
 * Source:    tests/testcases/complaints-inbox/INB-05.yaml
 * Flow:      INB-05 — clear_search
 * Contract:  ui-contract.json v1.3.0 (scraped 2026-11-20; contract gaps verified live, read-only, 2026-11-20)
 * Generator: /playwright-gen complaints-inbox
 * Auth:      default actor (admin) — saved workbench-login session (playwright.config.ts) + restoreSavedSession().
 * Safety:    read-only; every request that is not a read is aborted (blockNonReadRequests).
 * Deferred:  rbac — the inbox search API check is INB-13-RBAC-1 (→ /script-gen).
 */
import { test, expect, type Response } from '@playwright/test'
import * as allure from 'allure-js-commons'
import { PaymentsUiEmployeePgrInboxV2Page } from '../../pages/PaymentsUiEmployeePgrInboxV2Page.page'
import { installOverlayHandlers, blockNonReadRequests, loadTestData } from '../../helpers/app'
import { openInbox, settleFilterCard, clickAndSearch, inboxSearchBody } from '../../helpers/inbox'
import { traceCase } from '../../helpers/traceability'

const BASE_URL = (process.env.QA_UI_BASE_URL || '').trim() || 'https://sierraleone-hcm.digit.org/workbench-ui/employee'   // .env QA_UI_BASE_URL normally supplies this
const YAML_SOURCE = 'tests/testcases/complaints-inbox/INB-05.yaml'
const FLOW = { yamlSource: YAML_SOURCE, module: 'complaints-inbox', flowId: 'INB-05', flowName: 'clear_search' } as const
const OPEN_STEP = '1. Open /payments-ui/employee/pgr/inbox-v2, wait for animation_1dcbe0 to be hidden and for the first results column header, up to 90 s'

test.describe('INB-05 clear_search', {
  tag: ['@INB-05', '@complaints-inbox', '@P1'],
}, () => {
  test('INB-05-H1: Empty the search fields and bring back the default list when Clear Search is clicked', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await traceCase({
      ...FLOW, caseId: 'INB-05-H1', type: 'happy_path', priority: 'P1', tags: ['regression'], testDataRef: 'INB-05-H1',
      title: 'Empty the search fields and bring back the default list when Clear Search is clicked',
      coverageNote: 'Reset of the search card back to the default list; no other case clicks Clear Search.',
    })
    const data = loadTestData<{ complaintNumber: string }>('INB-05-H1')
    const inbox = new PaymentsUiEmployeePgrInboxV2Page(page)
    let cleared!: Response

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      await blockNonReadRequests(page)
    })

    await allure.step(OPEN_STEP, async () => {
      await openInbox(page, BASE_URL)
    })
    await allure.step('2. Fill complaintnumber_7836f5 with the QA-TEST complaint number from test data INB-05-H1, click Search and wait for exactly 1 result row', async () => {
      await inbox.complaintnumber7836f5().fill(data.complaintNumber)
      await clickAndSearch(page, () => inbox.search().click())
      await expect(inbox.resultRows()).toHaveCount(1)
    })
    await allure.step('3. Click clear_search_c692f5 and wait for the next POST /inbox/v2/_search response', async () => {
      cleared = await clickAndSearch(page, () => inbox.clearSearchC692f5().click(), 30_000)
    })

    await allure.step('Assert: complaint_number_field_empty', async () => {
      await expect(inbox.complaintnumber7836f5()).toHaveValue('')
    })
    await allure.step('Assert: mobile_number_field_empty', async () => {
      await expect(inbox.mobilenumberC51cd9()).toHaveValue('')
    })
    await allure.step('Assert: last_search_request_has_no_search_criteria', async () => {
      expect(inboxSearchBody(cleared).inbox?.moduleSearchCriteria ?? {}).toEqual({})
    })
    await allure.step('Assert: result_rows_more_than_1', async () => {
      await expect.poll(() => inbox.resultRows().count(), { message: 'the default list is back' }).toBeGreaterThan(1)
    })
  })

  test('INB-05-H2: Keep the chosen Status filter when Clear Search is clicked', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await traceCase({
      ...FLOW, caseId: 'INB-05-H2', type: 'edge_case', priority: 'P1', tags: ['regression'], testDataRef: 'INB-05-H2',
      title: 'Keep the chosen Status filter when Clear Search is clicked',
      coverageNote: 'Different starting state from H1 (a filter is set): proves Clear Search and Clear All (INB-07) act on separate panels.',
    })
    const data = loadTestData<{ complaintNumber: string; status: string }>('INB-05-H2')
    const inbox = new PaymentsUiEmployeePgrInboxV2Page(page)

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      await blockNonReadRequests(page)
    })

    await allure.step(OPEN_STEP, async () => {
      await openInbox(page, BASE_URL)
    })
    await allure.step('2. Tick the Status checkbox from test data INB-05-H2 (contract gap: the input[type=checkbox] in the option whose text is Pending Assignment) and click apply_18d6c0', async () => {
      await settleFilterCard(page)   // the Filter card re-mounts once after its first use (observed live 2026-11-20)
      await inbox.statusCheckbox(data.status).check()
      await clickAndSearch(page, () => inbox.apply18d6c0().click())
    })
    await allure.step('3. Fill complaintnumber_7836f5 with the QA-TEST complaint number from test data INB-05-H2 and click Search', async () => {
      await inbox.complaintnumber7836f5().fill(data.complaintNumber)
      await clickAndSearch(page, () => inbox.search().click())
    })
    await allure.step('4. Click clear_search_c692f5 and wait for the next POST /inbox/v2/_search response', async () => {
      await clickAndSearch(page, () => inbox.clearSearchC692f5().click(), 30_000)
    })

    await allure.step('Assert: complaint_number_field_empty', async () => {
      await expect(inbox.complaintnumber7836f5()).toHaveValue('')
    })
    await allure.step('Assert: status_checkbox_still_checked', async () => {
      await expect(inbox.statusCheckbox(data.status)).toBeChecked()
    })
  })
})
