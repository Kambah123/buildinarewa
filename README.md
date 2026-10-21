# Arewa Is Building

A curated, bilingual directory for software built in Northern Nigeria and by Arewa people everywhere.

> This repository is currently at **Stage 1: MVP directory**. See [`docs/MASTER_PROMPT.md`](docs/MASTER_PROMPT.md) for the agreed product brief and [`CHANGELOG.md`](CHANGELOG.md) for the current delivery checklist.

## Stack

- Next.js 15, React 19, TypeScript (strict), App Router
- Tailwind CSS v4, Lucide icons, Framer Motion-ready component architecture
- `next-intl` with English (`/en`) and Hausa (`/ha`) routes
- Supabase Auth, Postgres, Storage, RLS, search indexes
- Resend transactional email templates
- Cloudflare Turnstile integration hook
- Vitest, Playwright, GitHub Actions

## Local development

### 1. Install dependencies

```bash
npm install
```

### 2. Set environment variables

```bash
cp .env.example .env.local
```

At minimum, add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to enable auth and database access. The public directory has labelled fallback seed data so the interface can be explored before a Supabase project is connected.

### 3. Create the database

Install and authenticate the [Supabase CLI](https://supabase.com/docs/guides/cli), link your project or start Supabase locally, then apply the schema and seed data:

```bash
supabase db reset
```

This applies `supabase/migrations/202610210001_stage_1_schema.sql` and `supabase/seed.sql`.

To make the first editor or admin after that person signs in:

```sql
update public.profiles
set role = 'admin'
where id = '<AUTH_USER_UUID>';
```

Never set privileged roles from browser code.

### 4. Configure Supabase Auth

In **Authentication → URL Configuration**, add:

```text
http://localhost:3000/auth/callback
https://your-production-domain/auth/callback
```

Enable Email (magic link) and Google as needed. For Google, add the provider callback URL displayed by Supabase to your Google OAuth configuration.

### 5. Run the app

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000). Middleware redirects the root route to `/en`.

## Media storage security

Product media lives in the private `product-assets` bucket. Files are stored beneath:

```text
<auth-user-id>/<product-id>/<asset-name>
```

RLS allows a submitter to upload to their own prefix. Public users can only receive signed reads after the related product is approved or featured. Do not make this bucket public.

## Email and anti-spam

- Set `RESEND_API_KEY` and `EMAIL_FROM` to send received, approved, and rejected listing emails.
- Set both Turnstile variables to enable Cloudflare verification on submissions. When `TURNSTILE_SECRET_KEY` is absent, verification is intentionally skipped for local development only.
- Set `NEXT_PUBLIC_SITE_URL` to the deployed domain before configuring email links and social sharing.

## Tests and checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

## Operational notes

- The database search function uses `tsvector`, `websearch_to_tsquery`, and `pg_trgm` matching; the client debounces search input before updating the server-rendered directory.
- Role checks happen in server actions and Supabase RLS, not only in page components.
- Product submission and review payloads are validated with Zod on the server.
- Seed products are explicitly marked in the UI and database (`is_seed = true`). Replace or enrich them through the editorial workflow before promoting the directory.
