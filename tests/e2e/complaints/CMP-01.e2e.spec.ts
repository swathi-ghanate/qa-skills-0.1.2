/**
 * AUTO-GENERATED — do not edit by hand.
 * Source:    tests/testcases/complaints/CMP-01.yaml
 * Flow:      CMP-01 — open_create_complaint_from_home
 * Contract:  ui-contract.json v1.3.0 (+ live capture 2026-11-16 for contract gaps)
 * Generator: /playwright-gen complaints
 * Auth:      default actor (admin) — saved workbench-login session (localStorage via playwright.config.ts,
 *            DIGIT sessionStorage rebuilt by restoreSavedSession()).
 * Deferred:  rbac_checks CMP-01-RBAC-1 (API-level, endpoint TBD) → /script-gen after `qa-kit api-scrape`.
 */
import { test, expect } from '@playwright/test'
import * as allure from 'allure-js-commons'
import { WorkbenchUiEmployeePage } from '../../pages/WorkbenchUiEmployeePage.page'
import { PaymentsUiEmployeePgrCreateComplaintPage } from '../../pages/PaymentsUiEmployeePgrCreateComplaintPage.page'
import { HomePage } from '../../pages/HomePage.page'
import { expectPathname } from '../../helpers/routes'
import { installOverlayHandlers, waitForLoaderGone, restoreSavedSession, blockCreateRequests, loadTestData } from '../../helpers/app'

const BASE_URL = (process.env.QA_UI_BASE_URL || '').trim() || 'https://sierraleone-hcm.digit.org/workbench-ui/employee'   // .env QA_UI_BASE_URL normally supplies this
const YAML_SOURCE = 'tests/testcases/complaints/CMP-01.yaml'

test.describe('CMP-01 open_create_complaint_from_home', {
  tag: ['@CMP-01', '@complaints', '@P0'],
}, () => {
  test('CMP-01-H1: Open Create complaint from the Complaints card on the workbench home', {
    tag: ['@smoke', '@regression'],
  }, async ({ page }) => {
    await allure.tms(YAML_SOURCE + '#CMP-01-H1', 'CMP-01-H1')
    await allure.parameter('case_id', 'CMP-01-H1')
    await allure.parameter('flow_id', 'CMP-01')
    await allure.parameter('module', 'complaints')
    await allure.parameter('type', 'happy_path')
    await allure.parameter('priority', 'P0')
    await allure.parameter('test_data_ref', 'CMP-01-H1')
    await allure.parameter('yaml_source', YAML_SOURCE)
    await allure.epic('complaints')
    await allure.feature('open_create_complaint_from_home')
    await allure.story('Open Create complaint from the Complaints card on the workbench home')
    await allure.severity('critical')
    await allure.tag('smoke')
    await allure.tag('regression')
    await allure.description('The real user path into the form (home card, then a payments-ui app switch); AUTH-07-H1 only opens the URL directly to test the session.\n\nSource: ' + YAML_SOURCE + '#CMP-01-H1')

    const workbench = new WorkbenchUiEmployeePage(page)
    const createComplaint = new PaymentsUiEmployeePgrCreateComplaintPage(page)
    const loader = new HomePage(page)

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      await restoreSavedSession(page)   // the workbench home needs the DIGIT sessionStorage too
      await blockCreateRequests(page)   // read-only case: no complaint can be created
    })

    await allure.step('1. Open /workbench-ui/employee and wait for animation_1dcbe0 to be hidden', async () => {
      await workbench.goto(BASE_URL)
      await waitForLoaderGone(loader.animation1dcbe0())
    })
    await allure.step('2. Wait for create_complaint_17f516 to be visible', async () => {
      // A cold load can take ~15 s, so allow 60 s.
      await expect(workbench.createComplaint17f516()).toBeVisible({ timeout: 60_000 })
    })
    await allure.step('3. Click create_complaint_17f516', async () => {
      await workbench.createComplaint17f516().click()
    })
    await allure.step('4. Wait for the URL pathname to be /payments-ui/employee/pgr/create-complaint and for animation_1dcbe0 to be hidden', async () => {
      await expectPathname(page, PaymentsUiEmployeePgrCreateComplaintPage.PATH)
      await waitForLoaderGone(loader.animation1dcbe0())
    })

    await allure.step('Assert: url_pathname_is_payments_ui_employee_pgr_create_complaint', async () => {
      await expectPathname(page, PaymentsUiEmployeePgrCreateComplaintPage.PATH)
    })
    await allure.step('Assert: submit_button_visible', async () => {
      // The payments-ui app is a separate bundle; its first load is slow, so allow 60 s.
      await expect(createComplaint.submitB6846a()).toBeVisible({ timeout: 60_000 })
    })
    await allure.step('Assert: complaint_type_field_visible', async () => {
      await expect(createComplaint.field09988fc()).toBeVisible()
    })
  })

  test('CMP-01-H2: Show all five form sections with their fields and required markers', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await allure.tms(YAML_SOURCE + '#CMP-01-H2', 'CMP-01-H2')
    await allure.parameter('case_id', 'CMP-01-H2')
    await allure.parameter('flow_id', 'CMP-01')
    await allure.parameter('module', 'complaints')
    await allure.parameter('type', 'happy_path')
    await allure.parameter('priority', 'P1')
    await allure.parameter('test_data_ref', 'CMP-01-H2')
    await allure.parameter('yaml_source', YAML_SOURCE)
    await allure.epic('complaints')
    await allure.feature('open_create_complaint_from_home')
    await allure.story('Show all five form sections with their fields and required markers')
    await allure.severity('normal')
    await allure.tag('regression')
    await allure.description('Form inventory: catches a missing section, field or required marker, which the navigation case does not check.\n\nSource: ' + YAML_SOURCE + '#CMP-01-H2')

    const data = loadTestData<{ sections: string[] }>('CMP-01-H2')
    const createComplaint = new PaymentsUiEmployeePgrCreateComplaintPage(page)
    const loader = new HomePage(page)

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      await blockCreateRequests(page)
    })

    await allure.step('1. Open /payments-ui/employee/pgr/create-complaint and wait for animation_1dcbe0 to be hidden', async () => {
      await createComplaint.goto(BASE_URL)
      await waitForLoaderGone(loader.animation1dcbe0())
    })
    await allure.step('2. Wait for submit_b6846a to be visible', async () => {
      await expect(createComplaint.submitB6846a()).toBeVisible({ timeout: 60_000 })
    })

    await allure.step('Assert: section_headings_visible', async () => {
      for (const section of data.sections) await expect(createComplaint.sectionHeading(section), section).toBeVisible()
    })
    await allure.step('Assert: required_markers_shown', async () => {
      for (const label of ['Complaint Type', 'Date of complaint', 'Are you raising a complaint for yourself or another user?', 'Complainant Contact Number', 'Complaint description']) {
        await expect(createComplaint.fieldLabel(label), `"*" on ${label}`).toContainText('*')
      }
      await expect(createComplaint.boundaryLabel('Country'), '"*" on Country').toContainText('*')
      for (const optional of ["Supervisor's name", 'Address line 1', 'Postal code']) {
        await expect(createComplaint.fieldLabel(optional), `no "*" on ${optional}`).not.toContainText('*')
      }
    })
    await allure.step('Assert: key_fields_visible', async () => {
      for (const field of [
        createComplaint.field09988fc(), createComplaint.complaintdate8ac55d(), createComplaint.boundaryDropdown('Country'),
        createComplaint.field4Cba6ab(), createComplaint.field5Cba6ab(), createComplaint.complainantnameFc3612(),
        createComplaint.complainantcontactnumber869a24(), createComplaint.description9237c5(), createComplaint.chooseFile4a8be7(),
        createComplaint.addressone768768(), createComplaint.postalcode0b8576(),
      ]) await expect(field).toBeVisible()
    })
  })
})
