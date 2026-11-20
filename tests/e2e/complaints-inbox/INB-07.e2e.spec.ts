/**
 * AUTO-GENERATED — do not edit by hand.
 * Source:    tests/testcases/complaints-inbox/INB-07.yaml
 * Flow:      INB-07 — clear_all_filters
 * Contract:  ui-contract.json v1.3.0 (scraped 2026-11-20; filter controls are contract gaps, verified live, read-only, 2026-11-20)
 * Generator: /playwright-gen complaints-inbox
 * Auth:      default actor (admin) — saved workbench-login session (playwright.config.ts) + restoreSavedSession().
 * Safety:    read-only; every request that is not a read is aborted (blockNonReadRequests).
 * Deferred:  rbac — the inbox search API check is INB-13-RBAC-1 (→ /script-gen).
 */
import { test, expect, type Response } from '@playwright/test'
import * as allure from 'allure-js-commons'
import { PaymentsUiEmployeePgrInboxV2Page } from '../../pages/PaymentsUiEmployeePgrInboxV2Page.page'
import { installOverlayHandlers, blockNonReadRequests, loadTestData } from '../../helpers/app'
import { openInbox, settleFilterCard, clickAndSearch, inboxSearchBody, filterFields } from '../../helpers/inbox'
import { traceCase } from '../../helpers/traceability'

const BASE_URL = (process.env.QA_UI_BASE_URL || '').trim() || 'https://sierraleone-hcm.digit.org/workbench-ui/employee'   // .env QA_UI_BASE_URL normally supplies this
const YAML_SOURCE = 'tests/testcases/complaints-inbox/INB-07.yaml'
const FLOW = { yamlSource: YAML_SOURCE, module: 'complaints-inbox', flowId: 'INB-07', flowName: 'clear_all_filters' } as const

test.describe('INB-07 clear_all_filters', {
  tag: ['@INB-07', '@complaints-inbox', '@P1'],
}, () => {
  test('INB-07-H1: Reset every filter and stop sending them when Clear All is clicked', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await traceCase({
      ...FLOW, caseId: 'INB-07-H1', type: 'happy_path', priority: 'P1', tags: ['regression'], testDataRef: 'INB-07-H1',
      title: 'Reset every filter and stop sending them when Clear All is clicked',
      coverageNote: 'Reset of the whole Filter card, checked in both the controls and the request; the user-management Clear Filter defect shows why both matter.',
    })
    const data = loadTestData<{ radio: string; complaintType: string; complaintTypeLocalized: string; status: string }>('INB-07-H1')
    const inbox = new PaymentsUiEmployeePgrInboxV2Page(page)
    let cleared!: Response

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
      await blockNonReadRequests(page)
    })

    await allure.step('1. Open /payments-ui/employee/pgr/inbox-v2, wait for animation_1dcbe0 to be hidden and for the first results column header, up to 90 s', async () => {
      await openInbox(page, BASE_URL)
      await settleFilterCard(page)   // the Filter card re-mounts once after its first use (observed live 2026-11-20)
    })
    await allure.step('2. Set the filters from test data INB-07-H1: the Assigned to me radio, the complaint type and the Pending Assignment status (contract gaps)', async () => {
      await inbox.assigneeRadio(data.radio).click()
      await inbox.chooseFilterOption('Complaint Type', [data.complaintType, data.complaintTypeLocalized])
      await inbox.statusCheckbox(data.status).check()
    })
    await allure.step('3. Click apply_18d6c0 and wait for the POST /inbox/v2/_search response', async () => {
      const applied = await clickAndSearch(page, () => inbox.apply18d6c0().click())
      await allure.parameter('applied_filter_fields', filterFields(inboxSearchBody(applied)).join(', ') || '(none)')
    })
    await allure.step('4. Click clear_all_d8e461 and wait for the next POST /inbox/v2/_search response', async () => {
      cleared = await clickAndSearch(page, () => inbox.clearAllD8e461().click(), 30_000)
    })

    await allure.step('Assert: assignee_radios_unchecked', async () => {
      await expect(inbox.assigneeRadio('Assigned to me')).not.toBeChecked()
      await expect(inbox.assigneeRadio('Assigned to others')).not.toBeChecked()
    })
    await allure.step('Assert: complaint_type_field_empty', async () => {
      await expect(inbox.filterDropdown('Complaint Type')).toHaveValue('')
    })
    await allure.step('Assert: status_checkbox_unchecked', async () => {
      await expect(inbox.statusCheckbox(data.status)).not.toBeChecked()
    })
    await allure.step('Assert: last_search_request_without_filters', async () => {
      const fields = filterFields(inboxSearchBody(cleared))
      expect(fields, `filter fields still sent after Clear All: ${fields.join(', ') || 'none'}`).toEqual([])
    })
    await allure.step('Assert: result_rows_between_1_and_10', async () => {
      await expect(inbox.resultRows().first()).toBeVisible()
      const rows = await inbox.resultRows().count()
      expect(rows).toBeGreaterThanOrEqual(1)
      expect(rows).toBeLessThanOrEqual(10)
    })
  })
})
