/**
 * AUTO-GENERATED — do not edit by hand.
 * Source:    tests/testcases/user-management/USR-02.yaml
 * Flow:      USR-02 — hierarchy_type_step
 * Contract:  ui-contract.json v1.3.0 (+ live capture 2026-11-16, re-verified 2026-11-18, for contract gaps)
 * Generator: /playwright-gen user-management
 * Auth:      default actor (admin) — saved workbench-login session (localStorage via playwright.config.ts).
 * Safety:    read-only; every _create/_update request is aborted.
 * Deferred:  rbac_checks USR-02-RBAC-1 (API-level) → /script-gen after `qa-kit api-scrape`.
 */
import { test, expect } from '@playwright/test'
import * as allure from 'allure-js-commons'
import { PaymentsUiEmployeeHrmsInboxPage } from '../../pages/PaymentsUiEmployeeHrmsInboxPage.page'
import { HomePage } from '../../pages/HomePage.page'
import { installOverlayHandlers, waitForLoaderGone, blockWriteRequests, loadTestData } from '../../helpers/app'

const BASE_URL = (process.env.QA_UI_BASE_URL || '').trim() || 'https://sierraleone-hcm.digit.org/workbench-ui/employee'   // .env QA_UI_BASE_URL normally supplies this
const YAML_SOURCE = 'tests/testcases/user-management/USR-02.yaml'
const OPEN_STEP = '1. Open /payments-ui/employee/hrms/inbox and wait for animation_1dcbe0 to be hidden and the Next button to be visible'

test.describe('USR-02 hierarchy_type_step', {
  tag: ['@USR-02', '@user-management', '@P1'],
}, () => {
  test('USR-02-H1: Offer the configured hierarchy in the Hierarchy type list', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await allure.tms(YAML_SOURCE + '#USR-02-H1', 'USR-02-H1')
    await allure.parameter('case_id', 'USR-02-H1')
    await allure.parameter('flow_id', 'USR-02')
    await allure.parameter('module', 'user-management')
    await allure.parameter('type', 'happy_path')
    await allure.parameter('priority', 'P1')
    await allure.parameter('test_data_ref', 'USR-02-H1')
    await allure.parameter('yaml_source', YAML_SOURCE)
    await allure.epic('user-management')
    await allure.feature('hierarchy_type_step')
    await allure.story('Offer the configured hierarchy in the Hierarchy type list')
    await allure.severity('normal')
    await allure.tag('regression')
    await allure.description('The configured hierarchy list itself; USR-01 only picks the option.\n\nSource: ' + YAML_SOURCE + '#USR-02-H1')

    const data = loadTestData<{ hierarchyOptions: string[] }>('USR-02-H1')
    const inbox = new PaymentsUiEmployeeHrmsInboxPage(page)

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      await blockWriteRequests(page)
    })

    await allure.step(OPEN_STEP, async () => {
      await inbox.goto(BASE_URL)
      await waitForLoaderGone(new HomePage(page).animation1dcbe0())
      await expect(inbox.hierarchy.next()).toBeVisible({ timeout: 60_000 })
    })
    await allure.step('2. Open the Hierarchy type dropdown (first .digit-dropdown-select; contract gap)', async () => {
      await inbox.hierarchy.openList()
    })

    await allure.step('Assert: hierarchy_options_match_test_data', async () => {
      // The options load a moment after the list opens; toHaveText retries until they match.
      await expect(inbox.hierarchy.options()).toHaveText(data.hierarchyOptions, { timeout: 30_000 })
    })
  })

  test('USR-02-E1: Keep the hierarchy step and show an error when Next is clicked with nothing chosen', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await allure.tms(YAML_SOURCE + '#USR-02-E1', 'USR-02-E1')
    await allure.parameter('case_id', 'USR-02-E1')
    await allure.parameter('flow_id', 'USR-02')
    await allure.parameter('module', 'user-management')
    await allure.parameter('type', 'negative')
    await allure.parameter('priority', 'P1')
    await allure.parameter('test_data_ref', 'USR-02-E1')
    await allure.parameter('yaml_source', YAML_SOURCE)
    await allure.epic('user-management')
    await allure.feature('hierarchy_type_step')
    await allure.story('Keep the hierarchy step and show an error when Next is clicked with nothing chosen')
    await allure.severity('normal')
    await allure.tag('regression')
    await allure.description("The step's mandatory check; every other case chooses a hierarchy first.\n\nSource: " + YAML_SOURCE + '#USR-02-E1')

    const data = loadTestData<{ expectedError: string }>('USR-02-E1')
    const inbox = new PaymentsUiEmployeeHrmsInboxPage(page)

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      await blockWriteRequests(page)
    })

    await allure.step(OPEN_STEP, async () => {
      await inbox.goto(BASE_URL)
      await waitForLoaderGone(new HomePage(page).animation1dcbe0())
      await expect(inbox.hierarchy.next()).toBeVisible({ timeout: 60_000 })
    })
    await allure.step('2. Click Next without choosing a hierarchy type', async () => {
      await inbox.hierarchy.next().click()
    })

    await allure.step('Assert: mandatory_field_error_visible', async () => {
      await expect(inbox.hierarchy.mandatoryFieldError()).toHaveText(data.expectedError)
    })
    await allure.step('Assert: search_fields_not_shown', async () => {
      await expect(inbox.hierarchy.next()).toBeVisible()
      await expect(inbox.username()).toHaveCount(0)
    })
  })
})
