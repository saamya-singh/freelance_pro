# FreelancePro --- Pages JavaScript Documentation

## Purpose

The `js/pages/` directory contains page controllers. Each module owns
the behavior of one HTML page and connects:

-   page DOM
-   user interactions
-   core state/storage
-   reusable components
-   navigation

The page layer should orchestrate the application rather than contain
reusable infrastructure or tax-law primitives.

## Page map

  --------------------------------------------------------------------------
  File                    Page                    Main responsibility
  ----------------------- ----------------------- --------------------------
  `landing.js`            Landing                 Landing-page
                                                  animation/interactions

  `login.js`              Login                   Authentication form

  `signup.js`             Signup                  User registration

  `dashboard.js`          Dashboard               Financial overview and
                                                  saved tax summary

  `clients.js`            Clients                 Client
                                                  list/search/filter/modal
                                                  CRUD

  `client-detail.js`      Client detail           Individual client
                                                  information

  `invoices.js`           Invoices                Invoice list, metrics,
                                                  creation/editing and
                                                  payment state

  `invoice-detail.js`     Invoice detail          Individual invoice
                                                  display/printing

  `work.js`               Work entries            Work-entry management and
                                                  invoice creation links

  `tax.js`                Tax Calculator          Tax inputs, calculation
                                                  display and saving

  `tax-settings.js`       Tax Settings            Tax configuration UI

  `settings.js`           Settings                User/application settings
  --------------------------------------------------------------------------

------------------------------------------------------------------------

## `landing.js`

### Responsibility

Controls landing-page behavior and animated counters.

### Key function

`animateCounter(element, start, end, prefix)`

Animates numerical values with `requestAnimationFrame`.

### Keep here

Landing-page-only visual interactions.

------------------------------------------------------------------------

## `login.js`

### Responsibility

Handles the login form.

### Main flow

``` text
Submit login form
  → validate credentials
  → Auth login/session
  → redirect to dashboard
```

Authentication logic itself belongs in `core/auth.js`.

------------------------------------------------------------------------

## `signup.js`

### Responsibility

Handles user registration.

### Main flow

``` text
Signup form
  → client-side validation
  → create user through Auth
  → initialize user data
  → redirect
```

Password/session implementation should remain in `core/auth.js`.

------------------------------------------------------------------------

## `dashboard.js`

### Responsibility

Builds the main financial dashboard.

### Key functions

-   `renderDashboard()`
-   `renderRecentInvoices(invoices)`
-   `renderRecentActivities(activities)`

### Data sources

Dashboard data comes from application state/storage rather than being
independently maintained.

### Tax integration

The dashboard reads the saved tax calculation and displays:

-   tax liability
-   net take-home
-   related financial summary

It also listens for the browser `storage` event so another tab saving a
tax calculation can cause the dashboard to refresh.

### Recommended flow

``` text
Tax Calculator
  → save calculation
  → user-scoped storage
  → storage event
  → Dashboard refresh
```

------------------------------------------------------------------------

## `clients.js`

### Responsibility

Client list and client CRUD UI.

### Key functions

-   `setupEventListeners()`
-   `renderClientsPage()`
-   `renderClientsTable(searchQuery, filter)`
-   `openClientModal(client)`
-   `editClient(id)`

### Features

-   Search.
-   Status filtering.
-   Client table rendering.
-   Create/edit modal.
-   Navigation to client detail.

Business data should be persisted through the core state/storage layer.

------------------------------------------------------------------------

## `client-detail.js`

### Responsibility

Displays one client selected by URL query parameter.

### Main flow

``` text
?id=<clientId>
  → locate client
  → render client details
  → render related information
```

------------------------------------------------------------------------

## `invoices.js`

### Responsibility

Complete invoice management UI.

### Key functions

-   `setupInvoiceEventListeners()`
-   `renderInvoicesPage()`
-   `updateInvoiceMetrics()`
-   `renderInvoicesTable(searchQuery, filter)`
-   `openInvoiceModal(invoice)`
-   `renderLineItems(items)`
-   `recalculateTotals(items)`
-   `markInvoicePaid(id)`

### Invoice flow

``` text
Invoice form
  → line items
  → subtotal
  → tax/discount logic
  → total
  → save invoice
  → render list
```

The page owns the form experience; reusable table/modal mechanics belong
to components.

------------------------------------------------------------------------

## `invoice-detail.js`

### Responsibility

Displays a single invoice.

### Features

-   Reads invoice ID from the URL.
-   Loads the invoice.
-   Renders invoice details.
-   Provides printing behavior through `window.print()`.

------------------------------------------------------------------------

## `work.js`

### Responsibility

Manages work entries/time records.

### Main concerns

-   Work-entry creation/editing.
-   Client association.
-   Search/filter/display.
-   Converting work into an invoice workflow.

The page can navigate to invoice creation with work/client IDs through
query parameters.

------------------------------------------------------------------------

## `tax.js`

### Responsibility

Controls the Tax Calculator UI. It does **not** own the underlying tax
law; `core/tax-engine.js` does.

### State variables

-   `currentTaxCalculation` --- latest calculation displayed in the UI.
-   `savedTaxCalculation` --- previously persisted calculation.
-   `taxSaveSignature` --- identifies whether the currently displayed
    calculation differs from the saved one.

### Key functions

#### `getTaxInputs()`

Reads the current form values.

Inputs include:

-   annual revenue/invoiced income
-   allowable business expenses
-   other annual income
-   TDS already deducted

#### `makeTaxSignature(inputs, result)`

Creates a comparable signature for determining whether the current
result matches the saved result.

#### `initTaxCalculator()`

Initializes the page:

-   restores saved values where appropriate.
-   attaches input listeners.
-   attaches the save button.
-   calculates the initial result.
-   listens for storage changes.

#### `setTaxInputs(inputs)`

Restores saved tax inputs into the form.

#### `prefillRevenueFromPaidInvoices()`

Uses paid invoice information to populate revenue when a saved
calculation/input is not already available.

#### `calculateAndRenderTax()`

Main calculation orchestration:

``` text
Read inputs
  → TaxEngine
  → update calculation state
  → render summary
  → update save status
```

#### `updateSaveState()`

Updates the UI to distinguish:

-   saved/synced calculation
-   unsaved changes

#### `saveCurrentTaxCalculation()`

Persists the calculated tax result and related inputs to user-scoped
storage, then updates the UI state.

### Important tax architecture

``` text
pages/tax.js
     ↓
core/tax-engine.js
     ↓
calculated result
     ↓
core/state.js / core/storage.js
     ↓
Dashboard reads saved result
```

Do not put new slab/rebate rules directly into `tax.js`.

------------------------------------------------------------------------

## `tax-settings.js`

### Responsibility

Controls tax configuration/preferences.

Tax calculation rules remain in `core/tax-engine.js`; this page is for
user-facing settings/configuration.

------------------------------------------------------------------------

## `settings.js`

### Responsibility

Controls general user/application settings.

Typical operations include:

-   loading saved settings
-   updating preferences
-   persisting settings
-   refreshing the page after changes when necessary

------------------------------------------------------------------------

## Page-layer dependency rules

### Page files should

-   Read user input.
-   Call core services.
-   Call reusable components.
-   Render page-specific HTML.
-   Handle page-specific events.
-   Navigate to related pages.

### Page files should not

-   Reimplement authentication.
-   Reimplement localStorage wrappers.
-   Duplicate tax-law calculations.
-   Duplicate generic modal/table/chart logic.
-   Maintain separate copies of core business data.

## Recommended dependency direction

``` text
HTML page
   ↓
js/pages/*
   ↓
js/components/* + js/core/*
   ↓
localStorage / browser APIs
```

Avoid the reverse direction: core modules should not depend on page
controllers.

## Adding a new page

1.  Add the HTML file under `pages/`.
2.  Add `js/pages/<page>.js`.
3.  Initialize from `DOMContentLoaded`.
4.  Use `AppState`/`StorageManager` for persistent data.
5.  Reuse existing components where possible.
6.  Add page-specific CSS separately.
7.  Keep business rules in core modules.
8.  Add navigation through the existing router/sidebar patterns.
