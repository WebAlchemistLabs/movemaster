# MoveMaster Pro — API Server with SQLite Database

Full Node.js/Express backend with persistent SQLite bookkeeping database.

## Quick Start

```bash
npm install
cp .env.example .env
npm run db:seed    # ← Creates database with 3 years of history
npm run dev        # ← Starts server at http://localhost:4000
```

## Database

SQLite database at `./data/movemaster.db` — persists between restarts.

```bash
npm run db:seed    # Seed with demo data (29 jobs, 20 clients)
npm run db:reset   # Wipe and re-seed fresh
```

## Login Credentials

| Email | Password | Role |
|---|---|---|
| admin@movemaster.pro | admin1234 | Admin |
| demo@movemaster.pro | demo1234 | Customer |

## API Routes

All routes prefixed with `/api/v1`

### Auth
- `POST /auth/register` — Create account
- `POST /auth/login` — Login
- `POST /auth/refresh` — Refresh token
- `POST /auth/demo` — Demo login
- `GET  /auth/me` — Get profile
- `PATCH /auth/me` — Update profile

### Quotes
- `POST /quotes/estimate` — Instant price estimate (no save)
- `POST /quotes` — Submit quote request
- `GET  /quotes/mine` — My quotes (customer)
- `GET  /quotes` — All quotes (admin)
- `PATCH /quotes/:id/status` — Update status (admin)
- `POST /quotes/:id/confirm-deposit` — Confirm deposit paid

### Bookkeeping (Admin only)
- `GET /bookkeeping/dashboard` — Full business stats
- `GET /bookkeeping/jobs` — All jobs with filters
- `GET /bookkeeping/jobs/:id` — Job detail + invoice + transactions
- `PATCH /bookkeeping/jobs/:id/status` — Update job + invoice
- `GET /bookkeeping/clients` — Client list
- `GET /bookkeeping/clients/:id` — Client profile + history
- `GET /bookkeeping/invoices` — All invoices
- `GET /bookkeeping/invoices/:id` — Invoice detail
- `GET /bookkeeping/transactions` — Payment ledger
- `POST /bookkeeping/transactions` — Record manual payment
- `GET /bookkeeping/report?year=2024` — Financial report
- `GET /bookkeeping/messages` — Contact messages
- `PATCH /bookkeeping/messages/:id/read` — Mark read

### Health
- `GET /health` — Server status

## Database Schema

- **users** — Auth accounts with roles
- **clients** — Enriched customer profiles with lifetime stats
- **jobs** — All quotes/bookings with full move details
- **invoices** — Generated invoice per job with line items
- **transactions** — Payment ledger (deposits + balance payments)
- **contact_messages** — Website contact form submissions

## Seeded Data Summary

- 20 clients with realistic Southern Ontario profiles
- 29 jobs: 20 completed, 1 in-progress, 4 confirmed, 4 pending
- $46,000+ in completed revenue
- Full invoice history
- Payment transaction ledger
- 5 contact messages (2 read, 3 unread)
