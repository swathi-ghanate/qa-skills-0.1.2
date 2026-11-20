/**
 * AUTO-GENERATED — do not edit by hand.
 * Source:    tests/testcases/complaints/CMP-03.yaml
 * Flow:      CMP-03 — complaint_date_limits
 * Contract:  ui-contract.json v1.3.0 (+ live capture 2026-11-16 for contract gaps)
 * Generator: /playwright-gen complaints
 * Deferred:  rbac_checks CMP-03-RBAC-1 (API-level, endpoint TBD) → /script-gen after `qa-kit api-scrape`.
 */
import { test, expect, type Page } from '@playwright/test'
import * as allure from 'allure-js-commons'
import { PaymentsUiEmployeePgrCreateComplaintPage } from '../../pages/PaymentsUiEmployeePgrCreateComplaintPage.page'
import { HomePage } from '../../pages/HomePage.page'
import { installOverlayHandlers, waitForLoaderGone, blockCreateRequests, localIsoDate, displayDate } from '../../helpers/app'

const BASE_URL = (process.env.QA_UI_BASE_URL || '').trim() || 'https://sierraleone-hcm.digit.org/workbench-ui/employee'   // .env QA_UI_BASE_URL normally supplies this
const YAML_SOURCE = 'tests/testcases/complaints/CMP-03.yaml'
const OPEN_STEP = '1. Open /payments-ui/employee/pgr/create-complaint, wait for animation_1dcbe0 to be hidden and for the one-time form rebuild (form element replaced, max 15 s)'

async function openForm(page: Page, form: PaymentsUiEmployeePgrCreateComplaintPage): Promise<void> {
  await form.goto(BASE_URL)
  await waitForLoaderGone(new HomePage(page).animation1dcbe0())
  await form.waitForFormRebuild()
}

test.describe('CMP-03 complaint_date_limits', {
  tag: ['@CMP-03', '@complaints', '@P1'],
}, () => {
  test("CMP-03-H1: Accept today's date as the date of complaint", {
    tag: ['@regression'],
  }, async ({ page }) => {
    await allure.tms(YAML_SOURCE + '#CMP-03-H1', 'CMP-03-H1')
    await allure.parameter('case_id', 'CMP-03-H1')
    await allure.parameter('flow_id', 'CMP-03')
    await allure.parameter('module', 'complaints')
    await allure.parameter('type', 'happy_path')
    await allure.parameter('priority', 'P1')
    await allure.parameter('test_data_ref', 'CMP-03-H1')
    await allure.parameter('yaml_source', YAML_SOURCE)
    await allure.epic('complaints')
    await allure.feature('complaint_date_limits')
    await allure.story("Accept today's date as the date of complaint")
    await allure.severity('normal')
    await allure.tag('regression')
    await allure.description('The upper boundary value (today) is accepted.\n\nSource: ' + YAML_SOURCE + '#CMP-03-H1')

    const today = localIsoDate(0)   // test data CMP-03-H1: TODAY, computed at run time
    const form = new PaymentsUiEmployeePgrCreateComplaintPage(page)

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      await blockCreateRequests(page)
    })

    await allure.step(OPEN_STEP, async () => {
      await openForm(page, form)
    })
    await allure.step("2. Fill complaintdate_8ac55d with today's date (computed at run time, test data CMP-03-H1)", async () => {
      await form.complaintdate8ac55d().fill(today)
    })

    await allure.step('Assert: complaint_date_value_is_today', async () => {
      await expect(form.complaintdate8ac55d()).toHaveValue(today)
    })
    await allure.step('Assert: select_date_display_shows_date', async () => {
      await expect(form.selectDateF857ea()).toHaveValue(displayDate(today))
    })
  })

  test('CMP-03-E1: Block a future date of complaint', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await allure.tms(YAML_SOURCE + '#CMP-03-E1', 'CMP-03-E1')
    await allure.parameter('case_id', 'CMP-03-E1')
    await allure.parameter('flow_id', 'CMP-03')
    await allure.parameter('module', 'complaints')
    await allure.parameter('type', 'edge_case')
    await allure.parameter('priority', 'P1')
    await allure.parameter('test_data_ref', 'CMP-03-E1')
    await allure.parameter('yaml_source', YAML_SOURCE)
    await allure.epic('complaints')
    await allure.feature('complaint_date_limits')
    await allure.story('Block a future date of complaint')
    await allure.severity('normal')
    await allure.tag('regression')
    await allure.description('Just above the boundary (tomorrow); a complaint cannot be dated in the future.\n\nSource: ' + YAML_SOURCE + '#CMP-03-E1')

    const today = localIsoDate(0)
    const tomorrow = localIsoDate(1)   // test data CMP-03-E1: TOMORROW, computed at run time
    const form = new PaymentsUiEmployeePgrCreateComplaintPage(page)

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      await blockCreateRequests(page)
    })

    await allure.step(OPEN_STEP, async () => {
      await openForm(page, form)
    })
    await allure.step("2. Fill complaintdate_8ac55d with tomorrow's date (computed at run time, test data CMP-03-E1)", async () => {
      await form.complaintdate8ac55d().fill(tomorrow)
    })

    await allure.step('Assert: complaint_date_max_is_today', async () => {
      await expect(form.complaintdate8ac55d()).toHaveAttribute('max', today)
    })
    await allure.step('Assert: future_date_not_accepted', async () => {
      // Either the browser flags the value as above max, or the app clears it; the app's own message is TBD.
      await expect.poll(() => form.complaintdate8ac55d().evaluate(el => {
        const input = el as HTMLInputElement
        return input.value === '' || input.validity.rangeOverflow
      })).toBe(true)
    })
  })
})
