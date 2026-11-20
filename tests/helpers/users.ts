import { type Page, type Response, expect } from '@playwright/test'
import * as allure from 'allure-js-commons'
import { randomBytes, randomInt } from 'crypto'
import * as fs from 'fs'
import * as path from 'path'
import { HomePage } from '../pages/HomePage.page'
import { DEFAULT_HIERARCHY_TYPE } from '../pages/HrmsHierarchyStep.page'
import { PaymentsUiEmployeeHrmsInboxPage } from '../pages/PaymentsUiEmployeeHrmsInboxPage.page'
import { PaymentsUiEmployeeHrmsCreatePage } from '../pages/PaymentsUiEmployeeHrmsCreatePage.page'
import { waitForLoaderGone, fillPrivately, localIsoDate, localIsoDateYearsAgo } from './app'
import { requiredEnv } from './requiredEnv'

/** Test data shape of the cases that fill the Create user form (USR-10-H1, USR-10-E1). */
export type TestUserData = {
  usernamePrefix?: string
  username?: string
  name: string
  mobileNumber: string   // "generated:unique" — a synthetic number generated at run time
  gender: 'Female' | 'Male'
  ageYears: number
  employmentType: string
  department: string
  designation: string
  role: string
  jurisdiction: { Country: string }
}

/** Prefix of every username the tests create; the lifecycle override accepts only these. */
export const TEST_USERNAME_RE = /^qatest\d+$/

/** A test-data value the team has not provided yet ("<TBD: ...>"). */
export const isTbd = (value: unknown): boolean => typeof value === 'string' && value.trim().startsWith('<TBD')

/** Resolve an "env:NAME" fixture value from .env. */
export function envOrValue(value: string): string {
  return value.startsWith('env:') ? requiredEnv(value.slice(4)) : value
}

/**
 * Read a "session:<localStorage key>.<field>" fixture value (e.g. session:Employee.user-info.name) from the saved
 * login at run time. The page must already be on the app origin. The value is never logged: fill it with fillPrivately.
 */
export async function sessionValue(page: Page, ref: string): Promise<string> {
  const match = /^session:(.+)\.([^.]+)$/.exec(ref)
  if (!match) throw new Error(`Not a session:KEY.field reference: ${ref}`)
  const [, key, field] = match
  const value = await page.evaluate(([k, f]) => {
    try { return String((JSON.parse(localStorage.getItem(k) || '{}') as Record<string, unknown>)[f] ?? '') } catch { return '' }
  }, [key, field] as const)
  if (!value) throw new Error(`The saved login has no ${field} in ${key}; refresh it with QA_REFRESH_AUTH=1`)
  return value
}

/** Throw before anything is created while a value the team must provide (`labels` → value) is still TBD. */
export function requireTeamAnswers(values: Record<string, unknown>): void {
  const missing = Object.entries(values).filter(([, v]) => isTbd(v)).map(([label]) => label)
  if (missing.length) {
    throw new Error(`Blocked before changing anything: still needed from the team: ${missing.join('; ')}. ` +
      'See tests/testplan/user-management.md.')
  }
}

/** New username: prefix + run timestamp, letters and digits only (the username rule is not confirmed yet). */
export function newTestUsername(prefix = 'qatest'): string {
  return `${prefix}${Date.now()}`
}

/** A password that meets the form rule (8-15 characters; upper, lower, digit and one of @#$%). Never stored or logged. */
export function generatePassword(): string {
  return `Qa${randomBytes(4).toString('hex')}@7`
}

/**
 * A synthetic mobile number for a new test user: 9 digits (the form's rule, user 2026-11-20, confirmed live).
 * It never starts with 0, so it is not in the local 0XX XXX XXX format of Sierra Leone mobile numbers.
 * The form refuses a number any other employee already has, and deactivated users most likely keep theirs, so each
 * created user needs a fresh number (team decision 2026-11-18: synthetic numbers, accepting that DIGIT may text the
 * account details to it). Never logged: fill it with fillPrivately.
 */
export function syntheticMobile(): string {
  return `${randomInt(1, 10)}${String(randomInt(0, 100_000_000)).padStart(8, '0')}`
}

/**
 * Click Submit on a filled Create user form and confirm the "Ready to Submit ?" dialog. Submit first checks the
 * mobile number (POST /egov-hrms/employees/_search?phone=…); when the form answers "Mobile number already exist!",
 * fill a new synthetic number and submit again, up to `attempts` times. After the dialog the app checks the username
 * (_search?codes=…) and either sends POST /egov-hrms/employees/_create or shows "Username exists" and sends nothing.
 * Flow observed live 2026-11-18.
 */
export async function submitAndConfirm(form: PaymentsUiEmployeeHrmsCreatePage, attempts = 3): Promise<void> {
  for (let attempt = 1; attempt <= attempts; attempt++) {
    await expect(form.submit(), 'Submit enabled once every required field is filled').toBeEnabled({ timeout: 15_000 })
    const confirm = form.confirmDialog().waitFor({ state: 'visible', timeout: 30_000 }).then(() => 'confirm' as const)
    const taken = form.mobileTakenToast().waitFor({ state: 'visible', timeout: 30_000 }).then(() => 'taken' as const)
    confirm.catch(() => undefined)
    taken.catch(() => undefined)
    await form.submit().click()
    if ((await Promise.race([confirm, taken])) === 'confirm') {
      await form.confirmSubmit().click()
      return
    }
    await allure.step(`The mobile number is already used by another employee: fill a new synthetic number (attempt ${attempt + 1})`, async () => {
      await form.mobileTakenToast().waitFor({ state: 'hidden', timeout: 15_000 }).catch(() => undefined)
      await fillPrivately(form.mobileNumber(), syntheticMobile())
    })
  }
  throw new Error(`Every synthetic mobile number tried (${attempts}) was already used by another employee`)
}

/** submitAndConfirm, resolving with the create response (202 Accepted on success, observed 2026-11-18). */
export async function submitCreateUser(form: PaymentsUiEmployeeHrmsCreatePage, attempts = 3): Promise<Response> {
  const created = form.page.waitForResponse(r => PaymentsUiEmployeeHrmsCreatePage.CREATE_API_RE.test(r.url()), { timeout: 120_000 })
  created.catch(() => undefined)
  await submitAndConfirm(form, attempts)
  return created
}

/**
 * Open Search user, pass the hierarchy step and wait for the default list. Resolves with the first search
 * response (registered before Next, which triggers it).
 */
export async function openUserSearch(page: Page, baseURL: string): Promise<Response> {
  const inbox = new PaymentsUiEmployeeHrmsInboxPage(page)
  const loader = new HomePage(page).animation1dcbe0()
  await inbox.goto(baseURL)
  await waitForLoaderGone(loader)
  const firstSearch = page.waitForResponse(r => PaymentsUiEmployeeHrmsInboxPage.SEARCH_API_RE.test(r.url()), { timeout: 60_000 })
  await inbox.hierarchy.pass(DEFAULT_HIERARCHY_TYPE)
  await waitForLoaderGone(loader)
  const response = await firstSearch
  await inbox.resultRows().first().waitFor({ state: 'visible', timeout: 60_000 })
  return response
}

/** Open Create user and pass the hierarchy step; waits for the Username field. */
export async function openCreateUser(page: Page, baseURL: string): Promise<PaymentsUiEmployeeHrmsCreatePage> {
  const form = new PaymentsUiEmployeeHrmsCreatePage(page)
  const loader = new HomePage(page).animation1dcbe0()
  await form.goto(baseURL)
  await waitForLoaderGone(loader)
  await form.hierarchy.pass(DEFAULT_HIERARCHY_TYPE)
  await waitForLoaderGone(loader)
  await form.username().waitFor({ state: 'visible', timeout: 60_000 })
  return form
}

/**
 * Click the username link of a search result, but only when the result is exactly `username` (privacy guard:
 * a lost search value would otherwise open another person's record). Waits for the details page to load.
 */
export async function clickOnlyUsernameLink(page: Page, username: string): Promise<void> {
  const inbox = new PaymentsUiEmployeeHrmsInboxPage(page)
  await expect(inbox.usernameLinks(), 'exactly one result for the searched username').toHaveCount(1, { timeout: 30_000 })
  const isSearched = (await inbox.usernameLinks().first().innerText()).trim() === username
  expect(isSearched, 'the only result is the searched username (another user is never opened)').toBe(true)
  await inbox.usernameLinks().first().click()
  await waitForLoaderGone(new HomePage(page).animation1dcbe0())
}

/** Search `username` from a fresh Search user page and open its details page. */
export async function openUserDetails(page: Page, baseURL: string, username: string): Promise<void> {
  await openUserSearch(page, baseURL)
  await new PaymentsUiEmployeeHrmsInboxPage(page).searchUsername(username)
  await clickOnlyUsernameLink(page, username)
}

/**
 * Fill every required field after Username except the mobile number (USR-10-H1 steps 3 and 5–8; the mobile
 * number is step 4). The generated password never reaches a report.
 */
export async function fillRequiredFieldsExceptMobile(form: PaymentsUiEmployeeHrmsCreatePage, data: TestUserData): Promise<void> {
  const password = generatePassword()
  await fillPrivately(form.password(), password)
  await fillPrivately(form.confirmPassword(), password)
  await form.name().fill(data.name)
  await form.genderRadio(data.gender).check()
  await form.dateOfBirth().fill(localIsoDateYearsAgo(data.ageYears))
  await form.chooseDropdown(form.employmentType(), data.employmentType)
  await form.chooseDropdown(form.department(), data.department)
  await form.chooseDropdown(form.designation(), data.designation)
  await form.dateOfAppointment().fill(localIsoDate(0))
  await form.chooseRole(data.role)
  await form.chooseCountry(1, data.jurisdiction.Country)
}

// --- One test user per run (team decision 2026-11-18) ---
// USR-10-H1 creates the run's only test user; USR-11-H1, USR-13-H3, USR-13-H5 and USR-13-H4 (deactivation, last)
// act on it. The username is kept in a file under test-results/, which Playwright empties at the start of every run,
// so it survives a worker restart after a failed test but never leaks into the next run.
const LIFECYCLE_FILE = path.join(__dirname, '..', '..', 'test-results', '.usr-lifecycle-user.json')

export function saveLifecycleUser(username: string): void {
  fs.mkdirSync(path.dirname(LIFECYCLE_FILE), { recursive: true })
  fs.writeFileSync(LIFECYCLE_FILE, JSON.stringify({ username }))
}

/**
 * The test user of this run. QA_LIFECYCLE_USERNAME (only a qatest<digits> user the tests created) re-runs the later
 * steps against an earlier test user without creating another one.
 */
export function lifecycleUser(): string {
  const override = (process.env.QA_LIFECYCLE_USERNAME || '').trim()
  if (override) {
    if (!TEST_USERNAME_RE.test(override)) throw new Error('QA_LIFECYCLE_USERNAME must be a test-created user (qatest<digits>); real staff are never edited')
    return override
  }
  if (fs.existsSync(LIFECYCLE_FILE)) {
    const { username } = JSON.parse(fs.readFileSync(LIFECYCLE_FILE, 'utf-8')) as { username?: string }
    if (username && TEST_USERNAME_RE.test(username)) return username
  }
  throw new Error('No test user in this run: USR-10-H1 must pass first in the same run ' +
    '(or set QA_LIFECYCLE_USERNAME to a qatest<digits> user created by an earlier run)')
}
