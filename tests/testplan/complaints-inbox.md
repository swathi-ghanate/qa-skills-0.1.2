# Test plan: complaints-inbox

<!-- generated from ui-contract.json v1.3.0 (scraped 2026-11-20) + read-only live capture 2026-11-20 | app: HCM -->

## Module purpose
Verifies the PGR complaints inbox ("Search Complaints", `/payments-ui/employee/pgr/inbox-v2`) on the DIGIT HCM Sierra Leone console:
- opening the inbox;
- the three ways to search (Complaint Number, Mobile Number, Date Range) and Clear Search;
- the Filter panel (Assigned to me / others, Complaint Type, Country, Status) with Apply and Clear All;
- paging and rows per page;
- opening a complaint from the results;
- the Take Action menu (Assign, Reject, Resolve) on a QA-TEST complaint;
- the New Complaint and breadcrumb links;
- that a logged-out visitor cannot open the inbox.

**Sources:**
- **Contract:** the inbox page was scraped on 2026-11-20 (scoped, `--max-pages 8`).
- **Read-only live capture (2026-11-20):** the Search button, filter controls, table, complaint details page and Take Action pop-ups are not in the contract. They were captured live with every write request blocked; pop-ups were only opened and cancelled. Only labels, counts and request shapes were recorded, never other people's data.

**The inbox works again** (2026-11-20): `POST /inbox/v2/_search` returns 200 and AUTH-07-H2 passes. The 2026-11-16 defect ("no such index [pgr-services]") is fixed.

Out of scope for now:
- **Actually assigning, rejecting or resolving a complaint (INB-11).** It changes a real complaint and waits for team approval (see Warnings).
- Creating complaints: covered by the `complaints` plan (CMP-*).
- Complaint file upload: a team decision (as CMP-07).
- The complaint timeline ("View More") content.
- Any login other than the workbench login.

---

## Actors
| Actor | Description |
|---|---|
| Employee (test account) | Logged in through the workbench login (saved session `.auth/storage-state.json` + `restoreSavedSession()`). Sees the inbox and Take Action on complaints. Exact roles `<TBD>`. Acts only on QA-TEST complaints: those filed with the team-owned `QA_COMPLAINANT_MOBILE` (`.env`), e.g. PGR-2026-11-19-004529. |
| Anonymous visitor | No session. Must not be able to open the inbox or a complaint's details. |

---

## Flows to test
| Flow ID | Description | Priority |
|---|---|---|
| INB-01 | Open the inbox from the workbench home "Search complaint" card and see the search card, filter panel and results table | P0 |
| INB-02 | Search by Complaint Number finds exactly that complaint; an unknown number finds none | P0 |
| INB-03 | Search by Mobile Number lists only the complaints filed with that number | P1 |
| INB-04 | Search by Date Range (date picker) | P1 |
| INB-05 | Clear Search empties the search fields and brings back the default list | P1 |
| INB-06 | Filters: Assigned to me / Assigned to others, Complaint Type, Country, Status, then Apply | P1 |
| INB-07 | Clear All resets every filter and brings back the default list | P1 |
| INB-08 | Paging and rows per page | P2 |
| INB-09 | Open a complaint from the results; its details page shows the complaint and Take Action | P0 |
| INB-10 | Take Action shows Assign, Reject and Resolve; each pop-up shows its fields and closes with Cancel (read-only) | P1 |
| INB-11 | Assign, Reject or Resolve a QA-TEST complaint (changes data; **needs approval**, not generated yet) | P1 |
| INB-12 | New Complaint and breadcrumb links leave the inbox | P1 |
| INB-13 | A logged-out visitor cannot open the inbox or a complaint's details page | P0 |

---

## Key assertions
- **Entry:** the workbench home Complaints card holds `search_complaint_c22151` ("Search complaint"). It opens `/payments-ui/employee/pgr/inbox-v2`. That target is recorded on the payments-ui home's matching card (`search_complaint_bb5939-2`); confirm it for the workbench card on the first run. The page switches to the payments-ui app. Allow 90 s: the loader shows first and the table renders about 25 s after load.
- **Page layout** (live 2026-11-20):
  - heading "Search Complaints"; breadcrumb Home / PGR Inbox;
  - a "Complaints" card with the **New Complaint** link;
  - the search card: Complaint Number, Mobile Number, Date Range, then **Search** and **Clear Search**;
  - the Filter card: radios "Assigned to me" / "Assigned to others"; Complaint Type; Country; Status with one checkbox "Pending Assignment"; then **Apply** and **Clear All**.
- **Results table:** columns **Complaint Number | Boundary | Current Status | Current owner | Created Date** (5 column headers). The Complaint Number cell is a link to `/payments-ui/employee/pgr/complaint-details/<complaintNumber>`. Paging: "Rows per page" (default 10), a count "1-10 of N" (N = 18 on 2026-11-20), and First / Previous / Next / Last buttons.
- **Search request:** `POST /inbox/v2/_search` with body `inbox.processSearchCriteria = { businessService: ["PGR"], moduleName: "RAINMAKER-PGR", tenantId: "si" }`, `inbox.limit = 10`, `inbox.offset = 0`, and `inbox.moduleSearchCriteria`:
  - `{}` for the default list (the page sends it twice on load);
  - `{ complaintNumber }` for a Complaint Number search;
  - `{ mobileNumber }` for a Mobile Number search.
- **Search results:**
  - A known QA-TEST complaint number returns exactly 1 row, and its link text equals the number searched.
  - `QA_COMPLAINANT_MOBILE` returned exactly the 8 QA-TEST complaints on 2026-11-20 (PGR-2026-11-16-004506..09, PGR-2026-11-19-004526..29). The count grows with each CMP-08 run, so assert "at least 1 row, and the known QA-TEST number is among them".
- **Complaint Type options** (6): "Other: Dept-Other", "Performance Issue: Dept-eGov", "Security Issue: Dept-eGov", "Data Issue: Dept-eGov", "User Account Issue: Dept-eGov", "Technical Issue: Dept-eGov".
- **Details page** `/payments-ui/employee/pgr/complaint-details/<complaintNumber>`:
  - heading "Complaint Details"; breadcrumb Home / PGR Inbox;
  - labels (`.digit-viewcard-label`): Complaint Number, Complaint Type, Complaint Filed Date, Area, Current Status, Landmark Details, Complaint description, Complainant Name, Complainant Contact Number;
  - buttons **View More** and **Take Action**;
  - it loads `POST /pgr-services/v2/request/_search?tenantId=si&serviceRequestId=<n>`, `POST /egov-workflow-v2/egov-wf/process/_search?history=true&businessIds=<n>` and `POST /egov-workflow-v2/egov-wf/businessservice/_search?businessServices=PGR`.
- **Take Action** (a "Pending Assignment" complaint, live 2026-11-20): the menu has exactly 3 options, **Resolve, Assign, Reject**. Each opens the pop-up `.digit-popup-wrapper.pgr-workflow-popup` with **Cancel** and **Submit**:

| Option | Pop-up title | Fields |
|---|---|---|
| Assign | "Assign complaint" | **Assign to \*** (dropdown "Select Employee"; filled from `egov-hrms/employees/_search?roles=…`; 1 option on 2026-11-20), **Employee Comments \***, Complaint File |
| Reject | "Reject Complaint" | **Rejection Reason \*** (Resolved or Closed Issue, Non-actionable Issue, Insufficient or Missing Information, Duplicate Complaint, Invalid Complaint), **Employee Comments \***, Complaint File |
| Resolve | "Resolve Complaint" | **Employee Comments \***, Complaint File |

- **Logged out:** opening the inbox with no session redirects to the login page (the 2026-11-20 scrape saw the redirect: "marked protected").
- **Safety:**
  - Every case except INB-11 aborts any request whose URL ends in `_create` or `_update`; Take Action's Submit would send one (expected `POST /pgr-services/v2/request/_update`, not observed).
  - Tests assert only headers, counts, labels and request shapes, plus the numbers of QA-TEST complaints.
  - They never log or compare other people's complaint numbers, names, mobile numbers, areas or owners.

---

## Per-flow notes

### INB-01 — Open the inbox from the workbench home

**Page:** `workbench_ui_employee` → `payments_ui_employee_pgr_inbox_v2` | **Path:** `/workbench-ui/employee` → `/payments-ui/employee/pgr/inbox-v2`

Start logged in (saved session plus `restoreSavedSession()`). The scrape entry URL (`config.baseUrl`, `https://sierraleone-hcm.digit.org/workbench-ui/employee/campaign/campaign-home`) is for the crawler only. Tests start from `QA_UI_BASE_URL` = `https://sierraleone-hcm.digit.org/workbench-ui/employee`. Read-only.

| Step | Element ID | Label | Expected pathname | Assert kind |
|---|---|---|---|---|
| 1 | — (loader) | open `/workbench-ui/employee`, loader hidden | `/workbench-ui/employee` | url + hidden |
| 2 | `search_complaint_c22151` | Search complaint (Complaints card) | `/payments-ui/employee/pgr/inbox-v2` | click, url |
| 3 | `complaintnumber_7836f5` | Complaint Number | same | visible |
| 4 | `mobilenumber_c51cd9` | Mobile Number | same | visible |
| 5 | `field_2_2ab45f` | Date Range | same | visible (live selector, see below) |
| 6 | `apply_18d6c0` | Apply (Filter card) | same | visible |
| 7 | — (contract gap: results table) | table | same | 5 column headers in order; 1–10 data rows; "1-10 of N" |

**Selectors to use:**
- Loader: contract element `animation_1dcbe0`, `page.getByRole('button', { name: 'animation', exact: true })`. It is marked stale only because it is gone once the page loads; it is still the right thing to wait on (see Warnings).
- `search_complaint_c22151`: `page.getByRole('button', { name: 'Search complaint', exact: true })`
- `complaintnumber_7836f5`: `page.locator('[name="complaintNumber"]')`
- `mobilenumber_c51cd9`: `page.locator('[name="mobileNumber"]')`
- `field_2_2ab45f`: `page.getByRole('textbox', { name: 'field_2', exact: true })`. **Matches 0 live.** Use (live) `page.locator('input.digit-employee-select-wrap--elipses[readonly]')` (1 match).
- `apply_18d6c0`: `page.getByRole('button', { name: 'Apply', exact: true })`
- Search (live, not in the contract): `page.getByRole('button', { name: 'Search', exact: true })` (1 match)
- Table headers (live): `page.getByRole('columnheader')` (5); data rows: `[role="row"]` that contain cells; row links (live): `page.locator("a[href*='/pgr/complaint-details/']")` (10 on page 1)

**Edge cases:**
- AUTH-07-H2 already opens the inbox by URL and checks the Complaint Number field. This flow adds the entry from the home card and the full layout. Do not repeat AUTH-07-H2's session check.
- Wait for the first column header (up to 90 s) before counting rows. The table appears after two `_search` calls.

### INB-02 — Search by Complaint Number

**Page:** `payments_ui_employee_pgr_inbox_v2` | **Path:** `/payments-ui/employee/pgr/inbox-v2`

Start logged in, directly on the inbox URL, after the table has loaded. Read-only. The known QA-TEST complaint number comes from test data (e.g. PGR-2026-11-19-004529).

| Step | Element ID | Label | Expected pathname | Assert kind |
|---|---|---|---|---|
| 1 | `complaintnumber_7836f5` | Complaint Number = QA-TEST number | same | filled |
| 2 | — (contract gap: Search) | Search | same | request `moduleSearchCriteria.complaintNumber` = the number; exactly 1 row; its link text equals the number |
| 3 | `complaintnumber_7836f5` | Complaint Number = "PGR-2000-01-01-000000" (not real), Search | same | 0 rows; a no-results message (exact text to capture on the first run) |

**Selectors to use:**
- `complaintnumber_7836f5`: `page.locator('[name="complaintNumber"]')`
- Search (live): `page.getByRole('button', { name: 'Search', exact: true })`
- Row link (live): `page.locator("a[href*='/pgr/complaint-details/']").filter({ hasText: <number> })`

**Edge cases:**
- Do not use the 10 row-link elements in the contract (`pgr_2026_…`); they are tied to the complaints listed on 2026-11-20 (see Warnings).
- Partial numbers, lower case and spaces around the number: behaviour unknown. Add as E-cases only after the first run shows what the app does.

### INB-03 — Search by Mobile Number

**Page:** `payments_ui_employee_pgr_inbox_v2` | **Path:** `/payments-ui/employee/pgr/inbox-v2`

Start logged in on the inbox. Read-only. The number is `QA_COMPLAINANT_MOBILE` from `.env` (team-owned); it is never logged, so fill it with `fillPrivately()`.

| Step | Element ID | Label | Expected pathname | Assert kind |
|---|---|---|---|---|
| 1 | `mobilenumber_c51cd9` | Mobile Number = `QA_COMPLAINANT_MOBILE` | same | filled (value not shown in the report) |
| 2 | — (contract gap: Search) | Search | same | request has `moduleSearchCriteria.mobileNumber`; ≥ 1 row; the known QA-TEST number is among the rows |
| 3 | `mobilenumber_c51cd9` | Mobile Number = "123", Search | same | a validation message or 0 rows (to capture on the first run) |

**Selectors to use:**
- `mobilenumber_c51cd9`: `page.locator('[name="mobileNumber"]')`
- Search (live): as in INB-02.

**Edge cases:**
- Complainant mobile numbers have 9 to 11 digits (complaint form rule since 2026-11-20; it was 11). Whether this search field checks the format is unknown.

### INB-04 — Search by Date Range

**Page:** `payments_ui_employee_pgr_inbox_v2` | **Path:** `/payments-ui/employee/pgr/inbox-v2`

Start logged in on the inbox. Read-only.

| Step | Element ID | Label | Expected pathname | Assert kind |
|---|---|---|---|---|
| 1 | `field_2_2ab45f` | Date Range: open the date picker | same | a calendar opens |
| 2 | — | choose a range that includes 2026-11-19 | same | the field shows the range |
| 3 | — (contract gap: Search) | Search | same | the request carries the date range (field names to capture); the known QA-TEST number from 2026-11-19 is listed |

**Selectors to use:**
- `field_2_2ab45f`: `page.getByRole('textbox', { name: 'field_2', exact: true })`. **Matches 0 live.** Use (live) `page.locator('input.digit-employee-select-wrap--elipses[readonly]')`; its calendar icon is the following `svg.cursorPointer`.

**Edge cases:**
- The picker (react-date-range, `.rdrCalendarWrapper`) opens from the calendar icon after a click on the field; the field alone opens nothing. Dates are chosen with its month/year `<select>`s and day buttons (`button.rdrDay`). Corrected 2026-11-20: an earlier note here said the picker did not open; that was a probe error.

### INB-05 — Clear Search

**Page:** `payments_ui_employee_pgr_inbox_v2` | **Path:** `/payments-ui/employee/pgr/inbox-v2`

Start logged in on the inbox. Read-only.

| Step | Element ID | Label | Expected pathname | Assert kind |
|---|---|---|---|---|
| 1 | `complaintnumber_7836f5` | Complaint Number = QA-TEST number, Search | same | 1 row |
| 2 | `clear_search_c692f5` | Clear Search | same | Complaint Number and Mobile Number are empty; request `moduleSearchCriteria = {}`; the default list is back (more than 1 row when N > 1) |

**Selectors to use:**
- `clear_search_c692f5`: `page.getByRole('button', { name: 'Clear Search', exact: true })`
- `complaintnumber_7836f5`, `mobilenumber_c51cd9` as above.

**Edge cases:**
- Clear Search must not reset the Filter panel. Check one filter left checked (INB-06) stays checked.

### INB-06 — Filters

**Page:** `payments_ui_employee_pgr_inbox_v2` | **Path:** `/payments-ui/employee/pgr/inbox-v2`

Start logged in on the inbox. Read-only. Assert counts, checked state and the request only, never row contents.

| Step | Element ID | Label | Expected pathname | Assert kind |
|---|---|---|---|---|
| 1 | — (contract gap: radio) | Assigned to me, Apply | same | radio checked; the request carries an assignee filter (field name to capture); rows ≤ 10 |
| 2 | — (contract gap: radio) | Assigned to others, Apply | same | only one radio checked |
| 3 | — (contract gap: dropdown) | Complaint Type: open | same | exactly the 6 options listed in Key assertions |
| 4 | — (contract gap: dropdown) | Complaint Type = "Other: Dept-Other", Apply | same | the request carries the type; every row's link is still a complaint-details link |
| 5 | — (contract gap: checkbox) | Status "Pending Assignment", Apply | same | checkbox checked; the request carries the status |
| 6 | — (contract gap: dropdown) | Country: open | same | at least 1 option (a boundary dropdown: `.boundary-dropdown-container`, label `div.comment-label`) |
| 7 | `apply_18d6c0` | Apply with nothing chosen | same | no error; default list |

**Selectors to use:**
- `apply_18d6c0`: `page.getByRole('button', { name: 'Apply', exact: true })`
- Radios (live): selecting them by role and name finds 0, because the labels are not linked to the inputs. Click the `input.digit-radio-btn` inside the option whose text is "Assigned to me" / "Assigned to others", the same pattern as the user-management status radios.
- Complaint Type / Country (live): `.digit-dropdown-employee-select-wrap--elipses`, 1st / 2nd in the Filter card. Anchor each on its label ("Complaint Type", "Country"), not on position. Options: `.digit-dropdown-item`.
- Status checkbox (live): role and name find 0. Use the `input[type="checkbox"]` in the option whose text is "Pending Assignment".

**Edge cases:**
- The Status list shows only the statuses present in the data ("Pending Assignment" alone on 2026-11-20). Assert that it is present, not that it is the only one.
- The filter request field names are not observed yet. Record them on the first run (as USR-04 did).

### INB-07 — Clear All

**Page:** `payments_ui_employee_pgr_inbox_v2` | **Path:** `/payments-ui/employee/pgr/inbox-v2`

Start logged in on the inbox with filters set as in INB-06. Read-only.

| Step | Element ID | Label | Expected pathname | Assert kind |
|---|---|---|---|---|
| 1 | — | set Assigned to me, Complaint Type, Status; Apply | same | filters applied |
| 2 | `clear_all_d8e461` | Clear All | same | radios unchecked; dropdowns empty; checkbox unchecked; the next request carries no filter; the default list is back |

**Selectors to use:**
- `clear_all_d8e461`: `page.getByRole('button', { name: 'Clear All', exact: true })` (1 match live; `clear_all_d8e461-2` is the same button recorded twice)

**Edge cases:**
- In user management, Clear Filter unchecked the radio but kept sending the filter (defect USR-04-H5). Check the request here too, not just the controls.

### INB-08 — Paging and rows per page

**Page:** `payments_ui_employee_pgr_inbox_v2` | **Path:** `/payments-ui/employee/pgr/inbox-v2`

Start logged in on the inbox. Read-only. Needs more than 10 complaints in the list (18 on 2026-11-20); skip with a clear message if N ≤ 10.

| Step | Element ID | Label | Expected pathname | Assert kind |
|---|---|---|---|---|
| 1 | `first_page_b08b28`, `previous_page_131236` | page 1 | same | both disabled; count text "1-10 of N" |
| 2 | `next_page_4297e0` | Next Page | same | request `offset = 10`; count text "11-… of N"; First and Previous enabled |
| 3 | `previous_page_131236` | Previous Page | same | back to "1-10 of N" |
| 4 | `last_page_9cd9d1` | Last Page | same | Next and Last disabled |
| 5 | `rows_per_page_70af54` | Rows per page = 20 | same | request `limit = 20`; up to 20 rows |

**Selectors to use:**
- `first_page_b08b28`: `page.getByRole('button', { name: 'First Page', exact: true })` (also `#pagination-first-page`, live)
- `previous_page_131236`: `page.getByRole('button', { name: 'Previous Page', exact: true })`
- `next_page_4297e0`: `page.getByRole('button', { name: 'Next Page', exact: true })`
- `last_page_9cd9d1`: `page.getByRole('button', { name: 'Last Page', exact: true })`
- `rows_per_page_70af54`: `page.getByRole('button', { name: 'Rows per page', exact: true })`. **Matches 0 live** (it is a `<select>`). Use (live) `page.getByRole('combobox', { name: 'Rows per page' })` (1 match).

**Edge cases:**
- Wait for rows before checking the buttons. Before the table loads, every paging button is disabled (seen in user management).
- Rows-per-page options other than 10 are not captured yet; read them on the first run.

### INB-09 — Open a complaint from the results

**Page:** `payments_ui_employee_pgr_inbox_v2` → complaint details (contract has only empty stubs `payments_ui_employee_pgr_complaint_details_pgr_2…`) | **Path:** `/payments-ui/employee/pgr/inbox-v2` → `/payments-ui/employee/pgr/complaint-details/<complaintNumber>`

Start logged in on the inbox. Read-only. Open a QA-TEST complaint only: search it by number (INB-02), then click its row link after checking the link text equals the number searched.

| Step | Element ID | Label | Expected pathname | Assert kind |
|---|---|---|---|---|
| 1 | `complaintnumber_7836f5` | Complaint Number = QA-TEST number, Search | same | 1 row |
| 2 | — (contract gap: row link) | click the complaint number | `/payments-ui/employee/pgr/complaint-details/<number>` | url; heading "Complaint Details" |
| 3 | — (contract gap) | details labels | same | the 9 labels listed in Key assertions; the Complaint Number value equals the number |
| 4 | — (contract gap) | View More, Take Action | same | both visible |
| 5 | — (contract gap: breadcrumb) | PGR Inbox | `/payments-ui/employee/pgr/inbox-v2` | back on the inbox |

**Selectors to use (live):**
- Row link: `page.locator("a[href*='/pgr/complaint-details/']").filter({ hasText: <number> })`
- Labels: `.digit-viewcard-label`
- Take Action: `page.getByRole('button', { name: 'Take Action' })`; View More: `page.getByRole('button', { name: 'View More' })`
- Breadcrumb: `page.getByRole('link', { name: 'PGR Inbox' })` (href `/payments-ui/employee/pgr/inbox-v2`)

**Edge cases:**
- Opening a details URL directly (not from the results) is not checked yet. In user management, the details page only worked from a search click.
- Assert only the label set and our own complaint number. The complainant name and number on QA-TEST complaints are test data, but keep them out of logs anyway.

### INB-10 — Take Action menu and pop-ups (read-only)

**Page:** complaint details (not in the contract) | **Path:** `/payments-ui/employee/pgr/complaint-details/<complaintNumber>`

Start on a QA-TEST complaint in "Pending Assignment" (reach it as in INB-09). The guard aborts every `_update` request, and each pop-up is closed with Cancel. Submit is clicked only in the empty-form case, and that request is aborted.

| Case | Action | What is checked |
|---|---|---|
| H1 | Take Action | menu shows exactly Resolve, Assign, Reject |
| H2 | Assign | title "Assign complaint"; Assign to \* (dropdown "Select Employee", ≥ 1 option, names not logged); Employee Comments \*; Complaint File; Cancel closes it; no `_update` sent |
| H3 | Reject | title "Reject Complaint"; Rejection Reason \* has the 5 reasons; Employee Comments \*; Cancel closes it |
| H4 | Resolve | title "Resolve Complaint"; Employee Comments \*; Complaint File; Cancel closes it |
| E1 | Submit with empty required fields (any pop-up) | a required-field message, or Submit disabled; any `_update` request is aborted by the guard and recorded |

**Selectors to use (live):**
- Take Action: `page.getByRole('button', { name: 'Take Action' })`; options `.header-dropdown-option` with exact text "Resolve" / "Assign" / "Reject"
- Pop-up: `.digit-popup-wrapper.pgr-workflow-popup`; Cancel / Submit: `getByRole('button', { name: 'Cancel' })` / `{ name: 'Submit' }` inside the pop-up
- Employee Comments: `[name="SelectedComments"]` (id ends `-cs_common_employee_comments`; the id embeds the complaint number, so select by name or suffix)
- Rejection Reason: `[id$="-cs_reject_complaint"]`; options `.digit-dropdown-item`
- Assign to: the `.digit-dropdown-employee-select-wrap--elipses` with placeholder "Select Employee"
- Complaint File: `#upload-complaintFile` (not used: file upload is out of scope)

**Edge cases:**
- The options depend on the complaint's status; after a complaint is assigned, the menu will differ. Pick a QA-TEST complaint still in "Pending Assignment".
- The E1 behaviour is unknown. If the app really submits with empty fields, the guard keeps the complaint unchanged, and that is a finding.

### INB-11 — Assign, Reject or Resolve a QA-TEST complaint (needs approval)

**Page:** complaint details (not in the contract) | **Path:** `/payments-ui/employee/pgr/complaint-details/<complaintNumber>`

**Not generated until the team answers the questions in Warnings.** This changes a real complaint's workflow state. It would also close the 8 QA-TEST complaints still open from 2026-11-16 and 2026-11-19 (a pending cleanup).

| Case | Action | What is checked (planned) |
|---|---|---|
| H1 | Resolve a QA-TEST complaint with comment "QA-TEST automated resolve" | `_update` succeeds; Current Status changes (exact status text to capture); Take Action no longer offers Resolve |
| H2 | Reject a QA-TEST complaint, reason "Duplicate Complaint" | `_update` succeeds; Current Status changes |
| H3 | Assign a QA-TEST complaint | `_update` succeeds; Current owner changes (who to assign to: team to decide) |

**Edge cases:**
- Each case needs its own open QA-TEST complaint. Use those created by CMP-08 in the same run, never another person's complaint.

### INB-12 — New Complaint and breadcrumb links

**Page:** `payments_ui_employee_pgr_inbox_v2` | **Path:** `/payments-ui/employee/pgr/inbox-v2`

Start logged in on the inbox. Read-only.

| Step | Element ID | Label | Expected pathname | Assert kind |
|---|---|---|---|---|
| 1 | `new_complaint_bc0fc8` | New Complaint | `/payments-ui/employee/pgr/create-complaint` | url; `complaintdate_8ac55d` (Date of complaint) visible |
| 2 | `home_b6873d` | Home (breadcrumb), from the inbox | `/payments-ui/employee` | url |

**Selectors to use:**
- `new_complaint_bc0fc8`: `page.locator('a[href="/payments-ui/employee/pgr/create-complaint"]')` (`target_path` `/payments-ui/employee/pgr/create-complaint`)
- `home_b6873d`: `page.locator('a[href="/payments-ui/employee"]')`
- `complaintdate_8ac55d` (create complaint page): `page.locator('[name="ComplaintDate"]')`

**Edge cases:**
- The Create complaint form rebuilds itself 0.2–4 s after load (complaints plan). This flow only checks that the page opened; it never fills the form.
- CMP-10 covers the Home breadcrumb on Create complaint; this one is the inbox's own link.

### INB-13 — Logged-out visitor cannot open the inbox or a complaint

**Page:** `payments_ui_employee_pgr_inbox_v2`, complaint details | **Path:** as named

Start in a fresh browser context with no session (`storageState` empty).

| Step | Element ID | Label | Expected pathname | Assert kind |
|---|---|---|---|---|
| 1 | — | open `/payments-ui/employee/pgr/inbox-v2` | away from it (expected `/payments-ui/employee/user/login`) | url (redirect) |
| 2 | `complaintnumber_7836f5` | Complaint Number | — | not present |
| 3 | — | open `/payments-ui/employee/pgr/complaint-details/<QA-TEST number>` | away from it | url (redirect); no "Take Action" |

**Selectors to use:** `complaintnumber_7836f5`: `page.locator('[name="complaintNumber"]')`

**Edge cases:**
- Only the redirect is asserted; the payments-ui login is never used (workbench login only).
- The API side (`POST /inbox/v2/_search` without a token) is AUTH-07-RBAC-1. Its endpoint is now known, so update that case rather than adding a new one here.

---

## Warnings and needs confirmation

**Warnings**
- **Stale element skipped:** `animation_1dcbe0` (the loader) is marked stale (last seen 2026-11-20 07:21 UTC) because it is gone once the page loads. The plans still wait on it by its role selector, as all existing specs do (AUTH-07-H2 passed twice on 2026-11-20).
- **Broken contract selectors (0 matches live):**
  - `field_2_2ab45f` (Date Range) and `rows_per_page_70af54` (Rows per page): live replacements are given in INB-04 and INB-08.
  - A rescrape records them the same way, so fix them in the contract by hand (selector audit, 2026-11-20).
- **Contract gaps:**
  - On the inbox: the Search button, the filter radios / dropdowns / checkbox and the results table were captured live only.
  - The complaint details page exists only as 10 empty stubs, and the Take Action pop-ups are not in the contract.
  - The scraper must not crawl the details page: its click-through could press Assign / Reject / Resolve on a real complaint. Add these elements to the contract by hand from the 2026-11-20 capture. Any rescrape: `qa-kit scrape --max-pages 8` only.
- **Data-dependent elements:** the contract holds 10 row links (`pgr_2026_…`) and 10 stub pages named after real complaints listed on 2026-11-20. Never use them in tests; use the general row link filtered by a QA-TEST number.
- **XPath fallbacks:** all 25 inbox elements share one identical XPath, which points to the same single `div`. Never fall back to XPath on this page.
- **API contract:** `contract/api-contract.json` has only 2 logged-out lookups, because `qa-kit api-scrape` could not log in. The request shapes in this plan come from the read-only live capture.
- **Privacy:** the inbox lists real people's complaints (Boundary, Current owner, and complainant details behind each link). Tests act only on QA-TEST complaints (team-owned `QA_COMPLAINANT_MOBILE`). They assert structure, counts and our own numbers, and never print row values. Fill the mobile number with `fillPrivately()`.
- **Overlap** (run `/overlap-check complaints-inbox`):
  - AUTH-07-H2 opens the inbox (INB-01 extends it).
  - AUTH-07-RBAC-1 is the inbox search API check (INB-13 defers to it).
  - CMP-08 creates the QA-TEST complaints that INB-02/03/09/10 rely on.
  - CMP-09 / AUTH-05 are the logged-out checks for other pages.

**Findings (observed live 2026-11-20; corrected after the first test run the same day)**
1. ~~Date Range: no date picker opens.~~ **Withdrawn:** the picker works. It opens from the calendar icon after a click on the field; the earlier probes looked for the wrong class names. Minor usability note: clicking the field alone opens nothing.
2. ~~Country filter: no options.~~ **Withdrawn:** Country lists its options (INB-06-H6 passes). The empty list was caused by finding 4.
3. **Accessibility:** the "Assigned to me / Assigned to others" radios and the "Pending Assignment" checkbox have no accessible names (role + name finds 0; the checkbox label's `for` points to an id that does not exist). "Rows per page" is a `<select>` that the scraper recorded as a button.
4. **Filter card re-mounts once:** about 1 s after the first interaction with the Filter card, the whole card re-mounts.
   - A dropdown that was just opened closes by itself.
   - A Status box that was just ticked clears itself (although Apply had already sent `moduleSearchCriteria.status`).
   - Before the re-mount, the Country label shows the raw key `ADMIN_KAMBIA_COUNTRY`.
   - The tests wait for the re-mount (`settleFilterCard`) before using a filter.
5. **Take Action pop-ups give no feedback:** Submit stays enabled with an empty required field (Employee Comments, Rejection Reason). Clicking it does nothing: no message, no save request, and the pop-up stays open (INB-10-E1/E2 fail on this).
6. **Complaint Type labels vary between visits:** the same six types show either as "Other: Dept-Other", "Performance Issue: Dept-eGov"… or translated as "Other", "Performance Issues"…, depending on when the label translations load. The tests accept both and record which one appeared (INB-06-H3).

**Needs confirmation (team)**
1. **INB-11:** may tests Resolve, Reject or Assign QA-TEST complaints? If yes: which action closes them, which comment text, and who is assigned in Assign (the list shows real staff)?
2. **Clean-up:** should the 8 open QA-TEST complaints (PGR-2026-11-16-004506..09, PGR-2026-11-19-004526..29) be closed by INB-11, or by hand?
3. **Mobile search:** is a format check expected on the Mobile Number search field (9 to 11 digits like the complaint form)?
4. **Status filter:** is it meant to list every PGR status, or only those present in the data?
5. **Test account roles:** which roles does the test account have? (Take Action options may depend on them.)

**Requirement coverage**

| Req tag | Requirement | Happy path | Negative / edge | Gap |
|---|---|---|---|---|
| [REQ-1] | Search by Complaint Number | INB-02 step 2 | INB-02 step 3 (unknown number) | no-results text to capture |
| [REQ-2] | Search by Mobile Number | INB-03 step 2 | INB-03 step 3 (bad format) | expected behaviour unknown |
| [REQ-3] | Search by Date Range | INB-04-H1 | INB-04-E1 (range with no complaints) | — |
| [REQ-4] | Filters | INB-06 | INB-06-E1 (Apply empty) | filter card re-mount (Finding 4) handled in the tests |
| [REQ-5] | Clear All and Clear Search | INB-05, INB-07 | INB-05 edge (filters kept), INB-07 (request still filtered) | — |
| [REQ-6] | Open a complaint | INB-09 | INB-13 step 3 (logged out) | direct-URL open not checked |
| [REQ-7] | New Complaint link | INB-12 | — | — |
| [REQ-8] | Paging | INB-08 | INB-08 steps 1, 4 (disabled ends) | needs N > 10 |
| [REQ-9] | Take Action with three options | INB-10 H1–H4 | INB-10 E1 | real actions wait for approval (INB-11) |
| [IMP-1] | Inbox and details need a login | INB-13 | AUTH-07-RBAC-1 (API) | — |
| [IMP-2] | Entry from the workbench home | INB-01 | — | target path to confirm |
| [IMP-3] | Tests touch only QA-TEST complaints | all (guard + test data) | INB-10 E1 (guard) | — |
| [IMP-4] | Breadcrumb navigation | INB-09 step 5, INB-12 step 2 | — | — |

[REQ] = asked for by the user (2026-11-20: rescrape and testplan-gen requests). [IMP] = implied by the contract or by safety; please confirm.
