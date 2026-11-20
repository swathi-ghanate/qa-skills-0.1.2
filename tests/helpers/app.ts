import { type Locator, type Page, expect } from '@playwright/test'
import * as fs from 'fs'
import * as path from 'path'

const FIXTURES_DIR = path.join(__dirname, '..', 'fixtures')

/** Load one test-data entry by ref (e.g. 'AUTH-03-E1') from any tests/fixtures/*.test-data.json file. */
export function loadTestData<T = Record<string, string>>(ref: string): T {
  for (const file of fs.readdirSync(FIXTURES_DIR).filter(f => f.endsWith('.test-data.json'))) {
    const data = JSON.parse(fs.readFileSync(path.join(FIXTURES_DIR, file), 'utf-8'))
    if (ref in data) return data[ref] as T
  }
  throw new Error(`Test data ${ref} not found in ${FIXTURES_DIR}/*.test-data.json`)
}

/** Start collecting uncaught page errors and console.error messages; returns the live array. */
export function collectPageErrors(page: Page): string[] {
  const errors: string[] = []
  page.on('pageerror', e => errors.push(`pageerror: ${e.message}`))
  page.on('console', m => { if (m.type() === 'error') errors.push(`console: ${m.text()}`) })
  return errors
}

/** localStorage keys that hold the DIGIT session token (key names observed in .auth/storage-state.json). */
const SESSION_TOKEN_KEYS = ['token', 'Employee.token']

/** Which session-token keys are present in localStorage (names only — never read the values). */
export async function sessionTokenKeys(page: Page): Promise<string[]> {
  return page.evaluate(keys => keys.filter(k => localStorage.getItem(k) !== null), SESSION_TOKEN_KEYS)
}

/**
 * Register handlers for overlays that can appear at any time (cookie banners, tours, promo dialogs).
 * None have been observed on the DIGIT HCM workbench as of 2026-11-16; add page.addLocatorHandler(...) calls here when one appears.
 */
export async function installOverlayHandlers(_page: Page): Promise<void> {
  // intentionally empty until an overlay is observed
}

/**
 * Wait for the DIGIT app loader (contract element animation_1dcbe0) to finish.
 * The loader may not be attached yet right after goto, so first give it a short chance to appear,
 * then wait for it to disappear. A cold load takes ~15 s, so allow up to 60 s.
 */
export async function waitForLoaderGone(loader: Locator): Promise<void> {
  await loader.first().waitFor({ state: 'attached', timeout: 3_000 }).catch(() => undefined)
  await expect(loader.first()).toBeHidden({ timeout: 60_000 })
}

/**
 * Rebuild the DIGIT sessionStorage the workbench app needs (Digit.User, Digit.userType, ...) from the saved
 * localStorage session. playwright.config.ts restores only localStorage (storageState), and without these keys
 * the workbench sends a saved session to the login page (observed 2026-11-16). The keys are built the way the
 * DIGIT app builds them itself (token + Employee.user-info), so they always match the current saved login and
 * no extra file or global-setup change is needed (verified live 2026-11-16: workbench home loads and survives reload).
 * Call it first in specs that use the default saved session. It does nothing in a logged-out context
 * (no Employee.token in localStorage) and never overwrites a session the app has already set.
 */
export async function restoreSavedSession(page: Page): Promise<void> {
  await page.addInitScript(() => {
    try {
      if (!localStorage.getItem('Employee.token') || sessionStorage.getItem('Digit.User')) return
      const wrap = (value: unknown) => JSON.stringify({ value, ttl: 86400, expiry: Date.now() + 86_400_000 })
      const tenant = localStorage.getItem('Employee.tenant-id')
      sessionStorage.setItem('Digit.User', wrap({
        access_token: localStorage.getItem('Employee.token'),
        info: JSON.parse(localStorage.getItem('Employee.user-info') || 'null'),
      }))
      sessionStorage.setItem('Digit.userType', wrap('employee'))
      sessionStorage.setItem('Digit.user_type', wrap('employee'))
      sessionStorage.setItem('Digit.Employee.tenantId', wrap(tenant))
      sessionStorage.setItem('Digit.Citizen.tenantId', wrap(tenant))
    } catch {
      // about:blank or blocked storage: nothing to restore
    }
  })
}

/**
 * Safety guard for tests that must never create data: abort every request whose URL ends in `_create`
 * (e.g. POST /pgr-services/v2/request/_create) and record it. Returns the live list of blocked request paths,
 * so a test can also assert that no create request was even attempted.
 */
export async function blockCreateRequests(page: Page): Promise<string[]> {
  const attempted: string[] = []
  await page.route(/_create(\?|$)/, async route => {
    attempted.push(new URL(route.request().url()).pathname)
    await route.abort()
  })
  return attempted
}

/** Local calendar date as YYYY-MM-DD (the format of <input type="date">), offset by whole days from today. */
export function localIsoDate(offsetDays = 0): string {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/** How the DIGIT date display box shows a YYYY-MM-DD date, e.g. "16 November 2026" (observed live 2026-11-16). */
export function displayDate(isoDate: string): string {
  const [y, m, d] = isoDate.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

/** Local calendar date as YYYY-MM-DD, a whole number of years before today (e.g. the Date of Birth limit for age 18). */
export function localIsoDateYearsAgo(years: number): string {
  const d = new Date()
  d.setFullYear(d.getFullYear() - years)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/**
 * Safety guard for user-management tests: abort every request whose URL ends in `_create` and/or `_update`
 * (e.g. POST /egov-hrms/employees/_create, /_update) and record it. Returns the live list of blocked request paths.
 * Pass only the kinds the test must never send: a test that creates its own user blocks `update` only.
 */
export async function blockWriteRequests(page: Page, kinds: Array<'create' | 'update'> = ['create', 'update']): Promise<string[]> {
  const attempted: string[] = []
  await page.route(new RegExp(`_(${kinds.join('|')})(\\?|$)`), async route => {
    attempted.push(new URL(route.request().url()).pathname)
    await route.abort()
  })
  return attempted
}

/**
 * Strictest safety guard, for read-only cases on pages that hold real people's records (the PGR inbox and complaint
 * details): abort every request that is not a read. GET/HEAD/OPTIONS pass, and so do POSTs whose path ends in a read
 * verb (`_search`, `search`, `_details`, `_count`, `_get`), which DIGIT uses for lookups. Everything else (`_create`,
 * `_update`, workflow `_transition`, file uploads, logout) is aborted and recorded as "METHOD /path".
 * Verified live 2026-11-20: the inbox, complaint details page and Take Action pop-ups all load normally under it.
 */
export async function blockNonReadRequests(page: Page): Promise<string[]> {
  const attempted: string[] = []
  await page.route('**/*', async route => {
    const request = route.request()
    const method = request.method()
    if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') return route.continue()
    const pathname = new URL(request.url()).pathname
    if (/(search|_details|_count|_get)$/i.test(pathname)) return route.continue()
    attempted.push(`${method} ${pathname}`)
    return route.abort()
  })
  return attempted
}

/**
 * Put a value into an input without it appearing in Playwright or Allure step titles (`locator.fill` shows the value).
 * Use it for personal or secret values: the test account's own name and mobile number, generated passwords.
 * It sets the value the way React expects (native setter + input/change events); verified live 2026-11-18 on the
 * DIGIT HRMS search and create forms (the search request and the field validation both pick it up).
 */
export async function fillPrivately(input: Locator, value: string): Promise<void> {
  await input.evaluate((el, v) => {
    const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype
    Object.getOwnPropertyDescriptor(proto, 'value')!.set!.call(el, v)
    el.dispatchEvent(new Event('input', { bubbles: true }))
    el.dispatchEvent(new Event('change', { bubbles: true }))
  }, value)
}

/**
 * The input's effective type (the DOM `type` property, which is what the browser renders).
 * Browsers treat an unknown `type` attribute as "text": the DIGIT password toggle sets type="passwordToText",
 * which shows the password as plain text, so the attribute alone is not the right thing to assert.
 */
export async function effectiveInputType(input: Locator): Promise<string> {
  return input.evaluate(el => (el as HTMLInputElement).type)
}
