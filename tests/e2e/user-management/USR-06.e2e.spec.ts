/**
 * AUTO-GENERATED — do not edit by hand.
 * Source:    tests/testcases/user-management/USR-06.yaml
 * Flow:      USR-06 — user_details_page
 * Contract:  ui-contract.json v1.3.0 (+ live capture 2026-11-16, re-verified 2026-11-18; the details page is not in the contract)
 * Generator: /playwright-gen user-management
 * Auth:      default actor (admin) — saved workbench-login session (localStorage via playwright.config.ts).
 * Safety:    read-only; every _create/_update request is aborted. Only the test account's own record is opened,
 *            and the link is clicked only when it is the single result for QA_USERNAME.
 * Deferred:  rbac_checks USR-06-RBAC-1 (API-level) → /script-gen after `qa-kit api-scrape`.
 */
import { test, expect } from '@playwright/test'
import * as allure from 'allure-js-commons'
import { PaymentsUiEmployeeHrmsInboxPage } from '../../pages/PaymentsUiEmployeeHrmsInboxPage.page'
import { PaymentsUiEmployeeHrmsDetailsPage } from '../../pages/PaymentsUiEmployeeHrmsDetailsPage.page'
import { HomePage } from '../../pages/HomePage.page'
import { expectPathnameStartsWith } from '../../helpers/routes'
import { installOverlayHandlers, waitForLoaderGone, blockWriteRequests, loadTestData } from '../../helpers/app'
import { openUserSearch, clickOnlyUsernameLink, envOrValue } from '../../helpers/users'

const BASE_URL = (process.env.QA_UI_BASE_URL || '').trim() || 'https://sierraleone-hcm.digit.org/workbench-ui/employee'   // .env QA_UI_BASE_URL normally supplies this
const YAML_SOURCE = 'tests/testcases/user-management/USR-06.yaml'
const OPEN_STEP = '1. Open /payments-ui/employee/hrms/inbox, wait for animation_1dcbe0 to be hidden, choose ADMIN_KAMBIA in the Hierarchy type dropdown and click Next'
const SEARCH_STEP = '2. Search the Username field (input name=codes) for QA_USERNAME from .env'

test.describe('USR-06 user_details_page', {
  tag: ['@USR-06', '@user-management', '@P1'],
}, () => {
  test("USR-06-H1: Open the test account's details page from the search result", {
    tag: ['@regression'],
  }, async ({ page }) => {
    await allure.tms(YAML_SOURCE + '#USR-06-H1', 'USR-06-H1')
    await allure.parameter('case_id', 'USR-06-H1')
    await allure.parameter('flow_id', 'USR-06')
    await allure.parameter('module', 'user-management')
    await allure.parameter('type', 'happy_path')
    await allure.parameter('priority', 'P1')
    await allure.parameter('test_data_ref', 'USR-06-H1')
    await allure.parameter('yaml_source', YAML_SOURCE)
    await allure.epic('user-management')
    await allure.feature('user_details_page')
    await allure.story("Open the test account's details page from the search result")
    await allure.severity('normal')
    await allure.tag('regression')
    await allure.description('The details page, reached from a search result (contract gap: page not in the contract).\n\nSource: ' + YAML_SOURCE + '#USR-06-H1')

    const data = loadTestData<{ username: string; sections: string[] }>('USR-06-H1')
    const username = envOrValue(data.username)
    const inbox = new PaymentsUiEmployeeHrmsInboxPage(page)
    const details = new PaymentsUiEmployeeHrmsDetailsPage(page)

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      await blockWriteRequests(page)
    })

    await allure.step(OPEN_STEP, async () => {
      await openUserSearch(page, BASE_URL)
    })
    await allure.step(SEARCH_STEP, async () => {
      await inbox.searchUsername(username)
    })
    await allure.step('3. Click the username link in the result row ([role=table] span.link)', async () => {
      await clickOnlyUsernameLink(page, username)
    })
    await allure.step('4. Wait for animation_1dcbe0 to be hidden', async () => {
      await waitForLoaderGone(new HomePage(page).animation1dcbe0())
    })

    await allure.step('Assert: url_pathname_starts_with_payments_ui_employee_hrms_details', async () => {
      await expectPathnameStartsWith(page, PaymentsUiEmployeeHrmsDetailsPage.PATH_PREFIX)
    })
    await allure.step('Assert: details_sections_visible', async () => {
      for (const section of data.sections) await expect(details.sectionHeading(section), section).toBeVisible({ timeout: 30_000 })
    })
    await allure.step('Assert: take_action_button_visible', async () => {
      await expect(details.takeAction()).toBeVisible()
    })
  })

  test('USR-06-H2: List the Edit actions in the Take Action menu without using them', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await allure.tms(YAML_SOURCE + '#USR-06-H2', 'USR-06-H2')
    await allure.parameter('case_id', 'USR-06-H2')
    await allure.parameter('flow_id', 'USR-06')
    await allure.parameter('module', 'user-management')
    await allure.parameter('type', 'happy_path')
    await allure.parameter('priority', 'P1')
    await allure.parameter('test_data_ref', 'USR-06-H2')
    await allure.parameter('yaml_source', YAML_SOURCE)
    await allure.epic('user-management')
    await allure.feature('user_details_page')
    await allure.story('List the Edit actions in the Take Action menu without using them')
    await allure.severity('normal')
    await allure.tag('regression')
    await allure.description('The actions offered on the logged-in account itself (two, no Deactivate); USR-13-H3 checks the three actions on another user.\n\nSource: ' + YAML_SOURCE + '#USR-06-H2')

    const data = loadTestData<{ username: string; actions: string[]; notOffered: string[] }>('USR-06-H2')
    const username = envOrValue(data.username)
    const inbox = new PaymentsUiEmployeeHrmsInboxPage(page)
    const details = new PaymentsUiEmployeeHrmsDetailsPage(page)

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      await blockWriteRequests(page)
    })

    await allure.step(OPEN_STEP, async () => {
      await openUserSearch(page, BASE_URL)
    })
    await allure.step(SEARCH_STEP, async () => {
      await inbox.searchUsername(username)
    })
    await allure.step('3. Click the username link in the result row and wait for animation_1dcbe0 to be hidden', async () => {
      await clickOnlyUsernameLink(page, username)
    })
    await allure.step('4. Click Take Action', async () => {
      await details.takeAction().click()
    })

    await allure.step('Assert: action_menu_shows_edit_employee', async () => {
      await expect(details.actionItem(data.actions[0])).toBeVisible()
    })
    await allure.step('Assert: action_menu_shows_edit_campaign_assignment', async () => {
      await expect(details.actionItem(data.actions[1])).toBeVisible()
    })
    await allure.step('Assert: deactivate_not_offered_for_own_account', async () => {
      await expect(details.actionItems()).toHaveText(data.actions)
      for (const action of data.notOffered) await expect(details.actionItem(action), action).toHaveCount(0)
    })
  })
})
