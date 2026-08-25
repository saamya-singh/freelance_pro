# FreelancePro --- Core JavaScript Documentation

## Purpose

The `js/core/` directory contains application-wide services and
infrastructure. These files are loaded by multiple pages and should
remain independent of page-specific DOM markup whenever possible.

## Architecture

``` text
Pages
  ↓
Core services
  ├── App bootstrap
  ├── Authentication
  ├── Router
  ├── State
  ├── Storage
  ├── Tax Engine
  ├── Theme
  ├── Notifications
  ├── Utilities
  └── Validators
```

## Files

  -----------------------------------------------------------------------
  File                    Main responsibility     Key global/API
  ----------------------- ----------------------- -----------------------
  `app.js`                Application bootstrap   DOMContentLoaded
                          and global keyboard     bootstrap
                          behavior                

  `auth.js`               Login/session/user      `Auth`
                          management              

  `notifications.js`      Toast notifications     `Toast`

  `router.js`             Page navigation and URL `Router`
                          routing                 

  `state.js`              Central in-memory       `AppState`
                          application state and   
                          user data access        

  `storage.js`            localStorage            `STORAGE_KEYS`,
                          persistence,            `StorageManager`
                          user-scoped data,       
                          defaults/demo data      

  `tax-engine.js`         FY 2025--26 tax         `TaxEngine`
                          calculation logic       

  `theme.js`              Light/dark theme        `ThemeManager`
                          persistence and         
                          switching               

  `utils.js`              Shared formatting,      `Utils`
                          URL/query and helper    
                          functions               

  `validators.js`         Reusable input          `Validators`
                          validation rules        
  -----------------------------------------------------------------------

## `app.js`

### Responsibility

Initializes global application behavior after the DOM is ready. It is
the lightweight bootstrap layer rather than a page controller.

### Main behavior

-   Waits for `DOMContentLoaded`.
-   Initializes shared UI/services used across the application.
-   Registers global keyboard handling.

### When to modify

Change this file only when the behavior should apply to the whole
application. Page-specific logic belongs in `js/pages/`.

------------------------------------------------------------------------

## `auth.js`

### Responsibility

Handles browser-based authentication and session state.

### Main responsibilities

-   Reads the current session from `localStorage`.
-   Looks up registered users.
-   Creates and stores a session after successful login.
-   Creates/updates user records.
-   Clears the session during logout.
-   Redirects between root and `/pages/` locations correctly.
-   Provides route protection behavior for authenticated pages.

### Important storage dependency

Authentication uses the shared `STORAGE_KEYS` definitions from
`storage.js`.

### Design note

This is a client-side demo authentication layer. It is appropriate for
the current static/localStorage application, but a production deployment
should replace it with a server-side authentication system.

------------------------------------------------------------------------

## `notifications.js`

### Responsibility

Provides transient user feedback.

### `Toast`

The `Toast` object centralizes success, error, warning, and
informational messages so pages do not need to implement notification
markup repeatedly.

### Typical use

``` js
Toast.success('Saved successfully');
Toast.error('Unable to save');
```

Use this instead of duplicating toast DOM logic in page files.

------------------------------------------------------------------------

## `router.js`

### Responsibility

Centralizes navigation between the landing page and files inside
`pages/`.

### `Router`

Handles:

-   Detecting the current location.
-   Building page-relative paths.
-   Preserving query strings when navigating.
-   Redirecting to the correct page location from root or `/pages/`.

------------------------------------------------------------------------

## `state.js`

### Responsibility

Provides the central application data/state abstraction.

### `AppState`

The state layer coordinates:

-   Current user/session context.
-   Clients.
-   Work entries.
-   Invoices.
-   Payments.
-   Activities.
-   Settings.
-   Tax settings.
-   Saved tax calculations.

### Why it matters

Page modules should use `AppState`/storage abstractions instead of
scattering direct `localStorage` calls throughout the UI.

### Tax persistence

The tax calculator saves its result into the user-scoped state/storage
model. The dashboard then reads that saved calculation to display tax
and net take-home consistently.

------------------------------------------------------------------------

## `storage.js`

### Responsibility

Owns persistent browser storage.

### Main concepts

-   `STORAGE_KEYS` defines logical storage keys.
-   `StorageManager` reads/writes/removes JSON values safely.
-   User-specific data is namespaced so one user's data does not collide
    with another user's data.
-   Demo data and default settings can be initialized for users.

### Data categories

The project persists data for:

-   users
-   session
-   clients
-   work entries
-   invoices
-   payments
-   activities
-   settings
-   tax settings
-   saved tax calculations

### Error handling

Storage operations catch serialization/access errors and log them rather
than allowing the page to fail silently.

------------------------------------------------------------------------

## `tax-engine.js`

### Responsibility

Contains the tax calculation rules independently from the Tax page UI.

### `TaxEngine`

The engine receives normalized financial inputs and returns calculated
tax values.

The calculation flow is conceptually:

``` text
Revenue
  ↓
Business expenses
  ↓
Business profit
  ↓
Other income
  ↓
Taxable income
  ↓
FY 2025–26 new-regime slab calculation
  ↓
Section 87A rebate, when applicable
  ↓
Health & Education Cess
  ↓
Tax liability
  ↓
TDS credit / balance tax
```

### Important distinction

TDS is a tax credit already deducted at source. It should not be used to
hide the underlying computed tax. The UI therefore keeps:

-   calculated tax
-   rebate
-   cess
-   TDS credit
-   final balance payable

as separate concepts.

### Maintenance

If tax law changes, update the engine/data layer rather than embedding
new tax rules inside `pages/tax.js`.

------------------------------------------------------------------------

## `theme.js`

### Responsibility

Controls application appearance.

### `ThemeManager`

-   Reads the saved theme.
-   Applies the active theme.
-   Stores the user's selection.
-   Registers theme-toggle interactions.

------------------------------------------------------------------------

## `utils.js`

### Responsibility

Shared helper functions used across multiple modules.

Typical concerns include:

-   Currency/number formatting.
-   Date formatting.
-   Query-string parsing.
-   General DOM/helper operations.

Keep generic helpers here only when they are genuinely reusable.

------------------------------------------------------------------------

## `validators.js`

### Responsibility

Reusable validation rules for forms.

Typical validation concerns include:

-   Required values.
-   Email formatting.
-   Numeric values.
-   Form field constraints.

Page modules call these validators rather than duplicating validation
expressions.

------------------------------------------------------------------------

## Core dependency rules

1.  **Core should not depend on page-specific DOM markup.**
2.  **Tax rules belong in `tax-engine.js`, not `pages/tax.js`.**
3.  **Persistence belongs in `storage.js`.**
4.  **Cross-page application state belongs in `state.js`.**
5.  **Reusable validation belongs in `validators.js`.**
6.  **Reusable UI notifications belong in `notifications.js`.**
7.  Page files should orchestrate these services rather than reimplement
    them.

## Typical data flow

``` text
User action
  → page controller
  → core service/state
  → storage
  → persisted user data
  → another page reads the same state
```
