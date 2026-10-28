# FreelanceLedger India

FreelanceLedger is a freelancer CRM, work tracker, invoicing and Indian tax dashboard. The vanilla JavaScript frontend is served by a Node.js + Express backend. Accounts, sessions and workspaces are stored in MongoDB, not in browser LocalStorage (which is used only for the theme).

## Run locally

Requires Node.js 18+, npm and MongoDB. Add your connection string to `.env`; `.env.example` lists the supported settings.

```env
MONGO_DB_URL=mongodb+srv://username:password@cluster.example.mongodb.net/
MONGO_DB_NAME=freelanceledger
PORT=3000
```

`MONGO_DB_NAME` and `PORT` are optional. Their defaults are `freelanceledger` and `3000`. MongoDB creates the database and its `users`, `sessions`, and `workspaces` collections on first use. The server creates the required indexes and seeds the demo account once.

```bash
npm install
npm start
```

Visit http://localhost:3000. The demo account is `rahul@freelancedger.in` / `Password123!`, or use **Continue with Demo Account**. Signups start with an empty workspace. Data persists in MongoDB across logins and restarts.

The frontend and API are served by the same Express process:

- App: http://localhost:3000
- Interactive API responses: http://localhost:3000/api-docs
- OpenAPI JSON: http://localhost:3000/api/openapi.json

The app must be served by Express: opening HTML files directly or using a separate static server will not provide API access. Existing LocalStorage workspaces and data from the former `data/ledger.json` store are not migrated automatically. Export a workspace before switching and import it through Settings. Accounts from the JSON-backed version must sign up again.

## Features

- Clients, billable work, invoices and payments with server-side persistence per account
- Dashboard, tax projections, custom tax settings and activity history
- JSON workspace export/import, print-friendly invoices and keyboard command palette
- Password-hashed accounts and HttpOnly session cookies

## API

See [API.md](API.md) for endpoints, payloads, authentication and examples.

Import `FreelanceLedger.postman_collection.json` into Postman for an executable API collection. Start the app with `npm start`, then use **Run collection** in its listed order. It creates a unique test account and does not modify the demo workspace.

## Project layout

- `server.js` — Express routes, MongoDB persistence, auth and static hosting
- `js/core/storage.js` — browser workspace cache and API adapter
- `js/core/auth.js` — account API client
- `js/pages/` — page interactions
- `pages/`, `css/`, `index.html` — UI
- `.env` — private MongoDB connection settings (ignored by git)

Run `npm test` to exercise the API with an in-memory MongoDB collection double. Tests do not access the configured cluster.
