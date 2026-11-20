/**
 * AUTO-GENERATED — do not edit by hand.
 * Source:    tests/testcases/complaints-inbox/INB-04.yaml
 * Flow:      INB-04 — search_by_date_range
 * Contract:  ui-contract.json v1.3.0 (scraped 2026-11-20; contract gaps verified live, read-only, 2026-11-20)
 * Generator: /playwright-gen complaints-inbox
 * Auth:      default actor (admin) — saved workbench-login session (playwright.config.ts) + restoreSavedSession().
 * Safety:    read-only; every request that is not a read is aborted (blockNonReadRequests).
 * Picker:    react-date-range, verified live 2026-11-20: it opens from the calendar icon after a click on the field
 *            (the field alone opens nothing). Dates are chosen with its month/year selects and day buttons.
 * Deferred:  rbac — the inbox search API check is INB-13-RBAC-1 (→ /script-gen).
 */
import { test, expect, type Response } from '@playwright/test'
import * as allure from 'allure-js-commons'
import { PaymentsUiEmployeePgrInboxV2Page } from '../../pages/PaymentsUiEmployeePgrInboxV2Page.page'
import { installOverlayHandlers, blockNonReadRequests, loadTestData } from '../../helpers/app'
import { openInbox, clickAndSearch, inboxSearchBody, filterFields } from '../../helpers/inbox'
import { traceCase } from '../../helpers/traceability'

const BASE_URL = (process.env.QA_UI_BASE_URL || '').trim() || 'https://sierraleone-hcm.digit.org/workbench-ui/employee'   // .env QA_UI_BASE_URL normally supplies this
const YAML_SOURCE = 'tests/testcases/complaints-inbox/INB-04.yaml'
const FLOW = { yamlSource: YAML_SOURCE, module: 'complaints-inbox', flowId: 'INB-04', flowName: 'search_by_date_range' } as const
const OPEN_STEP = '1. Open /payments-ui/employee/pgr/inbox-v2, wait for animation_1dcbe0 to be hidden and for the first results column header, up to 90 s'

type DateData = { fromDate: string; toDate: string; knownComplaintNumber?: string }

/** Open the date picker: click the field, then its calendar icon (the field alone opens nothing; live 2026-11-20). */
async function openDatePicker(inbox: PaymentsUiEmployeePgrInboxV2Page): Promise<void> {
  await inbox.field22ab45f().click()
  if (!(await inbox.calendar().isVisible())) await inbox.dateRangeIcon().click()
  await expect(inbox.calendar(), 'the date picker opens from the Date Range field').toBeVisible({ timeout: 15_000 })
}

/** Choose a start and an end date (YYYY-MM-DD): pick the month and year, then click the day. */
async function chooseDates(inbox: PaymentsUiEmployeePgrInboxV2Page, data: DateData): Promise<void> {
  for (const iso of [data.fromDate, data.toDate]) {
    const [year, month, day] = iso.split('-').map(Number)
    await inbox.calendarYearSelect().selectOption(String(year))
    await inbox.calendarMonthSelect().selectOption({ index: month - 1 })
    await inbox.calendarDay(day).click()
  }
}

/** Close the picker by clicking outside it (the page heading). */
async function closeDatePicker(inbox: PaymentsUiEmployeePgrInboxV2Page): Promise<void> {
  await inbox.page.locator('.digit-inbox-search-composer-header').first().click()
  await expect(inbox.calendar()).toBeHidden()
}

test.describe('INB-04 search_by_date_range', {
  tag: ['@INB-04', '@complaints-inbox', '@P1'],
}, () => {
  test('INB-04-H1: Find a QA-TEST complaint by a date range that includes its filing date', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await traceCase({
      ...FLOW, caseId: 'INB-04-H1', type: 'happy_path', priority: 'P1', tags: ['regression'], testDataRef: 'INB-04-H1',
      title: 'Find a QA-TEST complaint by a date range that includes its filing date',
      coverageNote: 'Third search mode; the only case that exercises the date picker and the date criteria of the search request.',
    })
    const data = loadTestData<DateData>('INB-04-H1')
    const inbox = new PaymentsUiEmployeePgrInboxV2Page(page)
    let fields: string[] = []
    let searched!: Response

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      await blockNonReadRequests(page)
    })

    await allure.step(OPEN_STEP, async () => {
      await openInbox(page, BASE_URL)
    })
    await allure.step('2. Click field_2_2ab45f (Date Range) or its calendar icon and wait for the calendar to be visible', async () => {
      await openDatePicker(inbox)
    })
    await allure.step('3. Choose the from and to dates from test data INB-04-H1', async () => {
      await chooseDates(inbox, data)
    })
    await allure.step('4. Close the calendar and wait for field_2_2ab45f to show the chosen range', async () => {
      await closeDatePicker(inbox)
      await expect(inbox.field22ab45f()).not.toHaveValue('')
      await allure.parameter('date_range_shown_as', (await inbox.field22ab45f().inputValue()).replace(/\d/g, '9'))   // format only
    })
    await allure.step('5. Click Search (contract gap) and wait for the POST /inbox/v2/_search response', async () => {
      const search = await clickAndSearch(page, () => inbox.search().click())
      expect(search.status()).toBe(200)
      fields = filterFields(inboxSearchBody(search))
      await allure.parameter('search_filter_fields', fields.join(', ') || '(none)')
      searched = search
    })

    await allure.step('Assert: search_request_has_date_range', async () => {
      // Pinned from the 2026-11-20 runs: the range is sent as moduleSearchCriteria.fromDate and .toDate, nothing else.
      expect([...fields].sort(), 'the only filters sent are the two range ends').toEqual(['moduleSearchCriteria.fromDate', 'moduleSearchCriteria.toDate'])
      const criteria = inboxSearchBody(searched).inbox?.moduleSearchCriteria ?? {}
      const from = new Date(criteria.fromDate as string | number).getTime()
      const to = new Date(criteria.toDate as string | number).getTime()
      expect(from, 'fromDate is a valid date').not.toBeNaN()
      expect(to, 'toDate is a valid date').not.toBeNaN()
      expect(to, 'toDate is not before fromDate').toBeGreaterThanOrEqual(from)
    })
    await allure.step('Assert: known_qa_test_complaint_among_results', async () => {
      await expect(inbox.complaintLink(data.knownComplaintNumber!)).toHaveCount(1)
    })
  })

  test('INB-04-E1: Show no complaints for a date range before any complaint was filed', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await traceCase({
      ...FLOW, caseId: 'INB-04-E1', type: 'edge_case', priority: 'P1', tags: ['regression'], testDataRef: 'INB-04-E1',
      title: 'Show no complaints for a date range before any complaint was filed',
      coverageNote: 'Empty-result boundary of the date search (a range in the past with no complaints); added by test design, not listed in the plan.',
    })
    const data = loadTestData<DateData>('INB-04-E1')
    const inbox = new PaymentsUiEmployeePgrInboxV2Page(page)

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      await blockNonReadRequests(page)
    })

    await allure.step(OPEN_STEP, async () => {
      await openInbox(page, BASE_URL)
    })
    await allure.step('2. Open the Date Range calendar as in INB-04-H1 and choose the range from test data INB-04-E1', async () => {
      await openDatePicker(inbox)
      await chooseDates(inbox, data)
      await closeDatePicker(inbox)
    })
    await allure.step('3. Click Search and wait for the POST /inbox/v2/_search response', async () => {
      const search = await clickAndSearch(page, () => inbox.search().click())
      expect(search.status()).toBe(200)
    })

    await allure.step('Assert: result_rows_zero', async () => {
      await expect(inbox.resultRows()).toHaveCount(0)
    })
    await allure.step('Assert: no_results_message_visible', async () => {
      // The table can still be re-rendering after the response (seen live 2026-11-20); allow it 15 s.
      await expect(inbox.noResults()).toBeVisible({ timeout: 15_000 })
    })
  })
})
