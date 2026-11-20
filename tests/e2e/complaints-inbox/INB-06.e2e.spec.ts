/**
 * AUTO-GENERATED — do not edit by hand.
 * Source:    tests/testcases/complaints-inbox/INB-06.yaml
 * Flow:      INB-06 — inbox_filters
 * Contract:  ui-contract.json v1.3.0 (scraped 2026-11-20; every filter control is a contract gap, verified live, read-only, 2026-11-20)
 * Generator: /playwright-gen complaints-inbox
 * Auth:      default actor (admin) — saved workbench-login session (playwright.config.ts) + restoreSavedSession().
 * Safety:    read-only; every request that is not a read is aborted (blockNonReadRequests).
 * Privacy:   counts, checked state and request field NAMES only; row values are never read.
 * The filter request field names were not observed before this spec: each filter case records the fields it sent
 * (Allure parameter "search_filter_fields") so they can be pinned later.
 * Filter card: it re-mounts once about 1 s after its first use (a product glitch seen live 2026-11-20: an open list
 *            closes, a just-ticked box clears), so every case calls settleFilterCard() before touching a filter.
 * Deferred:  rbac — the inbox search API check is INB-13-RBAC-1 (→ /script-gen).
 */
import { test, expect, type Response } from '@playwright/test'
import * as allure from 'allure-js-commons'
import { PaymentsUiEmployeePgrInboxV2Page } from '../../pages/PaymentsUiEmployeePgrInboxV2Page.page'
import { installOverlayHandlers, blockNonReadRequests, loadTestData } from '../../helpers/app'
import { openInbox, settleFilterCard, clickAndSearch, clickAndMaybeSearch, inboxSearchBody, filterFields } from '../../helpers/inbox'
import { traceCase } from '../../helpers/traceability'

const BASE_URL = (process.env.QA_UI_BASE_URL || '').trim() || 'https://sierraleone-hcm.digit.org/workbench-ui/employee'   // .env QA_UI_BASE_URL normally supplies this
const YAML_SOURCE = 'tests/testcases/complaints-inbox/INB-06.yaml'
const FLOW = { yamlSource: YAML_SOURCE, module: 'complaints-inbox', flowId: 'INB-06', flowName: 'inbox_filters' } as const
const OPEN_STEP = '1. Open /payments-ui/employee/pgr/inbox-v2, wait for animation_1dcbe0 to be hidden and for the first results column header, up to 90 s'

async function recordFilterFields(response: Response): Promise<string[]> {
  const fields = filterFields(inboxSearchBody(response))
  await allure.parameter('search_filter_fields', fields.join(', ') || '(none)')
  return fields
}

test.describe('INB-06 inbox_filters', {
  tag: ['@INB-06', '@complaints-inbox', '@P1'],
}, () => {
  test('INB-06-H1: Send the assignee filter when Assigned to me is applied', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await traceCase({
      ...FLOW, caseId: 'INB-06-H1', type: 'happy_path', priority: 'P1', tags: ['regression'], testDataRef: 'INB-06-H1',
      title: 'Send the assignee filter when Assigned to me is applied',
      coverageNote: 'Assignee filter; may legitimately return 0 rows when nothing is assigned to the test account.',
    })
    const data = loadTestData<{ radio: string }>('INB-06-H1')
    const inbox = new PaymentsUiEmployeePgrInboxV2Page(page)
    let fields: string[] = []
    let applied!: Response

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      await blockNonReadRequests(page)
    })

    await allure.step(OPEN_STEP, async () => {
      await openInbox(page, BASE_URL)
      await settleFilterCard(page)   // the Filter card re-mounts once after its first use (observed live 2026-11-20)
    })
    await allure.step('2. Click the radio from test data INB-06-H1 (Assigned to me; contract gap)', async () => {
      await inbox.assigneeRadio(data.radio).click()
    })
    await allure.step('3. Click apply_18d6c0 and wait for the POST /inbox/v2/_search response', async () => {
      const search = await clickAndSearch(page, () => inbox.apply18d6c0().click())
      expect(search.status()).toBe(200)
      fields = await recordFilterFields(search)
      applied = search
    })

    await allure.step('Assert: assigned_to_me_radio_checked', async () => {
      await expect(inbox.assigneeRadio(data.radio)).toBeChecked()
    })
    await allure.step('Assert: search_request_has_assignee_filter', async () => {
      // Pinned from the 2026-11-20 runs: Assigned to me sends moduleSearchCriteria.assignedToMe (a string) and nothing else.
      expect(fields, 'the only filter sent is the assignee filter').toEqual(['moduleSearchCriteria.assignedToMe'])
      const assignedToMe = inboxSearchBody(applied).inbox?.moduleSearchCriteria?.assignedToMe
      expect(typeof assignedToMe, 'assignedToMe is a string (value not logged)').toBe('string')
      expect((assignedToMe as string).length, 'assignedToMe is not empty').toBeGreaterThan(0)
      const result = await applied.json() as { totalCount?: number; items?: unknown[] }
      expect(typeof result.totalCount, 'the response carries a totalCount').toBe('number')
      expect(result.items?.length, 'items match totalCount, capped at the page size').toBe(Math.min(result.totalCount as number, 10))
    })
    await allure.step('Assert: result_rows_at_most_10', async () => {
      expect(await inbox.resultRows().count()).toBeLessThanOrEqual(10)
    })
  })

  test('INB-06-H2: Keep only one assignee radio checked when switching to Assigned to others', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await traceCase({
      ...FLOW, caseId: 'INB-06-H2', type: 'happy_path', priority: 'P1', tags: ['regression'], testDataRef: 'INB-06-H2',
      title: 'Keep only one assignee radio checked when switching to Assigned to others',
      coverageNote: 'Mutual exclusion of the two assignee radios, which H1 (one radio) does not prove.',
    })
    const data = loadTestData<{ firstRadio: string; secondRadio: string }>('INB-06-H2')
    const inbox = new PaymentsUiEmployeePgrInboxV2Page(page)

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      await blockNonReadRequests(page)
    })

    await allure.step(OPEN_STEP, async () => {
      await openInbox(page, BASE_URL)
      await settleFilterCard(page)   // the Filter card re-mounts once after its first use (observed live 2026-11-20)
    })
    await allure.step('2. Click the first radio from test data INB-06-H2 (Assigned to me)', async () => {
      await inbox.assigneeRadio(data.firstRadio).click()
    })
    await allure.step('3. Click the second radio from test data INB-06-H2 (Assigned to others)', async () => {
      await inbox.assigneeRadio(data.secondRadio).click()
    })

    await allure.step('Assert: assigned_to_others_radio_checked', async () => {
      await expect(inbox.assigneeRadio(data.secondRadio)).toBeChecked()
    })
    await allure.step('Assert: assigned_to_me_radio_unchecked', async () => {
      await expect(inbox.assigneeRadio(data.firstRadio)).not.toBeChecked()
    })
  })

  test('INB-06-H3: List the six complaint types in the Complaint Type filter', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await traceCase({
      ...FLOW, caseId: 'INB-06-H3', type: 'happy_path', priority: 'P1', tags: ['regression'], testDataRef: 'INB-06-H3',
      title: 'List the six complaint types in the Complaint Type filter',
      coverageNote: 'Same complaint-type master data as CMP-02-H1 but a different control (the inbox filter), so both are kept.',
    })
    const data = loadTestData<{ expectedOptions: string[]; localizedOptions: string[] }>('INB-06-H3')
    const inbox = new PaymentsUiEmployeePgrInboxV2Page(page)

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      await blockNonReadRequests(page)
    })

    await allure.step(OPEN_STEP, async () => {
      await openInbox(page, BASE_URL)
      await settleFilterCard(page)   // the Filter card re-mounts once after its first use (observed live 2026-11-20)
    })
    await allure.step('2. Click the Complaint Type dropdown in the Filter card (contract gap)', async () => {
      await inbox.filterDropdown('Complaint Type').click()
    })
    await allure.step('3. Wait for the options (.digit-dropdown-item) to be visible', async () => {
      await expect(inbox.dropdownOptions().first()).toBeVisible()
    })

    await allure.step('Assert: complaint_type_option_count_is_6', async () => {
      await expect(inbox.dropdownOptions()).toHaveCount(6)
    })
    await allure.step('Assert: complaint_type_options_match_test_data', async () => {
      // The same six types appear either as "Other: Dept-Other"… or translated as "Other"… depending on when the label
      // translations load (product finding, live 2026-11-20). Both labellings are accepted; the one shown is recorded.
      const shown = (await inbox.dropdownOptions().allInnerTexts()).map(t => t.trim())
      await allure.parameter('complaint_type_labels', shown.join(' | '))
      expect([JSON.stringify(data.expectedOptions), JSON.stringify(data.localizedOptions)], `the six configured complaint types (shown: ${shown.join(' | ')})`)
        .toContain(JSON.stringify(shown))
    })
  })

  test('INB-06-H4: Send the complaint type filter when a type is chosen and applied', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await traceCase({
      ...FLOW, caseId: 'INB-06-H4', type: 'happy_path', priority: 'P1', tags: ['regression'], testDataRef: 'INB-06-H4',
      title: 'Send the complaint type filter when a type is chosen and applied',
      coverageNote: 'Applies a chosen type; H3 only lists the options.',
    })
    const data = loadTestData<{ complaintType: string; complaintTypeLocalized: string }>('INB-06-H4')
    const inbox = new PaymentsUiEmployeePgrInboxV2Page(page)
    let fields: string[] = []
    let applied!: Response

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      await blockNonReadRequests(page)
    })

    await allure.step(OPEN_STEP, async () => {
      await openInbox(page, BASE_URL)
      await settleFilterCard(page)   // the Filter card re-mounts once after its first use (observed live 2026-11-20)
    })
    await allure.step('2. Choose the complaint type from test data INB-06-H4 in the Complaint Type dropdown (contract gap)', async () => {
      await inbox.chooseFilterOption('Complaint Type', [data.complaintType, data.complaintTypeLocalized])
    })
    await allure.step('3. Click apply_18d6c0 and wait for the POST /inbox/v2/_search response', async () => {
      const search = await clickAndSearch(page, () => inbox.apply18d6c0().click())
      expect(search.status()).toBe(200)
      fields = await recordFilterFields(search)
      applied = search
    })

    await allure.step('Assert: search_request_has_complaint_type_filter', async () => {
      // Pinned from the 2026-11-20 runs: a chosen type is sent as moduleSearchCriteria.complaintType and nothing else.
      expect(fields, 'the only filter sent is the complaint type filter').toEqual(['moduleSearchCriteria.complaintType'])
      const complaintType = inboxSearchBody(applied).inbox?.moduleSearchCriteria?.complaintType
      expect(typeof complaintType, 'complaintType is a string').toBe('string')
      expect((complaintType as string).length, 'complaintType is not empty').toBeGreaterThan(0)
      await allure.parameter('complaint_type_code_sent', complaintType as string)   // a type code, not personal data
      const result = await applied.json() as { totalCount?: number; items?: unknown[] }
      expect(typeof result.totalCount, 'the response carries a totalCount').toBe('number')
      expect(result.items?.length, 'items match totalCount, capped at the page size').toBe(Math.min(result.totalCount as number, 10))
    })
    await allure.step('Assert: result_rows_at_most_10', async () => {
      expect(await inbox.resultRows().count()).toBeLessThanOrEqual(10)
    })
    await allure.step('Assert: every_result_row_has_details_link', async () => {
      expect(await inbox.complaintLinks().count()).toBe(await inbox.resultRows().count())
    })
  })

  test('INB-06-H5: Send the status filter when Pending Assignment is ticked and applied', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await traceCase({
      ...FLOW, caseId: 'INB-06-H5', type: 'happy_path', priority: 'P1', tags: ['regression'], testDataRef: 'INB-06-H5',
      title: 'Send the status filter when Pending Assignment is ticked and applied',
      coverageNote: 'Status filter; the list shows only statuses present in the data ("Pending Assignment" alone on 2026-11-20), so only its presence is relied on.',
    })
    const data = loadTestData<{ status: string; applicationStatus: string }>('INB-06-H5')
    const inbox = new PaymentsUiEmployeePgrInboxV2Page(page)
    let fields: string[] = []
    let applied!: Response

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      await blockNonReadRequests(page)
    })

    await allure.step(OPEN_STEP, async () => {
      await openInbox(page, BASE_URL)
      await settleFilterCard(page)   // the Filter card re-mounts once after its first use (observed live 2026-11-20)
    })
    await allure.step('2. Tick the Status checkbox from test data INB-06-H5 (contract gap)', async () => {
      await inbox.statusCheckbox(data.status).check()
    })
    await allure.step('3. Click apply_18d6c0 and wait for the POST /inbox/v2/_search response', async () => {
      const search = await clickAndSearch(page, () => inbox.apply18d6c0().click())
      expect(search.status()).toBe(200)
      fields = await recordFilterFields(search)
      applied = search
    })

    await allure.step('Assert: status_checkbox_checked', async () => {
      await expect(inbox.statusCheckbox(data.status)).toBeChecked()
    })
    await allure.step('Assert: search_request_has_status_filter', async () => {
      // Pinned from the 2026-11-20 runs: the ticked box sends moduleSearchCriteria.status = [its workflow state id]
      // (the checkbox's own value), and every complaint returned is in that state (PENDING_ASSIGNMENT).
      expect(fields, 'the only filter sent is the status filter').toEqual(['moduleSearchCriteria.status'])
      const stateId = await inbox.statusCheckbox(data.status).getAttribute('value')
      expect(inboxSearchBody(applied).inbox?.moduleSearchCriteria?.status, 'status carries the ticked box\'s state id').toEqual([stateId])
      const result = await applied.json() as { items?: Array<{ ProcessInstance?: { state?: { applicationStatus?: string } } }> }
      const states = (result.items ?? []).map(i => i.ProcessInstance?.state?.applicationStatus)
      expect(states.every(s => s === data.applicationStatus), `every result is ${data.applicationStatus} (got: ${Array.from(new Set(states)).join(', ') || 'no rows'})`).toBe(true)
    })
    await allure.step('Assert: result_rows_at_most_10', async () => {
      expect(await inbox.resultRows().count()).toBeLessThanOrEqual(10)
    })
  })

  test('INB-06-H6: Offer at least one Country in the Country filter', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await traceCase({
      ...FLOW, caseId: 'INB-06-H6', type: 'happy_path', priority: 'P1', tags: ['regression'], testDataRef: 'INB-06-H6',
      title: 'Offer at least one Country in the Country filter',
      coverageNote: 'The only boundary filter on the inbox; documents the empty Country list seen on 2026-11-20.',
    })
    const data = loadTestData<{ expectedOption: string }>('INB-06-H6')
    const inbox = new PaymentsUiEmployeePgrInboxV2Page(page)

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      await blockNonReadRequests(page)
    })

    await allure.step(OPEN_STEP, async () => {
      await openInbox(page, BASE_URL)
      await settleFilterCard(page)   // the Filter card re-mounts once after its first use (observed live 2026-11-20)
    })
    await allure.step('2. Click the Country dropdown in the Filter card (contract gap)', async () => {
      await inbox.filterDropdown('Country').click()
    })
    await allure.step('3. Wait up to 10 s for options (.digit-dropdown-item) to be visible', async () => {
      await inbox.dropdownOptions().first().waitFor({ state: 'visible', timeout: 10_000 }).catch(() => undefined)   // the assertion reports an empty list
    })

    await allure.step('Assert: country_option_count_at_least_1', async () => {
      await expect(inbox.dropdownOptions().first(), `the Country list offers at least one country (expected "${data.expectedOption}")`).toBeVisible()
    })
  })

  test('INB-06-E1: Keep the default list without an error when Apply is clicked with no filter chosen', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await traceCase({
      ...FLOW, caseId: 'INB-06-E1', type: 'edge_case', priority: 'P1', tags: ['regression'], testDataRef: 'INB-06-E1',
      title: 'Keep the default list without an error when Apply is clicked with no filter chosen',
      coverageNote: 'Empty-input partition of the Filter card.',
    })
    const inbox = new PaymentsUiEmployeePgrInboxV2Page(page)

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      await blockNonReadRequests(page)
    })

    await allure.step(OPEN_STEP, async () => {
      await openInbox(page, BASE_URL)
      await settleFilterCard(page)   // the Filter card re-mounts once after its first use (observed live 2026-11-20)
    })
    await allure.step('2. Click apply_18d6c0 without choosing any filter', async () => {
      const search = await clickAndMaybeSearch(page, () => inbox.apply18d6c0().click())
      await allure.parameter('search_request_sent', search ? 'yes' : 'no')
    })

    await allure.step('Assert: result_rows_between_1_and_10', async () => {
      await expect(inbox.resultRows().first()).toBeVisible()
      const rows = await inbox.resultRows().count()
      expect(rows).toBeGreaterThanOrEqual(1)
      expect(rows).toBeLessThanOrEqual(10)
    })
    await allure.step('Assert: no_error_message_shown', async () => {
      await expect(page.locator('[class*="error-message"]:visible, [class*="toast"][class*="error"]:visible, [role="alert"]:visible')).toHaveCount(0)
    })
  })
})
