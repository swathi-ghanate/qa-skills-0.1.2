/**
 * AUTO-GENERATED — do not edit by hand.
 * Source:    tests/testcases/complaints-inbox/INB-01.yaml
 * Flow:      INB-01 — open_inbox_from_workbench_home
 * Contract:  ui-contract.json v1.3.0 (scraped 2026-11-20; contract gaps verified live, read-only, 2026-11-20)
 * Generator: /playwright-gen complaints-inbox
 * Auth:      default actor (admin) — saved workbench-login session (playwright.config.ts) + restoreSavedSession().
 * Safety:    read-only; every request that is not a read is aborted (blockNonReadRequests).
 * Privacy:   only headers, counts and request bodies are asserted; row values are never read.
 */
import { test, expect, type Response } from '@playwright/test'
import * as allure from 'allure-js-commons'
import { PaymentsUiEmployeePgrInboxV2Page } from '../../pages/PaymentsUiEmployeePgrInboxV2Page.page'
import { WorkbenchUiEmployeePage } from '../../pages/WorkbenchUiEmployeePage.page'
import { installOverlayHandlers, blockNonReadRequests, restoreSavedSession, waitForLoaderGone, loadTestData } from '../../helpers/app'
import { expectPathname } from '../../helpers/routes'
import { gotoInbox, inboxSearchBody, type InboxLoad } from '../../helpers/inbox'
import { traceCase } from '../../helpers/traceability'

const BASE_URL = (process.env.QA_UI_BASE_URL || '').trim() || 'https://sierraleone-hcm.digit.org/workbench-ui/employee'   // .env QA_UI_BASE_URL normally supplies this
const YAML_SOURCE = 'tests/testcases/complaints-inbox/INB-01.yaml'
const FLOW = { yamlSource: YAML_SOURCE, module: 'complaints-inbox', flowId: 'INB-01', flowName: 'open_inbox_from_workbench_home' } as const

type LayoutData = {
  columns: string[]
  defaultRequest: { limit: number; offset: number; businessService: string[]; moduleName: string; tenantId: string }
}

test.describe('INB-01 open_inbox_from_workbench_home', {
  tag: ['@INB-01', '@complaints-inbox', '@P0'],
}, () => {
  test('INB-01-H1: Open the complaints inbox from the Search complaint button on the workbench home', {
    tag: ['@smoke', '@regression'],
  }, async ({ page }) => {
    await traceCase({
      ...FLOW, caseId: 'INB-01-H1', type: 'happy_path', priority: 'P0', tags: ['smoke', 'regression'], testDataRef: 'INB-01-H1',
      title: 'Open the complaints inbox from the Search complaint button on the workbench home',
      coverageNote: 'The only case that reaches the inbox through the workbench home card; AUTH-07-H2 opens it by URL and CMP-01-H1 uses the other button (Create complaint) on the same card.',
    })
    const home = new WorkbenchUiEmployeePage(page)
    const inbox = new PaymentsUiEmployeePgrInboxV2Page(page)

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      await blockNonReadRequests(page)
      await restoreSavedSession(page)   // the workbench home needs the DIGIT sessionStorage keys
    })

    await allure.step('1. Open /workbench-ui/employee and wait for animation_1dcbe0 to be hidden', async () => {
      await home.goto(BASE_URL)
      await waitForLoaderGone(inbox.animation1dcbe0())
    })
    await allure.step('2. Wait for search_complaint_c22151 (Complaints card) to be visible', async () => {
      await expect(home.searchComplaintC22151()).toBeVisible({ timeout: 60_000 })
    })
    await allure.step('3. Click search_complaint_c22151', async () => {
      await home.searchComplaintC22151().click()
    })
    await allure.step('4. Wait for the URL pathname to be /payments-ui/employee/pgr/inbox-v2 and for animation_1dcbe0 to be hidden', async () => {
      await expectPathname(page, PaymentsUiEmployeePgrInboxV2Page.PATH, 60_000)
      await waitForLoaderGone(inbox.animation1dcbe0())
    })

    await allure.step('Assert: url_pathname_is_payments_ui_employee_pgr_inbox_v2', async () => {
      await expectPathname(page, PaymentsUiEmployeePgrInboxV2Page.PATH)
    })
    await allure.step('Assert: complaint_number_field_visible', async () => {
      // Arriving from the workbench is a cold load of the payments-ui app: the search card can take ~25 s to render
      // after the loader goes (live 2026-11-20), so this check allows 60 s instead of the default 5 s.
      await expect(inbox.complaintnumber7836f5()).toBeVisible({ timeout: 60_000 })
    })
  })

  test('INB-01-H2: Show the search card, filter panel, results table and default search request when the inbox opens', {
    tag: ['@smoke', '@regression'],
  }, async ({ page }) => {
    await traceCase({
      ...FLOW, caseId: 'INB-01-H2', type: 'happy_path', priority: 'P0', tags: ['smoke', 'regression'], testDataRef: 'INB-01-H2',
      title: 'Show the search card, filter panel, results table and default search request when the inbox opens',
      coverageNote: 'Checks the whole inbox layout and the default search request, which AUTH-07-H2 (Complaint Number field only) does not.',
    })
    const data = loadTestData<LayoutData>('INB-01-H2')
    const inbox = new PaymentsUiEmployeePgrInboxV2Page(page)
    let load!: InboxLoad
    let defaultSearch!: Response

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      await blockNonReadRequests(page)
    })

    await allure.step('1. Open /payments-ui/employee/pgr/inbox-v2 and wait for animation_1dcbe0 to be hidden', async () => {
      load = await gotoInbox(page, BASE_URL)
    })
    await allure.step('2. Wait for the first POST /inbox/v2/_search response and for the first results column header (contract gap: results table) to be visible, up to 90 s', async () => {
      defaultSearch = await load.settled()
      expect(defaultSearch.status(), 'default inbox search status').toBe(200)
    })
    await allure.step('3. Read the search card: complaintnumber_7836f5, mobilenumber_c51cd9, field_2_2ab45f (Date Range; contract selector matches 0, use input.digit-employee-select-wrap--elipses[readonly]) and the Search and Clear Search buttons (Search is a contract gap)', async () => {
      await inbox.complaintnumber7836f5().scrollIntoViewIfNeeded()
    })
    await allure.step('4. Read the Filter card: the Assigned to me / Assigned to others radios, Complaint Type, Country, the Pending Assignment checkbox (contract gaps) and apply_18d6c0, clear_all_d8e461', async () => {
      await inbox.apply18d6c0().scrollIntoViewIfNeeded()
    })

    await allure.step('Assert: default_search_request_params', async () => {
      const body = inboxSearchBody(defaultSearch).inbox ?? {}
      expect(body.moduleSearchCriteria ?? {}, 'moduleSearchCriteria').toEqual({})
      expect(body.limit, 'limit').toBe(data.defaultRequest.limit)
      expect(body.offset, 'offset').toBe(data.defaultRequest.offset)
      expect(body.processSearchCriteria, 'processSearchCriteria').toMatchObject({
        businessService: data.defaultRequest.businessService,
        moduleName: data.defaultRequest.moduleName,
        tenantId: data.defaultRequest.tenantId,
      })
    })
    await allure.step('Assert: search_card_fields_visible', async () => {
      await expect(inbox.complaintnumber7836f5()).toBeVisible()
      await expect(inbox.mobilenumberC51cd9()).toBeVisible()
      await expect(inbox.field22ab45f()).toBeVisible()
      await expect(inbox.search()).toBeVisible()
      await expect(inbox.clearSearchC692f5()).toBeVisible()
    })
    await allure.step('Assert: filter_card_controls_visible', async () => {
      await expect(inbox.assigneeRadio('Assigned to me')).toBeVisible()
      await expect(inbox.assigneeRadio('Assigned to others')).toBeVisible()
      await expect(inbox.filterDropdown('Complaint Type')).toBeVisible()
      await expect(inbox.filterDropdown('Country')).toBeVisible()
      await expect(inbox.statusCheckbox('Pending Assignment')).toBeVisible()
      await expect(inbox.apply18d6c0()).toBeVisible()
      await expect(inbox.clearAllD8e461()).toBeVisible()
    })
    await allure.step('Assert: results_column_headers_match_test_data', async () => {
      await expect(inbox.columnHeaders()).toHaveText(data.columns)
    })
    await allure.step('Assert: result_rows_between_1_and_10', async () => {
      const rows = await inbox.resultRows().count()
      expect(rows).toBeGreaterThanOrEqual(1)
      expect(rows).toBeLessThanOrEqual(10)
    })
    await allure.step('Assert: page_count_text_shown', async () => {
      await expect(inbox.pageCount()).toHaveText(/^1-\d+ of \d+$/)
    })
  })
})
