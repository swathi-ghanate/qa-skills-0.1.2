/**
 * AUTO-GENERATED — do not edit by hand.
 * Source:    tests/testcases/user-management/USR-05.yaml
 * Flow:      USR-05 — user_list_paging
 * Contract:  ui-contract.json v1.3.0 (+ live capture 2026-11-16, re-verified 2026-11-18, for contract gaps)
 * Generator: /playwright-gen user-management
 * Auth:      default actor (admin) — saved workbench-login session (localStorage via playwright.config.ts).
 * Safety:    read-only; every _create/_update request is aborted.
 * Note:      on 2026-11-18 the search response's TotalCount equalled the page size (10 of 10; 20 of 20 at 20 per page),
 *            so the pager never enables Next although more users exist. Step 2 waits for Next and fails on that.
 * Deferred:  rbac_checks USR-05-RBAC-1 (API-level) → /script-gen after `qa-kit api-scrape`.
 */
import { test, expect, type Response } from '@playwright/test'
import * as allure from 'allure-js-commons'
import { PaymentsUiEmployeeHrmsInboxPage } from '../../pages/PaymentsUiEmployeeHrmsInboxPage.page'
import { installOverlayHandlers, blockWriteRequests, loadTestData } from '../../helpers/app'
import { openUserSearch } from '../../helpers/users'

const BASE_URL = (process.env.QA_UI_BASE_URL || '').trim() || 'https://sierraleone-hcm.digit.org/workbench-ui/employee'   // .env QA_UI_BASE_URL normally supplies this
const YAML_SOURCE = 'tests/testcases/user-management/USR-05.yaml'

test.describe('USR-05 user_list_paging', {
  tag: ['@USR-05', '@user-management', '@P2'],
}, () => {
  test('USR-05-H1: Load the second page of users with the next-page button', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await allure.tms(YAML_SOURCE + '#USR-05-H1', 'USR-05-H1')
    await allure.parameter('case_id', 'USR-05-H1')
    await allure.parameter('flow_id', 'USR-05')
    await allure.parameter('module', 'user-management')
    await allure.parameter('type', 'happy_path')
    await allure.parameter('priority', 'P2')
    await allure.parameter('test_data_ref', 'USR-05-H1')
    await allure.parameter('yaml_source', YAML_SOURCE)
    await allure.epic('user-management')
    await allure.feature('user_list_paging')
    await allure.story('Load the second page of users with the next-page button')
    await allure.severity('minor')
    await allure.tag('regression')
    await allure.description('Paging; every other case stays on the first page.\n\nSource: ' + YAML_SOURCE + '#USR-05-H1')

    const data = loadTestData<{ expectedOffset: string }>('USR-05-H1')
    const inbox = new PaymentsUiEmployeeHrmsInboxPage(page)
    let pageTwo!: Response

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      await blockWriteRequests(page)
    })

    await allure.step('1. Open /payments-ui/employee/hrms/inbox, wait for animation_1dcbe0 to be hidden, choose ADMIN_KAMBIA in the Hierarchy type dropdown and click Next', async () => {
      await openUserSearch(page, BASE_URL)
    })
    await allure.step('2. Wait for the results rows to render and the next-page button (#pagination-next-page) to be enabled', async () => {
      await expect(inbox.resultRows().first()).toBeVisible()
      await expect(inbox.nextPage(), 'next-page button enabled (more than 10 users exist)').toBeEnabled({ timeout: 30_000 })
    })
    await allure.step('3. Click #pagination-next-page and wait for the POST /egov-hrms/employees/_search response', async () => {
      const searched = page.waitForResponse(r => PaymentsUiEmployeeHrmsInboxPage.SEARCH_API_RE.test(r.url()))
      await inbox.nextPage().click()
      pageTwo = await searched
    })

    await allure.step('Assert: search_request_offset_is_10', async () => {
      expect(new URL(pageTwo.request().url()).searchParams.get('offset')).toBe(data.expectedOffset)
    })
    await allure.step('Assert: result_rows_at_least_1', async () => {
      await expect(inbox.resultRows().first()).toBeVisible()
    })
    await allure.step('Assert: first_page_button_enabled', async () => {
      await expect(inbox.firstPage()).toBeEnabled()
    })
  })
})
