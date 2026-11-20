/**
 * AUTO-GENERATED — do not edit by hand.
 * Source:    tests/testcases/complaints/CMP-02.yaml
 * Flow:      CMP-02 — complaint_type_list
 * Contract:  ui-contract.json v1.3.0 (+ live capture 2026-11-16 for contract gaps)
 * Generator: /playwright-gen complaints
 * Deferred:  rbac_checks CMP-02-RBAC-1 (API-level, endpoint TBD) → /script-gen after `qa-kit api-scrape`.
 */
import { test, expect, type Page } from '@playwright/test'
import * as allure from 'allure-js-commons'
import { PaymentsUiEmployeePgrCreateComplaintPage } from '../../pages/PaymentsUiEmployeePgrCreateComplaintPage.page'
import { HomePage } from '../../pages/HomePage.page'
import { installOverlayHandlers, waitForLoaderGone, blockCreateRequests, loadTestData } from '../../helpers/app'

const BASE_URL = (process.env.QA_UI_BASE_URL || '').trim() || 'https://sierraleone-hcm.digit.org/workbench-ui/employee'   // .env QA_UI_BASE_URL normally supplies this
const YAML_SOURCE = 'tests/testcases/complaints/CMP-02.yaml'
const OPEN_STEP = '1. Open /payments-ui/employee/pgr/create-complaint, wait for animation_1dcbe0 to be hidden and for the one-time form rebuild (form element replaced, max 15 s)'

async function openForm(page: Page, form: PaymentsUiEmployeePgrCreateComplaintPage): Promise<void> {
  await form.goto(BASE_URL)
  await waitForLoaderGone(new HomePage(page).animation1dcbe0())
  await form.waitForFormRebuild()
}

test.describe('CMP-02 complaint_type_list', {
  tag: ['@CMP-02', '@complaints', '@P1'],
}, () => {
  test('CMP-02-H1: List the six complaint types when the Complaint Type arrow is clicked', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await allure.tms(YAML_SOURCE + '#CMP-02-H1', 'CMP-02-H1')
    await allure.parameter('case_id', 'CMP-02-H1')
    await allure.parameter('flow_id', 'CMP-02')
    await allure.parameter('module', 'complaints')
    await allure.parameter('type', 'happy_path')
    await allure.parameter('priority', 'P1')
    await allure.parameter('test_data_ref', 'CMP-02-H1')
    await allure.parameter('yaml_source', YAML_SOURCE)
    await allure.epic('complaints')
    await allure.feature('complaint_type_list')
    await allure.story('List the six complaint types when the Complaint Type arrow is clicked')
    await allure.severity('normal')
    await allure.tag('regression')
    await allure.description('Checks the configured complaint types (MDMS RAINMAKER-PGR.ServiceDefs) reach the form, by their UI labels.\n\nSource: ' + YAML_SOURCE + '#CMP-02-H1')

    const data = loadTestData<{ expectedOptions: string[] }>('CMP-02-H1')
    const form = new PaymentsUiEmployeePgrCreateComplaintPage(page)

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      await blockCreateRequests(page)
    })

    await allure.step(OPEN_STEP, async () => {
      await openForm(page, form)
    })
    await allure.step('2. Click the arrow icon of field_0_9988fc (contract gap: the list opens only from the arrow, not from the input)', async () => {
      await form.complaintTypeArrow().click()
    })
    await allure.step('3. Wait for the options card (.digit-dropdown-options-card) to be visible', async () => {
      await expect(form.optionsCard()).toBeVisible()
    })

    const options = async () => (await form.optionsCard().innerText()).split('\n').map(s => s.trim()).filter(Boolean)
    await allure.step('Assert: complaint_type_option_count_is_6', async () => {
      await expect.poll(async () => (await options()).length).toBe(data.expectedOptions.length)
    })
    await allure.step('Assert: complaint_type_options_match_test_data', async () => {
      expect(await options()).toEqual(data.expectedOptions)
    })
  })

  test('CMP-02-H2: Keep the chosen complaint type in the field', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await allure.tms(YAML_SOURCE + '#CMP-02-H2', 'CMP-02-H2')
    await allure.parameter('case_id', 'CMP-02-H2')
    await allure.parameter('flow_id', 'CMP-02')
    await allure.parameter('module', 'complaints')
    await allure.parameter('type', 'happy_path')
    await allure.parameter('priority', 'P1')
    await allure.parameter('test_data_ref', 'CMP-02-H2')
    await allure.parameter('yaml_source', YAML_SOURCE)
    await allure.epic('complaints')
    await allure.feature('complaint_type_list')
    await allure.story('Keep the chosen complaint type in the field')
    await allure.severity('normal')
    await allure.tag('regression')
    await allure.description('Selection outcome, which H1 (listing only) does not check; how the value is displayed is confirmed on first run.\n\nSource: ' + YAML_SOURCE + '#CMP-02-H2')

    const data = loadTestData<{ complaintType: string }>('CMP-02-H2')
    const form = new PaymentsUiEmployeePgrCreateComplaintPage(page)

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      await blockCreateRequests(page)
    })

    await allure.step(OPEN_STEP, async () => {
      await openForm(page, form)
    })
    await allure.step('2. Click the arrow icon of field_0_9988fc', async () => {
      await form.complaintTypeArrow().click()
      await expect(form.optionsCard()).toBeVisible()
    })
    await allure.step('3. Click the option from test data CMP-02-H2 in the options card', async () => {
      await form.optionsCard().getByText(data.complaintType, { exact: true }).click()
    })

    await allure.step('Assert: complaint_type_field_shows_selected_type', async () => {
      await expect(form.field09988fc()).toHaveValue(data.complaintType)
    })
    await allure.step('Assert: complaint_type_options_card_closed', async () => {
      await expect(form.optionsCard()).toBeHidden()
    })
  })
})
