/**
 * AUTO-GENERATED — do not edit by hand.
 * Source:    tests/testcases/complaints-inbox/INB-10.yaml
 * Flow:      INB-10 — take_action_menu_read_only
 * Contract:  ui-contract.json v1.3.0 (the details page and pop-ups are NOT in the contract; verified live, read-only, 2026-11-20)
 * Generator: /playwright-gen complaints-inbox
 * Auth:      default actor (admin) — saved workbench-login session (playwright.config.ts) + restoreSavedSession().
 * Safety:    READ-ONLY. Every request that is not a read is aborted (blockNonReadRequests), so no complaint can be
 *            assigned, rejected or resolved. Pop-ups are closed with Cancel; Submit is clicked only in E1/E2, where an
 *            attempted save is aborted, recorded and reported as a finding. Submit is NOT disabled on an empty form
 *            (observed live 2026-11-20). Really changing a complaint is INB-11, which waits for team approval.
 * Privacy:   the Assign to list holds real staff names: only its options are counted, never logged.
 * Data:      the QA-TEST complaint must still be in Pending Assignment (the menu depends on the status).
 */
import { test, expect } from '@playwright/test'
import * as allure from 'allure-js-commons'
import { PaymentsUiEmployeePgrComplaintDetailsPage } from '../../pages/PaymentsUiEmployeePgrComplaintDetailsPage.page'
import { installOverlayHandlers, blockNonReadRequests, loadTestData } from '../../helpers/app'
import { openQaComplaint } from '../../helpers/inbox'
import { traceCase } from '../../helpers/traceability'

const BASE_URL = (process.env.QA_UI_BASE_URL || '').trim() || 'https://sierraleone-hcm.digit.org/workbench-ui/employee'   // .env QA_UI_BASE_URL normally supplies this
const YAML_SOURCE = 'tests/testcases/complaints-inbox/INB-10.yaml'
const FLOW = { yamlSource: YAML_SOURCE, module: 'complaints-inbox', flowId: 'INB-10', flowName: 'take_action_menu_read_only' } as const
const NOT_A_SAVE = (attempted: string[]) => attempted.filter(r => !/search|_details|_count|_get/i.test(r))

type ActionData = { complaintNumber: string; expectedActions?: string[]; title?: string; reasons?: string[]; comments?: string }

test.describe('INB-10 take_action_menu_read_only', {
  tag: ['@INB-10', '@complaints-inbox', '@P1'],
}, () => {
  test('INB-10-H1: Offer Resolve, Assign and Reject in the Take Action menu of a pending complaint', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await traceCase({
      ...FLOW, caseId: 'INB-10-H1', type: 'happy_path', priority: 'P1', tags: ['regression'], testDataRef: 'INB-10-H1',
      title: 'Offer Resolve, Assign and Reject in the Take Action menu of a pending complaint',
      coverageNote: 'The complaint workflow actions offered to the test account; USR-06-H2 / USR-13 check a different Take Action menu (users).',
    })
    const data = loadTestData<ActionData>('INB-10-H1')
    let details!: PaymentsUiEmployeePgrComplaintDetailsPage

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      await blockNonReadRequests(page)
    })

    await allure.step('1. Open the QA-TEST complaint from test data INB-10-H1 as in steps 1-4 of INB-09-H1', async () => {
      details = await openQaComplaint(page, BASE_URL, data.complaintNumber)
    })
    await allure.step('2. Click Take Action (contract gap)', async () => {
      await details.takeAction().click()
    })

    await allure.step('Assert: action_menu_options_match_test_data', async () => {
      await expect(details.actionOptions()).toHaveText(data.expectedActions!)
    })
  })

  test('INB-10-H2: Show the Assign complaint pop-up fields and close it with Cancel without saving', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await traceCase({
      ...FLOW, caseId: 'INB-10-H2', type: 'happy_path', priority: 'P1', tags: ['regression'], testDataRef: 'INB-10-H2',
      title: 'Show the Assign complaint pop-up fields and close it with Cancel without saving',
      coverageNote: 'Assign pop-up content (title "Assign complaint", Assign to *, Employee Comments *, Complaint File; checked as steps) and that Cancel saves nothing.',
    })
    const data = loadTestData<ActionData>('INB-10-H2')
    let details!: PaymentsUiEmployeePgrComplaintDetailsPage
    let attempted: string[] = []

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      attempted = await blockNonReadRequests(page)
    })

    await allure.step('1. Open the QA-TEST complaint from test data INB-10-H2 as in steps 1-4 of INB-09-H1', async () => {
      details = await openQaComplaint(page, BASE_URL, data.complaintNumber)
    })
    await allure.step('2. Click Take Action, then the Assign option', async () => {
      await details.takeAction().click()
      await details.actionOption('Assign').click()
    })
    await allure.step('3. Wait for the pop-up titled Assign complaint and for the POST /egov-hrms/employees/_search response; check that Assign to, Employee Comments and Complaint File are shown', async () => {
      const assignees = page.waitForResponse(r => PaymentsUiEmployeePgrComplaintDetailsPage.ASSIGNEE_SEARCH_API_RE.test(r.url()), { timeout: 30_000 }).catch(() => null)
      await expect(details.popupHeading()).toHaveText(data.title!)
      expect((await assignees)?.status(), 'the Assign to list is loaded').toBe(200)
      await expect(details.popupFieldLabel('Assign to')).toBeVisible()
      await expect(details.popupFieldLabel('Employee Comments')).toBeVisible()
      await expect(details.popupFieldLabel('Complaint File')).toBeVisible()
    })
    await allure.step('4. Open the Assign to dropdown, check that it has at least 1 option (names not logged) and close it', async () => {
      await details.assignTo().click()
      await expect(details.dropdownOptions().first(), 'the Assign to list offers at least one employee').toBeVisible()
      await allure.parameter('assign_to_option_count', String(await details.dropdownOptions().count()))
      await details.closePopupDropdown()
    })
    await allure.step('5. Click Cancel in the pop-up', async () => {
      await details.popupCancel().click()
    })

    await allure.step('Assert: popup_closed', async () => {
      await expect(details.popup()).toBeHidden()
    })
    await allure.step('Assert: no_update_request_sent', async () => {
      expect(NOT_A_SAVE(attempted), 'save requests attempted (all were aborted)').toEqual([])
    })
  })

  test('INB-10-H3: Show the Reject Complaint pop-up with its five reasons and close it with Cancel', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await traceCase({
      ...FLOW, caseId: 'INB-10-H3', type: 'happy_path', priority: 'P1', tags: ['regression'], testDataRef: 'INB-10-H3',
      title: 'Show the Reject Complaint pop-up with its five reasons and close it with Cancel',
      coverageNote: 'Reject pop-up and its reason list (master data); different fields from Assign and Resolve.',
    })
    const data = loadTestData<ActionData>('INB-10-H3')
    let details!: PaymentsUiEmployeePgrComplaintDetailsPage
    let attempted: string[] = []

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      attempted = await blockNonReadRequests(page)
    })

    await allure.step('1. Open the QA-TEST complaint from test data INB-10-H3 as in steps 1-4 of INB-09-H1', async () => {
      details = await openQaComplaint(page, BASE_URL, data.complaintNumber)
    })
    await allure.step('2. Click Take Action, then the Reject option, and wait for the pop-up titled Reject Complaint', async () => {
      await details.openAction('Reject')
      await expect(details.popupHeading()).toHaveText(data.title!)
    })
    await allure.step('3. Open the Rejection Reason dropdown, check that its options match the 5 reasons in test data INB-10-H3, then close it', async () => {
      await details.rejectionReason().click()
      await expect(details.dropdownOptions()).toHaveText(data.reasons!)
      await details.closePopupDropdown()
    })
    await allure.step('4. Check that Employee Comments and Complaint File are shown', async () => {
      await expect(details.popupFieldLabel('Employee Comments')).toBeVisible()
      await expect(details.popupFieldLabel('Complaint File')).toBeVisible()
    })
    await allure.step('5. Click Cancel in the pop-up', async () => {
      await details.popupCancel().click()
    })

    await allure.step('Assert: popup_closed', async () => {
      await expect(details.popup()).toBeHidden()
    })
    await allure.step('Assert: no_update_request_sent', async () => {
      expect(NOT_A_SAVE(attempted), 'save requests attempted (all were aborted)').toEqual([])
    })
  })

  test('INB-10-H4: Show the Resolve Complaint pop-up and close it with Cancel without saving', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await traceCase({
      ...FLOW, caseId: 'INB-10-H4', type: 'happy_path', priority: 'P1', tags: ['regression'], testDataRef: 'INB-10-H4',
      title: 'Show the Resolve Complaint pop-up and close it with Cancel without saving',
      coverageNote: 'Resolve pop-up (comments and file only) and that the complaint stays actionable after Cancel.',
    })
    const data = loadTestData<ActionData>('INB-10-H4')
    let details!: PaymentsUiEmployeePgrComplaintDetailsPage
    let attempted: string[] = []

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      attempted = await blockNonReadRequests(page)
    })

    await allure.step('1. Open the QA-TEST complaint from test data INB-10-H4 as in steps 1-4 of INB-09-H1', async () => {
      details = await openQaComplaint(page, BASE_URL, data.complaintNumber)
    })
    await allure.step('2. Click Take Action, then the Resolve option, and wait for the pop-up titled Resolve Complaint', async () => {
      await details.openAction('Resolve')
      await expect(details.popupHeading()).toHaveText(data.title!)
    })
    await allure.step('3. Check that Employee Comments and Complaint File are shown and that there is no other required field', async () => {
      await expect(details.popupFieldLabel('Employee Comments')).toBeVisible()
      await expect(details.popupFieldLabel('Complaint File')).toBeVisible()
      await expect(details.popupFieldLabel('Assign to')).toHaveCount(0)
      await expect(details.popupFieldLabel('Rejection Reason')).toHaveCount(0)
    })
    await allure.step('4. Click Cancel in the pop-up', async () => {
      await details.popupCancel().click()
    })

    await allure.step('Assert: popup_closed', async () => {
      await expect(details.popup()).toBeHidden()
    })
    await allure.step('Assert: no_update_request_sent', async () => {
      expect(NOT_A_SAVE(attempted), 'save requests attempted (all were aborted)').toEqual([])
    })
    await allure.step('Assert: take_action_button_visible', async () => {
      await expect(details.takeAction()).toBeVisible()
    })
  })

  test('INB-10-E1: Block Resolve with an empty Employee Comments field', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await traceCase({
      ...FLOW, caseId: 'INB-10-E1', type: 'negative', priority: 'P1', tags: ['regression'], testDataRef: 'INB-10-E1',
      title: 'Block Resolve with an empty Employee Comments field',
      coverageNote: 'Required-comment rule of the workflow pop-ups (the same field is in all three).',
    })
    const data = loadTestData<ActionData>('INB-10-E1')
    let details!: PaymentsUiEmployeePgrComplaintDetailsPage
    let attempted: string[] = []
    let submitWasDisabled = false

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      attempted = await blockNonReadRequests(page)
    })

    await allure.step('1. Open the QA-TEST complaint from test data INB-10-E1 as in steps 1-4 of INB-09-H1', async () => {
      details = await openQaComplaint(page, BASE_URL, data.complaintNumber)
    })
    await allure.step('2. Click Take Action, then the Resolve option, and wait for the pop-up', async () => {
      await details.openAction('Resolve')
    })
    await allure.step('3. Leave Employee Comments empty and click Submit (if Submit is disabled, do not click it)', async () => {
      await expect(details.comments()).toHaveValue('')
      submitWasDisabled = await details.popupSubmit().isDisabled()
      if (!submitWasDisabled) await details.popupSubmit().click()
    })

    await allure.step('Assert: required_comment_message_or_submit_disabled', async () => {
      if (submitWasDisabled) return
      await expect(details.popupError().first(), 'a required-field message for Employee Comments').toBeVisible()
    })
    await allure.step('Assert: no_update_request_sent', async () => {
      expect(NOT_A_SAVE(attempted), 'save requests the app tried to send with an empty comment (all were aborted)').toEqual([])
    })
  })

  test('INB-10-E2: Block Reject when no rejection reason is chosen', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await traceCase({
      ...FLOW, caseId: 'INB-10-E2', type: 'negative', priority: 'P1', tags: ['regression'], testDataRef: 'INB-10-E2',
      title: 'Block Reject when no rejection reason is chosen',
      coverageNote: 'Required-reason rule, specific to Reject; E1 covers the comment rule with every other field valid.',
    })
    const data = loadTestData<ActionData>('INB-10-E2')
    let details!: PaymentsUiEmployeePgrComplaintDetailsPage
    let attempted: string[] = []
    let submitWasDisabled = false

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      attempted = await blockNonReadRequests(page)
    })

    await allure.step('1. Open the QA-TEST complaint from test data INB-10-E2 as in steps 1-4 of INB-09-H1', async () => {
      details = await openQaComplaint(page, BASE_URL, data.complaintNumber)
    })
    await allure.step('2. Click Take Action, then the Reject option, and wait for the pop-up', async () => {
      await details.openAction('Reject')
    })
    await allure.step('3. Fill Employee Comments with the QA-TEST comment from test data INB-10-E2 and leave Rejection Reason empty', async () => {
      await details.comments().fill(data.comments!)
      await expect(details.rejectionReason()).toHaveValue('')
    })
    await allure.step('4. Click Submit (if Submit is disabled, do not click it)', async () => {
      submitWasDisabled = await details.popupSubmit().isDisabled()
      if (!submitWasDisabled) await details.popupSubmit().click()
    })

    await allure.step('Assert: required_reason_message_or_submit_disabled', async () => {
      if (submitWasDisabled) return
      await expect(details.popupError().first(), 'a required-field message for Rejection Reason').toBeVisible()
    })
    await allure.step('Assert: no_update_request_sent', async () => {
      expect(NOT_A_SAVE(attempted), 'save requests the app tried to send without a reason (all were aborted)').toEqual([])
    })
  })
})
