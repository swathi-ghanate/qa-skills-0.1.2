# Test plan: complaints

<!-- generated from ui-contract.json v1.3.0 (scraped 2026-11-16) + live capture 2026-11-16 | app: HCM -->

## Module purpose
Verifies the **Create complaint** form of the DIGIT HCM Sierra Leone console: opening it from the workbench home (Complaints card → Create complaint), the Complaint Type list, the date limits, the 7-level boundary cascade, the "Myself / Another User" choice, mandatory-field validation and submitting a complete complaint. The page is `payments_ui_employee_pgr_create_complaint` (`/payments-ui/employee/pgr/create-complaint`, `is_protected: true`). The contract lacks some elements; these were captured live on 2026-11-16 without submitting anything (create requests were blocked).

**Team answers (2026-11-16):**
- Tests may create real complaints, of any complaint type. Closing them is handled later.
- File upload is not tested.
- Only Country is mandatory in Boundary Details; the user may stop at any lower level.
- A valid mobile number has 9 to 11 digits (form config, checked live 2026-11-20; it was 11 digits on 2026-11-16).
- Submit tests use "Another User", because the test account's own name and number (filled in by "Myself") fail the form's checks.

Out of scope for now:
- Search complaint.
- Complaint File upload (team decision).
- The complaints inbox (`inbox-v2`), blocked by the backend defect "no such index [pgr-services]".
- The complaint workflow after creation (assign or resolve).
- Any login other than the workbench login.

---

## Actors
| Actor | Description |
|---|---|
| Employee (test account) | Logged in through the workbench login (the saved session from `global-setup.ts`). Sees the Complaints card on the workbench home. When "Myself" is chosen, the form fills in this account's own name and mobile number. Exact roles `<TBD>`. |
| Anonymous visitor | No session. Must not be able to open the form (`is_protected: true`). |

---

## Flows to test
| Flow ID | Description | Priority |
|---|---|---|
| CMP-01 | Open Create complaint from the workbench home Complaints card | P0 |
| CMP-02 | Complaint Type list shows the configured complaint types and keeps the chosen one | P1 |
| CMP-03 | Date of complaint accepts today and blocks future dates | P1 |
| CMP-04 | Boundary details cascade from Country down to Community | P1 |
| CMP-05 | "Myself" fills and locks the complainant's name and number; "Another User" clears them | P1 |
| CMP-06 | Mandatory-field and format checks stop an incomplete complaint | P1 |
| CMP-07 | *Retired 2026-11-16: file upload is not tested (team decision). Do not reuse this ID.* | — |
| CMP-08 | Submit a complete complaint for another user and get a complaint number (creates a real complaint; approved 2026-11-16) | P0 |
| CMP-09 | A logged-out visitor cannot open Create complaint | P0 |
| CMP-10 | Breadcrumb "Home" leaves the form | P2 |

---

## Key assertions
- **Entry:** the workbench home card "Complaints" ("Manage Complaints", "Search complaint", "Create complaint") holds `create_complaint_17f516`. It opens `/payments-ui/employee/pgr/create-complaint`, a full load of the separate payments-ui app. Allow 60 s and wait for the loader `animation_1dcbe0` to be hidden.
- **Sections:** the form has five sections: Complaint Details, Boundary Details, Complainant Details, Additional Details and Complaint Location. The Submit button `submit_b6846a` sits in a sticky bar at the bottom.
- **Required fields:** the UI shows "*" on Complaint Type, Date of complaint, Country, "Are you raising a complaint for yourself or another user?", Complainant Contact Number and Complaint description. Complainant Name is checked on submit. The contract form lists every field as `required: false`, which under-reports them.
- **Complaint Type:** the list has 6 options (from MDMS `RAINMAKER-PGR.ServiceDefs`): "Other: Dept-Other", "Performance Issue: Dept-eGov", "Security Issue: Dept-eGov", "Data Issue: Dept-eGov", "User Account Issue: Dept-eGov", "Technical Issue: Dept-eGov". It opens only from the arrow icon; clicking the input or its wrapper does nothing.
- **Date of complaint:** `complaintdate_8ac55d` (`type="date"`) has `max` = today and no `min`.
- **Boundary cascade:** each level appears only after its parent is chosen: Country → Province → District → Chiefdom → PHU → Distribution Point → Community.
- **Complainant choice:** "Myself" fills and locks Complainant Name and Contact Number; "Another User" empties them and makes them editable.
- **Empty submit:** shows "Required", "Complainant's name is Invalid" and "Please provide a valid Mobile Number" under the fields, and the alert "Please enter all mandatory fields". The URL is unchanged and no POST request is sent.
- **Form rebuild (observed live 2026-11-16):** the form rebuilds itself once, between about 0.2 s and 4 s after Submit appears, and clears anything already entered. There is no reload and no single API response that triggers it. Before filling, mark the `<form>` element and wait until it has been replaced (at most 15 s). Before clicking Submit, check that every value is still there.
- **Mandatory rules (team + live 2026-11-16):** Country is the only mandatory boundary level; a complaint with Country only passes the form's checks. A mobile number with 11 digits is accepted; 10 or 12 digits shows "Please provide a valid Mobile Number". **Changed 2026-11-20:** 9, 10 and 11 digits are accepted (MDMS pattern `^[0-9]{9,11}$`); 8 and 12 digits are rejected.
- **Create request:** `POST /pgr-services/v2/request/_create` (observed live, blocked) with a `service` and `workflow` payload.
- **Safety:** only CMP-08 may create complaints (approved 2026-11-16). Every other case aborts any request whose URL ends in `_create`. Every negative case also leaves another mandatory field empty and asserts that no create request is sent.
- **Session:** the payments-ui pages work from the saved localStorage session alone. The workbench home (CMP-01 start) also needs the DIGIT sessionStorage, restored by `restoreSavedSession()` in `tests/helpers/app.ts`.

---

## Per-flow notes

### CMP-01 — Open Create complaint from the workbench home Complaints card

**Page:** `workbench_ui_employee` → `payments_ui_employee_pgr_create_complaint` | **Path:** `/workbench-ui/employee` → `/payments-ui/employee/pgr/create-complaint`

Start logged in (saved session plus `restoreSavedSession()`). The scrape entry URL (`config.baseUrl`, `https://sierraleone-hcm.digit.org/workbench-ui/employee/campaign/campaign-home`) is for the crawler only. Tests start from `QA_UI_BASE_URL` = `https://sierraleone-hcm.digit.org/workbench-ui/employee`. Read-only; nothing is submitted.

| Step | Element ID | Label | Expected pathname | Assert kind |
|---|---|---|---|---|
| 1 | — | open `/workbench-ui/employee` | `/workbench-ui/employee` | url |
| 2 | `animation_1dcbe0` | animation (loader) | `/workbench-ui/employee` | hidden |
| 3 | `create_complaint_17f516` | Create complaint (Complaints card) | `/workbench-ui/employee` | visible, then click |
| 4 | `animation_1dcbe0` | animation (loader) | `/payments-ui/employee/pgr/create-complaint` | url + hidden |
| 5 | `submit_b6846a` | Submit | `/payments-ui/employee/pgr/create-complaint` | visible |
| 6 | — (contract gap: section headings) | Complaint Details / Boundary Details / Complainant Details / Additional Details / Complaint Location | same | visible text |
| 7 | `field_0_9988fc`, `complaintdate_8ac55d`, `description_9237c5`, `addressone_768768` | key fields of each section | same | visible |

**Selectors to use:**
- `create_complaint_17f516`: `page.getByRole('button', { name: 'Create complaint', exact: true })`. Do not confuse it with `search_complaint_c22151` (`page.getByRole('button', { name: 'Search complaint', exact: true })`) on the same card.
- `submit_b6846a`: `page.getByRole('button', { name: 'Submit', exact: true })`
- `field_0_9988fc`: `page.locator('#pgr-create-complaint-cs_complaint_details_complaint_type')`
- `complaintdate_8ac55d`: `page.locator('[name="ComplaintDate"]')`
- `description_9237c5`: `page.locator('#pgr-create-complaint-cs_complaint_details_additional_details_description')`
- `addressone_768768`: `page.locator('#pgr-create-complaint-cs_complaint_details_address_1_details')`

**Edge cases:**
- The workbench-ui → payments-ui switch reloads a different app bundle, so the first load is slow.
- The sticky Submit bar can cover "Complainant Name"; scroll fields into view before using them.

### CMP-02 — Complaint Type list

**Page:** `payments_ui_employee_pgr_create_complaint` | **Path:** `/payments-ui/employee/pgr/create-complaint`

Start logged in, directly on the form. Read-only.

| Step | Element ID | Label | Expected pathname | Assert kind |
|---|---|---|---|---|
| 1 | — | open `/payments-ui/employee/pgr/create-complaint` | `/payments-ui/employee/pgr/create-complaint` | url |
| 2 | `animation_1dcbe0` | loader | same | hidden |
| 3 | — (contract gap: Complaint Type arrow icon) | arrow next to `field_0_9988fc` | same | click; options card visible |
| 4 | — (contract gap: options card) | 6 options (see Key assertions) | same | count = 6, texts |
| 5 | — (contract gap: option) | "Data Issue: Dept-eGov" | same | click |
| 6 | `field_0_9988fc` | Complaint Type | same | shows the chosen type |

**Selectors to use:**
- `field_0_9988fc`: `page.locator('#pgr-create-complaint-cs_complaint_details_complaint_type')`
- Arrow (live): `page.locator('.digit-dropdown-select', { has: page.locator('#pgr-create-complaint-cs_complaint_details_complaint_type') }).locator('svg')`
- Options card (live): `page.locator('.digit-dropdown-options-card')`. Pick an option with `.getByText('<option text>', { exact: true })`.

**Edge cases:**
- The UI labels differ from the MDMS names ("Security Issue" vs `Security Issues`). Assert the UI labels.
- How the chosen value is displayed in the input is to be confirmed at `/playwright-gen`.

### CMP-03 — Date of complaint

**Page:** `payments_ui_employee_pgr_create_complaint` | **Path:** `/payments-ui/employee/pgr/create-complaint`

Start logged in, directly on the form. Read-only. Compute "today" and "tomorrow" at run time; never hard-code dates.

| Step | Element ID | Label | Expected pathname | Assert kind |
|---|---|---|---|---|
| 1 | `complaintdate_8ac55d` | Date of complaint (native date input) | same | attribute `max` = today |
| 2 | `complaintdate_8ac55d` | fill today | same | value = today; `select_date_f857ea` shows it |
| 3 | `complaintdate_8ac55d` | fill tomorrow | same | not accepted (validity `rangeOverflow`, or the value is rejected) |

**Selectors to use:**
- `complaintdate_8ac55d`: `page.locator('[name="ComplaintDate"]')`
- `select_date_f857ea`: `page.getByRole('textbox', { name: 'Select date', exact: true })`. This read-only display box shows the picked date (format `<TBD>`).

**Edge cases:**
- What the app shows for a future date typed in is `<TBD>`. Assert the input's validity, not a message.

### CMP-04 — Boundary details cascade

**Page:** `payments_ui_employee_pgr_create_complaint` | **Path:** `/payments-ui/employee/pgr/create-complaint`

Start logged in, directly on the form. Read-only. The path observed live is Sierra Leone → North West → Kambia → Bramaia Chiefdom → Gbolon → Fatmalaia → Baimbaya.

| Step | Element ID | Label | Expected pathname | Assert kind |
|---|---|---|---|---|
| 1 | `field_3_f0ae98` (**broken selector**, use the live one) | Country * → "Sierra Leone" (only option) | same | chosen; Province appears |
| 2 | — (contract gap) | Province → "North West" (3 options: North West, Province1, Province2) | same | District appears |
| 3 | — (contract gap) | District → "Kambia" (1 option) | same | Chiefdom appears |
| 4 | — (contract gap) | Chiefdom → "Bramaia Chiefdom" (9 options) | same | PHU appears |
| 5 | — (contract gap) | PHU → "Gbolon" (4 options) | same | Distribution Point appears |
| 6 | — (contract gap) | Distribution Point → "Fatmalaia" (3 options) | same | Community appears |
| 7 | — (contract gap) | Community → "Baimbaya" (6 options) | same | all 7 values shown |

**Selectors to use:**
- Each level (live): the `.digit-dropdown-select` wrapper in the field labelled with the level name (Country, Province, District, Chiefdom, PHU, Distribution Point, Community). Options are `.digit-dropdown-item`. Confirm the exact wrapper-by-label locator at `/playwright-gen`. `field_3_f0ae98` (`page.getByRole('textbox', { name: 'field_3', exact: true })`) matches 0 elements.

**Edge cases:**
- Changing Province after choosing lower levels should reset District and below. This is an `[IMP]` assumption, to be confirmed.
- Only Country is mandatory; the user may stop at any lower level (team, confirmed live 2026-11-16). CMP-06-E6 checks that a missing Country blocks submit.
- "Province1" and "Province2" look like test data in this environment.

### CMP-05 — Myself / Another User

**Page:** `payments_ui_employee_pgr_create_complaint` | **Path:** `/payments-ui/employee/pgr/create-complaint`

Start logged in, directly on the form. Read-only. Never log or assert the prefilled values themselves (they are the test account's personal data); assert only filled or empty, and read-only or editable.

| Step | Element ID | Label | Expected pathname | Assert kind |
|---|---|---|---|---|
| 1 | `field_4_cba6ab` | Myself (radio) | same | checked |
| 2 | `complainantname_fc3612`, `complainantcontactnumber_869a24` | Complainant Name / Contact Number | same | filled + read-only |
| 3 | `field_5_cba6ab` | Another User (radio) | same | checked |
| 4 | `complainantname_fc3612`, `complainantcontactnumber_869a24` | Complainant Name / Contact Number | same | empty + editable |

**Selectors to use:**
- `field_4_cba6ab`: `page.locator('#pgr-create-complaint-es_createcomplaint_for').nth(0)`. Both radios share one id (match_count 2), so use the index. `nth(0)` = Myself and `nth(1)` = Another User, as observed live.
- `field_5_cba6ab`: `page.locator('#pgr-create-complaint-es_createcomplaint_for').nth(1)`
- `complainantname_fc3612`: `page.locator('#pgr-create-complaint-complaints_complainant_name')`
- `complainantcontactnumber_869a24`: `page.locator('#pgr-create-complaint-complaints_complainant_contact_number')`

**Edge cases:**
- Click the radio input. Clicking the label text "Myself" did not select it in one live run.
- **Finding (team, confirmed live 2026-11-16):** the test account's own name and number, filled in by "Myself", fail the form's checks ("Complainant's name is Invalid", "Please provide a valid Mobile Number"). So a complaint cannot be raised for yourself with this account, and submit tests use "Another User". Report this to the dev team.
- Before either option is chosen, both fields are empty and editable.

### CMP-06 — Mandatory-field and format checks

**Page:** `payments_ui_employee_pgr_create_complaint` | **Path:** `/payments-ui/employee/pgr/create-complaint`

Start logged in, directly on the form. As a safety net, every case leaves Complaint description empty (unless the case is about the description), so no complaint can be created. Every case also asserts that no create request is sent.

| Step | Element ID | Label | Expected pathname | Assert kind |
|---|---|---|---|---|
| 1 | `submit_b6846a` | Submit on the empty form | `/payments-ui/employee/pgr/create-complaint` | url unchanged |
| 2 | — (contract gap: field errors) | "Required", "Complainant's name is Invalid", "Please provide a valid Mobile Number" | same | visible text |
| 3 | — (contract gap: alert) | "Please enter all mandatory fields" | same | alert visible |
| 4 | — | network | same | no create request sent |

**Selectors to use:**
- `submit_b6846a`: `page.getByRole('button', { name: 'Submit', exact: true })`
- Alert (live): `page.getByRole('alert')` containing "Please enter all mandatory fields"
- Field errors (live): `page.getByText('Required')`, `page.getByText("Complainant's name is Invalid")`, `page.getByText('Please provide a valid Mobile Number')`
- `complainantname_fc3612` and `complainantcontactnumber_869a24`: as in CMP-05. Choose Another User first so they are editable.

**Edge cases:**
- Mobile number: valid = 9 to 11 digits (since 2026-11-20). 8 digits (E2) and 12 digits (E5) show "Please provide a valid Mobile Number"; E6 uses a 9-digit number, which must be accepted.
- Each mandatory field missing on its own: description (E4) and Country (E6).
- Name with digits or special characters: "Complainant's name is Invalid". The name rule is `<TBD>`.

### CMP-07 — Retired

File upload is not tested (team decision, 2026-11-16). The ID is kept so it is never reused.

### CMP-08 — Submit a complete complaint for another user

**Page:** `payments_ui_employee_pgr_create_complaint` | **Path:** `/payments-ui/employee/pgr/create-complaint`

**Creates a real complaint on the live Sierra Leone environment (approved by the team on 2026-11-16).** Any complaint type is allowed; closing test complaints is handled later. The description starts with "QA-TEST" so these complaints are easy to find. Use "Another User", because "Myself" is blocked by the finding in CMP-05. The complainant mobile number comes from `.env` (`QA_COMPLAINANT_MOBILE`, 11 digits, a number the team owns) so that a stranger never receives the complaint SMS.

| Step | Element ID | Label | Expected pathname | Assert kind |
|---|---|---|---|---|
| 1 | — | open the form; wait for the loader and the one-time form rebuild | `/payments-ui/employee/pgr/create-complaint` | form replaced |
| 2 | — (contract gap: option) | Complaint Type → "Other: Dept-Other" (any type is allowed) | same | chosen |
| 3 | `complaintdate_8ac55d` | Date of complaint = today | same | display shows today |
| 4 | — (contract gap) | Country → "Sierra Leone" (H1); the full path down to Community (H2) | same | chosen |
| 5 | `field_5_cba6ab` | Another User | same | checked |
| 6 | `complainantname_fc3612`, `complainantcontactnumber_869a24` | "QA Test Complainant", `QA_COMPLAINANT_MOBILE` | same | values |
| 7 | `description_9237c5` | Complaint description = "QA-TEST …" | same | value |
| 8 | `submit_b6846a` | Submit | `<TBD: observed on the first run>` | `POST /pgr-services/v2/request/_create` returns 200 |
| 9 | — (not observed yet) | success screen with a complaint number | `<TBD>` | visible |

**Selectors to use:** as in CMP-02 to CMP-05.

**Edge cases:**
- The success screen (text and path) and the response status were never observed. Capture them on the first run, then make the assertions exact.
- The complaint will not appear in the inbox while the inbox defect ("no such index [pgr-services]") remains.
- These cases create one complaint per run, so the "smoke" tag means one new complaint on every smoke run. The team may choose to run CMP-08 only in regression.

### CMP-09 — Logged-out visitor cannot open Create complaint

**Page:** `payments_ui_employee_pgr_create_complaint` | **Path:** `/payments-ui/employee/pgr/create-complaint`

Start in a fresh browser context with no session (`storageState` empty).

| Step | Element ID | Label | Expected pathname | Assert kind |
|---|---|---|---|---|
| 1 | — | open `/payments-ui/employee/pgr/create-complaint` | `/payments-ui/employee/user/login` | url (redirect) |
| 2 | `field_0_9988fc` | Complaint Type | — | not present |

**Selectors to use:** `field_0_9988fc` as above.

**Edge cases:**
- The redirect target was observed on 2026-11-16 with an expired session; confirm it with an empty session. The test only asserts the redirect. It never logs in on the payments-ui login (workbench login only).
- An API-level RBAC check needs the API contract (not scraped yet).

### CMP-10 — Breadcrumb Home

**Page:** `payments_ui_employee_pgr_create_complaint` | **Path:** `/payments-ui/employee/pgr/create-complaint`

Start logged in, directly on the form. Read-only.

| Step | Element ID | Label | Expected pathname | Assert kind |
|---|---|---|---|---|
| 1 | `home_b6873d` | Home (breadcrumb) | `/payments-ui/employee` | url |

**Selectors to use:**
- `home_b6873d`: `page.locator('a[href="/payments-ui/employee"]')`

**Edge cases:**
- This goes to the payments-ui home, not the workbench home. The final landing page is `<TBD>`, because it may redirect.

---

## Warnings and needs confirmation

**Warnings**
- `field_3_f0ae98` (Country) has a broken selector that matches 0 elements. Use the live selector (CMP-04).
- `field_4_cba6ab` and `field_5_cba6ab` share one id (match_count 2), so use `.nth(0)` and `.nth(1)`.
- Duplicate records of the same inputs exist: `complainantname_f24ee8` (`[name=…]`) and `complainantname_fc3612` (`#id`), and likewise for the contact number, supervisor, address, landmark and postal code inputs. Use the form-field `#id` selectors.
- Contract gaps, captured live on 2026-11-16:
  - Complaint Type arrow, options card and options
  - Province to Community dropdowns and their options
  - section headings
  - field error texts and the "Please enter all mandatory fields" alert
  - the success screen (not observed)

  Add these with a guided `/rescrape` later.
- The contract form marks every field `required: false`, which under-reports the "*" fields.
- There is no API contract (`contract/api-contract.json`), so RBAC endpoints are `<TBD>`. Run `qa-kit api-scrape` before `/script-gen`.
- **Session dependency:** CMP-01 starts on the workbench home, which needs the DIGIT sessionStorage. `restoreSavedSession()` rebuilds it from the saved localStorage session (token + `Employee.user-info`), so it needs no extra file and works with the plain qa-kit `global-setup.ts` (verified live 2026-11-16).
- **Shared account:** every login of the test account shares one token, so logging out in a browser ends the test session too (seen twice on 2026-11-16). Refresh it with `QA_REFRESH_AUTH=1`.
- **Overlap:** AUTH-07-H1 opens this page by direct URL to test the session. CMP-01 tests the home-card navigation and the form, so they are not duplicates and no `/overlap-check` is needed.

**Findings to report (observed live 2026-11-16)**
1. "Myself" fills in the test account's own name and number, and the form then rejects them as invalid. A complaint cannot be raised for yourself with this account. Likely cause, found during user management on 2026-11-16: the account's mobile number has 10 digits (the user form's rule), but the complaint form required 11. Since 2026-11-20 the complaint form accepts 9 to 11 digits, so this may be fixed: recheck.
2. The form rebuilds itself once, between about 0.2 s and 4 s after it appears, and clears anything already entered.
3. The Complaint Type list opens only from the arrow icon, not by clicking the field.
4. A missing Country blocks submit with the general alert only. Unlike every other mandatory field, there is no "Required" message under Country, so the user is not told which field is missing. Minor.
5. The inbox search fails with "no such index [pgr-services]" (see the login report).

**Answered by the team (2026-11-16)**
- Creating complaints is allowed, with any type; closing them is handled later.
- File upload is not tested.
- Only Country is mandatory.
- Valid mobile = 9 to 11 digits (since 2026-11-20).
- Submit tests use "Another User".

**Still open**
1. A mobile number (9 to 11 digits) the team owns for `QA_COMPLAINANT_MOBILE` in `.env`, so complaint SMS never go to a stranger.
2. The rule for a valid complainant name (letters only? minimum length?).
(Answered by the app: changing the Province clears District and Chiefdom; CMP-04-E1 passed on 2026-11-16.)
