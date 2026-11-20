/**
 * AUTO-GENERATED — do not edit by hand.
 * Source:    tests/testcases/complaints/CMP-08.yaml
 * Flow:      CMP-08 — submit_complete_complaint
 * Contract:  ui-contract.json v1.3.0 (+ live capture 2026-11-16 for contract gaps)
 * Generator: /playwright-gen complaints
 * SIDE EFFECT: each test CREATES A REAL COMPLAINT on the live Sierra Leone environment (approved by the team on
 *            2026-11-16; closing them is handled later). Descriptions start with "QA-TEST"; the complaint number is
 *            recorded as an Allure parameter so the team can find and close it.
 * Requires:  QA_COMPLAINANT_MOBILE in .env (9–11 digits, the complaint form's rule since 2026-11-20; a team-owned number, so no stranger gets the complaint SMS).
 * Deferred:  rbac_checks CMP-08-RBAC-1 (API-level) → /script-gen after `qa-kit api-scrape`.
 */
import { test, expect, type Page } from '@playwright/test'
import * as allure from 'allure-js-commons'
import { PaymentsUiEmployeePgrCreateComplaintPage, type BoundaryLevel } from '../../pages/PaymentsUiEmployeePgrCreateComplaintPage.page'
import { HomePage } from '../../pages/HomePage.page'
import { installOverlayHandlers, waitForLoaderGone, loadTestData, localIsoDate, displayDate, fillPrivately } from '../../helpers/app'
import { requiredEnv } from '../../helpers/requiredEnv'
import { recordCreatedComplaint } from '../../helpers/inbox'

const BASE_URL = (process.env.QA_UI_BASE_URL || '').trim() || 'https://sierraleone-hcm.digit.org/workbench-ui/employee'   // .env QA_UI_BASE_URL normally supplies this
const YAML_SOURCE = 'tests/testcases/complaints/CMP-08.yaml'
const OPEN_STEP = '1. Open /payments-ui/employee/pgr/create-complaint, wait for animation_1dcbe0 to be hidden and for the one-time form rebuild (form element replaced, max 15 s)'

type ComplaintData = {
  complaintType: string
  boundary: Partial<Record<BoundaryLevel, string>>
  complainantName: string
  mobileNumber: string   // "env:QA_COMPLAINANT_MOBILE"
  description: string
}

/** Resolve an "env:NAME" fixture value from .env; the real number never lives in a file. */
function complainantMobile(value: string): string {
  const mobile = value.startsWith('env:') ? requiredEnv(value.slice(4)) : value
  if (!/^\d{9,11}$/.test(mobile)) throw new Error(`${value.replace('env:', '')} must have 9 to 11 digits (complaint form rule, checked live 2026-11-20)`)
  return mobile
}

async function openForm(page: Page, form: PaymentsUiEmployeePgrCreateComplaintPage): Promise<void> {
  await form.goto(BASE_URL)
  await waitForLoaderGone(new HomePage(page).animation1dcbe0())
  await form.waitForFormRebuild()
}

/** Steps 2–10 shared by H1 and H2; returns the create response. */
async function fillAndSubmit(page: Page, form: PaymentsUiEmployeePgrCreateComplaintPage, data: ComplaintData, mobile: string, boundaryStep: string, testDataRef: string) {
  const today = localIsoDate(0)
  await allure.step(`2. Choose the complaint type from test data ${testDataRef} (arrow icon of field_0_9988fc)`, async () => {
    await form.chooseComplaintType(data.complaintType)
  })
  await allure.step("3. Fill complaintdate_8ac55d with today's date (computed at run time)", async () => {
    await form.complaintdate8ac55d().fill(today)
  })
  await allure.step(boundaryStep, async () => {
    for (const [level, value] of Object.entries(data.boundary) as Array<[BoundaryLevel, string]>) {
      await expect(form.boundaryDropdown(level)).toBeVisible({ timeout: 30_000 })
      await form.chooseBoundary(level, value)
    }
  })
  await allure.step('5. Click field_5_cba6ab (Another User)', async () => {
    await form.field5Cba6ab().check()
  })
  await allure.step(`6. Fill complainantname_fc3612 with the name from test data ${testDataRef}`, async () => {
    await form.complainantnameFc3612().fill(data.complainantName)
  })
  await allure.step('7. Fill complainantcontactnumber_869a24 with QA_COMPLAINANT_MOBILE from .env', async () => {
    await fillPrivately(form.complainantcontactnumber869a24(), mobile)   // team-owned number: keep it out of report step titles
  })
  await allure.step(`8. Fill description_9237c5 with the QA-TEST description from test data ${testDataRef}`, async () => {
    await form.description9237c5().fill(data.description)
  })
  await allure.step('9. Check that every chosen value is still in its field', async () => {
    // The form rebuilds itself once after load and clears input; make sure nothing was lost before submitting.
    await expect(form.field09988fc()).toHaveValue(data.complaintType)
    await expect(form.selectDateF857ea()).toHaveValue(displayDate(today))
    for (const [level, value] of Object.entries(data.boundary) as Array<[BoundaryLevel, string]>) await expect(form.boundaryInput(level), level).toHaveValue(value)
    await expect(form.field5Cba6ab()).toBeChecked()
    await expect(form.complainantnameFc3612()).toHaveValue(data.complainantName)
    await expect(form.complainantcontactnumber869a24()).toHaveValue(mobile)
    await expect(form.description9237c5()).toHaveValue(data.description)
  })
  return allure.step('10. Click submit_b6846a and wait for the POST /pgr-services/v2/request/_create response', async () => {
    const createResponse = page.waitForResponse(r => PaymentsUiEmployeePgrCreateComplaintPage.CREATE_API_RE.test(r.url()) && r.request().method() === 'POST', { timeout: 60_000 })
    await form.submitB6846a().click()
    return createResponse
  })
}

async function assertCreated(page: Page, response: Awaited<ReturnType<typeof fillAndSubmit>>): Promise<void> {
  let complaintNumber = ''
  await allure.step('Assert: create_request_returns_200', async () => {
    expect(response.status(), 'POST /pgr-services/v2/request/_create status').toBe(200)
    const body = await response.json()
    complaintNumber = body?.ServiceWrappers?.[0]?.service?.serviceRequestId ?? ''
    expect(complaintNumber, 'serviceRequestId in the create response').toBeTruthy()
    await allure.parameter('complaint_number', complaintNumber)   // so the team can find and close it
    recordCreatedComplaint(complaintNumber, test.info().title.split(':')[0])   // hand-off to INB-02-H2 (complaints-inbox)
  })
  await allure.step('Assert: complaint_number_shown', async () => {
    // The success screen was never observed before this test; the app must show the number it just created.
    await expect(page.getByText(complaintNumber, { exact: false }).first()).toBeVisible({ timeout: 60_000 })
  })
}

test.describe('CMP-08 submit_complete_complaint', {
  tag: ['@CMP-08', '@complaints', '@P0'],
}, () => {
  test('CMP-08-H1: Submit a complaint for another user with only the mandatory fields and get a complaint number', {
    tag: ['@smoke', '@regression'],
  }, async ({ page }) => {
    await allure.tms(YAML_SOURCE + '#CMP-08-H1', 'CMP-08-H1')
    await allure.parameter('case_id', 'CMP-08-H1')
    await allure.parameter('flow_id', 'CMP-08')
    await allure.parameter('module', 'complaints')
    await allure.parameter('type', 'happy_path')
    await allure.parameter('priority', 'P0')
    await allure.parameter('test_data_ref', 'CMP-08-H1')
    await allure.parameter('yaml_source', YAML_SOURCE)
    await allure.epic('complaints')
    await allure.feature('submit_complete_complaint')
    await allure.story('Submit a complaint for another user with only the mandatory fields and get a complaint number')
    await allure.severity('critical')
    await allure.tag('smoke')
    await allure.tag('regression')
    await allure.description('The core create with the smallest valid complaint (only mandatory fields, Country only), proving Country alone is enough. Creates a real complaint.\n\nSource: ' + YAML_SOURCE + '#CMP-08-H1')

    const data = loadTestData<ComplaintData>('CMP-08-H1')
    const form = new PaymentsUiEmployeePgrCreateComplaintPage(page)
    let mobile = ''

    await allure.step('Precondition: start state', async () => {
      mobile = complainantMobile(data.mobileNumber)   // fails fast, before anything is created, if .env lacks it
      await installOverlayHandlers(page)
    })
    await allure.step(OPEN_STEP, async () => { await openForm(page, form) })
    const response = await fillAndSubmit(page, form, data, mobile, '4. Choose the Country from test data CMP-08-H1 (Country only; lower levels are optional)', 'CMP-08-H1')
    await assertCreated(page, response)
  })

  test('CMP-08-H2: Submit a complaint for another user with the full boundary path and get a complaint number', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await allure.tms(YAML_SOURCE + '#CMP-08-H2', 'CMP-08-H2')
    await allure.parameter('case_id', 'CMP-08-H2')
    await allure.parameter('flow_id', 'CMP-08')
    await allure.parameter('module', 'complaints')
    await allure.parameter('type', 'happy_path')
    await allure.parameter('priority', 'P1')
    await allure.parameter('test_data_ref', 'CMP-08-H2')
    await allure.parameter('yaml_source', YAML_SOURCE)
    await allure.epic('complaints')
    await allure.feature('submit_complete_complaint')
    await allure.story('Submit a complaint for another user with the full boundary path and get a complaint number')
    await allure.severity('normal')
    await allure.tag('regression')
    await allure.description('The deepest location (all 7 levels) and a different complaint type, so a failure tied to a full boundary or another type is caught; H1 uses Country only. Creates a real complaint.\n\nSource: ' + YAML_SOURCE + '#CMP-08-H2')

    const data = loadTestData<ComplaintData>('CMP-08-H2')
    const form = new PaymentsUiEmployeePgrCreateComplaintPage(page)
    let mobile = ''

    await allure.step('Precondition: start state', async () => {
      mobile = complainantMobile(data.mobileNumber)
      await installOverlayHandlers(page)
    })
    await allure.step(OPEN_STEP, async () => { await openForm(page, form) })
    const response = await fillAndSubmit(page, form, data, mobile, '4. Choose every boundary level from test data CMP-08-H2, from Country down to Community', 'CMP-08-H2')
    await assertCreated(page, response)
  })
})
