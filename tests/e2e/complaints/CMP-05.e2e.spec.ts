/**
 * AUTO-GENERATED — do not edit by hand.
 * Source:    tests/testcases/complaints/CMP-05.yaml
 * Flow:      CMP-05 — complainant_myself_or_another_user
 * Contract:  ui-contract.json v1.3.0 (+ live capture 2026-11-16 for contract gaps)
 * Generator: /playwright-gen complaints
 * Privacy:   the prefilled values are the test account's personal data: never logged or compared, only filled/empty.
 * Deferred:  rbac_checks CMP-05-RBAC-1 (API-level, endpoint TBD) → /script-gen after `qa-kit api-scrape`.
 */
import { test, expect, type Page } from '@playwright/test'
import * as allure from 'allure-js-commons'
import { PaymentsUiEmployeePgrCreateComplaintPage } from '../../pages/PaymentsUiEmployeePgrCreateComplaintPage.page'
import { HomePage } from '../../pages/HomePage.page'
import { installOverlayHandlers, waitForLoaderGone, blockCreateRequests } from '../../helpers/app'

const BASE_URL = (process.env.QA_UI_BASE_URL || '').trim() || 'https://sierraleone-hcm.digit.org/workbench-ui/employee'   // .env QA_UI_BASE_URL normally supplies this
const YAML_SOURCE = 'tests/testcases/complaints/CMP-05.yaml'
const OPEN_STEP = '1. Open /payments-ui/employee/pgr/create-complaint, wait for animation_1dcbe0 to be hidden and for the one-time form rebuild (form element replaced, max 15 s)'

async function openForm(page: Page, form: PaymentsUiEmployeePgrCreateComplaintPage): Promise<void> {
  await form.goto(BASE_URL)
  await waitForLoaderGone(new HomePage(page).animation1dcbe0())
  await form.waitForFormRebuild()
}

test.describe('CMP-05 complainant_myself_or_another_user', {
  tag: ['@CMP-05', '@complaints', '@P1'],
}, () => {
  test("CMP-05-H1: Fill and lock the complainant's name and number when Myself is chosen", {
    tag: ['@regression'],
  }, async ({ page }) => {
    await allure.tms(YAML_SOURCE + '#CMP-05-H1', 'CMP-05-H1')
    await allure.parameter('case_id', 'CMP-05-H1')
    await allure.parameter('flow_id', 'CMP-05')
    await allure.parameter('module', 'complaints')
    await allure.parameter('type', 'happy_path')
    await allure.parameter('priority', 'P1')
    await allure.parameter('test_data_ref', 'CMP-05-H1')
    await allure.parameter('yaml_source', YAML_SOURCE)
    await allure.epic('complaints')
    await allure.feature('complainant_myself_or_another_user')
    await allure.story("Fill and lock the complainant's name and number when Myself is chosen")
    await allure.severity('normal')
    await allure.tag('regression')
    await allure.description('The account-prefill path: the complainant details come from the logged-in user.\n\nSource: ' + YAML_SOURCE + '#CMP-05-H1')

    const form = new PaymentsUiEmployeePgrCreateComplaintPage(page)

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      await blockCreateRequests(page)
    })

    await allure.step(OPEN_STEP, async () => {
      await openForm(page, form)
    })
    await allure.step('2. Click field_4_cba6ab (Myself: the first radio with id pgr-create-complaint-es_createcomplaint_for)', async () => {
      await form.field4Cba6ab().check()
    })

    await allure.step('Assert: myself_radio_checked', async () => {
      await expect(form.field4Cba6ab()).toBeChecked()
    })
    await allure.step('Assert: complainant_name_filled_and_read_only', async () => {
      await expect(form.complainantnameFc3612()).not.toHaveValue('')
      await expect(form.complainantnameFc3612()).not.toBeEditable()
    })
    await allure.step('Assert: complainant_contact_number_filled_and_read_only', async () => {
      await expect(form.complainantcontactnumber869a24()).not.toHaveValue('')
      await expect(form.complainantcontactnumber869a24()).not.toBeEditable()
    })
  })

  test("CMP-05-H2: Clear and unlock the complainant's name and number when switching to Another User", {
    tag: ['@regression'],
  }, async ({ page }) => {
    await allure.tms(YAML_SOURCE + '#CMP-05-H2', 'CMP-05-H2')
    await allure.parameter('case_id', 'CMP-05-H2')
    await allure.parameter('flow_id', 'CMP-05')
    await allure.parameter('module', 'complaints')
    await allure.parameter('type', 'happy_path')
    await allure.parameter('priority', 'P1')
    await allure.parameter('test_data_ref', 'CMP-05-H2')
    await allure.parameter('yaml_source', YAML_SOURCE)
    await allure.epic('complaints')
    await allure.feature('complainant_myself_or_another_user')
    await allure.story("Clear and unlock the complainant's name and number when switching to Another User")
    await allure.severity('normal')
    await allure.tag('regression')
    await allure.description('The switch back from Myself; checks the prefilled values are cleared and not left locked.\n\nSource: ' + YAML_SOURCE + '#CMP-05-H2')

    const form = new PaymentsUiEmployeePgrCreateComplaintPage(page)

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      await blockCreateRequests(page)
    })

    await allure.step(OPEN_STEP, async () => {
      await openForm(page, form)
    })
    await allure.step('2. Click field_4_cba6ab (Myself) and wait for complainantname_fc3612 to be filled', async () => {
      await form.field4Cba6ab().check()
      await expect(form.complainantnameFc3612()).not.toHaveValue('')
    })
    await allure.step('3. Click field_5_cba6ab (Another User: the second radio with the same id)', async () => {
      await form.field5Cba6ab().check()
    })

    await allure.step('Assert: another_user_radio_checked', async () => {
      await expect(form.field5Cba6ab()).toBeChecked()
    })
    await allure.step('Assert: complainant_name_empty_and_editable', async () => {
      await expect(form.complainantnameFc3612()).toHaveValue('')
      await expect(form.complainantnameFc3612()).toBeEditable()
    })
    await allure.step('Assert: complainant_contact_number_empty_and_editable', async () => {
      await expect(form.complainantcontactnumber869a24()).toHaveValue('')
      await expect(form.complainantcontactnumber869a24()).toBeEditable()
    })
  })
})
