/**
 * AUTO-GENERATED — do not edit by hand.
 * Source:    tests/testcases/user-management/USR-10.yaml (H1), USR-11.yaml (H1), USR-13.yaml (H3, H5, H4)
 * Flow:      one test user per run (team decision 2026-11-18):
 *            USR-10-H1 create → USR-11-H1 edit → USR-13-H3 Take Action menu → USR-13-H5 assign/unassign campaign
 *            → USR-13-H4 deactivate (last, so the run leaves no active test user).
 * Contract:  ui-contract.json v1.3.0 (+ live capture 2026-11-16 and 2026-11-18; details, edit and assign-campaign pages
 *            are not in the contract)
 * Generator: /playwright-gen user-management
 * Auth:      default actor (admin) — saved workbench-login session (localStorage via playwright.config.ts).
 * SIDE EFFECT: creates ONE REAL login account per run on the live Sierra Leone environment (approved 2026-11-16),
 *            username qatest<timestamp> (Allure parameter created_username), role Dashboard Viewer, with a synthetic
 *            mobile number (decided 2026-11-18, accepting that DIGIT may text the account details to it).
 * Order:     the tests run in declaration order (playwright.config.ts: workers 1, fullyParallel false). The username is
 *            kept in test-results/ (emptied at the start of every run), so a failed step does not stop the later
 *            ones, and the deactivation still runs. QA_LIFECYCLE_USERNAME=qatest<digits> re-runs the later steps on an
 *            earlier test user without creating another one.
 * Unverified until their first run: the create/update endpoints, the success screen, the Deactivate form (H4).
 * Deferred:  rbac_checks USR-10/11/13-RBAC-1 (API-level) → /script-gen after `qa-kit api-scrape`.
 */
import { test, expect, type Response } from '@playwright/test'
import * as allure from 'allure-js-commons'
import { PaymentsUiEmployeeHrmsCreatePage } from '../../pages/PaymentsUiEmployeeHrmsCreatePage.page'
import { PaymentsUiEmployeeHrmsInboxPage } from '../../pages/PaymentsUiEmployeeHrmsInboxPage.page'
import { PaymentsUiEmployeeHrmsDetailsPage } from '../../pages/PaymentsUiEmployeeHrmsDetailsPage.page'
import { PaymentsUiEmployeeHrmsEditPage } from '../../pages/PaymentsUiEmployeeHrmsEditPage.page'
import { PaymentsUiEmployeeHrmsAssignCampaignPage } from '../../pages/PaymentsUiEmployeeHrmsAssignCampaignPage.page'
import { HomePage } from '../../pages/HomePage.page'
import { expectPathname } from '../../helpers/routes'
import { installOverlayHandlers, waitForLoaderGone, blockWriteRequests, loadTestData, fillPrivately, localIsoDate, localIsoDateYearsAgo } from '../../helpers/app'
import {
  type TestUserData, requireTeamAnswers, newTestUsername, generatePassword, syntheticMobile, submitCreateUser,
  openCreateUser, openUserSearch, openUserDetails, saveLifecycleUser, lifecycleUser,
} from '../../helpers/users'

const BASE_URL = (process.env.QA_UI_BASE_URL || '').trim() || 'https://sierraleone-hcm.digit.org/workbench-ui/employee'   // .env QA_UI_BASE_URL normally supplies this
const YAML = {
  'USR-10': 'tests/testcases/user-management/USR-10.yaml',
  'USR-11': 'tests/testcases/user-management/USR-11.yaml',
  'USR-13': 'tests/testcases/user-management/USR-13.yaml',
} as const
const FLOW_NAME = { 'USR-10': 'create_test_user', 'USR-11': 'edit_test_user', 'USR-13': 'take_action_on_searched_user' } as const
const TAKE_USER_STEP = '1. Take the username of the test user created by USR-10-H1 in this run'
const OPEN_DETAILS_STEP = '2. Open /payments-ui/employee/hrms/inbox, pass the hierarchy step, search the new username and click its username link'

type Meta = { id: string; flow: keyof typeof YAML; priority: 'P0' | 'P1' | 'P2'; title: string; coverage: string; tags: string[] }

/** Traceability and report metadata for one lifecycle case (all happy_path). */
async function annotate(m: Meta): Promise<void> {
  const source = YAML[m.flow]
  await allure.tms(source + '#' + m.id, m.id)
  await allure.parameter('case_id', m.id)
  await allure.parameter('flow_id', m.flow)
  await allure.parameter('module', 'user-management')
  await allure.parameter('type', 'happy_path')
  await allure.parameter('priority', m.priority)
  await allure.parameter('test_data_ref', m.id)
  await allure.parameter('yaml_source', source)
  await allure.epic('user-management')
  await allure.feature(FLOW_NAME[m.flow])
  await allure.story(m.title)
  await allure.severity(m.priority === 'P0' ? 'critical' : m.priority === 'P1' ? 'normal' : 'minor')
  for (const tag of m.tags) await allure.tag(tag)
  await allure.description(m.coverage + '\n\nSource: ' + source + '#' + m.id)
}

test.describe('USR lifecycle: one test user per run', {
  tag: ['@user-management', '@lifecycle'],
}, () => {
  test('USR-10-H1: Create a test user with every required field and find it by its username', {
    tag: ['@USR-10', '@P0', '@smoke', '@regression'],
  }, async ({ page }) => {
    await annotate({ id: 'USR-10-H1', flow: 'USR-10', priority: 'P0', tags: ['smoke', 'regression'], title: 'Create a test user with every required field and find it by its username', coverage: 'The only end-to-end user creation; the follow-up search proves the user really exists.' })
    const data = loadTestData<TestUserData>('USR-10-H1')
    const inbox = new PaymentsUiEmployeeHrmsInboxPage(page)
    let form!: PaymentsUiEmployeeHrmsCreatePage
    // Set at test level: allure-js-commons attaches a parameter set inside a step to that step only.
    const username = newTestUsername(data.usernamePrefix)
    await allure.parameter('created_username', username, { excluded: true })   // changes every run: keep it out of the Allure history id
    let created!: Response

    await allure.step('Precondition: start state', async () => {
      requireTeamAnswers({ 'the role for test users (test data "role")': data.role })
      await installOverlayHandlers(page)
      await blockWriteRequests(page, ['update'])   // this case only creates
    })

    await allure.step('1. Open /payments-ui/employee/hrms/create, wait for animation_1dcbe0 to be hidden, choose ADMIN_KAMBIA in the Hierarchy type dropdown and click Next', async () => {
      form = await openCreateUser(page, BASE_URL)
    })
    await allure.step('2. Fill Username (#hrms-create-hr_emp_id_label) with qatest plus the run timestamp', async () => {
      await form.username().fill(username)
    })
    await allure.step('3. Fill Password and Confirm Password with the same generated password', async () => {
      const password = generatePassword()
      await fillPrivately(form.password(), password)
      await fillPrivately(form.confirmPassword(), password)
    })
    await allure.step('4. Fill Name with the value from test data USR-10-H1 and Mobile Number with a synthetic number generated at run time', async () => {
      await form.name().fill(data.name)
      await fillPrivately(form.mobileNumber(), syntheticMobile())
    })
    await allure.step('5. Choose the gender from test data and fill Date of Birth with today minus the age in test data', async () => {
      await form.genderRadio(data.gender).check()
      await form.dateOfBirth().fill(localIsoDateYearsAgo(data.ageYears))
    })
    await allure.step('6. Choose Employment Type, Department and Designation from test data and fill Date of Appointment with today', async () => {
      await form.chooseDropdown(form.employmentType(), data.employmentType)
      await form.chooseDropdown(form.department(), data.department)
      await form.chooseDropdown(form.designation(), data.designation)
      await form.dateOfAppointment().fill(localIsoDate(0))
    })
    await allure.step('7. Choose the role from test data in the Roles multi-select', async () => {
      await form.chooseRole(data.role)
    })
    await allure.step('8. Choose the jurisdiction Country from test data in Area 1', async () => {
      await form.chooseCountry(1, data.jurisdiction.Country)
    })
    await allure.step('9. Wait for Submit to be enabled', async () => {
      await expect(form.submit()).toBeEnabled({ timeout: 15_000 })
    })
    await allure.step('10. Click Submit and wait for the POST /egov-hrms/employees/_create response (if the form says the mobile number already exists, fill a new synthetic number and submit again)', async () => {
      created = await submitCreateUser(form)
      if (created.ok()) saveLifecycleUser(username)   // the later lifecycle cases act on this user
    })
    await allure.step('11. Wait for the success screen, then open /payments-ui/employee/hrms/inbox, pass the hierarchy step and search the new username', async () => {
      // The app opens its result screen /hrms/response after the create request (observed 2026-11-18).
      await expectPathname(page, PaymentsUiEmployeeHrmsCreatePage.RESPONSE_PATH, 60_000)
      await waitForLoaderGone(new HomePage(page).animation1dcbe0())
      await openUserSearch(page, BASE_URL)
      await inbox.searchUsername(username)
    })

    await allure.step('Assert: create_request_accepted', async () => {
      expect(created.status(), 'egov-hrms answers a successful create with 202 Accepted (observed 2026-11-18)').toBe(202)
    })
    await allure.step('Assert: new_user_found_by_username', async () => {
      await expect(inbox.resultRows()).toHaveCount(1)
      await expect(inbox.usernameLinks()).toHaveText([username])
    })
  })

  test('USR-11-H1: Change the designation of a test-created user and see it on the details page', {
    tag: ['@USR-11', '@P1', '@regression'],
  }, async ({ page }) => {
    await annotate({ id: 'USR-11-H1', flow: 'USR-11', priority: 'P1', tags: ['regression'], title: 'Change the designation of a test-created user and see it on the details page', coverage: 'Editing an existing user; the edit form was not captured yet and is recorded on the first run.' })
    const data = loadTestData<{ newDesignation: string }>('USR-11-H1')
    const details = new PaymentsUiEmployeeHrmsDetailsPage(page)
    const edit = new PaymentsUiEmployeeHrmsEditPage(page)
    const loader = new HomePage(page).animation1dcbe0()
    let username = ''
    let updated!: Response

    await allure.step('Precondition: start state', async () => {
      requireTeamAnswers({ 'the new designation (test data "newDesignation")': data.newDesignation })
      await installOverlayHandlers(page)
    })

    await allure.step(TAKE_USER_STEP, async () => {
      username = lifecycleUser()
    })
    await allure.parameter('lifecycle_username', username, { excluded: true })   // test level, not inside the step; excluded from the history id (changes every run)
    await allure.step(OPEN_DETAILS_STEP, async () => {
      await openUserDetails(page, BASE_URL, username)
    })
    await allure.step('3. Click Take Action, then Edit Employee', async () => {
      await details.chooseAction('Edit Employee')
      await waitForLoaderGone(loader)
    })
    await allure.step('4. Change Designation to the newDesignation value from test data USR-11-H1', async () => {
      await edit.chooseDesignation(data.newDesignation)
      await expect(edit.designation()).toHaveValue(data.newDesignation)
    })
    await allure.step('5. Click Submit and wait for the POST /egov-hrms/employees/_update response', async () => {
      // Submit opens the "Ready to Submit ?" dialog (observed 2026-11-18); its own Submit sends the update.
      await expect(edit.submit()).toBeEnabled({ timeout: 15_000 })
      const response = page.waitForResponse(r => PaymentsUiEmployeeHrmsEditPage.UPDATE_API_RE.test(r.url()), { timeout: 90_000 })
      const confirm = edit.confirmDialog().waitFor({ state: 'visible', timeout: 30_000 }).then(() => 'confirm' as const)
      const refused = edit.mobileTakenToast().waitFor({ state: 'visible', timeout: 30_000 }).then(() => 'refused' as const)
      for (const p of [response, confirm, refused]) p.catch(() => undefined)
      await edit.submit().click()
      if ((await Promise.race([confirm, refused])) === 'refused') {
        throw new Error('Edit Employee Submit was refused with "Mobile number already exist!" (the form finds the user\'s own number); no update was sent')
      }
      await edit.confirmSubmit().click()
      updated = await response
    })
    await allure.step("6. Open the user's details page again (search the username and click its link)", async () => {
      await openUserDetails(page, BASE_URL, username)
    })

    await allure.step('Assert: update_request_accepted', async () => {
      expect(updated.status(), 'egov-hrms answers a successful update with 202 Accepted (observed 2026-11-18)').toBe(202)
    })
    await allure.step('Assert: details_show_new_designation', async () => {
      await expect(details.sectionHeading('Assignment Details')).toBeVisible({ timeout: 30_000 })
      await expect(page.getByText(data.newDesignation, { exact: true }).first()).toBeVisible()
    })
  })

  test('USR-13-H3: Offer all three actions in Take Action for a test-created user', {
    tag: ['@USR-13', '@P1', '@regression'],
  }, async ({ page }) => {
    await annotate({ id: 'USR-13-H3', flow: 'USR-13', priority: 'P1', tags: ['regression'], title: 'Offer all three actions in Take Action for a test-created user', coverage: 'The full three-action menu, seen on a user that is not the logged-in account (USR-06-H2 shows only two on the own account).' })
    const data = loadTestData<{ actions: string[] }>('USR-13-H3')
    const details = new PaymentsUiEmployeeHrmsDetailsPage(page)
    let username = ''

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      await blockWriteRequests(page)   // no action in the menu is used
    })

    await allure.step(TAKE_USER_STEP, async () => {
      username = lifecycleUser()
    })
    await allure.parameter('lifecycle_username', username, { excluded: true })   // test level, not inside the step; excluded from the history id (changes every run)
    await allure.step(OPEN_DETAILS_STEP, async () => {
      await openUserDetails(page, BASE_URL, username)
    })
    await allure.step('3. Click Take Action', async () => {
      await details.takeAction().click()
    })

    await allure.step('Assert: action_menu_shows_three_actions', async () => {
      await expect(details.actionItems()).toHaveText(data.actions)
    })
  })

  test('USR-13-H5: Assign a campaign to a test-created user and unassign it again', {
    tag: ['@USR-13', '@P2', '@regression'],
  }, async ({ page }) => {
    await annotate({ id: 'USR-13-H5', flow: 'USR-13', priority: 'P2', tags: ['regression'], title: 'Assign a campaign to a test-created user and unassign it again', coverage: 'Action 3 end to end (assign and unassign), leaving the test user as it started; H2 only opens the page.' })
    const data = loadTestData<{ campaign: string; campaignNumber: string }>('USR-13-H5')
    const details = new PaymentsUiEmployeeHrmsDetailsPage(page)
    const assign = new PaymentsUiEmployeeHrmsAssignCampaignPage(page)
    const row = assign.campaignRow(data.campaignNumber)
    let username = ''

    await allure.step('Precondition: start state', async () => {
      requireTeamAnswers({ 'the campaign for test assignments (test data "campaign")': data.campaign })
      await installOverlayHandlers(page)
    })

    await allure.step(TAKE_USER_STEP, async () => {
      username = lifecycleUser()
    })
    await allure.parameter('lifecycle_username', username, { excluded: true })   // test level, not inside the step; excluded from the history id (changes every run)
    await allure.step(OPEN_DETAILS_STEP, async () => {
      await openUserDetails(page, BASE_URL, username)
    })
    await allure.step('3. Click Take Action, then Edit Campaign Assignment', async () => {
      await details.chooseAction('Edit Campaign Assignment')
      await waitForLoaderGone(new HomePage(page).animation1dcbe0())
    })
    await allure.step('4. Search for the campaign from test data USR-13-H5, click Assign on its row, fill Assigned from Date with today in the Campaign Assignment dialog and Submit; wait for the save to finish', async () => {
      await assign.searchCampaign(data.campaign)
      await expect(row).toHaveCount(1, { timeout: 30_000 })
      await row.getByRole('button', { name: 'Assign', exact: true }).click()
      await expect(assign.assignmentDialog()).toBeVisible()
      await assign.assignedFromDate().fill(localIsoDate(0))
      const saved = page.waitForResponse(r => PaymentsUiEmployeeHrmsAssignCampaignPage.STAFF_CREATE_API_RE.test(r.url()), { timeout: 60_000 })
      await assign.assignmentSubmit().click()
      expect((await saved).status(), 'assign (project staff _create) accepted').toBe(202)
      // The save is asynchronous (202): reload the rows and wait until the server shows the assignment.
      await expect(async () => {
        await assign.searchCampaign(data.campaign)
        await expect(row.getByRole('button', { name: 'Unassign', exact: true })).toBeVisible({ timeout: 5_000 })
      }).toPass({ timeout: 60_000 })
    })
    await allure.step('5. Click Unassign on the same row and wait for the save to finish', async () => {
      const deleted = page.waitForResponse(r => PaymentsUiEmployeeHrmsAssignCampaignPage.STAFF_DELETE_API_RE.test(r.url()), { timeout: 60_000 })
      await row.getByRole('button', { name: 'Unassign', exact: true }).click()   // no confirmation (observed 2026-11-18)
      expect((await deleted).status(), 'unassign (project staff _delete) accepted').toBe(202)
      await expect(async () => {
        await assign.searchCampaign(data.campaign)
        await expect(row.getByRole('button', { name: 'Assign', exact: true })).toBeVisible({ timeout: 5_000 })
      }).toPass({ timeout: 60_000 })
    })

    await allure.step('Assert: campaign_not_assigned_at_end', async () => {
      await expect(row.getByRole('button', { name: 'Assign', exact: true })).toBeVisible()
      await expect(row.getByRole('button', { name: 'Unassign', exact: true })).toHaveCount(0)
    })
    await allure.step('Assert: no_error_shown', async () => {
      // UNVERIFIED: DIGIT error toasts were only seen as div.toast-label; confirm the success/error toast classes on the first run.
      await expect(page.locator('.toast-label').filter({ hasText: /error|fail/i })).toHaveCount(0)
    })
  })

  test('USR-13-H4: Deactivate a test-created user and find it with the Inactive filter', {
    tag: ['@USR-13', '@P1', '@regression'],
  }, async ({ page }) => {
    await annotate({ id: 'USR-13-H4', flow: 'USR-13', priority: 'P1', tags: ['regression'], title: 'Deactivate a test-created user and find it with the Inactive filter', coverage: "Action 2 (Deactivate Employee), proven by the Inactive filter finding the user; no other case changes a user's status." })
    const data = loadTestData<{ deactivation: { reason: string; remarks: string } }>('USR-13-H4')
    const inbox = new PaymentsUiEmployeeHrmsInboxPage(page)
    const details = new PaymentsUiEmployeeHrmsDetailsPage(page)
    let username = ''
    let deactivated!: Promise<Response>
    let deactivateResponse!: Response

    await allure.step('Precondition: start state', async () => {
      requireTeamAnswers({ 'the deactivation reason (test data deactivation.reason)': data.deactivation.reason })
      await installOverlayHandlers(page)
    })

    await allure.step(TAKE_USER_STEP, async () => {
      username = lifecycleUser()
    })
    await allure.parameter('lifecycle_username', username, { excluded: true })   // test level, not inside the step; excluded from the history id (changes every run)
    await allure.step(OPEN_DETAILS_STEP, async () => {
      await openUserDetails(page, BASE_URL, username)
    })
    await allure.step('3. Click Take Action, then Deactivate Employee', async () => {
      await details.chooseAction('Deactivate Employee')
    })
    await allure.step('4. Fill the deactivation details from test data USR-13-H4 and confirm', async () => {
      // Popup captured 2026-11-18; Effective Date is prefilled with today, Order No. and documents are optional.
      await expect(details.deactivationForm()).toBeVisible()
      await details.deactivationReason().click()
      await details.deactivationReasonOption(data.deactivation.reason).click()
      await expect(details.deactivationEffectiveDate()).toHaveValue(localIsoDate(0))
      await details.deactivationRemarks().fill(data.deactivation.remarks)
      deactivated = page.waitForResponse(r => PaymentsUiEmployeeHrmsEditPage.UPDATE_API_RE.test(r.url()), { timeout: 60_000 })
      deactivated.catch(() => undefined)
      await details.deactivationConfirm().click()
    })
    await allure.step('5. Wait for the POST /egov-hrms/employees/_update response', async () => {
      deactivateResponse = await deactivated
    })
    await allure.step('6. Open /payments-ui/employee/hrms/inbox, pass the hierarchy step, choose the Inactive Employment Status filter, search the new username', async () => {
      await openUserSearch(page, BASE_URL)
      await inbox.statusRadio('Inactive').click()
      const filtered = page.waitForResponse(r => PaymentsUiEmployeeHrmsInboxPage.SEARCH_API_RE.test(r.url()))
      await inbox.applyFilters().click()
      await filtered
      await inbox.searchUsername(username)
    })

    await allure.step('Assert: deactivate_request_accepted', async () => {
      // Deactivation goes through the same egov-hrms _update as Edit Employee, which answers 202 Accepted (observed 2026-11-18).
      expect(deactivateResponse.status()).toBe(202)
    })
    await allure.step('Assert: user_found_with_inactive_filter', async () => {
      await expect(inbox.resultRows()).toHaveCount(1)
      await expect(inbox.usernameLinks()).toHaveText([username])
    })
  })
})
