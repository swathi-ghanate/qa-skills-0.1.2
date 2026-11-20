/**
 * AUTO-GENERATED — do not edit by hand.
 * Source:    tests/testcases/complaints/CMP-04.yaml
 * Flow:      CMP-04 — boundary_cascade
 * Contract:  ui-contract.json v1.3.0 (+ live capture 2026-11-16 for contract gaps)
 * Generator: /playwright-gen complaints
 * Deferred:  rbac_checks CMP-04-RBAC-1 (API-level, endpoint TBD) → /script-gen after `qa-kit api-scrape`.
 */
import { test, expect, type Page } from '@playwright/test'
import * as allure from 'allure-js-commons'
import { PaymentsUiEmployeePgrCreateComplaintPage, BOUNDARY_LEVELS, type BoundaryLevel } from '../../pages/PaymentsUiEmployeePgrCreateComplaintPage.page'
import { HomePage } from '../../pages/HomePage.page'
import { installOverlayHandlers, waitForLoaderGone, blockCreateRequests, loadTestData } from '../../helpers/app'

const BASE_URL = (process.env.QA_UI_BASE_URL || '').trim() || 'https://sierraleone-hcm.digit.org/workbench-ui/employee'   // .env QA_UI_BASE_URL normally supplies this
const YAML_SOURCE = 'tests/testcases/complaints/CMP-04.yaml'
const OPEN_STEP = '1. Open /payments-ui/employee/pgr/create-complaint, wait for animation_1dcbe0 to be hidden and for the one-time form rebuild (form element replaced, max 15 s)'

type Boundary = Partial<Record<BoundaryLevel, string>>

async function openForm(page: Page, form: PaymentsUiEmployeePgrCreateComplaintPage): Promise<void> {
  await form.goto(BASE_URL)
  await waitForLoaderGone(new HomePage(page).animation1dcbe0())
  await form.waitForFormRebuild()
}

/** Value of a boundary level, or '' when the level is not shown. */
async function boundaryValue(form: PaymentsUiEmployeePgrCreateComplaintPage, level: BoundaryLevel): Promise<string> {
  const input = form.boundaryInput(level)
  return (await input.count()) === 0 ? '' : input.first().inputValue()
}

test.describe('CMP-04 boundary_cascade', {
  tag: ['@CMP-04', '@complaints', '@P1'],
}, () => {
  test('CMP-04-H1: Choose a full boundary path from Country down to Community', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await allure.tms(YAML_SOURCE + '#CMP-04-H1', 'CMP-04-H1')
    await allure.parameter('case_id', 'CMP-04-H1')
    await allure.parameter('flow_id', 'CMP-04')
    await allure.parameter('module', 'complaints')
    await allure.parameter('type', 'happy_path')
    await allure.parameter('priority', 'P1')
    await allure.parameter('test_data_ref', 'CMP-04-H1')
    await allure.parameter('yaml_source', YAML_SOURCE)
    await allure.epic('complaints')
    await allure.feature('boundary_cascade')
    await allure.story('Choose a full boundary path from Country down to Community')
    await allure.severity('normal')
    await allure.tag('regression')
    await allure.description('The 7-level cascade (contract gap: the levels below Country were captured live); each level must appear only after its parent is chosen.\n\nSource: ' + YAML_SOURCE + '#CMP-04-H1')

    const data = loadTestData<{ boundary: Required<Boundary> }>('CMP-04-H1')
    const form = new PaymentsUiEmployeePgrCreateComplaintPage(page)

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      await blockCreateRequests(page)
    })

    await allure.step(OPEN_STEP, async () => {
      await openForm(page, form)
    })
    await allure.step('2. Check that only the Country dropdown is shown (Province not yet visible)', async () => {
      await expect(form.boundaryDropdown('Country')).toBeVisible()
      await expect(form.boundaryLevel('Province')).toHaveCount(0)
    })
    await allure.step('3. Choose the Country from test data CMP-04-H1 (field_3_f0ae98 selector is broken; use the dropdown labelled Country, options .digit-dropdown-item)', async () => {
      await form.chooseBoundary('Country', data.boundary.Country)
    })
    const lowerSteps: Array<[BoundaryLevel, string]> = [
      ['Province', '4. Wait for the Province dropdown to appear and choose the Province from test data'],
      ['District', '5. Wait for the District dropdown to appear and choose the District from test data'],
      ['Chiefdom', '6. Wait for the Chiefdom dropdown to appear and choose the Chiefdom from test data'],
      ['PHU', '7. Wait for the PHU dropdown to appear and choose the PHU from test data'],
      ['Distribution Point', '8. Wait for the Distribution Point dropdown to appear and choose the Distribution Point from test data'],
      ['Community', '9. Wait for the Community dropdown to appear and choose the Community from test data'],
    ]
    for (const [level, stepText] of lowerSteps) {
      await allure.step(stepText, async () => {
        await expect(form.boundaryDropdown(level)).toBeVisible({ timeout: 30_000 })
        await form.chooseBoundary(level, data.boundary[level])
      })
    }

    await allure.step('Assert: boundary_values_match_test_data', async () => {
      for (const level of BOUNDARY_LEVELS) await expect(form.boundaryInput(level), level).toHaveValue(data.boundary[level])
    })
  })

  test('CMP-04-E1: Reset the lower boundary levels when the Province is changed', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await allure.tms(YAML_SOURCE + '#CMP-04-E1', 'CMP-04-E1')
    await allure.parameter('case_id', 'CMP-04-E1')
    await allure.parameter('flow_id', 'CMP-04')
    await allure.parameter('module', 'complaints')
    await allure.parameter('type', 'edge_case')
    await allure.parameter('priority', 'P1')
    await allure.parameter('test_data_ref', 'CMP-04-E1')
    await allure.parameter('yaml_source', YAML_SOURCE)
    await allure.epic('complaints')
    await allure.feature('boundary_cascade')
    await allure.story('Reset the lower boundary levels when the Province is changed')
    await allure.severity('normal')
    await allure.tag('regression')
    await allure.description('A changed parent must not leave stale child values; H1 only moves forward through the levels. Expected behaviour is an assumption [IMP] until the team confirms it.\n\nSource: ' + YAML_SOURCE + '#CMP-04-E1')

    const data = loadTestData<{ boundary: Boundary; changedProvince: string }>('CMP-04-E1')
    const form = new PaymentsUiEmployeePgrCreateComplaintPage(page)

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      await blockCreateRequests(page)
    })

    await allure.step(OPEN_STEP, async () => {
      await openForm(page, form)
    })
    await allure.step('2. Choose Country, Province, District and Chiefdom from test data CMP-04-E1', async () => {
      for (const level of ['Country', 'Province', 'District', 'Chiefdom'] as const) {
        await expect(form.boundaryDropdown(level)).toBeVisible({ timeout: 30_000 })
        await form.chooseBoundary(level, data.boundary[level]!)
      }
      await expect(form.boundaryInput('Chiefdom')).toHaveValue(data.boundary.Chiefdom!)
    })
    await allure.step('3. Change the Province to the changedProvince value from test data CMP-04-E1', async () => {
      await form.chooseBoundary('Province', data.changedProvince)
      await expect(form.boundaryInput('Province')).toHaveValue(data.changedProvince)
    })

    await allure.step('Assert: district_cleared_after_province_change', async () => {
      await expect.poll(() => boundaryValue(form, 'District')).not.toBe(data.boundary.District)
    })
    await allure.step('Assert: chiefdom_not_shown_or_cleared', async () => {
      await expect.poll(() => boundaryValue(form, 'Chiefdom')).toBe('')
    })
  })
})
