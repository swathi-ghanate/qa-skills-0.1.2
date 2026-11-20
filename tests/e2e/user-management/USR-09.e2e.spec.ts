/**
 * AUTO-GENERATED — do not edit by hand.
 * Source:    tests/testcases/user-management/USR-09.yaml
 * Flow:      USR-09 — create_user_field_rules
 * Contract:  ui-contract.json v1.3.0 (+ live capture 2026-11-16, re-verified 2026-11-18, for contract gaps)
 * Generator: /playwright-gen user-management
 * Auth:      default actor (admin) — saved workbench-login session (localStorage via playwright.config.ts).
 * Safety:    synthetic values only; Submit stays disabled and every _create/_update request is aborted.
 * Mobile:    exactly 9 digits, any first digit (user, 2026-11-20; confirmed live in the form and its MDMS config). H1 = 9, E3 = 8, E6 = 10.
 * Deferred:  rbac_checks USR-09-RBAC-1 (API-level) → /script-gen after `qa-kit api-scrape`.
 */
import { test, expect, type Page } from '@playwright/test'
import * as allure from 'allure-js-commons'
import { PaymentsUiEmployeeHrmsCreatePage } from '../../pages/PaymentsUiEmployeeHrmsCreatePage.page'
import { installOverlayHandlers, blockWriteRequests, loadTestData, localIsoDate, localIsoDateYearsAgo } from '../../helpers/app'
import { openCreateUser } from '../../helpers/users'

const BASE_URL = (process.env.QA_UI_BASE_URL || '').trim() || 'https://sierraleone-hcm.digit.org/workbench-ui/employee'   // .env QA_UI_BASE_URL normally supplies this
const YAML_SOURCE = 'tests/testcases/user-management/USR-09.yaml'
const OPEN_STEP = '1. Open /payments-ui/employee/hrms/create, wait for animation_1dcbe0 to be hidden, choose ADMIN_KAMBIA in the Hierarchy type dropdown and click Next'

type Case = { id: string; type: 'happy_path' | 'negative'; title: string; coverage: string }

/** Traceability and report metadata shared by every USR-09 case (all are P1 regression). */
async function annotate(c: Case): Promise<void> {
  await allure.tms(YAML_SOURCE + '#' + c.id, c.id)
  await allure.parameter('case_id', c.id)
  await allure.parameter('flow_id', 'USR-09')
  await allure.parameter('module', 'user-management')
  await allure.parameter('type', c.type)
  await allure.parameter('priority', 'P1')
  await allure.parameter('test_data_ref', c.id)
  await allure.parameter('yaml_source', YAML_SOURCE)
  await allure.epic('user-management')
  await allure.feature('create_user_field_rules')
  await allure.story(c.title)
  await allure.severity('normal')
  await allure.tag('regression')
  await allure.description(c.coverage + '\n\nSource: ' + YAML_SOURCE + '#' + c.id)
}

async function start(page: Page): Promise<PaymentsUiEmployeeHrmsCreatePage> {
  await allure.step('Precondition: start state', async () => {
    await installOverlayHandlers(page)
    await blockWriteRequests(page)
  })
  let form!: PaymentsUiEmployeeHrmsCreatePage
  await allure.step(OPEN_STEP, async () => {
    form = await openCreateUser(page, BASE_URL)
  })
  return form
}

test.describe('USR-09 create_user_field_rules', {
  tag: ['@USR-09', '@user-management', '@P1'],
}, () => {
  test('USR-09-H1: Accept a 9-digit mobile number', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await annotate({ id: 'USR-09-H1', type: 'happy_path', title: 'Accept a 9-digit mobile number', coverage: 'Exactly 9 digits is accepted, and the leading 0 of the local format is kept; E3 and E6 cover 8 and 10 digits.' })
    const data = loadTestData<{ mobileNumber: string }>('USR-09-H1')
    const form = await start(page)

    await allure.step('2. Fill Mobile Number (#hrms-create-hr_mob_no_label) with the valid synthetic number from test data USR-09-H1 and move focus away', async () => {
      await form.mobileNumber().fill(data.mobileNumber)
      await form.mobileNumber().blur()
    })

    await allure.step('Assert: mobile_number_error_not_shown', async () => {
      await expect(form.mobileNumber()).toHaveValue(data.mobileNumber)
      await expect(form.fieldError(form.mobileNumber())).toBeHidden()
    })
  })

  test('USR-09-H2: Limit Date of Birth to users aged 18 or more and Date of Appointment to today', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await annotate({ id: 'USR-09-H2', type: 'happy_path', title: 'Limit Date of Birth to users aged 18 or more and Date of Appointment to today', coverage: 'The two date limits set by the app (observed live 2026-11-16).' })
    const data = loadTestData<{ minimumAgeYears: number }>('USR-09-H2')
    const form = await start(page)

    await allure.step('Assert: date_of_birth_max_is_today_minus_18_years', async () => {
      await expect(form.dateOfBirth()).toHaveAttribute('max', localIsoDateYearsAgo(data.minimumAgeYears))
    })
    await allure.step('Assert: date_of_appointment_max_is_today', async () => {
      await expect(form.dateOfAppointment()).toHaveAttribute('max', localIsoDate(0))
    })
  })

  test('USR-09-E1: Reject a password shorter than 8 characters', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await annotate({ id: 'USR-09-E1', type: 'negative', title: 'Reject a password shorter than 8 characters', coverage: 'Below the 8-character minimum of the password rule.' })
    const data = loadTestData<{ password: string; expectedError: string }>('USR-09-E1')
    const form = await start(page)

    await allure.step('2. Fill Password (#hrms-create-hr_emp_password_label) with the short value from test data USR-09-E1 and move focus away', async () => {
      await form.password().fill(data.password)
      await form.password().blur()
    })

    await allure.step('Assert: password_rule_error_visible', async () => {
      await expect(form.fieldError(form.password())).toHaveText(data.expectedError)
    })
    await allure.step('Assert: submit_disabled', async () => {
      await expect(form.submit()).toBeDisabled()
    })
  })

  test('USR-09-E2: Reject a Confirm Password that does not match', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await annotate({ id: 'USR-09-E2', type: 'negative', title: 'Reject a Confirm Password that does not match', coverage: 'Two valid passwords that differ; E1 covers an invalid one.' })
    const data = loadTestData<{ password: string; confirmPassword: string; expectedError: string }>('USR-09-E2')
    const form = await start(page)

    await allure.step('2. Fill Password (#hrms-create-hr_emp_password_label) with the valid synthetic password from test data USR-09-E2', async () => {
      await form.password().fill(data.password)
    })
    await allure.step('3. Fill Confirm Password (#hrms-create-hr_emp_confirm_password_label) with the different value from test data USR-09-E2 and move focus away', async () => {
      await form.confirmPassword().fill(data.confirmPassword)
      await form.confirmPassword().blur()
    })

    await allure.step('Assert: password_mismatch_error_visible', async () => {
      await expect(form.fieldError(form.confirmPassword())).toHaveText(data.expectedError)
    })
    await allure.step('Assert: submit_disabled', async () => {
      await expect(form.submit()).toBeDisabled()
    })
  })

  test('USR-09-E3: Reject a mobile number that is too short', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await annotate({ id: 'USR-09-E3', type: 'negative', title: 'Reject a mobile number that is too short', coverage: 'One digit below the 9-digit rule (8 digits); E6 covers one digit above.' })
    const data = loadTestData<{ mobileNumber: string; expectedError: string }>('USR-09-E3')
    const form = await start(page)

    await allure.step('2. Fill Mobile Number (#hrms-create-hr_mob_no_label) with the short value from test data USR-09-E3 and move focus away', async () => {
      await form.mobileNumber().fill(data.mobileNumber)
      await form.mobileNumber().blur()
    })

    await allure.step('Assert: mobile_number_error_visible', async () => {
      await expect(form.fieldError(form.mobileNumber())).toHaveText(data.expectedError)
    })
    await allure.step('Assert: submit_disabled', async () => {
      await expect(form.submit()).toBeDisabled()
    })
  })

  test('USR-09-E4: Reject an email address without @ and domain', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await annotate({ id: 'USR-09-E4', type: 'negative', title: 'Reject an email address without @ and domain', coverage: 'The optional Email field still validates its format.' })
    const data = loadTestData<{ email: string; expectedError: string }>('USR-09-E4')
    const form = await start(page)

    await allure.step('2. Fill Email (#hrms-create-hr_email_label) with the invalid value from test data USR-09-E4 and move focus away', async () => {
      await form.email().fill(data.email)
      await form.email().blur()
    })

    await allure.step('Assert: email_error_visible', async () => {
      await expect(form.fieldError(form.email())).toHaveText(data.expectedError)
    })
    await allure.step('Assert: submit_disabled', async () => {
      await expect(form.submit()).toBeDisabled()
    })
  })

  test('USR-09-E5: Reject a name that contains digits', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await annotate({ id: 'USR-09-E5', type: 'negative', title: 'Reject a name that contains digits', coverage: 'Name format check; asserts the rejection itself so a later message fix does not break it.' })
    const data = loadTestData<{ name: string }>('USR-09-E5')
    const form = await start(page)

    await allure.step('2. Fill Name (#hrms-create-hr_emp_name_label) with the value with digits from test data USR-09-E5 and move focus away', async () => {
      await form.name().fill(data.name)
      await form.name().blur()
    })

    await allure.step('Assert: name_error_visible', async () => {
      // Finding: the app shows the misleading text "Required" here; any error text is accepted.
      await expect(form.fieldError(form.name())).toBeVisible()
      await expect(form.fieldError(form.name())).not.toHaveText('')
    })
    await allure.step('Assert: submit_disabled', async () => {
      await expect(form.submit()).toBeDisabled()
    })
  })

  test('USR-09-E6: Reject a 10-digit mobile number', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await annotate({ id: 'USR-09-E6', type: 'negative', title: 'Reject a 10-digit mobile number', coverage: "One digit above the 9-digit rule (10 digits, the old rule's length); with E3 it pins the length from both sides." })
    const data = loadTestData<{ mobileNumber: string; expectedError: string }>('USR-09-E6')
    const form = await start(page)

    await allure.step('2. Fill Mobile Number (#hrms-create-hr_mob_no_label) with the number from test data USR-09-E6 and move focus away', async () => {
      await form.mobileNumber().fill(data.mobileNumber)
      await form.mobileNumber().blur()
    })

    await allure.step('Assert: mobile_number_error_visible', async () => {
      await expect(form.fieldError(form.mobileNumber())).toHaveText(data.expectedError)
    })
    await allure.step('Assert: submit_disabled', async () => {
      await expect(form.submit()).toBeDisabled()
    })
  })
})
