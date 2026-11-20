# Test plan: user-management

<!-- generated from ui-contract.json v1.3.0 (scraped 2026-11-16) + live capture 2026-11-16 | app: HCM -->

## Module purpose
Verifies User management on the DIGIT HCM Sierra Leone console:
- opening **Search user** and **Create user** from the workbench home "User management" card;
- the mandatory "Hierarchy type" step that both pages start with;
- searching users (username, unknown user, default list, filters, paging);
- opening a user's details page;
- the Create user form (sections, options, field rules and validation messages).

The contract has only empty, unexplored stubs for `payments_ui_employee_hrms_inbox` and `payments_ui_employee_hrms_create`, and no record of the details page. Every element below was captured live on 2026-11-16 with create and update requests blocked. Only labels and structure were recorded, never other people's data.

**Team answers (2026-11-16):**
- Tests **may create** real test users. Your team deactivates them later.
- Tests **may edit** users, but only users the tests created themselves.
- Mobile rule: **exactly 9 digits**, any first digit (user, 2026-11-20; confirmed live the same day in the form and its MDMS config).
- The **role** for test users will be named by the team later. Until then USR-10/11 stop at their first step with a clear message.

Out of scope for now:
- the "Manage users" card link;
- bulk user upload;
- any login other than the workbench login.

---

## Actors
| Actor | Description |
|---|---|
| Employee (test account) | Logged in through the workbench login (saved session). Sees the User management card. Its own username (`QA_USERNAME` in `.env`) is the only user the tests search for by name, so no other person's data is used. Exact roles `<TBD>`. |
| Anonymous visitor | No session. Must not be able to open the user pages. |

---

## Flows to test
| Flow ID | Description | Priority |
|---|---|---|
| USR-01 | Open Search user from the workbench home card, through the Hierarchy type step | P0 |
| USR-02 | Hierarchy type step is mandatory and offers the configured hierarchy | P1 |
| USR-03 | Search by username finds exactly that user; an unknown username shows "No Results Found" | P0 |
| USR-04 | Default list, empty search, Clear and the Role / Employment Status filters | P1 |
| USR-05 | Paging through the user list | P2 |
| USR-06 | Open a user's details page from the results (read-only) | P1 |
| USR-07 | Open Create user from the workbench home card, through the Hierarchy type step | P0 |
| USR-08 | Create user form shows its sections, required marks and dropdown options | P1 |
| USR-09 | Create user field rules and error messages keep Submit disabled | P1 |
| USR-10 | Create a new test user and find it by username (creates a real login account; approved 2026-11-16) | P0 |
| USR-11 | Edit a test-created user (approved 2026-11-16; never real staff or the test login account) | P1 |
| USR-12 | A logged-out visitor cannot open Search user or Create user | P0 |
| USR-13 | Take Action on a searched user: Edit Employee, Deactivate Employee, Edit Campaign Assignment | P1 |

---

## Key assertions
- **Entry:** the workbench home card "User management" ("Manage users", "Search user", "Create user") holds `search_user_8a67fa` and `create_user_980434`. They open `/payments-ui/employee/hrms/inbox` and `/payments-ui/employee/hrms/create`, a full load of the payments-ui app. Allow 60 s and wait for the loader `animation_1dcbe0`.
- **Hierarchy type step:** both pages first show "Select hierarchy type" with one mandatory dropdown ("Hierarchy type *", one option "ADMIN_KAMBIA") and a **Next** button. Next with nothing chosen shows "Please fill the mandatory field" and stays put. After Next the URL path does not change; the real page replaces the step.
- **Search page:**
  - Fields: Employee Name (`name="names"`), Username (`name="codes"`), Mobile Number (`name="phone"`), plus Search and Clear.
  - Filters: "By Role" dropdown and "Employment Status" (Active / Inactive), plus Apply Filters and Clear Filter.
  - Results table columns: Username | Name | No of Roles | Jurisdiction | Designation | Department.
  - "Create User" link to `/payments-ui/employee/hrms/create`.
- **Search behaviour:**
  - The page opens listing the 10 most recently changed users (`GET /egov-hrms/employees/_search?limit=10&sortBy=lastModifiedTime&sortOrder=DESC&offset=0`). An empty search returns the same list with no error.
  - Searching the test account's own username returns exactly 1 row, and its Username cell is a link (`span.link`).
  - An unknown username returns 0 users and shows "No Results Found".
- **Details page:** `/payments-ui/employee/hrms/details/<username>`, with sections Employee Details, Login Details, Personal Details, Jurisdiction Details and Assignment Details.
- **Take Action menu** (observed live 2026-11-16):
  - On another user it offers three actions: **Edit Employee**, **Deactivate Employee**, **Edit Campaign Assignment**.
  - On the logged-in account itself it offers only two (no Deactivate).
  - The details page only works when reached from the search result; opening its URL directly shows no Take Action.
- **Edit Employee** opens `/payments-ui/employee/hrms/edit/<username>`:
  - the user form, prefilled (no password fields);
  - roles shown as "N Selected";
  - Clear All and Submit buttons.
  - Its field ids embed the username (`hrms-edit-<username>-hr_*_label`), so select them by suffix: `[id$="-hr_emp_name_label"]`.
- **Edit Campaign Assignment** opens `/payments-ui/employee/hrms/update/assign-campaign/<username>`:
  - a "Search Campaign" form: Project type, Project name (`name`), Project number (`projectNumber`), Jurisdiction, Start date (`startDate`), End date (`endDate`);
  - Clear and Search buttons;
  - Assign and Unassign buttons on the results.
- **Create form sections:**
  - Login Details: Username *, Password *, Confirm Password *.
  - Personal Details: Name *, Mobile Number *, Gender * (Female / Male), Date of Birth *, Email, Correspondence Address.
  - Employee Details: Employment Type *, Date of Appointment *, Department *, Designation *, Roles *.
  - Jurisdiction: "Area 1*" with Country, plus "Add Jurisdiction".
  - **Submit is disabled until the form is valid.**
- **Create form options:**
  - Employment Type (3): Others, Temporary, Permanent.
  - Department (5): Other, MISAU, eGov, CHAI, NMCP.
  - Designation: 29 options.
  - Roles: 48 options plus "Select all" (multi-select).
  - Jurisdiction Country: Sierra Leone; choosing it adds the next level.
- **Field rules and messages:**
  - Password shorter than 8 characters: "Passwords should be 8-15 characters alphanumeric value. Special Characters Allowed: @,#,$,%".
  - Confirm Password mismatch: "Passwords doesn't match".
  - Name with digits: "Required" (misleading; see Findings).
  - Mobile with 8 or 10 digits: "Invalid Mobile number". Since 2026-11-20 the field takes exactly 9 digits, any first digit (it took 10 digits starting 6–9 before).
  - Email "not-an-email": "Please enter a valid email".
  - Date of Birth: `max` = today minus 18 years. Date of Appointment: `max` = today.
- The form does **not** rebuild itself after load (checked for 8 s), unlike Create complaint.
- **Safety:** every case except USR-10/11 aborts any request whose URL ends in `_create` or `_update`. Tests read only structure (headers, counts, labels). They never log or compare other people's names, numbers or usernames.

---

## Per-flow notes

### USR-01 — Open Search user from the workbench home card

**Page:** `workbench_ui_employee` → `payments_ui_employee_hrms_inbox` | **Path:** `/workbench-ui/employee` → `/payments-ui/employee/hrms/inbox`

Start logged in (saved session plus `restoreSavedSession()`). The scrape entry URL (`config.baseUrl`, `https://sierraleone-hcm.digit.org/workbench-ui/employee/campaign/campaign-home`) is for the crawler only. Tests start from `QA_UI_BASE_URL` = `https://sierraleone-hcm.digit.org/workbench-ui/employee`. Read-only.

| Step | Element ID | Label | Expected pathname | Assert kind |
|---|---|---|---|---|
| 1 | `animation_1dcbe0` | open `/workbench-ui/employee`, loader hidden | `/workbench-ui/employee` | url + hidden |
| 2 | `search_user_8a67fa` | Search user (User management card) | `/workbench-ui/employee` | visible, then click |
| 3 | — (contract gap: hierarchy dropdown) | Hierarchy type → "ADMIN_KAMBIA" | `/payments-ui/employee/hrms/inbox` | chosen |
| 4 | — (contract gap: Next button) | Next | `/payments-ui/employee/hrms/inbox` | click |
| 5 | — (contract gap: search fields, table) | Employee Name / Username / Mobile Number, results table | same | visible; 6 column headers |

**Selectors to use:**
- `search_user_8a67fa`: `page.getByRole('button', { name: 'Search user', exact: true })`
- Hierarchy dropdown (live): `page.locator('.digit-dropdown-select').first()`; option `page.locator('.digit-dropdown-item:visible').getByText('ADMIN_KAMBIA', { exact: true })`
- Next (live): `page.getByRole('button', { name: 'Next', exact: true })`
- Search fields (live): `input[name="names"]`, `input[name="codes"]`, `input[name="phone"]`
- Table (live): `page.locator('[role="table"]')`; headers `[role="columnheader"]`

**Edge cases:**
- The step and the search page share one URL, so assert the page by its fields, not by the URL.
- The workbench → payments-ui switch reloads a different app bundle, so the first load is slow.

### USR-02 — Hierarchy type step

**Page:** `payments_ui_employee_hrms_inbox` (the same step appears on `payments_ui_employee_hrms_create`) | **Path:** `/payments-ui/employee/hrms/inbox`

Start logged in, directly on the URL. Read-only.

| Step | Element ID | Label | Expected pathname | Assert kind |
|---|---|---|---|---|
| 1 | — (contract gap) | Next with nothing chosen | same | "Please fill the mandatory field" visible; step still shown |
| 2 | — (contract gap) | open the Hierarchy type list | same | exactly 1 option "ADMIN_KAMBIA" |

**Selectors to use:** as in USR-01. Error text (live): `page.getByText('Please fill the mandatory field', { exact: true })`.

**Edge cases:**
- The step appears on every visit; nothing remembers the last choice.

### USR-03 — Search by username

**Page:** `payments_ui_employee_hrms_inbox` | **Path:** `/payments-ui/employee/hrms/inbox`

Start logged in, past the hierarchy step. Read-only. Uses only the test account's own username (`QA_USERNAME`).

| Step | Element ID | Label | Expected pathname | Assert kind |
|---|---|---|---|---|
| 1 | — (contract gap) | Username = `QA_USERNAME`, Search | same | the search request has `codes`; 1 row; the row's username link equals `QA_USERNAME` |
| 2 | — (contract gap) | Username = "QA-TEST-NO-SUCH-USER-000", Search | same | 0 users; "No Results Found" |

**Selectors to use:**
- `input[name="codes"]`
- Search: `page.getByRole('button', { name: 'Search', exact: true })`
- Rows: `[role="table"] [role="rowgroup"] [role="row"]`
- Username link: `[role="table"] span.link`

**Edge cases:**
- Search by name (USR-03-H2) and by mobile (USR-03-H3) use the test account's own name and number. They are read at run time from the saved session (`Employee.user-info`) and are never logged or shown in step titles. A name search may also return other users with the same name, so only the presence of the own username is asserted.

### USR-04 — Default list, empty search, Clear and filters

**Page:** `payments_ui_employee_hrms_inbox` | **Path:** `/payments-ui/employee/hrms/inbox`

Start logged in, past the hierarchy step. Read-only. Assert only counts, headers and the request sent, never row contents.

| Step | Element ID | Label | Expected pathname | Assert kind |
|---|---|---|---|---|
| 1 | — | page opens | same | 10 rows or fewer; request `limit=10&offset=0&sortBy=lastModifiedTime` |
| 2 | — (contract gap) | Search with all fields empty | same | no error; list still shown |
| 3 | — (contract gap) | type in Username, then Clear | same | the field is empty again |
| 4 | — (contract gap) | Employment Status = Inactive, Apply Filters | same | the search request carries the status filter; rows ≤ 10 |
| 5 | — (contract gap) | Clear Filter | same | filter removed (radio unchecked) |

**Selectors to use:**
- Clear: `getByRole('button', { name: 'Clear', exact: true })`
- Apply Filters / Clear Filter: `getByRole('button', { name: 'Apply Filters' })` / `getByRole('button', { name: 'Clear Filter' })`
- Status radios (live): the `.digit-radio-btn` next to the text "Inactive" / "Active"
- By Role: the `.digit-dropdown-select` under "By Role"

**Edge cases:**
- The request parameter name for the status filter (e.g. `isActive`) is to be confirmed on the first run.

### USR-05 — Paging

**Page:** `payments_ui_employee_hrms_inbox` | **Path:** `/payments-ui/employee/hrms/inbox`

Start logged in, past the hierarchy step. Read-only.

| Step | Element ID | Label | Expected pathname | Assert kind |
|---|---|---|---|---|
| 1 | — (contract gap) | next-page button | same | enabled when there are more than 10 users |
| 2 | — (contract gap) | click next page | same | request with `offset=10`; rows shown |

**Selectors to use:** next page (live) `#pagination-next-page`, first page `#pagination-first-page`.

**Edge cases:**
- On the first capture all paging buttons were disabled, because the table had not loaded yet. Wait for rows before checking.

### USR-06 — User details page (read-only)

**Page:** user details (not in the contract) | **Path:** `/payments-ui/employee/hrms/details/<username>`

Start logged in; search the test account's own username, then click its username link.

| Step | Element ID | Label | Expected pathname | Assert kind |
|---|---|---|---|---|
| 1 | — (contract gap) | own username link | starts with `/payments-ui/employee/hrms/details/` | url |
| 2 | — (contract gap) | section headings | same | Employee Details, Login Details, Personal Details, Jurisdiction Details, Assignment Details |
| 3 | — (contract gap) | Take Action | same | menu shows "Edit Employee" and "Edit Campaign Assignment"; nothing is clicked |

**Edge cases:**
- Never assert or log the personal values on this page.

### USR-07 — Open Create user from the workbench home card

**Page:** `workbench_ui_employee` → `payments_ui_employee_hrms_create` | **Path:** `/workbench-ui/employee` → `/payments-ui/employee/hrms/create`

Same start as USR-01. Read-only.

| Step | Element ID | Label | Expected pathname | Assert kind |
|---|---|---|---|---|
| 1 | `create_user_980434` | Create user (User management card) | `/workbench-ui/employee` | visible, then click |
| 2 | — (contract gap) | Hierarchy type → ADMIN_KAMBIA, Next | `/payments-ui/employee/hrms/create` | form shown |
| 3 | — (contract gap) | "Create User" heading, Username field, Submit | same | visible; Submit disabled |

**Selectors to use:**
- `create_user_980434`: `page.getByRole('button', { name: 'Create user', exact: true })`
- Username (live): `#hrms-create-hr_emp_id_label`
- Submit (live): `getByRole('button', { name: 'Submit', exact: true })`

### USR-08 — Create user form: sections, required marks, options

**Page:** `payments_ui_employee_hrms_create` | **Path:** `/payments-ui/employee/hrms/create`

Start logged in, past the hierarchy step. Read-only.

| Step | Element ID | Label | Expected pathname | Assert kind |
|---|---|---|---|---|
| 1 | — (contract gap) | headings | same | Login Details, Personal Details, Employee Details visible |
| 2 | — (contract gap) | required labels | same | "*" on the 14 required fields listed in Key assertions; none on Email or Correspondence Address |
| 3 | — (contract gap) | Employment Type list | same | Others, Temporary, Permanent |
| 4 | — (contract gap) | Department list | same | Other, MISAU, eGov, CHAI, NMCP |
| 5 | — (contract gap) | Designation and Roles lists | same | 29 designations; 48 roles plus "Select all" |
| 6 | — (contract gap) | Gender | same | Female, Male |

**Selectors to use (live):**
- Employment Type: `#hrms-create-hr_employment_type_label`
- Department: `#hrms-create-hr_employment_department_label`
- Designation: `#hrms-create-hr_employment_designation_label` (open each with its `.digit-dropdown-select`; options are `.digit-dropdown-item`)
- Roles: the multi-select input `input.digit-cursorPointer` under "Roles"
- Gender: `#hrms-create-hr_gender_label` (two radios share this id: `nth(0)` Female, `nth(1)` Male)

**Edge cases:**
- Option counts may change when the team edits MDMS. Assert the Employment Type and Department lists exactly; assert counts only for Designation and Roles.
- Designation options contain spelling mistakes in the data ("Junior Enginer ( Horticulutre)", "Sainitary Supervisor", "Sainitary Inspector"). Report this to the team.
- **Add Jurisdiction (USR-08-H4):** it adds an "Area 2*" block with its own Country dropdown. Each area block has a red delete (trash) icon at its top right (observed live 2026-11-16). The exact icon selector is confirmed at `/playwright-gen`.

### USR-09 — Field rules and error messages

**Page:** `payments_ui_employee_hrms_create` | **Path:** `/payments-ui/employee/hrms/create`

Start logged in, past the hierarchy step. Synthetic values only. Submit stays disabled, and create requests are blocked.

| Step | Element ID | Label | Expected pathname | Assert kind |
|---|---|---|---|---|
| 1 | — | Password "abc" | same | "Passwords should be 8-15 characters alphanumeric value. Special Characters Allowed: @,#,$,%" |
| 2 | — | Confirm Password different from Password | same | "Passwords doesn't match" |
| 3 | — | Mobile "123" | same | "Invalid Mobile number" |
| 4 | — | Email "not-an-email" | same | "Please enter a valid email" |
| 5 | — | Date of Birth / Date of Appointment | same | `max` = today − 18 years / today |
| 6 | — | Submit | same | disabled |

**Selectors to use (live):**
- Password / Confirm Password: `#hrms-create-hr_emp_password_label` / `#hrms-create-hr_emp_confirm_password_label`
- Mobile: `#hrms-create-hr_mob_no_label`; Email: `#hrms-create-hr_email_label`
- Date of Birth: `#hrms-create-hr_birth_date_label`; Date of Appointment: `#hrms-create-hr_appointment_date_label`

**Edge cases:**
- A name with digits shows "Required" (a misleading message). Assert the message the app shows today, and report it.
- A username with a space showed no message. The username rule is `<TBD>`.

### USR-10 — Create a new user (needs approval)

**Page:** `payments_ui_employee_hrms_create` | **Path:** `/payments-ui/employee/hrms/create`

**Creates a real login account on the live Sierra Leone environment (approved 2026-11-16). Accounts cannot be deleted; the team deactivates test users later.**
- **Username:** `qatest` plus a run timestamp (letters and digits only, so the unknown username rule is not hit). It is recorded in the Allure report so the team can find the user.
- **Name:** "QA Test User". **Password:** generated at run time and never stored or logged.
- **Role:** named by the team later (test data `role`). Until it is set, the test stops at its first step, before anything is created.
- **Mobile:** synthetic, generated at run time: 9 digits (the form's rule since 2026-11-20), never starting with 0. See the 2026-11-18 decision below.

| Step | Element ID | Label | Expected pathname | Assert kind |
|---|---|---|---|---|
| 1 | — | fill every required field with synthetic QA-TEST data | same | Submit enabled |
| 2 | — | Submit | `<TBD>` | create request succeeds; success screen `<TBD>` |
| 3 | — | search the new username | `/payments-ui/employee/hrms/inbox` | 1 row |

**Duplicate username (USR-10-E1):**
- The form does not check for duplicates while you type: leaving the Username field shows no message and sends no request (observed live 2026-11-16).
- So the case fills a full valid form with the test account's own username (`QA_USERNAME`), submits it, and expects the create request to be rejected, with an error shown and the page unchanged.
- The server must refuse an existing username, so no user is created.
- It has the same prerequisites as H1 (role and mobile number).

### USR-11 — Edit a user (needs approval)

**Page:** user details → edit form | **Path:** `<TBD>`

Only on a test-created user, never on a real person or on the test login account itself (approved 2026-11-16). To stay independent, the case first creates its own test user with USR-10's steps, then edits it: Take Action → Edit Employee → change the Designation → Submit. The details page must then show the new designation. The edit form was not captured yet; record it on the first run. The same role and mobile prerequisites as USR-10 apply.

### USR-13 — Take Action on a searched user (three actions)

**Page:** user details → edit / deactivate / assign-campaign (not in the contract) | **Path:** `/payments-ui/employee/hrms/details/<username>` → `/hrms/edit/<username>`, `/hrms/update/assign-campaign/<username>`

**Read-only cases (H1, H2):**
- They run on the test login account's own record only: search `QA_USERNAME`, then click the username link.
- The forms are opened and checked, but never saved. Create and update requests are aborted.

**Cases that change data (H3–H5):**
- Each first creates its own test user (the USR-10 steps and prerequisites), then acts only on that user.

| Case | Action | What is checked |
|---|---|---|
| H1 | Edit Employee (own account, read-only) | edit page opens; Username field shows the own username; sections and Submit visible |
| H2 | Edit Campaign Assignment (own account, read-only) | "Search Campaign" page opens with its 6 fields; Assign and Unassign buttons visible |
| H3 | Take Action on a test-created user | menu shows all three actions |
| H4 | Deactivate Employee on a test-created user | deactivation saved; the Inactive filter finds the user |
| H5 | Edit Campaign Assignment on a test-created user | assign a team-named campaign, then unassign it; the user ends unchanged |

**Selectors to use (live):**
- Take Action: `getByRole('button', { name: 'Take Action' })`; menu items by exact text.
- Edit form fields: `[id$="-hr_emp_id_label"]`, `[id$="-hr_emp_name_label"]` and similar.
- Campaign search: `#name`, `#projectNumber`, `#startDate`, `#endDate`; buttons Search / Clear / Assign / Unassign by role and name.

**Edge cases:**
- The Edit Employee page heading says "Create User" (a misleading heading; see Findings).
- The deactivation form (reason, effective date, order number, etc.) was not opened yet. It is captured on the first run of H4.
- The edit (USR-11) and Edit Employee (H1) cases are distinct: H1 only opens the form; USR-11 saves a change.

### USR-12 — Logged-out visitor cannot open the user pages

**Page:** `payments_ui_employee_hrms_inbox`, `payments_ui_employee_hrms_create` | **Path:** as named

Start in a fresh context with no session.

| Step | Element ID | Label | Expected pathname | Assert kind |
|---|---|---|---|---|
| 1 | — | open `/payments-ui/employee/hrms/inbox` | away from it (expected `/payments-ui/employee/user/login`) | url (redirect) |
| 2 | — | open `/payments-ui/employee/hrms/create` | same as above | url (redirect) |

**Edge cases:**
- The contract marks both pages `is_protected: false` only because they are unexplored stubs. This flow proves whether they are protected. Only the redirect is asserted; the payments-ui login is never used.

---

## Warnings and needs confirmation

**Warnings**
- **Contract gaps:** `payments_ui_employee_hrms_inbox` and `payments_ui_employee_hrms_create` have 0 elements (`status: unexplored`), and the details page is missing. Every element here was captured live on 2026-11-16. Run a guided `/rescrape` of these pages later so they enter the contract.
- Two Gender radios share one id (`#hrms-create-hr_gender_label`), so use `nth(0)` / `nth(1)`.
- The search page and the hierarchy step share one URL, so assert pages by their fields.
- There is no API contract, so RBAC endpoint checks (e.g. `/egov-hrms/employees/_search` without a token) wait for `qa-kit api-scrape` and `/script-gen`.
- **Privacy:** the user list holds real staff names, usernames and mobile numbers. Tests must assert structure and counts only, and must never print row values.
- **Overlap:** none with login (AUTH-*) or complaints (CMP-*). USR-12 is the user-page counterpart of AUTH-05 and CMP-09.

**Findings to report (observed live 2026-11-16)**
1. (Resolved 2026-11-20: the user Mobile Number now takes exactly 9 digits and complaints take 9–11.) Original finding: the user Mobile Number accepted only 10 digits starting 6–9 (6000000000–9999999999), but the team rule for complaint mobile numbers was 11 digits. Evidence: the test account's own saved mobile number has 10 digits, so the complaint form rejects it when "Myself" fills it in (see complaints Finding 1).
2. A name containing digits shows "Required" instead of an "invalid name" message.
3. Designation options contain spelling mistakes ("Enginer", "Horticulutre", "Sainitary").
4. A username with a space shows no message (the rule is unknown).
5. The Edit Employee page shows the heading "Create User", which is misleading on an edit page.

**Findings to report (observed live 2026-11-18)**
6. **Paging:** `/egov-hrms/employees/_search` returns `TotalCount` equal to the page size (10 of 10; 20 at 20 rows), so Next never enables although more users exist (USR-05-H1).
7. **Clear Filter:** it unchecks the status radio, but later searches still send `isActive`, once as `{"code":false,"name":"HR_DEACTIVATE_HEAD"}` (USR-04-H5).
8. **Details page:** Assignment Details shows "No Results Found" for a user whose search record has a current assignment, so an edited designation never shows (USR-11-H1).
9. **Results table:** the Designation column shows the raw code (e.g. `DESIG_47`) instead of its name ("Superintendent").
10. **Data:** "PGR Administrator" appears twice in By Role. The deactivation reasons read "User not preset", "NOt Working", "ORDERBYCOMMISSIONER" (typos and an untranslated code).

**Behaviour confirmed live (2026-11-18), not defects**
- Create user: Submit first checks the mobile number (`_search?phone=`) and refuses any number another employee has ("Mobile number already exist!"). Then a "Ready to Submit ?" dialog opens; its Submit checks the username ("Username exists" for a duplicate, with no create request) and sends `POST /egov-hrms/employees/_create` (202 Accepted). The app then opens `/payments-ui/employee/hrms/response`.
- Edit Employee: the same "Ready to Submit ?" dialog; `POST /egov-hrms/employees/_update` (202).
- Assign: a "Campaign Assignment" popup ("Assigned from Date *", "Assigned till Date") sends `POST /project/staff/v1/_create` (202). Unassign sends `POST /project/staff/v1/_delete` (202) with no confirmation. Both saves are asynchronous.
- Deactivate Employee popup: Reason for Deactivation *, Order No., Effective Date (today), Supporting Documents, Remarks; button "Deactivate Employee".

**Answered (2026-11-16):** create test users (yes), edit only test-created users (yes).

**Answered (2026-11-18):**
- Role for test users: **Dashboard Viewer** (least privilege).
- Tests **may deactivate** the users they create (USR-13-H4).
- Campaign for USR-13-H5: **test_q2** (PJT-2026-11-06-1289037).
- Mobile numbers: one number cannot serve two employees, so each created user gets a **synthetic** 9-digit number generated at run time. The user accepted that DIGIT may text the account details to it.
- **One test user per run:** USR-10-H1 creates it; USR-11-H1, USR-13-H3, USR-13-H5 and USR-13-H4 (deactivation, last) act on it (`tests/e2e/user-management/USR-lifecycle.e2e.spec.ts`).
- Deactivation reason: **Others** (chosen at /playwright-gen as the most neutral option; change it in the test data if the team prefers another).

**Still open (team)**
1. ~~Which mobile rule is right for users~~ Answered 2026-11-20: 9 digits. Still open: the Create user form shows a "+91" prefix in its config (`componentInFront`), which is India's country code, not Sierra Leone's (+232).
2. The username rule (allowed characters, length).
3. Whether the user-creation SMS is switched off on this environment (synthetic numbers could belong to real people).
