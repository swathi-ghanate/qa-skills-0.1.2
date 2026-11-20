import { type Page, type Request, type Response, expect } from '@playwright/test'
import * as fs from 'fs'
import * as path from 'path'
import { PaymentsUiEmployeePgrInboxV2Page } from '../pages/PaymentsUiEmployeePgrInboxV2Page.page'
import { PaymentsUiEmployeePgrComplaintDetailsPage } from '../pages/PaymentsUiEmployeePgrComplaintDetailsPage.page'
import { restoreSavedSession, waitForLoaderGone } from './app'
import { expectPathname } from './routes'

/** PGR complaint numbers, e.g. PGR-2026-11-19-004529. */
export const COMPLAINT_NUMBER_RE = /^PGR-\d{4}-\d{2}-\d{2}-\d{6}$/

/** process criteria every inbox search carries (observed live 2026-11-20); anything else in a request is a filter. */
const BASE_PROCESS_KEYS = ['businessService', 'moduleName', 'tenantId']

export type InboxSearchBody = {
  inbox?: {
    processSearchCriteria?: Record<string, unknown>
    moduleSearchCriteria?: Record<string, unknown>
    tenantId?: string
    limit?: number
    offset?: number
  }
}

const isInboxSearch = (request: Request) =>
  request.method() === 'POST' && PaymentsUiEmployeePgrInboxV2Page.SEARCH_API_RE.test(request.url())

/** The JSON body of an inbox search request ({} when it cannot be read). */
export function inboxSearchBody(response: Response): InboxSearchBody {
  try { return JSON.parse(response.request().postData() || '{}') as InboxSearchBody } catch { return {} }
}

/**
 * Filter fields a search sent on top of the default search: every non-empty moduleSearchCriteria key plus any
 * processSearchCriteria key other than businessService / moduleName / tenantId. Names only, never values.
 */
export function filterFields(body: InboxSearchBody): string[] {
  const module = Object.entries(body.inbox?.moduleSearchCriteria ?? {})
    .filter(([, v]) => v !== undefined && v !== null && v !== '' && !(Array.isArray(v) && v.length === 0))
    .map(([k]) => `moduleSearchCriteria.${k}`)
  const process = Object.keys(body.inbox?.processSearchCriteria ?? {})
    .filter(k => !BASE_PROCESS_KEYS.includes(k))
    .map(k => `processSearchCriteria.${k}`)
  return [...module, ...process]
}

/** The next inbox search response. Register it BEFORE the click that triggers the search. */
export function nextInboxSearch(page: Page, timeout = 60_000): Promise<Response> {
  return page.waitForResponse(r => isInboxSearch(r.request()), { timeout })
}

/** An inbox load in progress: settled() waits for the default searches to finish and the table to render. */
export type InboxLoad = { settled: () => Promise<Response> }

/**
 * Open the inbox with the saved session. The page sends its default search twice on load; settled() waits for both,
 * so a search typed afterwards cannot be overwritten by a late default response. Resolves with the last default search.
 */
export async function gotoInbox(page: Page, baseURL: string): Promise<InboxLoad> {
  const inbox = new PaymentsUiEmployeePgrInboxV2Page(page)
  const responses: Response[] = []
  const pending = new Set<Request>()
  const onRequest = (r: Request) => { if (isInboxSearch(r)) pending.add(r) }
  const onDone = (r: Request) => { pending.delete(r) }
  const onResponse = (r: Response) => { if (isInboxSearch(r.request())) responses.push(r) }
  page.on('request', onRequest)
  page.on('requestfinished', onDone)
  page.on('requestfailed', onDone)
  page.on('response', onResponse)
  await restoreSavedSession(page)
  await inbox.goto(baseURL)
  await waitForLoaderGone(inbox.animation1dcbe0())
  return {
    settled: async () => {
      await expect.poll(() => responses.length, { timeout: 90_000, message: 'the inbox sends its default search' }).toBeGreaterThan(0)
      await inbox.columnHeaders().first().waitFor({ state: 'visible', timeout: 90_000 })
      await expect.poll(() => pending.size, { timeout: 60_000, message: 'the default inbox searches finish' }).toBe(0)
      await inbox.resultRows().first().waitFor({ state: 'visible', timeout: 60_000 })
      page.off('request', onRequest)
      page.off('requestfinished', onDone)
      page.off('requestfailed', onDone)
      page.off('response', onResponse)
      return responses[responses.length - 1]
    },
  }
}

/**
 * Wait until no DIGIT lookup request (a POST/GET ending in `_search`: localization, MDMS, boundary, inbox) has been in
 * flight for `quietMs`. A condition-based wait: the inbox re-renders its cards when these responses arrive.
 */
export async function waitForQuietLookups(page: Page, quietMs = 1_500, timeout = 30_000): Promise<void> {
  const inFlight = new Set<Request>()
  let lastChange = Date.now()
  const isLookup = (r: Request) => /_search$/i.test(new URL(r.url()).pathname)
  const onStart = (r: Request) => { if (isLookup(r)) { inFlight.add(r); lastChange = Date.now() } }
  const onEnd = (r: Request) => { if (inFlight.delete(r)) lastChange = Date.now() }
  page.on('request', onStart)
  page.on('requestfinished', onEnd)
  page.on('requestfailed', onEnd)
  try {
    await expect.poll(() => inFlight.size === 0 && Date.now() - lastChange >= quietMs, {
      message: `no lookup request for ${quietMs} ms`, timeout, intervals: [250],
    }).toBe(true)
  } finally {
    page.off('request', onStart)
    page.off('requestfinished', onEnd)
    page.off('requestfailed', onEnd)
  }
}

const settledPages = new WeakSet<Page>()

/**
 * Make the inbox safe to use (once per page). Observed live 2026-11-20 (a product glitch): about 1 s after the first
 * interaction, the Filter card re-mounts; an open dropdown closes and a just-ticked box clears, and before that the
 * Country label shows the raw key "ADMIN_KAMBIA_COUNTRY". The re-mount is followed by more lookups (label translations,
 * another inbox search) that re-render the cards again, which can also drop a chosen status or date range.
 * So: make a harmless first interaction (open and close Complaint Type), wait for the localized Country label, then
 * wait until the lookups have been quiet for 1.5 s.
 */
export async function settleFilterCard(page: Page): Promise<void> {
  if (settledPages.has(page)) return
  const inbox = new PaymentsUiEmployeePgrInboxV2Page(page)
  await inbox.filterDropdown('Complaint Type').click()   // the first interaction that triggers the re-mount
  // The list opens ~0.5 s after the click; a re-mount (when it happens) closes it ~1 s after. Wait for it to open,
  // for the localized Country label and for the lookups to go quiet, and only then close the list if it is still open
  // (an open list covers the Status checkbox; seen in a run on 2026-11-20 where no re-mount happened).
  await inbox.dropdownOptions().first().waitFor({ state: 'visible', timeout: 5_000 }).catch(() => undefined)
  await expect(inbox.countryLabel(), 'the Filter card re-mounts with its localized Country label').toHaveText('Country', { timeout: 15_000 })
  await waitForQuietLookups(page)
  if (await inbox.dropdownOptions().count()) await inbox.page.locator('.digit-inbox-search-composer-header').first().click()
  await expect(inbox.dropdownOptions()).toHaveCount(0)
  settledPages.add(page)
}

/** Open the inbox, wait until the default list has rendered, and settle the page (see settleFilterCard). */
export async function openInbox(page: Page, baseURL: string): Promise<Response> {
  const response = await (await gotoInbox(page, baseURL)).settled()
  await settleFilterCard(page)
  return response
}

/** Click a control that triggers an inbox search and resolve with that search's response. */
export async function clickAndSearch(page: Page, click: () => Promise<void>, timeout = 60_000): Promise<Response> {
  const response = nextInboxSearch(page, timeout)
  await click()
  return response
}

/** Click a control that may or may not trigger a search; resolves with the response, or null after `timeout`. */
export async function clickAndMaybeSearch(page: Page, click: () => Promise<void>, timeout = 15_000): Promise<Response | null> {
  const response = nextInboxSearch(page, timeout).catch(() => null)
  await click()
  return response
}

/**
 * Click the only result link, but only when it is exactly `complaintNumber` (privacy guard: a lost search value
 * would otherwise open another person's complaint). Waits for the details page and its Take Action button.
 */
export async function clickOnlyComplaintLink(page: Page, complaintNumber: string): Promise<void> {
  const inbox = new PaymentsUiEmployeePgrInboxV2Page(page)
  await expect(inbox.complaintLinks(), 'exactly one result for the searched complaint number').toHaveCount(1, { timeout: 30_000 })
  const isSearched = (await inbox.complaintLinks().first().innerText()).trim() === complaintNumber
  expect(isSearched, 'the only result is the searched complaint (another complaint is never opened)').toBe(true)
  await inbox.complaintLinks().first().click()
}

/** Search a QA-TEST complaint by number from a fresh inbox and open its details page. */
export async function openQaComplaint(page: Page, baseURL: string, complaintNumber: string): Promise<PaymentsUiEmployeePgrComplaintDetailsPage> {
  if (!COMPLAINT_NUMBER_RE.test(complaintNumber)) throw new Error(`Not a complaint number: ${complaintNumber}`)
  const inbox = new PaymentsUiEmployeePgrInboxV2Page(page)
  const details = new PaymentsUiEmployeePgrComplaintDetailsPage(page)
  await openInbox(page, baseURL)
  await inbox.complaintnumber7836f5().fill(complaintNumber)
  await clickAndSearch(page, () => inbox.search().click())
  const loaded = page.waitForResponse(r => PaymentsUiEmployeePgrComplaintDetailsPage.COMPLAINT_SEARCH_API_RE.test(r.url()), { timeout: 60_000 })
  await clickOnlyComplaintLink(page, complaintNumber)
  await expectPathname(page, PaymentsUiEmployeePgrComplaintDetailsPage.pathFor(complaintNumber))
  await loaded
  await waitForLoaderGone(inbox.animation1dcbe0())
  await details.takeAction().waitFor({ state: 'visible', timeout: 60_000 })
  return details
}

// --- Complaints created by CMP-08, handed to INB-02-H2 ---
// In a full run the complaints/ folder runs before complaints-inbox/ (checked with --list 2026-11-20), so INB-02-H2 gets
// the complaint CMP-08 created earlier in the same run. The file is kept in .qa/run-state/ (gitignored), not in
// test-results/ (emptied at the start of every run), so INB-02-H2 also works when run on its own after a CMP-08 run.
const CREATED_FILE = path.join(__dirname, '..', '..', '.qa', 'run-state', 'created-complaints.json')

type CreatedComplaint = { complaintNumber: string; caseId: string; createdAt: string }

/** Record a complaint a test created (QA-TEST complaints only; the team closes them later). Keeps the last 50. */
export function recordCreatedComplaint(complaintNumber: string, caseId: string): void {
  if (!COMPLAINT_NUMBER_RE.test(complaintNumber)) return
  let list: CreatedComplaint[] = []
  try { list = JSON.parse(fs.readFileSync(CREATED_FILE, 'utf-8')) as CreatedComplaint[] } catch { list = [] }
  list.push({ complaintNumber, caseId, createdAt: new Date().toISOString() })
  fs.mkdirSync(path.dirname(CREATED_FILE), { recursive: true })
  fs.writeFileSync(CREATED_FILE, JSON.stringify(list.slice(-50), null, 2))
}

/**
 * The newest complaint CMP-08 created. QA_INBOX_COMPLAINT_NUMBER (a QA-TEST complaint number) overrides it.
 * Throws a clear message when CMP-08 has never recorded one.
 */
export function latestCreatedComplaint(): CreatedComplaint {
  const override = (process.env.QA_INBOX_COMPLAINT_NUMBER || '').trim()
  if (override) {
    if (!COMPLAINT_NUMBER_RE.test(override)) throw new Error('QA_INBOX_COMPLAINT_NUMBER must be a complaint number like PGR-2026-11-19-004529')
    return { complaintNumber: override, caseId: 'QA_INBOX_COMPLAINT_NUMBER', createdAt: 'unknown' }
  }
  let list: CreatedComplaint[] = []
  try { list = JSON.parse(fs.readFileSync(CREATED_FILE, 'utf-8')) as CreatedComplaint[] } catch { list = [] }
  const latest = list.filter(c => c.caseId.startsWith('CMP-08')).pop()
  if (!latest) {
    throw new Error('No complaint created by CMP-08 is recorded yet: run tests/e2e/complaints/CMP-08.e2e.spec.ts first ' +
      '(it records each complaint it creates in .qa/run-state/created-complaints.json), ' +
      'or set QA_INBOX_COMPLAINT_NUMBER to a QA-TEST complaint number')
  }
  return latest
}
