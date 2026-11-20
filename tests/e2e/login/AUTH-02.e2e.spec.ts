/**
 * AUTO-GENERATED — do not edit by hand.
 * Source:    tests/testcases/login/AUTH-02.yaml
 * Flow:      AUTH-02 — continue_disabled_until_form_complete
 * Contract:  ui-contract.json v1.3.0
 * Generator: /playwright-gen login AUTH-02
 */
import { test, expect, type Page } from '@playwright/test'
import * as allure from 'allure-js-commons'
import { WorkbenchUiEmployeeUserLoginPage } from '../../pages/WorkbenchUiEmployeeUserLoginPage.page'
import { HomePage } from '../../pages/HomePage.page'
import { expectPathname } from '../../helpers/routes'
import { installOverlayHandlers, waitForLoaderGone, fillPrivately } from '../../helpers/app'
import { requiredEnv } from '../../helpers/requiredEnv'

const BASE_URL = (process.env.QA_UI_BASE_URL || '').trim() || 'https://sierraleone-hcm.digit.org/workbench-ui/employee'   // .env QA_UI_BASE_URL normally supplies this
const YAML_SOURCE = 'tests/testcases/login/AUTH-02.yaml'
const CITY = 'Sierra Leone'

/** Step "Open /workbench-ui/employee/user/login and wait for animation_1dcbe0 to be hidden". */
async function openLogin(page: Page, login: WorkbenchUiEmployeeUserLoginPage, loader: HomePage): Promise<void> {
  await login.goto(BASE_URL)
  await expectPathname(page, WorkbenchUiEmployeeUserLoginPage.PATH)
  await waitForLoaderGone(loader.animation1dcbe0())
  // A cold load can take ~15 s, so allow 60 s for the form to render.
  await expect(login.username30177a()).toBeVisible({ timeout: 60_000 })
}

test.describe('AUTH-02 continue_disabled_until_form_complete', {
  tag: ['@AUTH-02', '@login', '@P1'],
}, () => {
  // Actor `unauthenticated`: the login form is only shown when logged out.
  test.use({ storageState: { cookies: [], origins: [] } })

  test('AUTH-02-H1: Enable Continue when username, password, city and consent are all set', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await allure.tms(YAML_SOURCE + '#AUTH-02-H1', 'AUTH-02-H1')
    await allure.parameter('case_id', 'AUTH-02-H1')
    await allure.parameter('flow_id', 'AUTH-02')
    await allure.parameter('module', 'login')
    await allure.parameter('type', 'happy_path')
    await allure.parameter('priority', 'P1')
    await allure.parameter('test_data_ref', 'AUTH-02-H1')
    await allure.parameter('yaml_source', YAML_SOURCE)
    await allure.epic('login')
    await allure.feature('continue_disabled_until_form_complete')
    await allure.story('Enable Continue when username, password, city and consent are all set')
    await allure.severity('normal')
    await allure.tag('regression')
    await allure.description('Positive partition: the only input combination that should enable Continue; nothing is submitted.\n\nSource: ' + YAML_SOURCE + '#AUTH-02-H1')

    const login = new WorkbenchUiEmployeeUserLoginPage(page)
    const loader = new HomePage(page)

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
    })

    await allure.step('1. Open /workbench-ui/employee/user/login and wait for animation_1dcbe0 to be hidden', async () => {
      await openLogin(page, login, loader)
    })
    await allure.step('2. Fill username_30177a with QA_USERNAME from .env', async () => {
      await login.username30177a().fill(requiredEnv('QA_USERNAME'))
    })
    await allure.step('3. Fill password_53fc5f with QA_PASSWORD from .env', async () => {
      await fillPrivately(login.password53fc5f(), requiredEnv('QA_PASSWORD'))   // keeps the password out of report step titles
    })
    await allure.step("4. Click select_an_option_be0437, then choose the option 'Sierra Leone'", async () => {
      await login.selectCity(CITY)
      await expect(login.field28b6e46()).toHaveValue(CITY)
    })
    await allure.step('5. Click by_clicking_i_accept_the_410d00 to tick field_3_b57319', async () => {
      await login.byClickingIAcceptThe410d00().click()
      await expect(login.field3B57319()).toBeChecked()
    })

    await allure.step('Assert: continue_button_enabled', async () => {
      await expect(login.continue5f8c5f()).toBeEnabled()
    })
    await allure.step('Assert: url_pathname_is_workbench_ui_employee_user_login', async () => {
      await expectPathname(page, WorkbenchUiEmployeeUserLoginPage.PATH)
    })
  })

  test('AUTH-02-E1: Keep Continue disabled on an empty form', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await allure.tms(YAML_SOURCE + '#AUTH-02-E1', 'AUTH-02-E1')
    await allure.parameter('case_id', 'AUTH-02-E1')
    await allure.parameter('flow_id', 'AUTH-02')
    await allure.parameter('module', 'login')
    await allure.parameter('type', 'negative')
    await allure.parameter('priority', 'P1')
    await allure.parameter('test_data_ref', 'AUTH-02-E1')
    await allure.parameter('yaml_source', YAML_SOURCE)
    await allure.epic('login')
    await allure.feature('continue_disabled_until_form_complete')
    await allure.story('Keep Continue disabled on an empty form')
    await allure.severity('normal')
    await allure.tag('regression')
    await allure.description('Empty-form partition (observed live on 13 Nov); the button is disabled, so no error message is expected.\n\nSource: ' + YAML_SOURCE + '#AUTH-02-E1')

    const login = new WorkbenchUiEmployeeUserLoginPage(page)
    const loader = new HomePage(page)

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
    })

    await allure.step('1. Open /workbench-ui/employee/user/login and wait for animation_1dcbe0 to be hidden', async () => {
      await openLogin(page, login, loader)
    })

    await allure.step('Assert: continue_button_disabled', async () => {
      await expect(login.continue5f8c5f()).toBeDisabled()
    })
  })

  test('AUTH-02-E2: Keep Continue disabled with username and password but no city or consent', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await allure.tms(YAML_SOURCE + '#AUTH-02-E2', 'AUTH-02-E2')
    await allure.parameter('case_id', 'AUTH-02-E2')
    await allure.parameter('flow_id', 'AUTH-02')
    await allure.parameter('module', 'login')
    await allure.parameter('type', 'negative')
    await allure.parameter('priority', 'P1')
    await allure.parameter('test_data_ref', 'AUTH-02-E2')
    await allure.parameter('yaml_source', YAML_SOURCE)
    await allure.epic('login')
    await allure.feature('continue_disabled_until_form_complete')
    await allure.story('Keep Continue disabled with username and password but no city or consent')
    await allure.severity('normal')
    await allure.tag('regression')
    await allure.description('Credentials-only partition: proves city and consent are required, not just the credentials.\n\nSource: ' + YAML_SOURCE + '#AUTH-02-E2')

    const login = new WorkbenchUiEmployeeUserLoginPage(page)
    const loader = new HomePage(page)

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
    })

    await allure.step('1. Open /workbench-ui/employee/user/login and wait for animation_1dcbe0 to be hidden', async () => {
      await openLogin(page, login, loader)
    })
    await allure.step('2. Fill username_30177a with QA_USERNAME from .env', async () => {
      await login.username30177a().fill(requiredEnv('QA_USERNAME'))
    })
    await allure.step('3. Fill password_53fc5f with QA_PASSWORD from .env', async () => {
      await fillPrivately(login.password53fc5f(), requiredEnv('QA_PASSWORD'))   // keeps the password out of report step titles
    })

    await allure.step('Assert: continue_button_disabled', async () => {
      await expect(login.continue5f8c5f()).toBeDisabled()
    })
    await allure.step('Assert: city_field_empty', async () => {
      await expect(login.field28b6e46()).toHaveValue('')
    })
    await allure.step('Assert: consent_checkbox_unchecked', async () => {
      await expect(login.field3B57319()).not.toBeChecked()
    })
  })

  test('AUTH-02-E3: Keep Continue disabled when everything except consent is set', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await allure.tms(YAML_SOURCE + '#AUTH-02-E3', 'AUTH-02-E3')
    await allure.parameter('case_id', 'AUTH-02-E3')
    await allure.parameter('flow_id', 'AUTH-02')
    await allure.parameter('module', 'login')
    await allure.parameter('type', 'negative')
    await allure.parameter('priority', 'P1')
    await allure.parameter('test_data_ref', 'AUTH-02-E3')
    await allure.parameter('yaml_source', YAML_SOURCE)
    await allure.epic('login')
    await allure.feature('continue_disabled_until_form_complete')
    await allure.story('Keep Continue disabled when everything except consent is set')
    await allure.severity('normal')
    await allure.tag('regression')
    await allure.description('Isolates the privacy-consent requirement: every other input is valid.\n\nSource: ' + YAML_SOURCE + '#AUTH-02-E3')

    const login = new WorkbenchUiEmployeeUserLoginPage(page)
    const loader = new HomePage(page)

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
    })

    await allure.step('1. Open /workbench-ui/employee/user/login and wait for animation_1dcbe0 to be hidden', async () => {
      await openLogin(page, login, loader)
    })
    await allure.step('2. Fill username_30177a with QA_USERNAME from .env', async () => {
      await login.username30177a().fill(requiredEnv('QA_USERNAME'))
    })
    await allure.step('3. Fill password_53fc5f with QA_PASSWORD from .env', async () => {
      await fillPrivately(login.password53fc5f(), requiredEnv('QA_PASSWORD'))   // keeps the password out of report step titles
    })
    await allure.step("4. Click select_an_option_be0437, then choose the option 'Sierra Leone'", async () => {
      await login.selectCity(CITY)
      await expect(login.field28b6e46()).toHaveValue(CITY)
    })

    await allure.step('Assert: continue_button_disabled', async () => {
      await expect(login.continue5f8c5f()).toBeDisabled()
    })
    await allure.step('Assert: consent_checkbox_unchecked', async () => {
      await expect(login.field3B57319()).not.toBeChecked()
    })
  })

  test('AUTH-02-E4: Disable Continue again when consent is unticked after completing the form', {
    tag: ['@regression'],
  }, async ({ page }) => {
    await allure.tms(YAML_SOURCE + '#AUTH-02-E4', 'AUTH-02-E4')
    await allure.parameter('case_id', 'AUTH-02-E4')
    await allure.parameter('flow_id', 'AUTH-02')
    await allure.parameter('module', 'login')
    await allure.parameter('type', 'edge_case')
    await allure.parameter('priority', 'P1')
    await allure.parameter('test_data_ref', 'AUTH-02-E4')
    await allure.parameter('yaml_source', YAML_SOURCE)
    await allure.epic('login')
    await allure.feature('continue_disabled_until_form_complete')
    await allure.story('Disable Continue again when consent is unticked after completing the form')
    await allure.severity('normal')
    await allure.tag('regression')
    await allure.description('State transition enabled to disabled: withdrawing consent must re-disable Continue.\n\nSource: ' + YAML_SOURCE + '#AUTH-02-E4')

    const login = new WorkbenchUiEmployeeUserLoginPage(page)
    const loader = new HomePage(page)

    await allure.step('Precondition: start state', async () => {
      await installOverlayHandlers(page)
    })

    await allure.step('1. Open /workbench-ui/employee/user/login and wait for animation_1dcbe0 to be hidden', async () => {
      await openLogin(page, login, loader)
    })
    await allure.step('2. Fill username_30177a with QA_USERNAME from .env', async () => {
      await login.username30177a().fill(requiredEnv('QA_USERNAME'))
    })
    await allure.step('3. Fill password_53fc5f with QA_PASSWORD from .env', async () => {
      await fillPrivately(login.password53fc5f(), requiredEnv('QA_PASSWORD'))   // keeps the password out of report step titles
    })
    await allure.step("4. Click select_an_option_be0437, then choose the option 'Sierra Leone'", async () => {
      await login.selectCity(CITY)
      await expect(login.field28b6e46()).toHaveValue(CITY)
    })
    await allure.step('5. Click by_clicking_i_accept_the_410d00 to tick field_3_b57319 and wait for continue_5f8c5f to be enabled', async () => {
      await login.byClickingIAcceptThe410d00().click()
      await expect(login.field3B57319()).toBeChecked()
      await expect(login.continue5f8c5f()).toBeEnabled()
    })
    await allure.step('6. Click by_clicking_i_accept_the_410d00 again to untick field_3_b57319', async () => {
      await login.byClickingIAcceptThe410d00().click()
    })

    await allure.step('Assert: continue_button_disabled', async () => {
      await expect(login.continue5f8c5f()).toBeDisabled()
    })
    await allure.step('Assert: consent_checkbox_unchecked', async () => {
      await expect(login.field3B57319()).not.toBeChecked()
    })
  })
})
