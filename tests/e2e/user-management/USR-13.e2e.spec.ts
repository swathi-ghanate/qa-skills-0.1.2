/**
 * AUTO-GENERATED — do not edit by hand.
 * Source:    tests/testcases/user-management/USR-13.yaml
 * Flow:      USR-13 — take_action_on_searched_user
 * Contract:  ui-contract.json v1.3.0 (+ live capture 2026-11-16, re-verified 2026-11-18; details, edit and
 *            assign-campaign pages are not in the contract)
 * Generator: /playwright-gen user-management
 * Auth:      default actor (admin) — saved workbench-login session (localStorage via playwright.config.ts).
 * Here:      H1–H2, read-only on the test login account's own record; every _create/_update request is aborted.
 *            H3, H5 and H4 act on the run's single test user (decided 2026-11-18), so they live in
 *            USR-lifecycle.e2e.spec.ts after USR-10-H1.
 * Deferred:  rbac_checks USR-13-RBAC-1 (API-level) → /script-gen after `qa-kit api-scrape`.
 */
import { test, expect, type Page } from '@playwright/test'
import * as allure from 'allure-js-commons'
import { PaymentsUiEmployeeHrmsInboxPage } from '../../pages/PaymentsUiEmployeeHrmsInboxPage.page'
import { PaymentsUiEmployeeHrmsDetailsPage } from '../../pages/PaymentsUiEmployeeHrmsDetailsPage.page'
import { PaymentsUiEmployeeHrmsEditPage } from '../../pages/PaymentsUiEmployeeHrmsEditPage.page'
import { PaymentsUiEmployeeHrmsAssignCampaignPage } from '../../pages/PaymentsUiEmployeeHrmsAssignCampaignPage.page'
import { HomePage } from '../../pages/HomePage.page'
import { expectPathnameStartsWith } from '../../helpers/routes'
import { installOverlayHandlers, waitForLoaderGone, blockWriteRequests, loadTestData } from '../../helpers/app'
import { openUserSearch, clickOnlyUsernameLink, envOrValue } from '../../helpers/users'

const BASE_URL = (process.env.QA_UI_BASE_URL || '').trim() || 'https://sierraleone-hcm.digit.org/workbench-ui/employee'   // .env QA_UI_BASE_URL normally supplies this
const YAML_SOURCE = 'tests/testcases/user-management/USR-13.yaml'
const OPEN_STEP = '1. Open /payments-ui/employee/hrms/inbox, wait for animation_1dcbe0 to be hidden, choose ADMIN_KAMBIA in the Hierarchy type dropdown and click Next'
const OWN_SEARCH_STEP = '2. Search the Username field (input name=codes) for QA_USERNAME from .env and click the username link in the result row'

type Meta = { id: string; title: string; coverage: string }

/** Traceability and report metadata (H1 and H2 are P1 happy_path regression cases). */
async function annotate(m: Meta): Promise<void> {
  await allure.tms(YAML_SOURCE + '#' + m.id, m.id)
  await allure.parameter('case_id', m.id)
  await allure.parameter('flow_id', 'USR-13')
  await allure.parameter('module', 'user-management')
  await allure.parameter('type', 'happy_path')
  await allure.parameter('priority', 'P1')
  await allure.parameter('test_data_ref', m.id)
  await allure.parameter('yaml_source', YAML_SOURCE)
  await allure.epic('user-management')
  await allure.feature('take_action_on_searched_user')
  await allure.story(m.title)
  await allure.severity('normal')
  await allure.tag('regression')
  await allure.description(m.coverage + '\n\nSource: ' + YAML_SOURCE + '#' + m.id)
}

/** Steps 1–2: open Search user and the test login account's own details page. */
async function openOwnDetails(page: Page, username: string): Promise<void> {
  await allure.step(OPEN_STEP, async () => {
    await openUserSearch(page, BASE_URL)
  })
  await allure.step(OWN_SEARCH_STEP, async () => {
    await new PaymentsUiEmployeeHrmsInboxPage(page).searchUsername(username)
    await clickOnlyUsernameLink(page, username)
  })
}

test.describe('USR-13 take_action_on_searched_user', {
  tag: ['@USR-13', '@user-management', '@P1'],
}, () => {
  test('USR-13-H1: Open the Edit Employee form of a searched user without saving', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await annotate({ id: 'USR-13-H1', title: 'Open the Edit Employee form of a searched user without saving', coverage: 'Action 1 (Edit Employee) opens a prefilled form for the chosen user; USR-11 covers actually saving an edit.' })
    const data = loadTestData<{ username: string; expectedPathPrefix: string; sections: string[] }>('USR-13-H1')
    const username = envOrValue(data.username)
    const details = new PaymentsUiEmployeeHrmsDetailsPage(page)
    const edit = new PaymentsUiEmployeeHrmsEditPage(page)

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      await blockWriteRequests(page)   // nothing is saved; Submit is never clicked
    })

    await openOwnDetails(page, username)
    await allure.step('3. Click Take Action, then Edit Employee', async () => {
      await details.chooseAction('Edit Employee')
    })
    await allure.step('4. Wait for animation_1dcbe0 to be hidden', async () => {
      await waitForLoaderGone(new HomePage(page).animation1dcbe0())
    })

    await allure.step('Assert: url_pathname_starts_with_payments_ui_employee_hrms_edit', async () => {
      await expectPathnameStartsWith(page, data.expectedPathPrefix)
    })
    await allure.step('Assert: edit_form_username_is_own_username', async () => {
      await expect(edit.username()).toBeVisible({ timeout: 30_000 })
      await expect.poll(async () => (await edit.username().inputValue()) === username, { message: 'the Username field shows QA_USERNAME' }).toBe(true)
    })
    await allure.step('Assert: edit_form_sections_visible', async () => {
      for (const section of data.sections) await expect(edit.sectionHeading(section), section).toBeVisible()
    })
    await allure.step('Assert: edit_form_submit_visible', async () => {
      await expect(edit.submit()).toBeVisible()
    })
  })

  test('USR-13-H2: Open the Edit Campaign Assignment page of a searched user without assigning', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await annotate({ id: 'USR-13-H2', title: 'Open the Edit Campaign Assignment page of a searched user without assigning', coverage: 'Action 3 (Edit Campaign Assignment) opens its campaign search page; H5 covers assigning and unassigning.' })
    const data = loadTestData<{ username: string; expectedPathPrefix: string; fields: string[]; buttons: string[] }>('USR-13-H2')
    const username = envOrValue(data.username)
    const details = new PaymentsUiEmployeeHrmsDetailsPage(page)
    const assign = new PaymentsUiEmployeeHrmsAssignCampaignPage(page)

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      await blockWriteRequests(page)   // Assign and Unassign are never clicked
    })

    await openOwnDetails(page, username)
    await allure.step('3. Click Take Action, then Edit Campaign Assignment', async () => {
      await details.chooseAction('Edit Campaign Assignment')
    })
    await allure.step('4. Wait for animation_1dcbe0 to be hidden', async () => {
      await waitForLoaderGone(new HomePage(page).animation1dcbe0())
    })

    await allure.step('Assert: url_pathname_starts_with_payments_ui_employee_hrms_update_assign_campaign', async () => {
      await expectPathnameStartsWith(page, data.expectedPathPrefix)
    })
    await allure.step('Assert: search_campaign_fields_visible', async () => {
      await expect(assign.heading()).toBeVisible({ timeout: 30_000 })
      for (const field of data.fields) await expect(assign.fieldLabel(field), field).toBeVisible()
      for (const input of [assign.projectName(), assign.projectNumber(), assign.startDate(), assign.endDate()]) await expect(input).toBeVisible()
    })
    await allure.step('Assert: assign_and_unassign_buttons_visible', async () => {
      // Assign/Unassign appear once per listed campaign (the own account had 4 Assign and 1 Unassign on 2026-11-18).
      await expect(assign.search()).toBeVisible()
      await expect(assign.clear()).toBeVisible()
      await expect(assign.assignButtons().first()).toBeVisible({ timeout: 30_000 })
      await expect(assign.unassignButtons().first()).toBeVisible()
    })
  })
})
