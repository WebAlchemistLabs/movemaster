# MoveMaster Pro

**Southern Ontario's Most Trusted Moving Company** — A production-grade, portfolio-quality web application built with Next.js 14, TypeScript, Tailwind CSS, and Firebase.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the app runs in full demo mode with no configuration required.

## Demo Mode

The app works 100% without any API keys. All Firebase operations fall back to `localStorage`:

- **Auth**: Click "Sign In as Demo User" on the login page, or register a new account
- **Quotes**: Submit quote requests via `/quote` — they are saved to localStorage
- **Payments**: Stripe deposit payments are simulated (no card is charged)
- **Admin Panel**: Visit `/admin` to see quote management, crew roster, and city coverage

## Pages

| Route | Description |
|---|---|
| `/` | Homepage — hero, services, stats, reviews, crew, pricing, blog |
| `/services` | All 8 service types |
| `/services/[slug]` | Individual service detail pages |
| `/quote` | 5-step quote request wizard |
| `/booking` | Deposit payment page (Stripe demo mode) |
| `/pricing` | Pricing tiers, rate tables, live calculator |
| `/cities` | All 15 Southern Ontario coverage cities |
| `/cities/[slug]` | City-specific landing pages |
| `/crew` | Full crew roster |
| `/crew/[id]` | Individual crew profiles |
| `/reviews` | All 62+ reviews with filters |
| `/blog` | Moving tips & guides |
| `/blog/[slug]` | Individual blog posts |
| `/about` | Company story, values, timeline, fleet |
| `/contact` | Contact form + office info |
| `/login` | Auth — sign in or use demo account |
| `/register` | Create a new account |
| `/dashboard` | User dashboard — quotes, bookings, profile |
| `/admin` | Admin panel — quote management, crew, cities |

## Tech Stack

- **Framework**: Next.js 14 App Router
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS v3
- **Auth/DB**: Firebase v10 with full localStorage demo fallback
- **Payments**: Stripe (mocked in demo mode)
- **Icons**: Lucide React
- **Fonts**: Oswald (headings) + DM Sans (body) + DM Mono (accents)

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your keys to enable real Firebase and Stripe:

```bash
cp .env.example .env.local
```

All variables are optional — the app runs in demo mode without them.

## Data

All data is statically defined in `data/`:

- `crew.ts` — 12 crew member profiles
- `services.ts` — 8 service packages  
- `cities.ts` — 15 Southern Ontario cities
- `reviews.ts` — 62 verified customer reviews
- `index.ts` — company stats, 20 FAQs, 6 blog posts, 3 pricing tiers

## Design System

| Token | Value |
|---|---|
| Background | `#0d1117` |
| Surface | `#161b22` |
| Primary Accent | `#e85d04` (orange) |
| Secondary | `#1e40af` (blue) |
| Text Primary | `#f0f6fc` |
| Text Muted | `#8b949e` |
| Border | `#30363d` |
