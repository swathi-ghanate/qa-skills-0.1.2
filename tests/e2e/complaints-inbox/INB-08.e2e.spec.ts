/**
 * AUTO-GENERATED — do not edit by hand.
 * Source:    tests/testcases/complaints-inbox/INB-08.yaml
 * Flow:      INB-08 — inbox_paging
 * Contract:  ui-contract.json v1.3.0 (scraped 2026-11-20; rows_per_page_70af54 overridden: the contract selector matches 0)
 * Generator: /playwright-gen complaints-inbox
 * Auth:      default actor (admin) — saved workbench-login session (playwright.config.ts) + restoreSavedSession().
 * Safety:    read-only; every request that is not a read is aborted (blockNonReadRequests).
 * Needs:     more than 10 complaints in the default list (18 on 2026-11-20); each case fails with a clear message otherwise.
 * Deferred:  rbac — the inbox search API check is INB-13-RBAC-1 (→ /script-gen).
 */
import { test, expect, type Response } from '@playwright/test'
import * as allure from 'allure-js-commons'
import { PaymentsUiEmployeePgrInboxV2Page } from '../../pages/PaymentsUiEmployeePgrInboxV2Page.page'
import { installOverlayHandlers, blockNonReadRequests, loadTestData } from '../../helpers/app'
import { openInbox, clickAndSearch, inboxSearchBody } from '../../helpers/inbox'
import { traceCase } from '../../helpers/traceability'

const BASE_URL = (process.env.QA_UI_BASE_URL || '').trim() || 'https://sierraleone-hcm.digit.org/workbench-ui/employee'   // .env QA_UI_BASE_URL normally supplies this
const YAML_SOURCE = 'tests/testcases/complaints-inbox/INB-08.yaml'
const FLOW = { yamlSource: YAML_SOURCE, module: 'complaints-inbox', flowId: 'INB-08', flowName: 'inbox_paging' } as const
const OPEN_STEP = '1. Open /payments-ui/employee/pgr/inbox-v2, wait for animation_1dcbe0 to be hidden and for the result rows to render'

type PagingData = { minTotal: number; expectedOffset?: number; rowsPerPage?: string; expectedLimit?: number }

/** Total N from the "a-b of N" count; fails clearly when the list is too short for paging. */
async function requireTotal(inbox: PaymentsUiEmployeePgrInboxV2Page, minTotal: number): Promise<number> {
  const text = (await inbox.pageCount().innerText()).trim()
  const total = Number(text.split(' of ')[1])
  await allure.parameter('total_complaints', String(total))
  expect(total, `paging needs at least ${minTotal} complaints in the default list (count text "${text}")`).toBeGreaterThanOrEqual(minTotal)
  return total
}

test.describe('INB-08 inbox_paging', {
  tag: ['@INB-08', '@complaints-inbox', '@P2'],
}, () => {
  test('INB-08-H1: Disable First and Previous on the first page and show the 1-10 count', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await traceCase({
      ...FLOW, caseId: 'INB-08-H1', type: 'happy_path', priority: 'P2', tags: ['regression'], testDataRef: 'INB-08-H1',
      title: 'Disable First and Previous on the first page and show the 1-10 count',
      coverageNote: 'Starting state of the pager; the user-management pager had a TotalCount defect (USR-05-H1), so the enabled Next is checked explicitly.',
    })
    const data = loadTestData<PagingData>('INB-08-H1')
    const inbox = new PaymentsUiEmployeePgrInboxV2Page(page)

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      await blockNonReadRequests(page)
    })

    await allure.step(OPEN_STEP + ' (paging buttons are all disabled until then)', async () => {
      await openInbox(page, BASE_URL)
      await requireTotal(inbox, data.minTotal)
    })

    await allure.step('Assert: first_page_button_disabled', async () => {
      await expect(inbox.firstPageB08b28()).toBeDisabled()
    })
    await allure.step('Assert: previous_page_button_disabled', async () => {
      await expect(inbox.previousPage131236()).toBeDisabled()
    })
    await allure.step('Assert: next_page_button_enabled', async () => {
      await expect(inbox.nextPage4297e0()).toBeEnabled()
    })
    await allure.step('Assert: page_count_text_is_first_page', async () => {
      await expect(inbox.pageCount()).toHaveText(/^1-10 of \d+$/)
    })
  })

  test('INB-08-H2: Load the second page with Next Page', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await traceCase({
      ...FLOW, caseId: 'INB-08-H2', type: 'happy_path', priority: 'P2', tags: ['regression'], testDataRef: 'INB-08-H2',
      title: 'Load the second page with Next Page',
      coverageNote: 'Forward paging and the offset sent to the server.',
    })
    const data = loadTestData<PagingData>('INB-08-H2')
    const inbox = new PaymentsUiEmployeePgrInboxV2Page(page)
    let next!: Response

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      await blockNonReadRequests(page)
    })

    await allure.step(OPEN_STEP, async () => {
      await openInbox(page, BASE_URL)
      await requireTotal(inbox, data.minTotal)
    })
    await allure.step('2. Click next_page_4297e0 and wait for the POST /inbox/v2/_search response', async () => {
      next = await clickAndSearch(page, () => inbox.nextPage4297e0().click())
    })

    await allure.step('Assert: search_request_offset_is_10', async () => {
      expect(inboxSearchBody(next).inbox?.offset).toBe(data.expectedOffset)
    })
    await allure.step('Assert: page_count_text_is_second_page', async () => {
      await expect(inbox.pageCount()).toHaveText(/^11-\d+ of \d+$/)
    })
    await allure.step('Assert: first_page_button_enabled', async () => {
      await expect(inbox.firstPageB08b28()).toBeEnabled()
    })
    await allure.step('Assert: result_rows_at_least_1', async () => {
      await expect(inbox.resultRows().first()).toBeVisible()
    })
  })

  test('INB-08-H3: Return to the first page with Previous Page', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await traceCase({
      ...FLOW, caseId: 'INB-08-H3', type: 'happy_path', priority: 'P2', tags: ['regression'], testDataRef: 'INB-08-H3',
      title: 'Return to the first page with Previous Page',
      coverageNote: 'Backward paging, which H2 (forward only) does not cover.',
    })
    const data = loadTestData<PagingData>('INB-08-H3')
    const inbox = new PaymentsUiEmployeePgrInboxV2Page(page)
    let previous!: Response

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      await blockNonReadRequests(page)
    })

    await allure.step(OPEN_STEP, async () => {
      await openInbox(page, BASE_URL)
      await requireTotal(inbox, data.minTotal)
    })
    await allure.step('2. Click next_page_4297e0 and wait for the POST /inbox/v2/_search response', async () => {
      await clickAndSearch(page, () => inbox.nextPage4297e0().click())
      await expect(inbox.pageCount()).toHaveText(/^11-/)
    })
    await allure.step('3. Click previous_page_131236 and wait for the next POST /inbox/v2/_search response', async () => {
      previous = await clickAndSearch(page, () => inbox.previousPage131236().click())
    })

    await allure.step('Assert: search_request_offset_is_0', async () => {
      expect(inboxSearchBody(previous).inbox?.offset).toBe(data.expectedOffset)
    })
    await allure.step('Assert: page_count_text_is_first_page', async () => {
      await expect(inbox.pageCount()).toHaveText(/^1-10 of \d+$/)
    })
  })

  test('INB-08-H4: Disable Next and Last on the last page', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await traceCase({
      ...FLOW, caseId: 'INB-08-H4', type: 'edge_case', priority: 'P2', tags: ['regression'], testDataRef: 'INB-08-H4',
      title: 'Disable Next and Last on the last page',
      coverageNote: 'Upper boundary of paging.',
    })
    const data = loadTestData<PagingData>('INB-08-H4')
    const inbox = new PaymentsUiEmployeePgrInboxV2Page(page)

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      await blockNonReadRequests(page)
    })

    await allure.step(OPEN_STEP, async () => {
      await openInbox(page, BASE_URL)
      await requireTotal(inbox, data.minTotal)
    })
    await allure.step('2. Click last_page_9cd9d1 and wait for the POST /inbox/v2/_search response', async () => {
      await clickAndSearch(page, () => inbox.lastPage9cd9d1().click())
    })

    await allure.step('Assert: next_page_button_disabled', async () => {
      await expect(inbox.nextPage4297e0()).toBeDisabled()
    })
    await allure.step('Assert: last_page_button_disabled', async () => {
      await expect(inbox.lastPage9cd9d1()).toBeDisabled()
    })
    await allure.step('Assert: page_count_text_ends_at_total', async () => {
      await expect(inbox.pageCount()).toHaveText(/^\d+-(\d+) of \1$/)
    })
  })

  test('INB-08-H5: Show up to 20 complaints when 20 rows per page is chosen', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await traceCase({
      ...FLOW, caseId: 'INB-08-H5', type: 'happy_path', priority: 'P2', tags: ['regression'], testDataRef: 'INB-08-H5',
      title: 'Show up to 20 complaints when 20 rows per page is chosen',
      coverageNote: 'Page-size change; the other options of Rows per page are not captured yet (read them on the first run).',
    })
    const data = loadTestData<PagingData>('INB-08-H5')
    const inbox = new PaymentsUiEmployeePgrInboxV2Page(page)
    let resized!: Response

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      await blockNonReadRequests(page)
    })

    await allure.step(OPEN_STEP, async () => {
      await openInbox(page, BASE_URL)
      await requireTotal(inbox, data.minTotal)
    })
    await allure.step("2. Choose the value from test data INB-08-H5 in rows_per_page_70af54 (use getByRole('combobox', { name: 'Rows per page' }); the contract selector matches 0)", async () => {
      await allure.parameter('rows_per_page_options', (await inbox.rowsPerPage70af54().locator('option').allInnerTexts()).join(', '))
      resized = await clickAndSearch(page, async () => { await inbox.rowsPerPage70af54().selectOption(data.rowsPerPage!) })
    })
    await allure.step('3. Wait for the POST /inbox/v2/_search response', async () => {
      expect(resized.status()).toBe(200)
    })

    await allure.step('Assert: search_request_limit_is_20', async () => {
      expect(inboxSearchBody(resized).inbox?.limit).toBe(data.expectedLimit)
    })
    await allure.step('Assert: result_rows_between_11_and_20', async () => {
      await expect.poll(() => inbox.resultRows().count(), { message: 'more than one page of rows is shown' }).toBeGreaterThanOrEqual(11)
      expect(await inbox.resultRows().count()).toBeLessThanOrEqual(20)
    })
  })
})
