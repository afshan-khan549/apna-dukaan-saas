# Apna Dukaan — SaaS Platform for Local Stores

A storefront platform for local shop owners: sign up, set up your store, add products or services, and get a shareable public page customers can open in their browser — no app required. Built as a portfolio project for placements.

## What it does

- **Shop owners** sign up, create a store profile (name, category, description, contact info), and manage a product/service list from a dashboard.
- **Customers** view a public storefront page at `/store/your-shop-slug` — no login needed.
- Shop owners can **export their product list as a PDF catalog** (generated client-side, no server involved).

## Tech stack

- **Frontend:** React + Vite + TypeScript + Tailwind CSS
- **Backend:** Supabase (Postgres database, authentication, row-level security — no separate server needed)
- **PDF export:** jsPDF (runs entirely in the browser)
- **Hosting:** Vercel (frontend) — free tier covers this project comfortably

## Project structure

```
src/
  pages/          Login, Signup, Onboarding, Landing, Storefront, dashboard pages
  components/     DashboardLayout, ProtectedRoute
  context/        AuthContext (Supabase session state)
  lib/            Supabase client setup
  utils/          slug generator, PDF catalog export
supabase/
  schema.sql      Database tables + row-level security policies — run this in Supabase
```

## Setup from zero to running locally

### 1. Create a free Supabase project

Go to [supabase.com](https://supabase.com) -> sign up (free) -> **New project**. Pick any name/region, set a database password (save it somewhere), and wait ~2 minutes for it to spin up.

### 2. Run the database schema

In your Supabase project: **SQL Editor -> New query** -> paste the entire contents of `supabase/schema.sql` from this repo -> **Run**. This creates the `stores` and `products` tables with the right security rules already in place.

### 3. Turn off email confirmation (for easy local testing)

**Authentication -> Providers -> Email** -> turn off "Confirm email". This means signup logs you in immediately, instead of waiting on a confirmation email. (You can turn this back on later if you ever put this somewhere real.)

### 4. Get your API keys

**Project Settings -> API**. You need the **Project URL** and the **anon public** key.

### 5. Set up your environment file

```bash
cp .env.example .env
```

Open `.env` and paste in your Project URL and anon key.

### 6. Install and run

```bash
npm install
npm run dev
```

Open the local URL it gives you. Sign up, create your store, add a product, then click "View storefront" to see the public page.

## Deploying for free

1. Push this repo to GitHub (`git init`, `add`, `commit`, `push` — same steps as the other project).
2. Go to [vercel.com](https://vercel.com) -> sign in with GitHub -> **Import Project** -> pick this repo.
3. In the Vercel project's **Environment Variables**, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` with the same values from your `.env`.
4. Deploy. You get a free live URL, and it auto-redeploys every time you push.

## What's built vs. what's left as "planned"

**Built:** auth, store profile management, full product CRUD, public storefront page, PDF catalog export.

**Intentionally left out (mention as "planned" if asked in an interview):** online payments — this needs a registered payment gateway account (Razorpay/Stripe) and business KYC, which isn't realistic for a student project, so it's a deliberate scope cut rather than an oversight.

## Why "Apna Dukaan"

Hindi for "your own shop" — named it rather than leaving it generic, since the product is specifically for Indian local shop owners.
