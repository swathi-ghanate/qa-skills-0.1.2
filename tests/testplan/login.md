# Test plan: login

<!-- generated from ui-contract.json | app: HCM -->

## Module purpose
Verifies employee login to the DIGIT HCM console through the **workbench login only**: `/workbench-ui/employee` redirects to `/workbench-ui/employee/user/login` (contract v1.3.0, scraped 2026-11-16T05:01Z). It covers the login form (username, password, Country/State/City, privacy consent), rejection of bad credentials, redirection of logged-out users from protected workbench pages, logout, session persistence, the session reaching the in-scope complaint pages, Forgot password navigation, the password visibility toggle, the Privacy Policy link and the banner carousel. Out of scope: the `payments-ui` and `dashboard-ui` login pages (by decision; they must not be used), submitting a password reset (it may send a code to a real user), account lockout (would lock the shared test account), OTP login (auth type is `form`) and language switching.

---

## Actors
| Actor | Description |
|---|---|
| Anonymous visitor | No session. May open the workbench login page. Must be redirected to it from every protected workbench page (`is_protected: true`). |
| Employee (test account) | Credentials from `.env` (`QA_USERNAME` / `QA_PASSWORD`), tenant "Sierra Leone". After login lands on `/workbench-ui/employee` and sees every module card, so likely broad, admin-like roles. Exact roles are not in the contract `<TBD: confirm roles>`. |
| Invalid user | Enters a wrong password or an unknown username. Synthetic values only, never a real person's account. |

---

## Flows to test
| Flow ID | Description | Priority |
|---|---|---|
| AUTH-01 | Log in through the workbench login and land on the workbench home | P0 |
| AUTH-02 | Continue stays disabled until username, password, city and consent are all set | P1 |
| AUTH-03 | Wrong password is rejected and no session is created | P0 |
| AUTH-04 | Unknown username is rejected | P1 |
| AUTH-05 | Protected workbench pages redirect a logged-out visitor to the workbench login | P0 |
| AUTH-06 | Logout ends the session and protected pages need a login again | P0 |
| AUTH-07 | The workbench login session opens the Create complaint and Complaints inbox pages | P1 |
| AUTH-08 | Session survives a page reload | P1 |
| AUTH-09 | Password visibility toggle shows and hides the password | P2 |
| AUTH-10 | Forgot password? opens the password-reset page (no submit) | P1 |
| AUTH-11 | Privacy Policy opens from the login form | P1 |
| AUTH-12 | Login-page banner carousel moves with the previous/next buttons | P2 |

P0 covers the core happy path and the security-critical checks (credential rejection, route protection, logout).

---

## Key assertions
- Login uses only `workbench_ui_employee_user_login` (`/workbench-ui/employee/user/login`). A successful login lands on `/workbench-ui/employee` (the 16 Nov scrape logged "Authentication succeeded at /workbench-ui/employee").
- Protected workbench pages (`workbench_ui_employee`, `workbench_ui_employee_campaign_commodity_campaig`, `is_protected: true`) redirect a logged-out visitor to `/workbench-ui/employee/user/login`. The anonymous scrape pass observed this for workbench routes on 13 Nov.
- `continue_5f8c5f` is disabled until all four inputs are set (observed live on 13 Nov). The contract form `https_sierraleone_hcm_digit_org_workbenc_996dec` lists all four fields as `required: false`, which under-reports them; the UI shows "*" on each.
- A failed login keeps the pathname on `/workbench-ui/employee/user/login`, shows an error message `<TBD text>` and stores no session token.
- After logout, `/workbench-ui/employee` redirects to the login page again.
- The session is stored in localStorage (no cookies) and also opens the `payments-ui` complaint pages (`is_protected: true`) without another login. The 16 Nov authenticated crawl, started from the workbench login, captured both.
- Wait for the loader `animation_1dcbe0` to be hidden before every assertion. A cold load takes about 14 s.

---

## Per-flow notes

### AUTH-01 — Log in through the workbench login

**Page:** `workbench_ui_employee_user_login` | **Path:** `/workbench-ui/employee/user/login`

Start in a fresh browser context with no stored session, so it does not reuse `.auth/storage-state.json`. The scrape entry URL (`config.baseUrl`) is `https://sierraleone-hcm.digit.org/workbench-ui/employee/campaign/campaign-home`. That is a warm-up page for the crawler only; tests start from `QA_UI_BASE_URL` = `https://sierraleone-hcm.digit.org/workbench-ui/employee`. All paths are absolute from the origin `https://sierraleone-hcm.digit.org`. Close the context afterwards.

| Step | Element ID | Label | Expected pathname | Assert kind |
|---|---|---|---|---|
| 1 | — | open `/workbench-ui/employee` (logged out) | `/workbench-ui/employee/user/login` | url (redirect) |
| 2 | `animation_1dcbe0` | animation (loader) | `/workbench-ui/employee/user/login` | hidden |
| 3 | `username_30177a` | username | `/workbench-ui/employee/user/login` | value (= `QA_USERNAME`) |
| 4 | `password_53fc5f` | password | `/workbench-ui/employee/user/login` | value (filled, masked) |
| 5 | `select_an_option_be0437` | Select an option (Country/State/City) → "Sierra Leone" | `/workbench-ui/employee/user/login` | click; option chosen |
| 6 | `field_2_8b6e46` | Country/State/City input | `/workbench-ui/employee/user/login` | value "Sierra Leone" |
| 7 | `field_3_b57319` | privacy consent checkbox | `/workbench-ui/employee/user/login` | checked |
| 8 | `continue_5f8c5f` | Continue | `/workbench-ui/employee/user/login` | enabled, then click |
| 9 | `commodity_management_2ffe55` | Commodity Management (home card) | `/workbench-ui/employee` | url + visible |

**Selectors to use:**
- `animation_1dcbe0`: `page.getByRole('button', { name: 'animation', exact: true })`. This is the app loader (recorded on page `home`); wait for it to be hidden.
- `username_30177a`: `page.locator('[name="username"]')`. The form-field alternative (`username_5a3c4c`) is `page.locator('#user-login-standalone-core_login_username-field')`.
- `password_53fc5f`: `page.locator('[name="password"]')`. The form-field alternative (`password_181b4b`) is `page.locator('#user-login-standalone-core_login_password-field')`.
- `select_an_option_be0437`: `page.getByRole('button', { name: 'Select an option', exact: true })`. This wrapper is what receives the click; the input underneath can't be clicked directly. The option "Sierra Leone" is **not in the contract**; observed live as `#jk-dropdown-unique .digit-dropdown-item`, the only option.
- `field_2_8b6e46`: `page.locator('#user-login-standalone-core_common_city-field')`. Use it to read the value only.
- `field_3_b57319`: `page.locator('#privacy-component-check')`. A sibling element covers it, so use `.check({ force: true })` or click `.digit-privacy-checkbox .digit-checkbox-container` (observed live, not in contract).
- `continue_5f8c5f`: `page.getByRole('button', { name: 'Continue', exact: true })`.
- `commodity_management_2ffe55`: `page.getByRole('button', { name: 'Commodity Management', exact: true })`. `match_count: 1`; the `-2` entry is the same element recorded twice.

**Edge cases:**
- Do not fall back to the `payments-ui` or `dashboard-ui` login pages, even though they are in the contract.
- Opening `/workbench-ui/employee/user/login` directly must behave the same as step 1's redirect.

### AUTH-02 — Continue stays disabled until the form is complete

**Page:** `workbench_ui_employee_user_login` | **Path:** `/workbench-ui/employee/user/login`

Fresh context, no session. Each check builds on the previous step, and nothing is submitted.

| Step | Element ID | Label | Expected pathname | Assert kind |
|---|---|---|---|---|
| 1 | `animation_1dcbe0` | animation (loader) | `/workbench-ui/employee/user/login` | hidden |
| 2 | `continue_5f8c5f` | Continue (empty form) | `/workbench-ui/employee/user/login` | disabled |
| 3 | `username_30177a` | username | `/workbench-ui/employee/user/login` | value |
| 4 | `password_53fc5f` | password | `/workbench-ui/employee/user/login` | value |
| 5 | `continue_5f8c5f` | Continue (city and consent missing) | `/workbench-ui/employee/user/login` | disabled |
| 6 | `select_an_option_be0437` | Select an option → "Sierra Leone" | `/workbench-ui/employee/user/login` | click; option chosen |
| 7 | `continue_5f8c5f` | Continue (consent missing) | `/workbench-ui/employee/user/login` | disabled |
| 8 | `field_3_b57319` | privacy consent checkbox | `/workbench-ui/employee/user/login` | checked |
| 9 | `continue_5f8c5f` | Continue (all set) | `/workbench-ui/employee/user/login` | enabled |
| 10 | `field_3_b57319` | privacy consent checkbox (uncheck) | `/workbench-ui/employee/user/login` | unchecked; Continue disabled |

**Selectors to use:**
- As AUTH-01 for `continue_5f8c5f`, `username_30177a`, `password_53fc5f`, `select_an_option_be0437` and `field_3_b57319`.

**Edge cases:**
- The live check covered an empty form and a form with city and consent but no credentials. Steps 5, 7 and 10 are implied; confirm them.
- Whitespace-only username or password: does it count as filled? `<TBD>`.

### AUTH-03 — Wrong password is rejected

**Page:** `workbench_ui_employee_user_login` | **Path:** `/workbench-ui/employee/user/login`

Fresh context. Use `QA_USERNAME` with a synthetic wrong password such as `QA-TEST-wrong-password`. Run it **once per suite run**, never in retry loops.

| Step | Element ID | Label | Expected pathname | Assert kind |
|---|---|---|---|---|
| 1 | `animation_1dcbe0` | animation (loader) | `/workbench-ui/employee/user/login` | hidden |
| 2 | `username_30177a` | username (`QA_USERNAME`) | `/workbench-ui/employee/user/login` | value |
| 3 | `password_53fc5f` | password (wrong) | `/workbench-ui/employee/user/login` | value |
| 4 | `select_an_option_be0437` | Select an option → "Sierra Leone" | `/workbench-ui/employee/user/login` | click; option chosen |
| 5 | `field_3_b57319` | privacy consent checkbox | `/workbench-ui/employee/user/login` | checked |
| 6 | `continue_5f8c5f` | Continue | `/workbench-ui/employee/user/login` | url (unchanged) + error text visible `<TBD text>` |

**Selectors to use:**
- As AUTH-01. The error message is **not in the contract**; capture its selector on the first run.

**Edge cases:**
- **Lockout risk:** repeated failures could lock the shared test account and break every suite. Prefer a dedicated negative-test account `<TBD>`.
- After the error, check that localStorage has no session keys and that `/workbench-ui/employee` still redirects to login.

### AUTH-04 — Unknown username is rejected

**Page:** `workbench_ui_employee_user_login` | **Path:** `/workbench-ui/employee/user/login`

Fresh context. Use the synthetic username `qa-test-unknown-user` and any password.

| Step | Element ID | Label | Expected pathname | Assert kind |
|---|---|---|---|---|
| 1 | `animation_1dcbe0` | animation (loader) | `/workbench-ui/employee/user/login` | hidden |
| 2 | `username_30177a` | username (unknown) | `/workbench-ui/employee/user/login` | value |
| 3 | `password_53fc5f` | password | `/workbench-ui/employee/user/login` | value |
| 4 | `select_an_option_be0437` | Select an option → "Sierra Leone" | `/workbench-ui/employee/user/login` | click; option chosen |
| 5 | `field_3_b57319` | privacy consent checkbox | `/workbench-ui/employee/user/login` | checked |
| 6 | `continue_5f8c5f` | Continue | `/workbench-ui/employee/user/login` | url (unchanged) + error text visible `<TBD text>` |

**Selectors to use:**
- As AUTH-01.

**Edge cases:**
- The message should not reveal whether the username exists; compare it with AUTH-03's message. Expected to be identical `<TBD: confirm>`.

### AUTH-05 — Protected workbench pages redirect a logged-out visitor

**Page:** `workbench_ui_employee`, `workbench_ui_employee_campaign_commodity_campaig` | **Path:** `/workbench-ui/employee`, `/workbench-ui/employee/campaign/commodity-campaigns`

Fresh context with no session. Open each URL directly. This is the RBAC check for the anonymous actor.

| Step | Element ID | Label | Expected pathname | Assert kind |
|---|---|---|---|---|
| 1 | — | open `/workbench-ui/employee` | `/workbench-ui/employee/user/login` | url |
| 2 | `username_30177a` | username (workbench login form) | `/workbench-ui/employee/user/login` | visible |
| 3 | — | open `/workbench-ui/employee/campaign/commodity-campaigns` | `/workbench-ui/employee/user/login` | url |
| 4 | `username_30177a` | username (workbench login form) | `/workbench-ui/employee/user/login` | visible |

**Selectors to use:**
- `username_30177a`: `page.locator('[name="username"]')`.

**Edge cases:**
- The redirect happens on the client after the app boots (about 5 s warm, about 14 s cold). Use `waitForURL`, not an immediate URL read.
- Logged-out access to the complaint pages redirects to the payments-ui login. That belongs to `complaints.md` and is not asserted here.

### AUTH-06 — Logout ends the session

**Page:** `workbench_ui_employee` | **Path:** `/workbench-ui/employee`

Log in **fresh inside this test** with AUTH-01's steps. Do not reuse `.auth/storage-state.json`: logout may invalidate the token on the server and break every test that shares the stored session.

| Step | Element ID | Label | Expected pathname | Assert kind |
|---|---|---|---|---|
| 1 | `commodity_management_2ffe55` | Commodity Management (home card) | `/workbench-ui/employee` | visible |
| 2 | `s_24f482` | S (user menu) | `/workbench-ui/employee` | click |
| 3 | `logout_8358e8` | Logout | `/workbench-ui/employee/user/login` `<TBD: confirm landing>` | visible, then click → url |
| 4 | — | open `/workbench-ui/employee` again | `/workbench-ui/employee/user/login` | url (redirect) |

**Selectors to use:**
- `commodity_management_2ffe55`: `page.getByRole('button', { name: 'Commodity Management', exact: true })`.
- `s_24f482`: `page.getByRole('button', { name: 'S', exact: true })`. **Fragile:** the name looks like the test account's initial.
- `logout_8358e8`: `page.getByRole('button', { name: 'Logout', exact: true })`. `match_count: 0` while the user menu is closed; it appears after step 2.

**Edge cases:**
- Logout may ask for confirmation (for example "Yes, Logout"); that is not in the contract `<TBD>`.

### AUTH-07 — The workbench session opens the complaint pages

**Page:** `payments_ui_employee_pgr_create_complaint`, `payments_ui_employee_pgr_inbox_v2` | **Path:** `/payments-ui/employee/pgr/create-complaint`, `/payments-ui/employee/pgr/inbox-v2`

Use the stored session from `global-setup.ts`, which logs in once through the workbench login. Read-only; nothing is submitted.

| Step | Element ID | Label | Expected pathname | Assert kind |
|---|---|---|---|---|
| 1 | — | open `/payments-ui/employee/pgr/create-complaint` | `/payments-ui/employee/pgr/create-complaint` | url (no redirect to any login) |
| 2 | `submit_b6846a` | Submit (complaint form rendered) | `/payments-ui/employee/pgr/create-complaint` | visible |
| 3 | — | open `/payments-ui/employee/pgr/inbox-v2` | `/payments-ui/employee/pgr/inbox-v2` | url (no redirect to any login) |
| 4 | `complaintnumber_7836f5` | complaintNumber (inbox rendered) | `/payments-ui/employee/pgr/inbox-v2` | visible |

**Selectors to use:**
- `submit_b6846a`: `page.getByRole('button', { name: 'Submit', exact: true })`.
- `complaintnumber_7836f5`: `page.locator('[name="complaintNumber"]')`.

**Edge cases:**
- The first `payments-ui` load is slow; wait for `animation_1dcbe0` to be hidden.

### AUTH-08 — Session survives a page reload

**Page:** `workbench_ui_employee` | **Path:** `/workbench-ui/employee`

Use the stored session. Read-only.

| Step | Element ID | Label | Expected pathname | Assert kind |
|---|---|---|---|---|
| 1 | `commodity_management_2ffe55` | Commodity Management (home card) | `/workbench-ui/employee` | visible |
| 2 | — | reload the page | `/workbench-ui/employee` | url (no redirect to login) |
| 3 | `animation_1dcbe0` | animation (loader) | `/workbench-ui/employee` | hidden |
| 4 | `commodity_management_2ffe55` | Commodity Management (home card) | `/workbench-ui/employee` | visible |

**Selectors to use:**
- `commodity_management_2ffe55`: `page.getByRole('button', { name: 'Commodity Management', exact: true })`.
- `animation_1dcbe0`: `page.getByRole('button', { name: 'animation', exact: true })`.

**Edge cases:**
- A logged-in user who opens `/workbench-ui/employee/user/login` should be sent home or shown the form; the expected behaviour is `<TBD>`.
- Session expiry or idle timeout is not in the contract `<TBD: duration>`.

### AUTH-09 — Password visibility toggle

**Page:** `workbench_ui_employee_user_login` | **Path:** `/workbench-ui/employee/user/login`

Fresh context. Type a synthetic value; never reveal the real password in screenshots or traces.

| Step | Element ID | Label | Expected pathname | Assert kind |
|---|---|---|---|---|
| 1 | `password_53fc5f` | password = `QA-TEST-visible` | `/workbench-ui/employee/user/login` | attribute `type` = `password` |
| 2 | `visibility_0fd527` | Visibility | `/workbench-ui/employee/user/login` | click; `password_53fc5f` `type` = `text` |
| 3 | `visibility_0fd527` | Visibility (again) | `/workbench-ui/employee/user/login` | click; `password_53fc5f` `type` = `password` |

**Selectors to use:**
- `password_53fc5f`: `page.locator('[name="password"]')`.
- `visibility_0fd527`: `page.getByRole('button', { name: 'Visibility', exact: true })`.

**Edge cases:**
- The toggle mechanism (changing `type` or another approach) is implied; confirm it on the first run.

### AUTH-10 — Forgot password? opens the reset page

**Page:** `workbench_ui_employee_user_login` | **Path:** `/workbench-ui/employee/user/login`

Fresh context. Navigation only; **do not submit** the reset form, because it may send a code to a real user.

| Step | Element ID | Label | Expected pathname | Assert kind |
|---|---|---|---|---|
| 1 | `animation_1dcbe0` | animation (loader) | `/workbench-ui/employee/user/login` | hidden |
| 2 | `forgot_password_54faff` | Forgot password? | `<TBD: reset path, likely /workbench-ui/employee/user/forgot-password>` | click → url |

**Selectors to use:**
- `forgot_password_54faff`: `page.getByRole('button', { name: 'Forgot password?', exact: true })`.

**Edge cases:**
- The reset page is not in the contract; add it to the scrape seeds if its form needs testing.

### AUTH-11 — Privacy Policy opens from the login form

**Page:** `workbench_ui_employee_user_login` | **Path:** `/workbench-ui/employee/user/login`

Fresh context. Reload between checks.

| Step | Element ID | Label | Expected pathname | Assert kind |
|---|---|---|---|---|
| 1 | `privacy_policy_29eb8b` | Privacy Policy | `/workbench-ui/employee/user/login` | click → policy content visible `<TBD selector>` |
| 2 | `by_clicking_i_accept_the_410d00` | By clicking, I accept the | `/workbench-ui/employee/user/login` | click; effect on `field_3_b57319` `<TBD: toggles consent or opens policy>` |

**Selectors to use:**
- `privacy_policy_29eb8b`: `page.getByRole('button', { name: ' Privacy Policy', exact: true })`. The accessible name has a leading space; Playwright trims it.
- `by_clicking_i_accept_the_410d00`: `page.getByRole('button', { name: 'By clicking, I accept the', exact: true })`.

**Edge cases:**
- The workbench login's policy modal and its Accept/Decline buttons were **not captured** in this contract. Capture them before turning this flow into cases.

### AUTH-12 — Login banner carousel

**Page:** `workbench_ui_employee_user_login` | **Path:** `/workbench-ui/employee/user/login`

Fresh context. Cosmetic.

| Step | Element ID | Label | Expected pathname | Assert kind |
|---|---|---|---|---|
| 1 | `navigation_button_9c123c` | > | `/workbench-ui/employee/user/login` | click, no error, url unchanged |
| 2 | `navigation_button_b3a210` | < | `/workbench-ui/employee/user/login` | click, no error, url unchanged |

**Selectors to use:**
- `navigation_button_9c123c`: `page.getByRole('button', { name: '>', exact: true })`.
- `navigation_button_b3a210`: `page.getByRole('button', { name: '<', exact: true })`.

**Edge cases:**
- All 7 slides showed the same heading and text during live inspection, so a slide change can't be proven by text; the active-dot indicator is not in the contract. Treat this as a visual or manual check.
