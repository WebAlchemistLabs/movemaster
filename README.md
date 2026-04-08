# MoveMaster Pro — Full Stack

Southern Ontario's Most Trusted Moving Company — complete full-stack application.

```
movemaster-pro/
├── movemaster/          ← Next.js 14 frontend
└── movemaster-server/   ← Node.js/Express API backend
```

## Start Both Services

### Terminal 1 — API Server
```bash
cd movemaster-server
npm install
cp .env.example .env
npm run dev
# → http://localhost:4000
```

### Terminal 2 — Next.js Frontend
```bash
cd movemaster
npm install
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:4000 in .env.local
npm run dev
# → http://localhost:3000
```

## Architecture

```
Browser
  │
  ├── Next.js 14 (port 3000)
  │     ├── App Router pages
  │     ├── React components
  │     ├── lib/api.ts  ←── typed client
  │     └── localStorage fallback (demo mode)
  │
  └── Express API (port 4000)
        ├── JWT auth (bcrypt + jsonwebtoken)
        ├── Quote management + pricing engine
        ├── Stripe payment intents
        ├── Nodemailer email service
        ├── Firebase Admin (optional)
        └── In-memory store (demo mode)
```

## Demo Mode

Everything runs without any API keys:

- Frontend: works standalone using localStorage (no API server needed)
- Backend: works with in-memory store, console-logged emails, mock Stripe

To connect them: set `NEXT_PUBLIC_API_URL=http://localhost:4000` in `movemaster/.env.local`

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend framework | Next.js 14 App Router |
| Frontend language | TypeScript (strict) |
| Styling | Tailwind CSS v3 |
| Backend framework | Express 4 |
| Backend language | TypeScript |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| Database | Firebase Firestore (optional) / in-memory |
| Payments | Stripe (optional) / mocked |
| Email | Nodemailer (optional) / console |
| Testing | Jest + Supertest |
