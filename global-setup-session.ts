// Runs before the generated global-setup.ts (that file is rewritten by `qa-kit auth gen-setup`, so it is not edited).
//
// 1. Empties allure-results, so an Allure report always shows exactly one run. Set QA_KEEP_ALLURE_RESULTS=1 to keep
//    earlier results (for example when you run modules one by one and want a single combined report).
// 2. Checks that the saved login still opens the workbench home. The test account is also used for manual testing,
//    and logging out anywhere ends the saved session (every login shares one token), after which every test lands on
//    the login page. When the check fails, it sets QA_REFRESH_AUTH=1 so the generated setup logs in again.
//    QA_REFRESH_AUTH=1 still forces a fresh login without the check.
// Nothing here prints the session, the token or any .env value.
import { chromium, type FullConfig } from '@playwright/test'
import * as dotenv from 'dotenv'
import * as fs from 'fs'
import * as path from 'path'
import generatedSetup from './global-setup'
import { restoreSavedSession } from './tests/helpers/app'

const STATE_REL = '.auth/storage-state.json'
const ALLURE_RESULTS_REL = 'allure-results'
const HOME_PATH = '/workbench-ui/employee'
const LOGIN_USERNAME_FIELD = '#user-login-standalone-core_login_username-field'
const CHECK_TIMEOUT_MS = 90_000   // a cold load shows the DIGIT loader for about 15 s

function emptyDir(dir: string): number {
  if (!fs.existsSync(dir)) return 0
  const entries = fs.readdirSync(dir)
  for (const entry of entries) fs.rmSync(path.join(dir, entry), { recursive: true, force: true })
  return entries.length
}

function siteOrigin(config: FullConfig): string {
  const baseURL = config.projects.find(p => p.name === 'e2e')?.use?.baseURL
  return new URL(baseURL || process.env.QA_LOGIN_URL || 'https://sierraleone-hcm.digit.org').origin
}

/** 'home' = the saved login works; 'login' = it has expired; 'timeout' = neither page appeared in time. */
async function checkSavedSession(statePath: string, origin: string): Promise<'home' | 'login' | 'timeout'> {
  const browser = await chromium.launch()
  try {
    const context = await browser.newContext({ storageState: statePath })
    const page = await context.newPage()
    await restoreSavedSession(page)
    await page.goto(origin + HOME_PATH, { waitUntil: 'domcontentloaded' })
    return await Promise.race([
      page.getByRole('button', { name: 'Search user', exact: true })
        .waitFor({ state: 'visible', timeout: CHECK_TIMEOUT_MS }).then(() => 'home' as const, () => 'timeout' as const),
      page.locator(LOGIN_USERNAME_FIELD)
        .waitFor({ state: 'visible', timeout: CHECK_TIMEOUT_MS }).then(() => 'login' as const, () => 'timeout' as const),
    ])
  } finally {
    await browser.close()
  }
}

export default async function globalSetup(config: FullConfig): Promise<void> {
  const root = config.configFile ? path.dirname(config.configFile) : process.cwd()
  dotenv.config({ path: path.join(root, '.env') })

  if (process.env.QA_KEEP_ALLURE_RESULTS !== '1') {
    const removed = emptyDir(path.join(root, ALLURE_RESULTS_REL))
    if (removed) console.log(`[setup] Emptied ${ALLURE_RESULTS_REL} (${removed} files from an earlier run).`)
  }

  const statePath = path.join(root, STATE_REL)
  const forced = process.env.QA_REFRESH_AUTH === '1'
  if (fs.existsSync(statePath) && !forced) {
    const seen = await checkSavedSession(statePath, siteOrigin(config))
    if (seen !== 'home') {
      console.log(seen === 'login'
        ? '[setup] The saved login has expired (the app shows the login page); logging in again.'
        : '[setup] Could not confirm the saved login within 90 s; logging in again to be safe.')
      process.env.QA_REFRESH_AUTH = '1'
    }
  }
  try {
    await generatedSetup(config)
  } finally {
    if (!forced) delete process.env.QA_REFRESH_AUTH
  }
}
