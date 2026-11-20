import { defineConfig, devices } from '@playwright/test'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

dotenv.config({ path: path.join(__dirname, '.env') })
const statePath = path.join(__dirname, '.auth/storage-state.json')
const setupPath = path.join(__dirname, 'global-setup.ts')
const hasSetup = fs.existsSync(setupPath)
const hasState = fs.existsSync(statePath)

function configBaseUrl(): string {
  try {
    const cfg = JSON.parse(fs.readFileSync(path.join(__dirname, '.qa', 'config.json'), 'utf-8'))
    return typeof cfg.baseUrl === 'string' ? cfg.baseUrl.trim() : ''
  } catch {
    return ''
  }
}
const uiBaseURL =
  (process.env.QA_UI_BASE_URL || '').trim() || configBaseUrl() || 'http://localhost:3000'
const apiBaseURL =
  process.env.QA_API_BASE_URL?.replace(/\/$/, '') ?? `${uiBaseURL.replace(/\/$/, '')}/api`

export default defineConfig({
  // global-setup-session.ts empties allure-results, re-logs in when the saved session has expired, then runs global-setup.ts
  ...(hasSetup ? { globalSetup: require.resolve('./global-setup-session') } : {}),
  fullyParallel: false,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  timeout: 120_000,
  outputDir: './test-results',
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['allure-playwright', { resultsDir: 'allure-results' }],
  ],
  projects: [
    {
      name: 'e2e',
      testDir: './tests/e2e',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: uiBaseURL,
        ...(hasState ? { storageState: statePath } : {}),
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
      },
    },
    {
      name: 'api',
      testDir: './tests/api',
      testMatch: '**/*.api.spec.ts',
      use: {
        baseURL: apiBaseURL,
        extraHTTPHeaders: {
          Accept: 'application/json',
        },
      },
    },
    {
      name: 'integration',
      testDir: './tests/integration',
      testMatch: '**/*.integration.spec.ts',
      use: {
        baseURL: apiBaseURL,
        extraHTTPHeaders: {
          Accept: 'application/json',
        },
      },
    },
  ],
})
