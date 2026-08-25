# FreelancePro --- Components JavaScript Documentation

## Purpose

The `js/components/` directory contains reusable UI components. These
modules provide common interface behavior so individual pages do not
have to duplicate modal, table, header, sidebar, chart, and
command-palette implementations.

## Component map

  -----------------------------------------------------------------------
  File                    Component               Responsibility
  ----------------------- ----------------------- -----------------------
  `header.js`             `Header`                Top navigation/header
                                                  behavior

  `sidebar.js`            `Sidebar`               Main application
                                                  navigation

  `command-palette.js`    `CommandPalette`        Global search/command
                                                  interaction

  `modal.js`              `Modal`                 Generic modal behavior

  `confirm-dialog.js`     `ConfirmDialog`         Confirmation prompts

  `table.js`              `DataTable`             Reusable table
                                                  rendering/interaction

  `charts.js`             `Charts`                Reusable chart
                                                  rendering
  -----------------------------------------------------------------------

## `header.js`

### `Header`

Responsible for shared top-bar behavior.

Typical responsibilities:

-   Rendering/initializing the header.
-   Handling global header interactions.
-   Connecting search/command controls.
-   Registering document-level click behavior.
-   Supporting user-facing controls shared by pages.

### Usage principle

Do not add invoice/client/tax-specific rendering here. Keep it generic.

------------------------------------------------------------------------

## `sidebar.js`

### `Sidebar`

Provides the application navigation.

Responsibilities include:

-   Detecting whether the current document is in `/pages/`.
-   Building correct relative navigation URLs.
-   Highlighting/handling navigation controls.
-   Managing sidebar interactions.

### Important

Path handling matters because the project has both root-level and
`/pages/` documents.

------------------------------------------------------------------------

## `command-palette.js`

### `CommandPalette`

Provides the global command/search experience.

Responsibilities:

-   Opening and closing the palette.
-   Handling keyboard shortcuts.
-   Searching or presenting available actions.
-   Handling command selection.
-   Managing keyboard navigation and Escape behavior.

### Extension point

New global commands should be added here only when they make sense
across the application. Page-specific actions should remain in page
controllers.

------------------------------------------------------------------------

## `modal.js`

### `Modal`

Provides a generic modal container/interaction layer.

Typical responsibilities:

-   Open/close behavior.
-   Injecting modal content.
-   Overlay interaction.
-   Escape-key handling.
-   Cleanup after closing.

### Design rule

The component should provide modal mechanics; the page should provide
business-specific form fields and save behavior.

------------------------------------------------------------------------

## `confirm-dialog.js`

### `ConfirmDialog`

Specialized confirmation UI for destructive or important actions.

Useful for:

-   Delete operations.
-   Irreversible changes.
-   Explicit user confirmation before an action.

This keeps confirmation UX consistent across clients, invoices, work
entries, and settings.

------------------------------------------------------------------------

## `table.js`

### `DataTable`

Reusable data-table behavior.

Responsibilities generally include:

-   Rendering rows/columns.
-   Handling empty states.
-   Supporting table-level interaction patterns.
-   Keeping common table markup consistent.

### Page relationship

Pages such as Clients and Invoices own the business data and filtering
rules. `DataTable` should remain focused on presentation/reusable table
behavior.

------------------------------------------------------------------------

## `charts.js`

### `Charts`

Centralizes chart rendering.

The dashboard can call chart helpers instead of embedding chart-library
setup directly inside `dashboard.js`.

### Recommended separation

``` text
dashboard.js
  → chooses data
  → calls Charts
  → renders result

charts.js
  → knows how to draw charts
```

This makes future chart changes safer.

------------------------------------------------------------------------

## Component dependency rules

1.  Components should be reusable across pages.
2.  Components should not contain tax, invoice, or client business
    rules.
3.  Components may depend on generic core services when needed.
4.  Pages should provide the business data to components.
5.  Avoid copying component code into individual page files.
6.  Keep DOM selectors/configuration easy to discover.

## Example architecture

``` text
Page controller
   │
   ├── AppState / StorageManager
   │
   └── UI component
          ├── Modal
          ├── DataTable
          ├── Charts
          ├── Toast
          └── ConfirmDialog
```

## Adding a new component

1.  Create `js/components/<component>.js`.
2.  Give it one clear responsibility.
3.  Expose a predictable global object/API consistent with existing
    components.
4.  Keep business data outside the component.
5.  Add initialization only where required.
6.  Include the script on pages that use it.
