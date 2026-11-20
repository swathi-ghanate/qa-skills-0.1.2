/**
 * AUTO-GENERATED — do not edit by hand.
 * Source:    tests/testcases/complaints/CMP-10.yaml
 * Flow:      CMP-10 — breadcrumb_home
 * Contract:  ui-contract.json v1.3.0
 * Generator: /playwright-gen complaints
 * Deferred:  rbac_checks CMP-10-RBAC-1 (API-level, endpoint TBD) → /script-gen after `qa-kit api-scrape`.
 */
import { test, expect } from '@playwright/test'
import * as allure from 'allure-js-commons'
import { PaymentsUiEmployeePgrCreateComplaintPage } from '../../pages/PaymentsUiEmployeePgrCreateComplaintPage.page'
import { HomePage } from '../../pages/HomePage.page'
import { expectPathnameNot, expectPathnameStartsWith } from '../../helpers/routes'
import { installOverlayHandlers, waitForLoaderGone, blockCreateRequests } from '../../helpers/app'

const BASE_URL = (process.env.QA_UI_BASE_URL || '').trim() || 'https://sierraleone-hcm.digit.org/workbench-ui/employee'   // .env QA_UI_BASE_URL normally supplies this
const YAML_SOURCE = 'tests/testcases/complaints/CMP-10.yaml'

test.describe('CMP-10 breadcrumb_home', {
  tag: ['@CMP-10', '@complaints', '@P2'],
}, () => {
  test('CMP-10-H1: Leave the form through the breadcrumb Home link', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await allure.tms(YAML_SOURCE + '#CMP-10-H1', 'CMP-10-H1')
    await allure.parameter('case_id', 'CMP-10-H1')
    await allure.parameter('flow_id', 'CMP-10')
    await allure.parameter('module', 'complaints')
    await allure.parameter('type', 'happy_path')
    await allure.parameter('priority', 'P2')
    await allure.parameter('test_data_ref', 'CMP-10-H1')
    await allure.parameter('yaml_source', YAML_SOURCE)
    await allure.epic('complaints')
    await allure.feature('breadcrumb_home')
    await allure.story('Leave the form through the breadcrumb Home link')
    await allure.severity('minor')
    await allure.tag('regression')
    await allure.description('The only way out of the form that the page itself offers.\n\nSource: ' + YAML_SOURCE + '#CMP-10-H1')

    const form = new PaymentsUiEmployeePgrCreateComplaintPage(page)
    const loader = new HomePage(page)

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      await blockCreateRequests(page)
    })

    await allure.step('1. Open /payments-ui/employee/pgr/create-complaint and wait for animation_1dcbe0 to be hidden', async () => {
      await form.goto(BASE_URL)
      await waitForLoaderGone(loader.animation1dcbe0())
      await expect(form.homeB6873d()).toBeVisible({ timeout: 60_000 })
    })
    await allure.step('2. Click home_b6873d (breadcrumb Home)', async () => {
      await form.homeB6873d().click()
    })
    await allure.step('3. Wait for the URL pathname to change away from /payments-ui/employee/pgr/create-complaint', async () => {
      await expectPathnameNot(page, PaymentsUiEmployeePgrCreateComplaintPage.PATH)
    })

    await allure.step('Assert: url_pathname_starts_with_payments_ui_employee', async () => {
      await expectPathnameStartsWith(page, PaymentsUiEmployeePgrCreateComplaintPage.PAYMENTS_HOME_PATH)
    })
    await allure.step('Assert: complaint_type_field_not_present', async () => {
      await expect(form.field09988fc()).toHaveCount(0)
    })
  })
})
