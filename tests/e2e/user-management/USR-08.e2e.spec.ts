/**
 * AUTO-GENERATED — do not edit by hand.
 * Source:    tests/testcases/user-management/USR-08.yaml
 * Flow:      USR-08 — create_user_form_layout_and_options
 * Contract:  ui-contract.json v1.3.0 (+ live capture 2026-11-16, re-verified 2026-11-18, for contract gaps)
 * Generator: /playwright-gen user-management
 * Auth:      default actor (admin) — saved workbench-login session (localStorage via playwright.config.ts).
 * Safety:    read-only; every _create/_update request is aborted.
 * Deferred:  rbac_checks USR-08-RBAC-1 (API-level) → /script-gen after `qa-kit api-scrape`.
 */
import { test, expect } from '@playwright/test'
import * as allure from 'allure-js-commons'
import { PaymentsUiEmployeeHrmsCreatePage } from '../../pages/PaymentsUiEmployeeHrmsCreatePage.page'
import { installOverlayHandlers, blockWriteRequests, loadTestData } from '../../helpers/app'
import { openCreateUser } from '../../helpers/users'

const BASE_URL = (process.env.QA_UI_BASE_URL || '').trim() || 'https://sierraleone-hcm.digit.org/workbench-ui/employee'   // .env QA_UI_BASE_URL normally supplies this
const YAML_SOURCE = 'tests/testcases/user-management/USR-08.yaml'
const OPEN_STEP = '1. Open /payments-ui/employee/hrms/create, wait for animation_1dcbe0 to be hidden, choose ADMIN_KAMBIA in the Hierarchy type dropdown and click Next'

test.describe('USR-08 create_user_form_layout_and_options', {
  tag: ['@USR-08', '@user-management', '@P1'],
}, () => {
  test('USR-08-H1: Show the form sections with required marks on the right fields', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await allure.tms(YAML_SOURCE + '#USR-08-H1', 'USR-08-H1')
    await allure.parameter('case_id', 'USR-08-H1')
    await allure.parameter('flow_id', 'USR-08')
    await allure.parameter('module', 'user-management')
    await allure.parameter('type', 'happy_path')
    await allure.parameter('priority', 'P1')
    await allure.parameter('test_data_ref', 'USR-08-H1')
    await allure.parameter('yaml_source', YAML_SOURCE)
    await allure.epic('user-management')
    await allure.feature('create_user_form_layout_and_options')
    await allure.story('Show the form sections with required marks on the right fields')
    await allure.severity('normal')
    await allure.tag('regression')
    await allure.description('Form inventory: a missing section, field or required mark is caught here.\n\nSource: ' + YAML_SOURCE + '#USR-08-H1')

    const data = loadTestData<{ sections: string[]; requiredLabels: string[]; optionalLabels: string[] }>('USR-08-H1')
    const form = new PaymentsUiEmployeeHrmsCreatePage(page)

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      await blockWriteRequests(page)
    })

    await allure.step(OPEN_STEP, async () => {
      await openCreateUser(page, BASE_URL)
    })
    await allure.step('2. Wait for the Username field (#hrms-create-hr_emp_id_label) to be visible', async () => {
      await expect(form.username()).toBeVisible()
    })

    await allure.step('Assert: section_headings_visible', async () => {
      for (const section of data.sections) await expect(form.sectionHeading(section), section).toBeVisible()
    })
    await allure.step('Assert: required_marks_on_required_fields', async () => {
      for (const label of data.requiredLabels) await expect(form.fieldLabel(label), `"*" on ${label}`).toContainText('*')
    })
    await allure.step('Assert: no_required_mark_on_optional_fields', async () => {
      for (const label of data.optionalLabels) {
        await expect(form.fieldLabel(label), `${label} shown`).toBeVisible()
        await expect(form.fieldLabel(label), `no "*" on ${label}`).not.toContainText('*')
      }
    })
  })

  test('USR-08-H2: Offer the configured Employment Type and Department options', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await allure.tms(YAML_SOURCE + '#USR-08-H2', 'USR-08-H2')
    await allure.parameter('case_id', 'USR-08-H2')
    await allure.parameter('flow_id', 'USR-08')
    await allure.parameter('module', 'user-management')
    await allure.parameter('type', 'happy_path')
    await allure.parameter('priority', 'P1')
    await allure.parameter('test_data_ref', 'USR-08-H2')
    await allure.parameter('yaml_source', YAML_SOURCE)
    await allure.epic('user-management')
    await allure.feature('create_user_form_layout_and_options')
    await allure.story('Offer the configured Employment Type and Department options')
    await allure.severity('normal')
    await allure.tag('regression')
    await allure.description('Exact short lists from MDMS; a missing or extra option is caught.\n\nSource: ' + YAML_SOURCE + '#USR-08-H2')

    const data = loadTestData<{ employmentTypes: string[]; departments: string[] }>('USR-08-H2')
    const form = new PaymentsUiEmployeeHrmsCreatePage(page)
    let employmentTypes: string[] = []
    let departments: string[] = []

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      await blockWriteRequests(page)
    })

    await allure.step(OPEN_STEP, async () => {
      await openCreateUser(page, BASE_URL)
    })
    await allure.step('2. Open the Employment Type dropdown (#hrms-create-hr_employment_type_label) and read its options, then close it', async () => {
      employmentTypes = await form.readDropdownOptions(form.employmentType())
    })
    await allure.step('3. Open the Department dropdown (#hrms-create-hr_employment_department_label) and read its options', async () => {
      departments = await form.readDropdownOptions(form.department())
    })

    await allure.step('Assert: employment_type_options_match_test_data', async () => {
      expect(employmentTypes).toEqual(data.employmentTypes)
    })
    await allure.step('Assert: department_options_match_test_data', async () => {
      expect(departments).toEqual(data.departments)
    })
  })

  test('USR-08-H3: Offer the Designation, Roles and Gender choices', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await allure.tms(YAML_SOURCE + '#USR-08-H3', 'USR-08-H3')
    await allure.parameter('case_id', 'USR-08-H3')
    await allure.parameter('flow_id', 'USR-08')
    await allure.parameter('module', 'user-management')
    await allure.parameter('type', 'happy_path')
    await allure.parameter('priority', 'P1')
    await allure.parameter('test_data_ref', 'USR-08-H3')
    await allure.parameter('yaml_source', YAML_SOURCE)
    await allure.epic('user-management')
    await allure.feature('create_user_form_layout_and_options')
    await allure.story('Offer the Designation, Roles and Gender choices')
    await allure.severity('normal')
    await allure.tag('regression')
    await allure.description('The long lists, checked by count only (the team may add designations or roles), and the gender choices.\n\nSource: ' + YAML_SOURCE + '#USR-08-H3')

    const data = loadTestData<{ designationCount: number; roleCount: number; genders: string[] }>('USR-08-H3')
    const form = new PaymentsUiEmployeeHrmsCreatePage(page)
    let designationCount = 0
    let roleCount = 0

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      await blockWriteRequests(page)
    })

    await allure.step(OPEN_STEP, async () => {
      await openCreateUser(page, BASE_URL)
    })
    await allure.step('2. Open the Designation dropdown (#hrms-create-hr_employment_designation_label) and count its options, then close it', async () => {
      designationCount = (await form.readDropdownOptions(form.designation())).length
    })
    await allure.step('3. Open the Roles multi-select and count its options, then close it', async () => {
      roleCount = await form.countRoleOptions()
    })

    await allure.step('Assert: designation_option_count_matches_test_data', async () => {
      expect(designationCount).toBe(data.designationCount)
    })
    await allure.step('Assert: roles_option_count_matches_test_data', async () => {
      expect(roleCount, 'role options, not counting "Select all"').toBe(data.roleCount)
    })
    await allure.step('Assert: gender_options_female_and_male', async () => {
      await expect(form.genderLabels()).toHaveText(data.genders)
    })
  })

  test('USR-08-H4: Add a second jurisdiction area and remove it again', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await allure.tms(YAML_SOURCE + '#USR-08-H4', 'USR-08-H4')
    await allure.parameter('case_id', 'USR-08-H4')
    await allure.parameter('flow_id', 'USR-08')
    await allure.parameter('module', 'user-management')
    await allure.parameter('type', 'happy_path')
    await allure.parameter('priority', 'P1')
    await allure.parameter('test_data_ref', 'USR-08-H4')
    await allure.parameter('yaml_source', YAML_SOURCE)
    await allure.epic('user-management')
    await allure.feature('create_user_form_layout_and_options')
    await allure.story('Add a second jurisdiction area and remove it again')
    await allure.severity('normal')
    await allure.tag('regression')
    await allure.description('Multiple jurisdictions (add and remove an area); every other case uses Area 1 only.\n\nSource: ' + YAML_SOURCE + '#USR-08-H4')

    const data = loadTestData<{ areasAfterAdd: string[]; areasAfterRemove: string[] }>('USR-08-H4')
    const form = new PaymentsUiEmployeeHrmsCreatePage(page)

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      await blockWriteRequests(page)
    })

    await allure.step(OPEN_STEP, async () => {
      await openCreateUser(page, BASE_URL)
    })
    await allure.step('2. Click Add Jurisdiction', async () => {
      await form.addJurisdiction().click()
    })
    await allure.step('3. Wait for the Area 2 block to appear with its own Country dropdown (observed live 2026-11-16)', async () => {
      await expect(form.areaHeadings()).toHaveText(data.areasAfterAdd)
      await expect(form.area(2).locator('.employee-select-wrap')).toBeVisible()
    })
    await allure.step('4. Click the red delete (trash) icon of the Area 2 block (contract gap; selector confirmed at /playwright-gen)', async () => {
      await form.areaDeleteIcon(2).click()
    })

    await allure.step('Assert: only_area_1_remains', async () => {
      await expect(form.areaHeadings()).toHaveText(data.areasAfterRemove)
    })
    await allure.step('Assert: one_jurisdiction_country_dropdown', async () => {
      await expect(form.countryDropdowns()).toHaveCount(1)
    })
  })
})
