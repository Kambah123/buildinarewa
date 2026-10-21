# Changelog

## Stage 2 — Builders, stories and signals (2026-10-21)

### Added

- Public builders directory and profiles, with product connections, state context, external links, seed-profile disclosures, and builder OG images.
- Public story directory and MDX-backed story pages, including story metadata, social images, optional video links, bilingual editorial fallback, and clearly labelled seed editorial content.
- Homepage editorial modules for featured product of the week, builder/story spotlight, practical need → product matching, and newsletter acquisition.
- Alternative directory pages at `/alternatives/[name]`, linked from each product’s alternatives.
- Authenticated upvotes using optimistic UI, a Zod-validated API payload, an atomic Supabase RPC, cached product counts, and a database-enforced 30-actions-per-minute rate limit.
- Double-opt-in English/Hausa newsletter form, confirmation email/page, Resend weekly digest email, protected subscriber export, and Vercel Monday 09:00 Africa/Lagos cron schedule.
- Editorial admin forms to create builder profiles and save/publish trusted MDX stories.
- Stage 2 Supabase migration, clearly marked seed builders/story/needs, Stage 2 validation and unit/E2E test coverage.

### How to test Stage 2

1. Run `supabase db reset` after pulling the Stage 2 migration, then configure an editor/admin profile as documented in `README.md`.
2. Browse `/en/builders`, `/en/stories`, `/en/alternatives/shopify`, and their Hausa routes. Confirm all supplied seed content is labelled as seed content.
3. Sign in, upvote an approved product, refresh the page, and verify the vote state/count. Repeat rapidly to verify the database rate-limit message after 30 changes in a minute.
4. Subscribe at `/en/newsletter`, open the Resend confirmation email, and use its confirmation link. Ensure only confirmed recipients receive a digest.
5. With `CRON_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, and Resend configured, call `GET /api/cron/weekly-digest` with `Authorization: Bearer <CRON_SECRET>` and verify the language-specific digest.
6. As an editor/admin, create a builder at `/en/admin/builders`, create a draft or published MDX story at `/en/admin/stories`, then verify the relevant public page and OG image.
7. Run `npm run lint && npm run typecheck && npm test && npm run build`; run `npm run test:e2e` after installing Playwright Chromium.

## Stage 1 — MVP directory (2026-10-21)

### Added

- Next.js App Router foundation with strict TypeScript, Tailwind CSS v4, responsive editorial design tokens, dark mode, and a subtle zane-inspired pattern.
- English and Hausa routes under `/en` and `/ha`, with translated interface copy and English-content fallback for products without Hausa content.
- Supabase migration with categories, Northern states + FCT, products, profiles, product makers, full-text/trigram search, private media storage, and RLS policies.
- Clearly labelled seed listings for Zipa, arewa-life, and a demonstration record to make the unconfigured local directory useful.
- Public home, product directory, search/filter/sort interface, product pages, category pages, state pages, about, terms, and privacy pages.
- Supabase email magic-link and Google sign-in flows, an authenticated multi-step product submission form, Cloudflare Turnstile verification hook, and Resend review emails.
- Personal submission dashboard with pending-submission editing and role-protected editorial review queue with approval, rejection, feature, and edit-before-approval actions.
- Product metadata, hreflang, JSON-LD, social share links, tests, health endpoint, and GitHub Actions CI.

### How to test Stage 1

1. Copy `.env.example` to `.env.local` and provide Supabase credentials. Run `supabase db reset` to apply the migration and seed records.
2. Run `npm run dev`, then open `http://localhost:3000/en`.
3. Browse `/en/products`, search for `Zipa` or `Shopify`, and filter by category/state.
4. Open a product card, verify Hausa at `/ha`, and test the WhatsApp/X/LinkedIn links.
5. Configure Supabase Google and magic-link redirect URLs for `/auth/callback`, then sign in and submit a product with valid image files.
6. In Supabase, promote a profile role to `editor` or `admin`, then test `/en/admin` approval and rejection emails with Resend configured.
7. Run `npm run lint && npm run typecheck && npm test && npm run build`. Run `npm run test:e2e` after installing Playwright’s Chromium browser.
