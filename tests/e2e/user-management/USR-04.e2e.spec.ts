/**
 * AUTO-GENERATED — do not edit by hand.
 * Source:    tests/testcases/user-management/USR-04.yaml
 * Flow:      USR-04 — default_list_clear_and_filters
 * Contract:  ui-contract.json v1.3.0 (+ live capture 2026-11-16, re-verified 2026-11-18, for contract gaps)
 * Generator: /playwright-gen user-management
 * Auth:      default actor (admin) — saved workbench-login session (localStorage via playwright.config.ts).
 * Safety:    read-only; every _create/_update request is aborted.
 * Privacy:   only counts, headers and request parameters are asserted; row values are never read.
 * Confirmed 2026-11-18: the status filter is sent as isActive=false; the role filter as roles=<role code>.
 * Deferred:  rbac_checks USR-04-RBAC-1 (API-level) → /script-gen after `qa-kit api-scrape`.
 */
import { test, expect, type Response } from '@playwright/test'
import * as allure from 'allure-js-commons'
import { PaymentsUiEmployeeHrmsInboxPage } from '../../pages/PaymentsUiEmployeeHrmsInboxPage.page'
import { installOverlayHandlers, blockWriteRequests, loadTestData } from '../../helpers/app'
import { openUserSearch } from '../../helpers/users'

const BASE_URL = (process.env.QA_UI_BASE_URL || '').trim() || 'https://sierraleone-hcm.digit.org/workbench-ui/employee'   // .env QA_UI_BASE_URL normally supplies this
const YAML_SOURCE = 'tests/testcases/user-management/USR-04.yaml'
const OPEN_STEP = '1. Open /payments-ui/employee/hrms/inbox, wait for animation_1dcbe0 to be hidden, choose ADMIN_KAMBIA in the Hierarchy type dropdown and click Next'

const params = (response: Response) => new URL(response.request().url()).searchParams
const nextSearch = (inbox: PaymentsUiEmployeeHrmsInboxPage) => inbox.page.waitForResponse(r => PaymentsUiEmployeeHrmsInboxPage.SEARCH_API_RE.test(r.url()))

test.describe('USR-04 default_list_clear_and_filters', {
  tag: ['@USR-04', '@user-management', '@P1'],
}, () => {
  test('USR-04-H1: List the most recently changed users when the search page opens', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await allure.tms(YAML_SOURCE + '#USR-04-H1', 'USR-04-H1')
    await allure.parameter('case_id', 'USR-04-H1')
    await allure.parameter('flow_id', 'USR-04')
    await allure.parameter('module', 'user-management')
    await allure.parameter('type', 'happy_path')
    await allure.parameter('priority', 'P1')
    await allure.parameter('test_data_ref', 'USR-04-H1')
    await allure.parameter('yaml_source', YAML_SOURCE)
    await allure.epic('user-management')
    await allure.feature('default_list_clear_and_filters')
    await allure.story('List the most recently changed users when the search page opens')
    await allure.severity('normal')
    await allure.tag('regression')
    await allure.description("The page's default list and sort order, which no search case checks.\n\nSource: " + YAML_SOURCE + '#USR-04-H1')

    const data = loadTestData<{ expectedQuery: Record<string, string> }>('USR-04-H1')
    const headers = loadTestData<{ tableHeaders: string[] }>('USR-01-H1').tableHeaders   // same table; headers are kept once, in USR-01-H1
    const inbox = new PaymentsUiEmployeeHrmsInboxPage(page)
    let firstSearch!: Response

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      await blockWriteRequests(page)
    })

    await allure.step(OPEN_STEP + ' (the first search response is captured from here)', async () => {
      firstSearch = await openUserSearch(page, BASE_URL)
    })
    await allure.step('2. Wait for the first POST /egov-hrms/employees/_search response and for the results rows to render', async () => {
      expect(firstSearch.status()).toBe(200)
      await expect(inbox.resultRows().first()).toBeVisible()
    })

    await allure.step('Assert: default_search_request_params', async () => {
      const query = params(firstSearch)
      for (const [name, value] of Object.entries(data.expectedQuery)) expect(query.get(name), name).toBe(value)
    })
    await allure.step('Assert: result_rows_between_1_and_10', async () => {
      const rows = await inbox.resultRows().count()
      expect(rows).toBeGreaterThanOrEqual(1)
      expect(rows).toBeLessThanOrEqual(10)
    })
    await allure.step('Assert: results_table_headers_shown', async () => {
      await expect(inbox.columnHeaders()).toHaveText(headers)
    })
  })

  test('USR-04-H2: Keep the list without an error when searching with every field empty', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await allure.tms(YAML_SOURCE + '#USR-04-H2', 'USR-04-H2')
    await allure.parameter('case_id', 'USR-04-H2')
    await allure.parameter('flow_id', 'USR-04')
    await allure.parameter('module', 'user-management')
    await allure.parameter('type', 'edge_case')
    await allure.parameter('priority', 'P1')
    await allure.parameter('test_data_ref', 'USR-04-H2')
    await allure.parameter('yaml_source', YAML_SOURCE)
    await allure.epic('user-management')
    await allure.feature('default_list_clear_and_filters')
    await allure.story('Keep the list without an error when searching with every field empty')
    await allure.severity('normal')
    await allure.tag('regression')
    await allure.description('Empty-criteria search (observed: same list, no error); distinct from H1 (no click) and USR-03 (filled criteria).\n\nSource: ' + YAML_SOURCE + '#USR-04-H2')

    const inbox = new PaymentsUiEmployeeHrmsInboxPage(page)
    let emptySearch!: Response

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      await blockWriteRequests(page)
    })

    await allure.step(OPEN_STEP, async () => {
      await openUserSearch(page, BASE_URL)
    })
    await allure.step('2. Wait for the results rows to render', async () => {
      await expect(inbox.resultRows().first()).toBeVisible()
    })
    await allure.step('3. Click Search with Employee Name, Username and Mobile Number all empty', async () => {
      await expect(inbox.employeeName()).toHaveValue('')
      await expect(inbox.username()).toHaveValue('')
      await expect(inbox.mobileNumber()).toHaveValue('')
      const searched = nextSearch(inbox)
      await inbox.search().click()
      emptySearch = await searched
    })

    await allure.step('Assert: result_rows_between_1_and_10', async () => {
      expect(emptySearch.status()).toBe(200)
      await expect(inbox.resultRows().first()).toBeVisible()
      const rows = await inbox.resultRows().count()
      expect(rows).toBeGreaterThanOrEqual(1)
      expect(rows).toBeLessThanOrEqual(10)
    })
    await allure.step('Assert: no_results_found_not_shown', async () => {
      await expect(inbox.noResults()).toHaveCount(0)
    })
  })

  test('USR-04-H3: Empty the search fields when Clear is clicked', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await allure.tms(YAML_SOURCE + '#USR-04-H3', 'USR-04-H3')
    await allure.parameter('case_id', 'USR-04-H3')
    await allure.parameter('flow_id', 'USR-04')
    await allure.parameter('module', 'user-management')
    await allure.parameter('type', 'happy_path')
    await allure.parameter('priority', 'P1')
    await allure.parameter('test_data_ref', 'USR-04-H3')
    await allure.parameter('yaml_source', YAML_SOURCE)
    await allure.epic('user-management')
    await allure.feature('default_list_clear_and_filters')
    await allure.story('Empty the search fields when Clear is clicked')
    await allure.severity('normal')
    await allure.tag('regression')
    await allure.description('The Clear button of the search form.\n\nSource: ' + YAML_SOURCE + '#USR-04-H3')

    const data = loadTestData<{ employeeName: string; username: string }>('USR-04-H3')
    const inbox = new PaymentsUiEmployeeHrmsInboxPage(page)

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      await blockWriteRequests(page)
    })

    await allure.step(OPEN_STEP, async () => {
      await openUserSearch(page, BASE_URL)
    })
    await allure.step('2. Fill Employee Name (input name=names) and Username (input name=codes) with the synthetic values from test data USR-04-H3', async () => {
      await inbox.employeeName().fill(data.employeeName)
      await inbox.username().fill(data.username)
      await expect(inbox.employeeName()).toHaveValue(data.employeeName)
      await expect(inbox.username()).toHaveValue(data.username)
    })
    await allure.step('3. Click Clear', async () => {
      await inbox.clear().click()
    })

    await allure.step('Assert: employee_name_field_empty', async () => {
      await expect(inbox.employeeName()).toHaveValue('')
    })
    await allure.step('Assert: username_field_empty', async () => {
      await expect(inbox.username()).toHaveValue('')
    })
  })

  test('USR-04-H4: Send the Employment Status filter when Inactive is applied', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await allure.tms(YAML_SOURCE + '#USR-04-H4', 'USR-04-H4')
    await allure.parameter('case_id', 'USR-04-H4')
    await allure.parameter('flow_id', 'USR-04')
    await allure.parameter('module', 'user-management')
    await allure.parameter('type', 'happy_path')
    await allure.parameter('priority', 'P1')
    await allure.parameter('test_data_ref', 'USR-04-H4')
    await allure.parameter('yaml_source', YAML_SOURCE)
    await allure.epic('user-management')
    await allure.feature('default_list_clear_and_filters')
    await allure.story('Send the Employment Status filter when Inactive is applied')
    await allure.severity('normal')
    await allure.tag('regression')
    await allure.description("The status filter reaches the search request; checked by the request, not by other people's row data.\n\nSource: " + YAML_SOURCE + '#USR-04-H4')

    const data = loadTestData<{ status: string }>('USR-04-H4')
    const inbox = new PaymentsUiEmployeeHrmsInboxPage(page)
    let filtered!: Response

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      await blockWriteRequests(page)
    })

    await allure.step(OPEN_STEP, async () => {
      await openUserSearch(page, BASE_URL)
    })
    await allure.step('2. Wait for the results rows to render', async () => {
      await expect(inbox.resultRows().first()).toBeVisible()
    })
    await allure.step('3. Click the Inactive Employment Status radio (test data USR-04-H4)', async () => {
      await inbox.statusRadio(data.status).click()
      await expect(inbox.statusRadio(data.status)).toBeChecked()
    })
    await allure.step('4. Click Apply Filters and wait for the POST /egov-hrms/employees/_search response', async () => {
      const searched = nextSearch(inbox)
      await inbox.applyFilters().click()
      filtered = await searched
    })

    await allure.step('Assert: search_request_has_inactive_status_filter', async () => {
      expect(params(filtered).get('isActive'), 'isActive request parameter').toBe('false')
    })
    await allure.step('Assert: result_rows_at_most_10', async () => {
      expect(filtered.status()).toBe(200)
      expect(await inbox.resultRows().count()).toBeLessThanOrEqual(10)
    })
  })

  test('USR-04-H5: Remove the Employment Status filter when Clear Filter is clicked', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await allure.tms(YAML_SOURCE + '#USR-04-H5', 'USR-04-H5')
    await allure.parameter('case_id', 'USR-04-H5')
    await allure.parameter('flow_id', 'USR-04')
    await allure.parameter('module', 'user-management')
    await allure.parameter('type', 'happy_path')
    await allure.parameter('priority', 'P1')
    await allure.parameter('test_data_ref', 'USR-04-H5')
    await allure.parameter('yaml_source', YAML_SOURCE)
    await allure.epic('user-management')
    await allure.feature('default_list_clear_and_filters')
    await allure.story('Remove the Employment Status filter when Clear Filter is clicked')
    await allure.severity('normal')
    await allure.tag('regression')
    await allure.description('Undoing a filter; H4 only applies it.\n\nSource: ' + YAML_SOURCE + '#USR-04-H5')

    const data = loadTestData<{ status: string }>('USR-04-H5')
    const inbox = new PaymentsUiEmployeeHrmsInboxPage(page)
    const searchRequests: URL[] = []
    page.on('request', r => { if (PaymentsUiEmployeeHrmsInboxPage.SEARCH_API_RE.test(r.url())) searchRequests.push(new URL(r.url())) })

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      await blockWriteRequests(page)
    })

    await allure.step(OPEN_STEP, async () => {
      await openUserSearch(page, BASE_URL)
    })
    await allure.step('2. Click the Inactive Employment Status radio and click Apply Filters, then wait for the search response', async () => {
      await inbox.statusRadio(data.status).click()
      const searched = nextSearch(inbox)
      await inbox.applyFilters().click()
      await searched
    })
    await allure.step('3. Click Clear Filter and wait for the next search response', async () => {
      const searched = nextSearch(inbox)
      await inbox.clearFilter().click()
      await searched
    })

    await allure.step('Assert: status_radios_unchecked', async () => {
      const radios = inbox.statusRadios()
      await expect(radios).toHaveCount(2)
      for (let i = 0; i < 2; i++) await expect(radios.nth(i)).not.toBeChecked()
    })
    await allure.step('Assert: last_search_request_without_status_filter', async () => {
      // Clear Filter can send several searches; poll so the last one is checked once they settle.
      await expect
        .poll(() => searchRequests[searchRequests.length - 1]?.searchParams.get('isActive') ?? null,
          { message: 'isActive in the last search request after Clear Filter' })
        .toBeNull()
    })
  })

  test('USR-04-H6: Send the role filter when a role is chosen in By Role and applied', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await allure.tms(YAML_SOURCE + '#USR-04-H6', 'USR-04-H6')
    await allure.parameter('case_id', 'USR-04-H6')
    await allure.parameter('flow_id', 'USR-04')
    await allure.parameter('module', 'user-management')
    await allure.parameter('type', 'happy_path')
    await allure.parameter('priority', 'P1')
    await allure.parameter('test_data_ref', 'USR-04-H6')
    await allure.parameter('yaml_source', YAML_SOURCE)
    await allure.epic('user-management')
    await allure.feature('default_list_clear_and_filters')
    await allure.story('Send the role filter when a role is chosen in By Role and applied')
    await allure.severity('normal')
    await allure.tag('regression')
    await allure.description('The role filter, a different request parameter from the status filter in H4.\n\nSource: ' + YAML_SOURCE + '#USR-04-H6')

    const data = loadTestData<{ role: string }>('USR-04-H6')
    const inbox = new PaymentsUiEmployeeHrmsInboxPage(page)
    let filtered!: Response

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      await blockWriteRequests(page)
    })

    await allure.step(OPEN_STEP, async () => {
      await openUserSearch(page, BASE_URL)
    })
    await allure.step('2. Wait for the results rows to render', async () => {
      await expect(inbox.resultRows().first()).toBeVisible()
    })
    await allure.step('3. Choose the role from test data USR-04-H6 in the By Role dropdown (contract gap)', async () => {
      await inbox.byRoleDropdown().click()
      await inbox.dropdownOption(data.role).click()
    })
    await allure.step('4. Click Apply Filters and wait for the POST /egov-hrms/employees/_search response', async () => {
      const searched = nextSearch(inbox)
      await inbox.applyFilters().click()
      filtered = await searched
    })

    await allure.step('Assert: search_request_has_role_filter', async () => {
      expect(params(filtered).get('roles') ?? '', 'roles request parameter').not.toBe('')
    })
    await allure.step('Assert: result_rows_at_most_10', async () => {
      expect(filtered.status()).toBe(200)
      expect(await inbox.resultRows().count()).toBeLessThanOrEqual(10)
    })
  })
})
