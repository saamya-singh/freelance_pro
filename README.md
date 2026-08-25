# FreelanceLedger India

> *"Do the work. Own the numbers. Grow with clarity."*

FreelanceLedger India is a premium financial operating system built specifically for freelancers, consultants, creators, independent professionals, and small agencies in India.

---

## 🌟 Key Features

- **Swiss Editorial Design System**: Ultra-clean monochrome aesthetic, warm ivory canvas (`#F7F7F2`), crisp 1px structural borders, and high-contrast typography.
- **Client Relationship Management (CRM)**: Manage clients, GSTINs, PAN numbers, billing addresses, and view aggregate lifetime revenue.
- **Work Tracking & Billable Hours**: Log project hours and rates (`Amount = Hours × Rate`), track billable vs non-billable time, and convert work entries to invoices in 1-click.
- **Invoice & Payment Engine**: Generate professional, GST-compliant invoices (Subtotal, Discount %, GST 18%, Total), record partial/full payments, and print/export PDF formatted documents.
- **Indian Tax Calculation Engine**: Real-time tax estimation under New (Section 115BAC) vs Old Tax Regimes for FY 2025-26/2026-27, with 4% Health & Education Cess, standard deductions, and monthly tax provision estimates.
- **Global Command Palette (`Cmd+K` / `Ctrl+K`)**: Instant search and direct navigation across clients, work logs, invoices, and app shortcuts.
- **Data Backup & Restore**: Full JSON export (`freelanceledger-backup.json`) and schema-validated JSON import.
- **Zero External Dependencies**: Built entirely with standard HTML5, CSS3, Vanilla JavaScript, and LocalStorage persistence.

---

## 🚀 How to Run

1. Clone or download this project folder.
2. Open the project in VS Code or any local development environment.
3. Launch a local web server (e.g. VS Code **Live Server** extension, Python `python3 -m http.server 8000`, or Node `npx serve`).
4. Navigate to `http://127.0.0.1:8000/index.html` in your browser.

---

## 📂 Project Structure

```
FreelanceLedger/
├── index.html                       # Public Editorial Landing Page
├── pages/
│   ├── login.html                   # Login & Demo account access
│   ├── signup.html                  # Signup with live password strength meter
│   ├── forgot-password.html         # Password reset simulation
│   ├── dashboard.html                # Main financial KPI dashboard & SVG charts
│   ├── clients.html                  # Clients CRM directory
│   ├── client-detail.html            # Single client profile & activity hub
│   ├── work.html                     # Work entries tracking & billable hours
│   ├── invoices.html                 # Invoices manager & payment recorder
│   ├── invoice-detail.html           # Printable invoice document & PDF export
│   ├── tax.html                      # Indian Tax Calculator & Income Estimator
│   ├── tax-settings.html             # Tax Slabs & Regime configuration manager
│   └── settings.html                 # Profile, business details, backup JSON import/export
├── css/
│   ├── global.css                    # Design tokens, typography, buttons, status badges
│   ├── landing.css                   # Hero, scroll reveals, geometric animations
│   ├── auth.css                      # Auth cards & password meter bar
│   ├── dashboard.css                 # Metric cards, grid layout, activity feed
│   ├── clients.css                   # CRM table & client cards
│   ├── work.css                      # Work entry logs & billable tags
│   ├── invoices.css                  # Invoice builder & print media queries
│   ├── tax.css                       # Tax summary breakdown
│   ├── settings.css                 # Business profile settings & backup box
│   └── responsive.css               # Mobile drawers & responsive layouts
├── js/
│   ├── core/
│   │   ├── app.js                    # Bootstrap & global listeners
│   │   ├── storage.js                # LocalStorage repository manager
│   │   ├── auth.js                   # Auth guards & session state
│   │   ├── state.js                  # Centralized event bus
│   │   ├── utils.js                  # Indian Rupee formatting (en-IN), dates, IDs
│   │   ├── validators.js             # Form validators & password strength engine
│   │   ├── notifications.js          # Toast system
│   │   └── router.js                 # Client-side relative routing helper
│   ├── components/
│   │   ├── sidebar.js                # App sidebar & mobile menu
│   │   ├── header.js                 # Header & global search button
│   │   ├── modal.js                  # Accessible modal frame
│   │   ├── toast.js                  # Toast notification logic
│   │   ├── table.js                  # Dynamic data table with sorting/empty states
│   │   ├── charts.js                 # SVG revenue & invoice health charts
│   │   ├── command-palette.js        # Cmd+K / Ctrl+K search dialog
│   │   └── confirm-dialog.js         # Confirmation dialog modal
│   ├── data/
│   │   ├── demo-data.js              # Seed data for Indian freelancers
│   │   └── tax-slabs.js              # FY 2025-26 Indian Income Tax slabs
│   └── pages/
│       ├── landing.js, login.js, signup.js, dashboard.js, clients.js,
│       ├── client-detail.js, work.js, invoices.js, invoice-detail.js,
│       └── tax.js, tax-settings.js, settings.js
└── README.md
```
