/**
 * AUTO-GENERATED — do not edit by hand.
 * Source:    tests/testcases/complaints/CMP-06.yaml
 * Flow:      CMP-06 — mandatory_and_format_validation
 * Contract:  ui-contract.json v1.3.0 (+ live capture 2026-11-16 for contract gaps)
 * Generator: /playwright-gen complaints
 * Safety:    every case aborts and records any `_create` request (blockCreateRequests) and asserts none was attempted.
 * Deferred:  rbac_checks CMP-06-RBAC-1 (API-level) → /script-gen after `qa-kit api-scrape`.
 */
import { test, expect, type Page } from '@playwright/test'
import * as allure from 'allure-js-commons'
import { PaymentsUiEmployeePgrCreateComplaintPage } from '../../pages/PaymentsUiEmployeePgrCreateComplaintPage.page'
import { HomePage } from '../../pages/HomePage.page'
import { expectPathname } from '../../helpers/routes'
import { installOverlayHandlers, waitForLoaderGone, blockCreateRequests, loadTestData, localIsoDate } from '../../helpers/app'

const BASE_URL = (process.env.QA_UI_BASE_URL || '').trim() || 'https://sierraleone-hcm.digit.org/workbench-ui/employee'   // .env QA_UI_BASE_URL normally supplies this
const YAML_SOURCE = 'tests/testcases/complaints/CMP-06.yaml'
const OPEN_STEP = '1. Open /payments-ui/employee/pgr/create-complaint, wait for animation_1dcbe0 to be hidden and for the one-time form rebuild (form element replaced, max 15 s)'
const MOBILE_ERROR = 'Please provide a valid Mobile Number'
const NAME_ERROR = "Complainant's name is Invalid"

type Person = { complainantName: string; mobileNumber: string }

async function openForm(page: Page, form: PaymentsUiEmployeePgrCreateComplaintPage): Promise<void> {
  await form.goto(BASE_URL)
  await waitForLoaderGone(new HomePage(page).animation1dcbe0())
  await form.waitForFormRebuild()
}

async function meta(c: { id: string; title: string; note: string }): Promise<void> {
  await allure.tms(YAML_SOURCE + '#' + c.id, c.id)
  await allure.parameter('case_id', c.id)
  await allure.parameter('flow_id', 'CMP-06')
  await allure.parameter('module', 'complaints')
  await allure.parameter('type', 'negative')
  await allure.parameter('priority', 'P1')
  await allure.parameter('test_data_ref', c.id)
  await allure.parameter('yaml_source', YAML_SOURCE)
  await allure.epic('complaints')
  await allure.feature('mandatory_and_format_validation')
  await allure.story(c.title)
  await allure.severity('normal')
  await allure.tag('regression')
  await allure.description(c.note + '\n\nSource: ' + YAML_SOURCE + '#' + c.id)
}

test.describe('CMP-06 mandatory_and_format_validation', {
  tag: ['@CMP-06', '@complaints', '@P1'],
}, () => {
  test('CMP-06-E1: Block an empty complaint with field errors and a mandatory-fields alert', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await meta({ id: 'CMP-06-E1', title: 'Block an empty complaint with field errors and a mandatory-fields alert', note: 'All mandatory fields empty at once; the messages were observed live on 2026-11-16.' })
    const form = new PaymentsUiEmployeePgrCreateComplaintPage(page)
    let creates: string[] = []

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      creates = await blockCreateRequests(page)
    })
    await allure.step(OPEN_STEP, async () => { await openForm(page, form) })
    await allure.step('2. Start tracking create requests', async () => { expect(creates).toEqual([]) })
    await allure.step('3. Click submit_b6846a', async () => { await form.submitB6846a().click() })

    await allure.step('Assert: url_pathname_is_payments_ui_employee_pgr_create_complaint', async () => {
      await expectPathname(page, PaymentsUiEmployeePgrCreateComplaintPage.PATH)
    })
    await allure.step('Assert: required_errors_visible', async () => {
      await expect(form.fieldRow(form.field09988fc()).getByText('Required', { exact: true })).toBeVisible()
      await expect(form.fieldRow(form.description9237c5()).getByText('Required', { exact: true })).toBeVisible()
    })
    await allure.step('Assert: complainant_name_invalid_error_visible', async () => {
      await expect(form.fieldRow(form.complainantnameFc3612()).getByText(NAME_ERROR, { exact: true })).toBeVisible()
    })
    await allure.step('Assert: mobile_number_invalid_error_visible', async () => {
      await expect(form.fieldRow(form.complainantcontactnumber869a24()).getByText(MOBILE_ERROR, { exact: true })).toBeVisible()
    })
    await allure.step('Assert: mandatory_fields_alert_visible', async () => {
      await expect(form.mandatoryFieldsAlert()).toBeVisible()
    })
    await allure.step('Assert: no_create_request_sent', async () => {
      expect(creates, 'create requests attempted').toEqual([])
    })
  })

  test('CMP-06-E2: Reject an 8-digit complainant mobile number', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await meta({ id: 'CMP-06-E2', title: 'Reject an 8-digit complainant mobile number', note: 'Just below the 9-digit minimum (form rule 9 to 11 digits, checked live 2026-11-20; user: 9 digits); E1 covers an empty number.' })
    const data = loadTestData<Person>('CMP-06-E2')
    const form = new PaymentsUiEmployeePgrCreateComplaintPage(page)
    let creates: string[] = []

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      creates = await blockCreateRequests(page)   // description also stays empty, so the form can never be valid
    })
    await allure.step(OPEN_STEP, async () => { await openForm(page, form) })
    await allure.step('2. Click field_5_cba6ab (Another User)', async () => { await form.field5Cba6ab().check() })
    await allure.step('3. Fill complainantname_fc3612 with the synthetic name from test data CMP-06-E2', async () => {
      await form.complainantnameFc3612().fill(data.complainantName)
    })
    await allure.step('4. Fill complainantcontactnumber_869a24 with the 8-digit number from test data CMP-06-E2', async () => {
      await form.complainantcontactnumber869a24().fill(data.mobileNumber)
    })
    await allure.step('5. Start tracking create requests', async () => { expect(creates).toEqual([]) })
    await allure.step('6. Click submit_b6846a', async () => { await form.submitB6846a().click() })

    await allure.step('Assert: mobile_number_invalid_error_visible', async () => {
      await expect(form.fieldRow(form.complainantcontactnumber869a24()).getByText(MOBILE_ERROR, { exact: true })).toBeVisible()
    })
    await allure.step('Assert: no_create_request_sent', async () => {
      expect(creates, 'create requests attempted').toEqual([])
    })
  })

  test('CMP-06-E3: Reject a complainant name with digits and special characters', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await meta({ id: 'CMP-06-E3', title: 'Reject a complainant name with digits and special characters', note: 'A filled but invalid name (E1 covers an empty one); the exact name rule is still to be confirmed.' })
    const data = loadTestData<Person>('CMP-06-E3')
    const form = new PaymentsUiEmployeePgrCreateComplaintPage(page)
    let creates: string[] = []

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      creates = await blockCreateRequests(page)   // description also stays empty, so the form can never be valid
    })
    await allure.step(OPEN_STEP, async () => { await openForm(page, form) })
    await allure.step('2. Click field_5_cba6ab (Another User)', async () => { await form.field5Cba6ab().check() })
    await allure.step('3. Fill complainantname_fc3612 with the invalid name from test data CMP-06-E3', async () => {
      await form.complainantnameFc3612().fill(data.complainantName)
    })
    await allure.step('4. Fill complainantcontactnumber_869a24 with the 11-digit synthetic number from test data CMP-06-E3', async () => {
      await form.complainantcontactnumber869a24().fill(data.mobileNumber)
    })
    await allure.step('5. Start tracking create requests', async () => { expect(creates).toEqual([]) })
    await allure.step('6. Click submit_b6846a', async () => { await form.submitB6846a().click() })

    await allure.step('Assert: complainant_name_invalid_error_visible', async () => {
      await expect(form.fieldRow(form.complainantnameFc3612()).getByText(NAME_ERROR, { exact: true })).toBeVisible()
    })
    await allure.step('Assert: no_create_request_sent', async () => {
      expect(creates, 'create requests attempted').toEqual([])
    })
  })

  test('CMP-06-E4: Block a complaint that has everything except the description', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await meta({ id: 'CMP-06-E4', title: 'Block a complaint that has everything except the description', note: 'Isolates one missing mandatory field (description) with everything else valid, so a missing check on that field alone is caught; the guard stops a real create if that happens.' })
    const data = loadTestData<Person & { complaintType: string; boundary: { Country: string } }>('CMP-06-E4')
    const form = new PaymentsUiEmployeePgrCreateComplaintPage(page)
    let creates: string[] = []

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      creates = await blockCreateRequests(page)
    })
    await allure.step(OPEN_STEP, async () => { await openForm(page, form) })
    await allure.step('2. Choose the complaint type from test data CMP-06-E4 (arrow icon of field_0_9988fc)', async () => {
      await form.chooseComplaintType(data.complaintType)
    })
    await allure.step("3. Fill complaintdate_8ac55d with today's date (computed at run time)", async () => {
      await form.complaintdate8ac55d().fill(localIsoDate(0))
    })
    await allure.step('4. Choose the Country from test data CMP-06-E4', async () => {
      await form.chooseBoundary('Country', data.boundary.Country)
    })
    await allure.step('5. Click field_5_cba6ab (Another User) and fill complainantname_fc3612 and complainantcontactnumber_869a24 from test data CMP-06-E4', async () => {
      await form.field5Cba6ab().check()
      await form.complainantnameFc3612().fill(data.complainantName)
      await form.complainantcontactnumber869a24().fill(data.mobileNumber)
    })
    await allure.step('6. Start tracking create requests', async () => {
      // Everything except the description must still be filled, otherwise this case tests nothing.
      await expect(form.field09988fc()).toHaveValue(data.complaintType)
      await expect(form.boundaryInput('Country')).toHaveValue(data.boundary.Country)
      expect(creates).toEqual([])
    })
    await allure.step('7. Click submit_b6846a', async () => { await form.submitB6846a().click() })

    await allure.step('Assert: url_pathname_is_payments_ui_employee_pgr_create_complaint', async () => {
      await expectPathname(page, PaymentsUiEmployeePgrCreateComplaintPage.PATH)
    })
    await allure.step('Assert: description_required_error_visible', async () => {
      await expect(form.fieldRow(form.description9237c5()).getByText('Required', { exact: true })).toBeVisible()
    })
    await allure.step('Assert: mandatory_fields_alert_visible', async () => {
      await expect(form.mandatoryFieldsAlert()).toBeVisible()
    })
    await allure.step('Assert: no_create_request_sent', async () => {
      expect(creates, 'create requests attempted').toEqual([])
    })
  })

  test('CMP-06-E5: Reject a 12-digit complainant mobile number', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await meta({ id: 'CMP-06-E5', title: 'Reject a 12-digit complainant mobile number', note: 'Just above the 11-digit maximum; together with E2 it pins the 9 to 11 digit range from both sides.' })
    const data = loadTestData<Person>('CMP-06-E5')
    const form = new PaymentsUiEmployeePgrCreateComplaintPage(page)
    let creates: string[] = []

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      creates = await blockCreateRequests(page)   // description also stays empty, so the form can never be valid
    })
    await allure.step(OPEN_STEP, async () => { await openForm(page, form) })
    await allure.step('2. Click field_5_cba6ab (Another User)', async () => { await form.field5Cba6ab().check() })
    await allure.step('3. Fill complainantname_fc3612 with the synthetic name from test data CMP-06-E5', async () => {
      await form.complainantnameFc3612().fill(data.complainantName)
    })
    await allure.step('4. Fill complainantcontactnumber_869a24 with the 12-digit number from test data CMP-06-E5', async () => {
      await form.complainantcontactnumber869a24().fill(data.mobileNumber)
    })
    await allure.step('5. Start tracking create requests', async () => { expect(creates).toEqual([]) })
    await allure.step('6. Click submit_b6846a', async () => { await form.submitB6846a().click() })

    await allure.step('Assert: mobile_number_invalid_error_visible', async () => {
      await expect(form.fieldRow(form.complainantcontactnumber869a24()).getByText(MOBILE_ERROR, { exact: true })).toBeVisible()
    })
    await allure.step('Assert: no_create_request_sent', async () => {
      expect(creates, 'create requests attempted').toEqual([])
    })
  })

  test('CMP-06-E6: Block a complaint that has everything except the Country', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await meta({ id: 'CMP-06-E6', title: 'Block a complaint that has everything except the Country', note: 'Country is the only mandatory boundary level (team, 2026-11-16); this isolates it with every other field valid. Its mobile number has 9 digits, so it also shows the lowest valid length is accepted.' })
    const data = loadTestData<Person & { complaintType: string; description: string }>('CMP-06-E6')
    const form = new PaymentsUiEmployeePgrCreateComplaintPage(page)
    let creates: string[] = []

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      creates = await blockCreateRequests(page)
    })
    await allure.step(OPEN_STEP, async () => { await openForm(page, form) })
    await allure.step('2. Choose the complaint type from test data CMP-06-E6 (arrow icon of field_0_9988fc)', async () => {
      await form.chooseComplaintType(data.complaintType)
    })
    await allure.step("3. Fill complaintdate_8ac55d with today's date (computed at run time)", async () => {
      await form.complaintdate8ac55d().fill(localIsoDate(0))
    })
    await allure.step('4. Click field_5_cba6ab (Another User) and fill complainantname_fc3612 and complainantcontactnumber_869a24 from test data CMP-06-E6', async () => {
      await form.field5Cba6ab().check()
      await form.complainantnameFc3612().fill(data.complainantName)
      await form.complainantcontactnumber869a24().fill(data.mobileNumber)
    })
    await allure.step('5. Fill description_9237c5 with the QA-TEST description from test data CMP-06-E6', async () => {
      await form.description9237c5().fill(data.description)
    })
    await allure.step('6. Start tracking create requests', async () => {
      await expect(form.field09988fc()).toHaveValue(data.complaintType)
      await expect(form.boundaryInput('Country')).toHaveValue('')
      expect(creates).toEqual([])
    })
    await allure.step('7. Click submit_b6846a', async () => { await form.submitB6846a().click() })

    await allure.step('Assert: url_pathname_is_payments_ui_employee_pgr_create_complaint', async () => {
      await expectPathname(page, PaymentsUiEmployeePgrCreateComplaintPage.PATH)
    })
    await allure.step('Assert: no_other_field_errors_shown', async () => {
      // Observed 2026-11-16: a missing Country shows no inline "Required" (unlike the other mandatory fields),
      // only the alert. No field error anywhere proves the block comes from the empty Country alone.
      await expect(form.mandatoryFieldsAlert()).toBeVisible()
      await expect(page.getByText('Required', { exact: true })).toHaveCount(0)
      await expect(page.getByText(NAME_ERROR, { exact: true })).toHaveCount(0)
      await expect(page.getByText(MOBILE_ERROR, { exact: true })).toHaveCount(0)
    })
    await allure.step('Assert: mandatory_fields_alert_visible', async () => {
      await expect(form.mandatoryFieldsAlert()).toBeVisible()
    })
    await allure.step('Assert: no_create_request_sent', async () => {
      expect(creates, 'create requests attempted').toEqual([])
    })
  })
})
