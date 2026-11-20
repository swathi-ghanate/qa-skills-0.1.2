/**
 * AUTO-GENERATED — do not edit by hand.
 * Source:    tests/testcases/user-management/USR-03.yaml
 * Flow:      USR-03 — search_by_username
 * Contract:  ui-contract.json v1.3.0 (+ live capture 2026-11-16, re-verified 2026-11-18, for contract gaps)
 * Generator: /playwright-gen user-management
 * Auth:      default actor (admin) — saved workbench-login session (localStorage via playwright.config.ts).
 * Safety:    read-only; every _create/_update request is aborted.
 * Privacy:   only the test account's own username, name and number are searched. The name and number are read
 *            from the saved login at run time, filled with fillPrivately and compared as booleans, so they never
 *            appear in a step title, an assertion message or a report.
 * Deferred:  rbac_checks USR-03-RBAC-1 (API-level) → /script-gen after `qa-kit api-scrape`.
 */
import { test, expect, type Response } from '@playwright/test'
import * as allure from 'allure-js-commons'
import { PaymentsUiEmployeeHrmsInboxPage } from '../../pages/PaymentsUiEmployeeHrmsInboxPage.page'
import { installOverlayHandlers, blockWriteRequests, loadTestData, fillPrivately } from '../../helpers/app'
import { openUserSearch, envOrValue, sessionValue } from '../../helpers/users'
import { requiredEnv } from '../../helpers/requiredEnv'

const BASE_URL = (process.env.QA_UI_BASE_URL || '').trim() || 'https://sierraleone-hcm.digit.org/workbench-ui/employee'   // .env QA_UI_BASE_URL normally supplies this
const YAML_SOURCE = 'tests/testcases/user-management/USR-03.yaml'
const OPEN_STEP = '1. Open /payments-ui/employee/hrms/inbox, wait for animation_1dcbe0 to be hidden, choose ADMIN_KAMBIA in the Hierarchy type dropdown and click Next'
const SEARCH_STEP = '3. Click Search and wait for the POST /egov-hrms/employees/_search response'

/** The search response that carries `param` (the default list request is still in flight when the page opens). */
const searchResponseWith = (inbox: PaymentsUiEmployeeHrmsInboxPage, param: string) =>
  inbox.page.waitForResponse(r => PaymentsUiEmployeeHrmsInboxPage.SEARCH_API_RE.test(r.url()) && new URL(r.url()).searchParams.has(param))

const linkTexts = async (inbox: PaymentsUiEmployeeHrmsInboxPage) => (await inbox.usernameLinks().allInnerTexts()).map(t => t.trim())

test.describe('USR-03 search_by_username', {
  tag: ['@USR-03', '@user-management', '@P0'],
}, () => {
  test('USR-03-H1: Find exactly the test account when searching its own username', {
    tag: ['@smoke', '@regression'],
  }, async ({ page }) => {
    await allure.tms(YAML_SOURCE + '#USR-03-H1', 'USR-03-H1')
    await allure.parameter('case_id', 'USR-03-H1')
    await allure.parameter('flow_id', 'USR-03')
    await allure.parameter('module', 'user-management')
    await allure.parameter('type', 'happy_path')
    await allure.parameter('priority', 'P0')
    await allure.parameter('test_data_ref', 'USR-03-H1')
    await allure.parameter('yaml_source', YAML_SOURCE)
    await allure.epic('user-management')
    await allure.feature('search_by_username')
    await allure.story('Find exactly the test account when searching its own username')
    await allure.severity('critical')
    await allure.tag('smoke')
    await allure.tag('regression')
    await allure.description('The core search: a known username returns that one user, with its username as the link to the details page.\n\nSource: ' + YAML_SOURCE + '#USR-03-H1')

    const data = loadTestData<{ username: string }>('USR-03-H1')
    const username = envOrValue(data.username)
    const inbox = new PaymentsUiEmployeeHrmsInboxPage(page)
    let response!: Response

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      await blockWriteRequests(page)
    })

    await allure.step(OPEN_STEP, async () => {
      await openUserSearch(page, BASE_URL)
    })
    await allure.step('2. Fill the Username field (input name=codes) with QA_USERNAME from .env', async () => {
      await inbox.username().fill(username)
    })
    await allure.step(SEARCH_STEP, async () => {
      const searched = searchResponseWith(inbox, 'codes')
      await inbox.search().click()
      response = await searched
    })

    await allure.step('Assert: search_request_has_codes_parameter', async () => {
      const codes = new URL(response.request().url()).searchParams.get('codes')
      expect(codes === username, 'the search request sends codes = QA_USERNAME').toBe(true)
    })
    await allure.step('Assert: exactly_one_result_row', async () => {
      await expect(inbox.resultRows()).toHaveCount(1)
    })
    await allure.step('Assert: result_username_link_is_own_username', async () => {
      await expect.poll(async () => (await linkTexts(inbox)).join('|') === username, { message: 'the only username link is QA_USERNAME' }).toBe(true)
    })
  })

  test('USR-03-E1: Show "No Results Found" for an unknown username', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await allure.tms(YAML_SOURCE + '#USR-03-E1', 'USR-03-E1')
    await allure.parameter('case_id', 'USR-03-E1')
    await allure.parameter('flow_id', 'USR-03')
    await allure.parameter('module', 'user-management')
    await allure.parameter('type', 'negative')
    await allure.parameter('priority', 'P1')
    await allure.parameter('test_data_ref', 'USR-03-E1')
    await allure.parameter('yaml_source', YAML_SOURCE)
    await allure.epic('user-management')
    await allure.feature('search_by_username')
    await allure.story('Show "No Results Found" for an unknown username')
    await allure.severity('normal')
    await allure.tag('regression')
    await allure.description('The empty-result path (observed live 2026-11-16: "No Results Found"), which H1 never reaches.\n\nSource: ' + YAML_SOURCE + '#USR-03-E1')

    const data = loadTestData<{ username: string; expectedText: string }>('USR-03-E1')
    const inbox = new PaymentsUiEmployeeHrmsInboxPage(page)
    let response!: Response

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      await blockWriteRequests(page)
    })

    await allure.step(OPEN_STEP, async () => {
      await openUserSearch(page, BASE_URL)
    })
    await allure.step('2. Fill the Username field (input name=codes) with the unknown username from test data USR-03-E1', async () => {
      await inbox.username().fill(data.username)
    })
    await allure.step(SEARCH_STEP, async () => {
      const searched = searchResponseWith(inbox, 'codes')
      await inbox.search().click()
      response = await searched
    })

    await allure.step('Assert: search_response_has_zero_employees', async () => {
      expect(response.status()).toBe(200)
      const body = (await response.json()) as { Employees?: unknown[] }
      expect(body.Employees, 'Employees in the response').toHaveLength(0)
    })
    await allure.step('Assert: no_results_found_visible', async () => {
      await expect(page.getByText(data.expectedText, { exact: true })).toBeVisible()
    })
  })

  test('USR-03-H2: Find the test account when searching its own name in Employee Name', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await allure.tms(YAML_SOURCE + '#USR-03-H2', 'USR-03-H2')
    await allure.parameter('case_id', 'USR-03-H2')
    await allure.parameter('flow_id', 'USR-03')
    await allure.parameter('module', 'user-management')
    await allure.parameter('type', 'happy_path')
    await allure.parameter('priority', 'P1')
    await allure.parameter('test_data_ref', 'USR-03-H2')
    await allure.parameter('yaml_source', YAML_SOURCE)
    await allure.epic('user-management')
    await allure.feature('search_by_username')
    await allure.story('Find the test account when searching its own name in Employee Name')
    await allure.severity('normal')
    await allure.tag('regression')
    await allure.description('Search by name, a different search field (names) from H1 (codes).\n\nSource: ' + YAML_SOURCE + '#USR-03-H2')

    const data = loadTestData<{ employeeName: string }>('USR-03-H2')
    const username = requiredEnv('QA_USERNAME')
    const inbox = new PaymentsUiEmployeeHrmsInboxPage(page)
    let ownName = ''
    let response!: Response

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      await blockWriteRequests(page)
    })

    await allure.step(OPEN_STEP, async () => {
      await openUserSearch(page, BASE_URL)
    })
    await allure.step("2. Fill the Employee Name field (input name=names) with the test account's own name from the saved session", async () => {
      ownName = await sessionValue(page, data.employeeName)
      await fillPrivately(inbox.employeeName(), ownName)
    })
    await allure.step(SEARCH_STEP, async () => {
      const searched = searchResponseWith(inbox, 'names')
      await inbox.search().click()
      response = await searched
    })

    await allure.step('Assert: search_request_has_names_parameter', async () => {
      const names = new URL(response.request().url()).searchParams.get('names')
      expect(names === ownName, "the search request sends names = the account's own name").toBe(true)
    })
    await allure.step('Assert: own_username_among_results', async () => {
      // Other users with the same name may also appear; only the presence of the own username is checked.
      await expect.poll(async () => (await linkTexts(inbox)).includes(username), { message: 'QA_USERNAME is among the results' }).toBe(true)
    })
  })

  test('USR-03-H3: Find the test account when searching its own mobile number', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await allure.tms(YAML_SOURCE + '#USR-03-H3', 'USR-03-H3')
    await allure.parameter('case_id', 'USR-03-H3')
    await allure.parameter('flow_id', 'USR-03')
    await allure.parameter('module', 'user-management')
    await allure.parameter('type', 'happy_path')
    await allure.parameter('priority', 'P1')
    await allure.parameter('test_data_ref', 'USR-03-H3')
    await allure.parameter('yaml_source', YAML_SOURCE)
    await allure.epic('user-management')
    await allure.feature('search_by_username')
    await allure.story('Find the test account when searching its own mobile number')
    await allure.severity('normal')
    await allure.tag('regression')
    await allure.description('Search by mobile number, the third search field (phone).\n\nSource: ' + YAML_SOURCE + '#USR-03-H3')

    const data = loadTestData<{ mobileNumber: string }>('USR-03-H3')
    const username = requiredEnv('QA_USERNAME')
    const inbox = new PaymentsUiEmployeeHrmsInboxPage(page)
    let ownMobile = ''
    let response!: Response

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      await blockWriteRequests(page)
    })

    await allure.step(OPEN_STEP, async () => {
      await openUserSearch(page, BASE_URL)
    })
    await allure.step("2. Fill the Mobile Number field (input name=phone) with the test account's own mobile number from the saved session", async () => {
      ownMobile = await sessionValue(page, data.mobileNumber)
      await fillPrivately(inbox.mobileNumber(), ownMobile)
    })
    await allure.step(SEARCH_STEP, async () => {
      const searched = searchResponseWith(inbox, 'phone')
      await inbox.search().click()
      response = await searched
    })

    await allure.step('Assert: search_request_has_phone_parameter', async () => {
      const phone = new URL(response.request().url()).searchParams.get('phone')
      expect(phone === ownMobile, "the search request sends phone = the account's own number").toBe(true)
    })
    await allure.step('Assert: own_username_among_results', async () => {
      await expect.poll(async () => (await linkTexts(inbox)).includes(username), { message: 'QA_USERNAME is among the results' }).toBe(true)
    })
  })
})
